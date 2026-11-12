// Publish queue worker.
//
// Two job kinds live in PublishJob:
//  - action "generate_kit": the AI marketing kit for a product is built
//    (description, social posts, video script, SEO) for every requested locale.
//  - action "publish" (default): the prepared asset for one channel is
//    dispatched — to the channel's webhook when one is configured, otherwise
//    marked as prepared so the operator/API can post it.
//
// The worker is invoked by POST /api/marketing/queue (admin) and by the
// scheduled automation that hits /api/internal/marketing/process.

import { prisma } from '@/lib/db/prisma'
import { automateProduct, configuredChannelIds } from '@/lib/marketing/automation'
import { CHANNEL_BY_ID } from '@/lib/marketing/channels'
import type { Locale } from '@/lib/i18n/config'

const KIT_CHANNEL = '__kit__'
const MAX_ATTEMPTS = 3

export interface ProcessSummary {
  kits: { processed: number; failed: number }
  publishes: { sent: number; prepared: number; failed: number }
  remaining: number
}

// Queues a kit-generation job for a product. Cheap DB write, safe to call from
// a request handler: the heavy AI work happens later in the worker.
export async function enqueueProductKit(
  productId: string,
  opts: { locales?: Locale[]; channels?: string[]; regenerate?: boolean } = {}
): Promise<string> {
  const job = await prisma.publishJob.create({
    data: {
      productId,
      channel: KIT_CHANNEL,
      action: 'generate_kit',
      status: 'queued',
      payload: JSON.stringify({
        locales: opts.locales || null,
        channels: opts.channels || null,
        regenerate: Boolean(opts.regenerate),
      }),
    },
  })
  return job.id
}

interface StoredPayload {
  locales?: Locale[] | null
  channels?: string[] | null
  regenerate?: boolean
}

// Reads the webhook URL configured for a channel, if any. A channel value that
// is a plain URL (not a social profile link) doubles as its publish endpoint.
function channelEndpoint(channelValue: string | undefined): string | null {
  if (!channelValue) return null
  const v = channelValue.trim()
  return /^https?:\/\//i.test(v) && /webhook|api|hook/i.test(v) ? v : null
}

async function channelValues(): Promise<Record<string, string>> {
  const row = await prisma.setting.findUnique({ where: { key: 'store' } })
  if (!row?.value) return {}
  try {
    const parsed = JSON.parse(row.value) as { marketing?: { channels?: Record<string, string> } }
    return parsed.marketing?.channels || {}
  } catch {
    return {}
  }
}

async function processKitJob(jobId: string, productId: string, payload: StoredPayload): Promise<void> {
  await prisma.publishJob.update({
    where: { id: jobId },
    data: { status: 'running', attempts: { increment: 1 } },
  })
  try {
    const result = await automateProduct({
      productId,
      locales: payload.locales?.length ? payload.locales : undefined,
      channels: payload.channels?.length ? payload.channels : undefined,
      regenerate: payload.regenerate,
    })
    await prisma.publishJob.update({
      where: { id: jobId },
      data: { status: 'done', result: JSON.stringify(result), error: null },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const job = await prisma.publishJob.findUnique({ where: { id: jobId }, select: { attempts: true } })
    const attempts = job?.attempts ?? 1
    await prisma.publishJob.update({
      where: { id: jobId },
      data: { status: attempts >= MAX_ATTEMPTS ? 'failed' : 'queued', error: message },
    })
  }
}

async function processPublishJob(
  jobId: string,
  productId: string,
  channel: string,
  values: Record<string, string>
): Promise<'sent' | 'prepared' | 'failed'> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, price: true, slug: true, images: true },
  })
  if (!product) {
    await prisma.publishJob.update({
      where: { id: jobId },
      data: { status: 'failed', error: 'Produit introuvable' },
    })
    return 'failed'
  }

  const asset = await prisma.productAsset.findFirst({
    where: { productId, kind: 'social_post', channel, locale: 'fr' },
    orderBy: { createdAt: 'desc' },
  }) || await prisma.productAsset.findFirst({
    where: { productId, kind: 'description', channel: null },
    orderBy: { createdAt: 'desc' },
  })

  const body = {
    productId: product.id,
    productSlug: product.slug,
    name: product.name,
    price: product.price,
    channel,
    caption: asset?.body || null,
    meta: asset?.meta || null,
  }

  const endpoint = channelEndpoint(values[channel])
  await prisma.publishJob.update({
    where: { id: jobId },
    data: { status: 'running', attempts: { increment: 1 }, payload: JSON.stringify(body), assetId: asset?.id || null },
  })

  if (!endpoint) {
    // No publish endpoint configured for this channel: the content is ready.
    await prisma.publishJob.update({
      where: { id: jobId },
      data: {
        status: 'done',
        result: JSON.stringify({ mode: 'prepared', note: 'Contenu prêt — publication via l’API du canal' }),
      },
    })
    return 'prepared'
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    })
    const text = (await res.text()).slice(0, 800)
    await prisma.publishJob.update({
      where: { id: jobId },
      data: {
        status: res.ok ? 'done' : 'failed',
        result: JSON.stringify({ mode: 'webhook', status: res.status, body: text }),
        error: res.ok ? null : `HTTP ${res.status}`,
      },
    })
    return res.ok ? 'sent' : 'failed'
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await prisma.publishJob.update({
      where: { id: jobId },
      data: { status: 'failed', error: message },
    })
    return 'failed'
  }
}

// Drains queued jobs, oldest first. `limit` caps how many jobs one run handles
// so the worker stays within a serverless execution window.
export async function processQueue(limit = 25): Promise<ProcessSummary> {
  const summary: ProcessSummary = { kits: { processed: 0, failed: 0 }, publishes: { sent: 0, prepared: 0, failed: 0 }, remaining: 0 }
  const values = await channelValues()

  const jobs = await prisma.publishJob.findMany({
    where: { status: { in: ['queued', 'running'] }, runAfter: { lte: new Date() } },
    orderBy: { createdAt: 'asc' },
    take: limit,
  })

  for (const job of jobs) {
    let payload: StoredPayload = {}
    try {
      payload = job.payload ? (JSON.parse(job.payload) as StoredPayload) : {}
    } catch {
      payload = {}
    }
    if (job.action === 'generate_kit') {
      const before = await prisma.productAsset.count({ where: { productId: job.productId } })
      await processKitJob(job.id, job.productId, payload)
      const after = await prisma.productAsset.count({ where: { productId: job.productId } })
      if (after >= before) summary.kits.processed++
      else summary.kits.failed++
      continue
    }
    const outcome = await processPublishJob(job.id, job.productId, job.channel, values)
    if (outcome === 'sent') summary.publishes.sent++
    else if (outcome === 'prepared') summary.publishes.prepared++
    else summary.publishes.failed++
  }

  summary.remaining = await prisma.publishJob.count({ where: { status: 'queued' } })
  return summary
}

export const KIT_CHANNEL_ID = KIT_CHANNEL
export { configuredChannelIds }
export function channelLabel(id: string): string {
  return CHANNEL_BY_ID[id]?.name || id
}

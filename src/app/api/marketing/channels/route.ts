import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings/store'
import { ALL_CHANNELS } from '@/lib/marketing/channels'

// Public, read-only view of the marketing channels the store has configured.
// Only the values are exposed (URLs/handles), never UTM defaults or pixels.
export async function GET() {
  const settings = await getSettings()
  const channels = settings.marketing?.channels || {}

  const configured = ALL_CHANNELS
    .map((c) => ({ id: c.id, name: c.name, kind: c.kind, value: channels[c.id] || '' }))
    .filter((c) => c.value.trim())

  return NextResponse.json({
    channels: configured,
    whatsappOrderNumber: settings.marketing?.whatsappOrderNumber || '',
    phone: settings.phone,
  })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

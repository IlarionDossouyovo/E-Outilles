import { NextResponse } from 'next/server'
import { getResource } from '@/lib/formations/resources'
import { generateResourcePdf } from '@/lib/formations/pdf'

// Serves the downloadable training guides shown on /formations. The PDF is
// generated on demand (no binary committed) from the shared resource
// definitions, so every listed resource always has a working download.
export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const resource = getResource(params.slug)
  if (!resource) {
    return NextResponse.json({ error: 'Ressource introuvable' }, { status: 404 })
  }

  const pdf = generateResourcePdf(resource)
  const filename = `${resource.slug}.pdf`

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(pdf.length),
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  })
}

export const runtime = 'nodejs'

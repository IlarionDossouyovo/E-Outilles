// Minimal dependency-free PDF writer for the /formations downloads.
//
// Generates a valid multi-page A4 PDF using the PDF base-14 fonts (Helvetica /
// Helvetica-Bold) so no font file or library is needed. Text is encoded in
// WinAnsi (Windows-1252) so French accents, guillemets and the euro sign render
// correctly. Kept intentionally small: these are short technical guides.

import type { TrainingResource } from './resources'

const PAGE_W = 595
const PAGE_H = 842
const MARGIN = 56
const CONTENT_W = PAGE_W - MARGIN * 2

const BODY_SIZE = 10.5
const BODY_LEAD = 15
const HEADING_SIZE = 13
const HEADING_LEAD = 20
const TITLE_SIZE = 22

// WinAnsi code points that differ from Latin-1, so accented French copy renders.
const WINANSI: Record<string, number> = {
  '\u20AC': 0x80, '\u201A': 0x82, '\u0192': 0x83, '\u201E': 0x84,
  '\u2026': 0x85, '\u2020': 0x86, '\u2021': 0x87, '\u02C6': 0x88,
  '\u2030': 0x89, '\u0160': 0x8a, '\u2039': 0x8b, '\u0152': 0x8c,
  '\u017D': 0x8e, '\u2018': 0x91, '\u2019': 0x92, '\u201C': 0x93,
  '\u201D': 0x94, '\u2022': 0x95, '\u2013': 0x96, '\u2014': 0x97,
  '\u02DC': 0x98, '\u2122': 0x99, '\u0161': 0x9a, '\u203A': 0x9b,
  '\u0153': 0x9c, '\u017E': 0x9e, '\u0178': 0x9f,
}

function toWinAnsi(input: string): string {
  let out = ''
  for (const ch of input.split('')) {
    const code = ch.codePointAt(0)!
    if (code < 0x100) out += ch
    else if (WINANSI[ch] !== undefined) out += String.fromCharCode(WINANSI[ch])
    else out += '?'
  }
  return out
}

function esc(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

// Approximate Helvetica advance width (em) — good enough for line breaking.
function charWidth(ch: string, bold: boolean): number {
  if ('iljItf.,;:\'!|'.includes(ch)) return 0.28
  if ('mMW'.includes(ch)) return 0.86
  if (ch === ' ') return 0.28
  if (bold) return 0.6
  return 0.53
}

function wrap(text: string, size: number, bold: boolean, maxWidth = CONTENT_W): string[] {
  const lines: string[] = []
  for (const rawLine of text.split('\n')) {
    let line = ''
    let width = 0
    for (const word of rawLine.split(/\s+/)) {
      const w = word.split('').reduce((s, c) => s + charWidth(c, bold) * size, 0)
      const space = line ? charWidth(' ', bold) * size : 0
      if (width + space + w > maxWidth && line) {
        lines.push(line)
        line = word
        width = w
      } else {
        line = line ? `${line} ${word}` : word
        width += space + w
      }
    }
    lines.push(line)
  }
  return lines
}

interface Op {
  y: number
  draw: string
}

class PdfBuilder {
  private pages: string[][] = []
  private ops: Op[] = []
  private y = PAGE_H - MARGIN

  constructor(private title: string, private subtitle: string) {
    this.band()
  }

  private band() {
    // Yellow brand band at the top of the first page.
    this.ops.push({ y: 0, draw: 'q 1 0.7686 0 rg 0 782 595 60 re f Q' })
    this.ops.push({
      y: 0,
      draw: `BT /F2 16 Tf 0.07 0.07 0.07 rg ${MARGIN} 806 Td (${esc(toWinAnsi('E-Outilles'))}) Tj ET`,
    })
    this.ops.push({
      y: 0,
      draw: `BT /F1 9 Tf 0.25 0.25 0.25 rg 380 806 Td (${esc(toWinAnsi('Par ELECTRON'))}) Tj ET`,
    })
    this.y = PAGE_H - MARGIN - 24
  }

  private ensure(space: number) {
    if (this.y - space < MARGIN) {
      this.flush()
    }
  }

  private flush() {
    if (this.ops.length) this.pages.push(this.ops.map((o) => o.draw))
    this.ops = []
    this.y = PAGE_H - MARGIN
  }

  titleBlock() {
    for (const line of wrap(this.title, TITLE_SIZE, true)) {
      this.ensure(TITLE_SIZE + 6)
      this.ops.push({
        y: this.y,
        draw: `BT /F2 ${TITLE_SIZE} Tf 0.07 0.07 0.07 rg ${MARGIN} ${this.y.toFixed(2)} Td (${esc(toWinAnsi(line))}) Tj ET`,
      })
      this.y -= TITLE_SIZE + 6
    }
    this.y -= 4
    for (const line of wrap(this.subtitle, 10, false)) {
      this.ensure(14)
      this.ops.push({
        y: this.y,
        draw: `BT /F1 10 Tf 0.35 0.35 0.35 rg ${MARGIN} ${this.y.toFixed(2)} Td (${esc(toWinAnsi(line))}) Tj ET`,
      })
      this.y -= 14
    }
    this.y -= 10
    this.ops.push({
      y: 0,
      draw: `q 1 0.7686 0 rg ${MARGIN} ${(this.y + 6).toFixed(2)} ${CONTENT_W} 2 re f Q`,
    })
    this.y -= 12
  }

  heading(text: string) {
    this.ensure(HEADING_LEAD * 2)
    this.y -= 8
    for (const line of wrap(text, HEADING_SIZE, true)) {
      this.ensure(HEADING_LEAD)
      this.ops.push({
        y: this.y,
        draw: `BT /F2 ${HEADING_SIZE} Tf 0.07 0.07 0.07 rg ${MARGIN} ${this.y.toFixed(2)} Td (${esc(toWinAnsi(line))}) Tj ET`,
      })
      this.y -= HEADING_LEAD
    }
    this.y -= 2
  }

  paragraph(text: string) {
    for (const line of wrap(text, BODY_SIZE, false)) {
      this.ensure(BODY_LEAD)
      this.ops.push({
        y: this.y,
        draw: `BT /F1 ${BODY_SIZE} Tf 0.15 0.15 0.15 rg ${MARGIN} ${this.y.toFixed(2)} Td (${esc(toWinAnsi(line))}) Tj ET`,
      })
      this.y -= BODY_LEAD
    }
    this.y -= 6
  }

  build(): Uint8Array {
    this.flush()
    const objects: string[] = []
    const pageCount = this.pages.length
    const kids = this.pages.map((_, i) => `${5 + i * 2} 0 R`).join(' ')

    objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
    objects[2] = `<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`
    objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
    objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'

    this.pages.forEach((content, i) => {
      const stream = content.join('\n')
      const pageObj = 5 + i * 2
      const contentObj = pageObj + 1
      objects[pageObj] =
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObj} 0 R >>`
      objects[contentObj] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    })

    let pdf = '%PDF-1.4\n'
    const offsets: number[] = []
    for (let i = 1; i < objects.length; i++) {
      if (!objects[i]) continue
      offsets[i] = pdf.length
      pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`
    }

    const xrefStart = pdf.length
    const maxObj = objects.length
    pdf += `xref\n0 ${maxObj}\n0000000000 65535 f \n`
    for (let i = 1; i < maxObj; i++) {
      const off = offsets[i] ?? 0
      pdf += `${String(off).padStart(10, '0')} 00000 n \n`
    }
    pdf += `trailer\n<< /Size ${maxObj} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

    const bytes = new Uint8Array(pdf.length)
    for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff
    return bytes
  }
}

export function generateResourcePdf(resource: TrainingResource): Uint8Array {
  const b = new PdfBuilder(
    resource.title,
    `${resource.type} - ${resource.category} - e-outilles.com`
  )
  b.titleBlock()
  b.paragraph(resource.summary)
  for (const section of resource.sections) {
    b.heading(section.heading)
    for (const p of section.paragraphs) b.paragraph(p)
  }
  b.heading('Besoin de conseils personnalisés ?')
  b.paragraph(
    "Notre équipe technique vous accompagne dans le choix de vos outils. Écrivez-nous depuis la page Contact ou via WhatsApp : la réponse est généralement donnée le jour même. " +
      'E-Outilles - par ELECTRON - Cotonou, Bénin.'
  )
  return b.build()
}

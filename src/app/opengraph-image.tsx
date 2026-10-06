import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'E-Outille par ELECTRON - Outillage Professionnel INGCO'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0B0B0B',
          padding: '72px',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', background: '#FFC400', borderRadius: '14px' }} />
          <span style={{ fontSize: '34px', fontWeight: 700, letterSpacing: '-0.5px' }}>E-Outille</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#FFC400', fontSize: '28px', fontWeight: 600 }}>Outillage Professionnel</span>
          <span style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1.05, marginTop: '12px' }}>
            L&apos;outillage INGCO
          </span>
          <span style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1.05 }}>
            pour les pros
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '26px', color: '#9CA3AF' }}>
          <span>Livraison mondiale • Afrique de l&apos;Ouest</span>
          <span style={{ color: '#FFC400', fontWeight: 700 }}>e-outilles.com</span>
        </div>
      </div>
    ),
    size,
  )
}

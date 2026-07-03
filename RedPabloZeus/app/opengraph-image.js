import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'RED ZEUS — Bono de bienvenida 100%'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0B0A0A 0%, #1c0f0d 45%, #0e0b08 100%)',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fondo orbe rojo */}
        <div style={{
          position: 'absolute', top: '-120px', left: '50%',
          transform: 'translateX(-50%)',
          width: '700px', height: '500px',
          background: 'radial-gradient(circle, rgba(122,31,43,0.55) 0%, transparent 65%)',
          display: 'flex',
        }} />
        {/* Fondo orbe dorado */}
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-80px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(201,185,154,0.25) 0%, transparent 65%)',
          display: 'flex',
        }} />

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(122,31,43,0.3)',
          border: '1px solid rgba(201,185,154,0.4)',
          borderRadius: '999px', padding: '10px 24px',
          marginBottom: '28px',
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#7A1F2B', display: 'flex',
          }} />
          <span style={{ color: '#F3E4C2', fontSize: '14px', fontFamily: 'sans-serif', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: '600' }}>
            Oferta por tiempo limitado
          </span>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
          <span style={{ color: '#7A1F2B', fontSize: '52px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>RED</span>
          <span style={{ color: '#C9B99A', fontSize: '52px', fontWeight: '700', fontFamily: 'Georgia, serif' }}>ZEUS</span>
        </div>

        {/* Número grande */}
        <div style={{
          fontSize: '180px', fontWeight: '700', lineHeight: '0.85',
          fontFamily: 'Georgia, serif', letterSpacing: '-0.04em',
          background: 'linear-gradient(100deg, #9E8B70 0%, #C9B99A 30%, #FFF7E3 50%, #C9B99A 70%, #9E8B70 100%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '8px',
        }}>
          +100%
        </div>

        {/* Subtítulo */}
        <div style={{
          color: '#E8DDD0', fontSize: '28px',
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          marginBottom: '32px',
        }}>
          en tu primera carga
        </div>

        {/* CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'linear-gradient(180deg, #2bdd6e, #25D366)',
          color: '#062b15', fontFamily: 'sans-serif',
          fontWeight: '700', fontSize: '20px',
          padding: '18px 40px', borderRadius: '8px',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          Reclamá por WhatsApp
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

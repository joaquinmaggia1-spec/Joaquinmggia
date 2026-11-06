'use client'

import { CONFIG } from './config'

function WaIcon({ width = 18, height = 18, className }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params)
  }
}

export default function Home() {
  const waHref = `https://wa.me/${CONFIG.numero}?text=${encodeURIComponent(CONFIG.mensaje)}`

  function handleWaClick() {
    trackEvent('Contact', { content_name: 'WhatsApp CTA' })
    trackEvent('Lead')
  }

  return (
    <main className="cover">
      <a href="#" className="nav-brand cover-brand">
        <span className="glyph"></span>
        <span className="word">KR<i>I</i>PTON<i>I</i>TA</span>
      </a>

      <div className="cover-body">
        <div className="hero-eyebrow">
          <span className="dot"></span>
          Marketing para iGaming
        </div>

        <h1 className="cover-title">
          Escalamos <span className="gold">tu casino.</span>
        </h1>

        <p className="cover-sub">
          Somos serios y tenemos experiencia en el nicho.{' '}<br />
          La seriedad y nuestra actitud reservada nos caracterizan.
        </p>

        <a href={waHref} onClick={handleWaClick} target="_blank" rel="noopener" className="btn-wa">
          <span className="sheen"></span>
          <span className="wa-ico"><WaIcon width={18} height={18} /></span>
          <span>Escribinos por WhatsApp</span>
          <span className="arrow"><ArrowIcon /></span>
        </a>

        <div className="wa-subline">
          <span className="dot"></span>
          Atención confidencial y personalizada
        </div>
      </div>

      <div className="cover-foot">Reservado · Discreto · Profesional</div>
    </main>
  )
}

'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { CONFIG } from './config'

function WaIcon({ width = 18, height = 18, className }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  )
}

function DecoChip1() {
  return (
    <svg className="deco-chip c1" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="cg1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#E8D49A" />
          <stop offset="100%" stopColor="#7A6B4D" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#cg1)" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="#0B0A0A" strokeWidth="2" strokeDasharray="3 6" />
      <circle cx="50" cy="50" r="18" fill="#0B0A0A" />
      <text x="50" y="56" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="16" fill="#E8D49A" fontStyle="italic">K</text>
    </svg>
  )
}

function DecoChip2() {
  return (
    <svg className="deco-chip c2" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="cg2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#C9B99A" />
          <stop offset="100%" stopColor="#5A4F3C" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#cg2)" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="#0B0A0A" strokeWidth="2" strokeDasharray="3 6" />
      <circle cx="50" cy="50" r="18" fill="#0B0A0A" />
    </svg>
  )
}

function CasoChart1() {
  return (
    <svg viewBox="0 0 320 100" preserveAspectRatio="none" style={{ width: '100%', height: '100px' }}>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D49A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E8D49A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,80 C40,75 80,72 120,60 S200,32 240,22 S300,10 320,8 L320,100 L0,100 Z" fill="url(#g1)" />
      <path d="M0,80 C40,75 80,72 120,60 S200,32 240,22 S300,10 320,8" fill="none" stroke="#E8D49A" strokeWidth="2" />
      <circle cx="320" cy="8" r="4" fill="#E8D49A" />
      <circle cx="320" cy="8" r="8" fill="none" stroke="#E8D49A" strokeOpacity="0.4" />
    </svg>
  )
}

function CasoChart2() {
  return (
    <svg viewBox="0 0 320 100" preserveAspectRatio="none" style={{ width: '100%', height: '100px' }}>
      <defs>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6BC089" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6BC089" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,90 L40,88 L80,70 L120,75 L160,55 L200,45 L240,28 L280,18 L320,12 L320,100 L0,100 Z" fill="url(#g2)" />
      <path d="M0,90 L40,88 L80,70 L120,75 L160,55 L200,45 L240,28 L280,18 L320,12" fill="none" stroke="#6BC089" strokeWidth="2" />
      <circle cx="320" cy="12" r="4" fill="#6BC089" />
    </svg>
  )
}

function CasoChart3() {
  return (
    <svg viewBox="0 0 320 100" preserveAspectRatio="none" style={{ width: '100%', height: '100px' }}>
      <defs>
        <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9B99A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9B99A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,85 Q60,70 100,68 T180,40 T260,20 T320,8 L320,100 L0,100 Z" fill="url(#g3)" />
      <path d="M0,85 Q60,70 100,68 T180,40 T260,20 T320,8" fill="none" stroke="#C9B99A" strokeWidth="2" />
      <circle cx="320" cy="8" r="4" fill="#C9B99A" />
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

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons()

    // ── Floating chips background ──
    const bg = document.getElementById('chipsBg')
    const chipColors = [
      ['#E8D49A', '#7A6B4D'],
      ['#C9B99A', '#5A4F3C'],
      ['#9E8B70', '#3A3225'],
      ['#F4E4B8', '#9E8B70'],
    ]
    if (bg) {
      for (let i = 0; i < 14; i++) {
        const el = document.createElement('div')
        el.className = 'chip-bg'
        const size = 24 + Math.random() * 64
        el.style.width = el.style.height = size + 'px'
        el.style.left = Math.random() * 100 + '%'
        el.style.top = Math.random() * 100 + '%'
        el.style.animationDelay = -Math.random() * 18 + 's'
        el.style.animationDuration = 14 + Math.random() * 14 + 's'
        el.style.opacity = 0.15 + Math.random() * 0.35
        const [a, b] = chipColors[Math.floor(Math.random() * chipColors.length)]
        el.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs><radialGradient id="cgx${i}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></radialGradient></defs>
          <circle cx="50" cy="50" r="48" fill="url(#cgx${i})"/>
          <circle cx="50" cy="50" r="32" fill="none" stroke="#0B0A0A" stroke-width="2" stroke-dasharray="3 6"/>
          <circle cx="50" cy="50" r="14" fill="#0B0A0A" opacity="0.7"/>
        </svg>`
        bg.appendChild(el)
      }
    }

    // ── Slot machine ──
    const SYMBOLS = ['K', 'R', 'I', 'P', 'T', 'O', 'N', 'I', 'T', 'A', '★', '◆', '7', '♠', '♣']
    const TARGETS_POOL = [
      ['K', 'R', 'I'], ['7', '7', '7'], ['★', '★', '★'], ['F', 'T', 'D'],
      ['W', 'I', 'N'], ['R', 'O', 'I'], ['T', 'O', 'P'], ['B', 'E', 'T'],
    ]
    function buildStrip(stripEl, finalSymbol) {
      stripEl.innerHTML = ''
      const total = 30
      const cells = []
      for (let i = 0; i < total; i++) cells.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      cells[total - 2] = finalSymbol
      cells.forEach(c => {
        const d = document.createElement('div')
        d.className = 'reel-cell' + (/[★◆♠♣]/.test(c) ? ' symbol' : '')
        d.textContent = c
        stripEl.appendChild(d)
      })
      return total
    }
    let spinTimeout
    function spinSlot() {
      const r1 = document.getElementById('r1')
      const r2 = document.getElementById('r2')
      const r3 = document.getElementById('r3')
      if (!r1 || !r2 || !r3) return
      const target = TARGETS_POOL[Math.floor(Math.random() * TARGETS_POOL.length)]
      ;[r1, r2, r3].forEach(r => {
        r.style.transition = 'none'
        r.style.transform = 'translateY(0)'
      })
      const totals = [buildStrip(r1, target[0]), buildStrip(r2, target[1]), buildStrip(r3, target[2])]
      void r1.offsetHeight
      const cellH = 56
      const reels = [r1, r2, r3]
      reels.forEach((r, i) => {
        const total = totals[i]
        const targetY = (total - 3) * cellH
        r.style.transition = `transform ${2200 + i * 420}ms cubic-bezier(.22,.9,.27,1)`
        r.style.transform = `translateY(-${targetY}px)`
      })
      setTimeout(() => {
        const ftd = 240 + Math.floor(Math.random() * 180)
        const roas = (7 + Math.random() * 5).toFixed(1)
        const cpa = (10 + Math.random() * 9).toFixed(0)
        const ftdEl = document.getElementById('sl-ftd')
        const roasEl = document.getElementById('sl-roas')
        const cpaEl = document.getElementById('sl-cpa')
        if (ftdEl) ftdEl.textContent = ftd
        if (roasEl) roasEl.textContent = roas + 'x'
        if (cpaEl) cpaEl.textContent = '$' + cpa
      }, 2400)
    }
    spinSlot()
    function autoSpin() {
      spinTimeout = setTimeout(() => {
        spinSlot()
        autoSpin()
      }, 6500)
    }
    autoSpin()
    const spinBtn = document.getElementById('spinBtn')
    function onSpinClick() {
      clearTimeout(spinTimeout)
      spinSlot()
      autoSpin()
    }
    if (spinBtn) spinBtn.addEventListener('click', onSpinClick)

    // ── Counters ──
    function animateCounters(container) {
      if (!container) return
      container.querySelectorAll('[data-count]').forEach(el => {
        if (el.dataset.done) return
        el.dataset.done = '1'
        const target = parseFloat(el.dataset.count)
        const decimals = parseInt(el.dataset.decimals || '0')
        const prefix = el.dataset.prefix || ''
        const suffix = el.dataset.suffix || ''
        const format = el.dataset.format
        let start = null
        const duration = 1800
        function fmt(v) {
          let s = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
          if (format === 'comma') s = Number(s).toLocaleString('es-AR')
          return prefix + s + suffix
        }
        function tick(t) {
          if (!start) start = t
          const p = Math.min((t - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = fmt(target * eased)
          if (p < 1) requestAnimationFrame(tick)
          else el.textContent = fmt(target)
        }
        requestAnimationFrame(tick)
      })
    }

    // ── Meta Ads chart ──
    function drawMetaChart() {
      const svg = document.getElementById('metaChart')
      if (!svg || svg.dataset.drawn) return
      svg.dataset.drawn = '1'

      const W = 1040, H = 320
      const padL = 48, padR = 28, padT = 16, padB = 44
      const innerW = W - padL - padR
      const innerH = H - padT - padB

      const data = [14, 9, 11, 16, 14, 21, 19, 22, 21, 26, 24, 28, 27, 31, 28, 31, 30, 36, 34, 37, 35, 39, 41, 37, 43, 40, 46, 45, 43, 49, 45, 51, 48, 52, 49, 46]
      const N = data.length
      const maxY = 60

      const xAt = i => padL + (i / (N - 1)) * innerW
      const yAt = v => padT + (1 - v / maxY) * innerH

      const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
      const startDate = new Date(2026, 3, 12)
      const xLabels = []
      for (let i = 0; i < N; i += 4) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + i)
        xLabels.push({ i, txt: d.getDate() + ' de ' + months[d.getMonth()] })
      }

      const yTicks = [0, 10, 20, 30, 40, 50, 60]
      let gridSvg = ''
      yTicks.forEach(t => {
        const y = yAt(t)
        gridSvg += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#E4E6EB" stroke-width="1"/>`
        gridSvg += `<text x="${padL - 10}" y="${y + 4}" font-size="12" fill="#65676B" text-anchor="end" font-family="-apple-system, 'Segoe UI', sans-serif">${t}</text>`
      })

      let xSvg = ''
      xLabels.forEach(l => {
        const x = xAt(l.i)
        xSvg += `<text x="${x}" y="${H - 18}" font-size="12" fill="#65676B" text-anchor="middle" font-family="-apple-system, 'Segoe UI', sans-serif">${l.txt}</text>`
      })

      const hoverIdxA = 29
      const hoverIdxB = 30
      const hoverA = xAt(hoverIdxA)
      const hoverB = xAt(hoverIdxB)
      const hoverYa = yAt(data[hoverIdxA])
      const hoverYb = yAt(data[hoverIdxB])

      const pathD = data.map((v, i) => (i === 0 ? 'M' : 'L') + xAt(i).toFixed(2) + ',' + yAt(v).toFixed(2)).join(' ')

      svg.innerHTML = `
        <line x1="${hoverA}" y1="${padT}" x2="${hoverA}" y2="${H - padB}" stroke="#65676B" stroke-width="1" stroke-dasharray="2 3" opacity="0.55"/>
        <line x1="${hoverB}" y1="${padT}" x2="${hoverB}" y2="${H - padB}" stroke="#65676B" stroke-width="1" stroke-dasharray="2 3" opacity="0.55"/>
        ${gridSvg}
        ${xSvg}
        <path id="metaLine" d="${pathD}" fill="none" stroke="#26C6DA" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="${hoverA}" cy="${hoverYa}" r="6" fill="#fff" stroke="#26C6DA" stroke-width="2.4"/>
        <circle cx="${hoverB}" cy="${hoverYb}" r="6" fill="#fff" stroke="#26C6DA" stroke-width="2.4"/>
      `

      const line = svg.querySelector('#metaLine')
      const len = line.getTotalLength()
      line.style.strokeDasharray = len
      line.style.strokeDashoffset = len
      line.style.transition = 'stroke-dashoffset 2400ms cubic-bezier(0.22, 0.9, 0.27, 1)'
      requestAnimationFrame(() => { line.style.strokeDashoffset = '0' })
    }

    function animateMetaCounters(container) {
      if (!container) return
      container.querySelectorAll('[data-meta-count]').forEach(el => {
        if (el.dataset.done) return
        el.dataset.done = '1'
        const target = parseFloat(el.dataset.metaCount)
        const decimals = parseInt(el.dataset.metaDecimals || '0')
        const prefix = el.dataset.metaPrefix || ''
        const format = el.dataset.metaFormat
        const duration = 1800
        let start = null
        function fmt(v) {
          if (decimals > 0) {
            const parts = v.toFixed(decimals).split('.')
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            return prefix + parts.join(',')
          }
          let s = Math.round(v).toString()
          if (format === 'comma') s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          return prefix + s
        }
        function tick(t) {
          if (!start) start = t
          const p = Math.min((t - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = fmt(target * eased)
          if (p < 1) requestAnimationFrame(tick)
          else el.textContent = fmt(target)
        }
        requestAnimationFrame(tick)
      })
    }

    // ── Scroll reveal ──
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          animateCounters(e.target)
          animateMetaCounters(e.target)
          if (e.target.querySelector('#metaChart')) drawMetaChart()
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))

    animateCounters(document.querySelector('.hero-kpis'))

    // ── Live counter bump ──
    const bumpInterval = setInterval(() => {
      const elFtd = document.querySelectorAll('.hero-kpis [data-count]')[2]
      if (!elFtd) return
      const cur = parseInt(elFtd.textContent.replace(/\D/g, ''))
      const next = cur + Math.floor(1 + Math.random() * 4)
      elFtd.textContent = next.toLocaleString('es-AR')
    }, 3500)

    return () => {
      if (spinBtn) spinBtn.removeEventListener('click', onSpinClick)
      clearTimeout(spinTimeout)
      clearInterval(bumpInterval)
      io.disconnect()
    }
  }, [])

  return (
    <>
      <Script
        src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"
        strategy="afterInteractive"
        onLoad={() => window.lucide && window.lucide.createIcons()}
      />

      {/* ──────────────── NAV ──────────────── */}
      <nav>
        <div className="nav-inner">
          <a href="#" className="nav-brand">
            <span className="glyph"></span>
            <span className="word">KR<i>I</i>PTON<i>I</i>TA</span>
          </a>
          <ul className="nav-links">
            <li><a href="#metodo">Método</a></li>
            <li><a href="#resultados">Resultados</a></li>
            <li><a href="#casos">Casos</a></li>
            <li><a href="#proceso">Proceso</a></li>
          </ul>
          <a href={waHref} onClick={handleWaClick} target="_blank" rel="noopener" className="nav-cta wa">
            <WaIcon width={14} height={14} />
            WhatsApp
          </a>
        </div>
      </nav>

      {/* ──────────────── HERO ──────────────── */}
      <section className="hero">
        <div className="chips-bg" id="chipsBg"></div>

        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="dot"></span>
            Performance marketing para iGaming
          </div>
          <h1 className="hero-title">
            Escalamos<br />
            casinos online<br />
            con <span className="gold">paid media</span>
            <span className="small-line">— de alto rendimiento, no de suerte.</span>
          </h1>
          <div className="hero-actions">
            <a href={waHref} onClick={handleWaClick} target="_blank" rel="noopener" className="btn-wa">
              <span className="sheen"></span>
              <span className="wa-ico"><WaIcon width={18} height={18} /></span>
              <span>Escribime por WhatsApp</span>
              <span className="arrow"><i data-lucide="arrow-right" width="14" height="14"></i></span>
            </a>
          </div>
          <div className="wa-subline">
            <span className="dot"></span>
            Respondemos en menos de 5 minutos · Lun a Vie 9–22h
          </div>
          <p className="hero-sub">
            Operamos campañas en Meta, Google y TikTok para operadores de iGaming. <b>+47 casinos escalados</b>, CPA promedio reducido <b>−63%</b>, y ROAS sostenido sobre <b>8.4x</b>.
          </p>
          <div className="hero-trust">
            <div className="item"><i data-lucide="badge-check" width="14" height="14"></i> Meta Business Partner</div>
            <div className="item"><i data-lucide="shield-check" width="14" height="14"></i> Google Premier</div>
          </div>
        </div>

        <div className="hero-right">
          <DecoChip1 />
          <DecoChip2 />

          <div className="slot" id="slot">
            <div className="slot-header">
              <div className="label"><span className="led"></span> KRIPTONITA LIVE FEED</div>
              <div className="badge">ACTIVO</div>
            </div>
            <div className="reels">
              <div className="reel"><div className="reel-strip" id="r1"></div></div>
              <div className="reel"><div className="reel-strip" id="r2"></div></div>
              <div className="reel"><div className="reel-strip" id="r3"></div></div>
            </div>
            <div className="slot-foot">
              <div className="stat"><span className="v" id="sl-ftd">312</span><span className="l">FTDs hoy</span></div>
              <div className="stat"><span className="v" id="sl-roas">8.4x</span><span className="l">ROAS</span></div>
              <div className="stat"><span className="v" id="sl-cpa">$14</span><span className="l">CPA Meta</span></div>
              <button className="spin-btn" id="spinBtn">Re-spin</button>
            </div>
          </div>

          <div className="hero-kpis">
            <div className="kpi"><div className="l">Operadores activos</div><div className="v" data-count="47" data-suffix="">0</div><div className="d"><i data-lucide="trending-up" width="12" height="12"></i> +12 vs Q4</div></div>
            <div className="kpi"><div className="l">Inversión gestionada</div><div className="v" data-count="2.4" data-prefix="$" data-suffix="M">$0M</div><div className="d"><i data-lucide="trending-up" width="12" height="12"></i> +84% YoY</div></div>
            <div className="kpi"><div className="l">FTDs generados</div><div className="v" data-count="84600" data-suffix="">0</div><div className="d"><i data-lucide="trending-up" width="12" height="12"></i> Últ. 12 meses</div></div>
          </div>
        </div>
      </section>

      {/* ──────────────── TICKER ──────────────── */}
      <div className="ticker">
        <div className="ticker-track">
          <span className="ticker-item">CPA <b>−63%</b></span><span className="ticker-item"><span className="sep"></span></span>
          <span className="ticker-item"><b>+47</b> casinos escalados</span><span className="ticker-item"><span className="sep"></span></span>
          <span className="ticker-item">ROAS <b>8.4x</b> promedio</span><span className="ticker-item"><span className="sep"></span></span>
          <span className="ticker-item"><b>84.600</b> FTDs generados</span><span className="ticker-item"><span className="sep"></span></span>
          <span className="ticker-item">Meta <b>·</b> Google <b>·</b> TikTok</span><span className="ticker-item"><span className="sep"></span></span>
          <span className="ticker-item">CPA <b>−63%</b></span><span className="ticker-item"><span className="sep"></span></span>
          <span className="ticker-item"><b>+47</b> casinos escalados</span><span className="ticker-item"><span className="sep"></span></span>
          <span className="ticker-item">ROAS <b>8.4x</b> promedio</span><span className="ticker-item"><span className="sep"></span></span>
          <span className="ticker-item"><b>84.600</b> FTDs generados</span><span className="ticker-item"><span className="sep"></span></span>
          <span className="ticker-item">Meta <b>·</b> Google <b>·</b> TikTok</span><span className="ticker-item"><span className="sep"></span></span>
        </div>
      </div>

      {/* ──────────────── PROBLEMA / MÉTODO ──────────────── */}
      <section className="section" id="metodo">
        <div className="reveal">
          <div className="section-eyebrow">El problema del iGaming</div>
          <h2 className="section-title">No pierdes dinero por <em>mala suerte</em>.<br />Lo pierdes por <em>mala estructura</em>.</h2>
          <p className="section-lede">Los operadores que estancan no es porque su producto sea malo. Es porque están escalando sin un sistema. Nosotros lo arreglamos.</p>
        </div>
        <div className="problem-row reveal">
          <div className="problem-cell">
            <div className="num">01 / SÍNTOMA</div>
            <h3>CPA fuera de control</h3>
            <p>Las campañas funcionan al inicio y luego revientan. La cuenta no aprende porque las conversiones llegan tarde o mal trackeadas.</p>
          </div>
          <div className="problem-cell">
            <div className="num">02 / SÍNTOMA</div>
            <h3>Bans, restricciones y rechazos</h3>
            <p>Meta y Google bloquean campañas cada semana. Pierdes pixel, pierdes data, vuelves a empezar de cero cada vez.</p>
          </div>
          <div className="problem-cell">
            <div className="num">03 / SÍNTOMA</div>
            <h3>Tráfico que no deposita</h3>
            <p>Llegan registros pero no FTDs. El funnel está roto entre el anuncio y la primera ficha cargada, y nadie está mirando.</p>
          </div>
        </div>
      </section>

      {/* ──────────────── DASHBOARD META MOCK ──────────────── */}
      <section className="dash-section" id="resultados">
        <div className="section">
          <div className="reveal">
            <div className="section-eyebrow">Resultados verificables</div>
            <h2 className="section-title">El <em>panel de Meta Ads</em> de un cliente real.<br />Últimos 90 días.</h2>
            <p className="section-lede">Captura directa del Business Manager. Operador LATAM, ticket promedio €58, mercado MX/CO/PE. Toda la data validada con server-side tracking.</p>
          </div>

          <div className="dash-frame reveal">
            <div className="dash-chrome">
              <div className="lights"><span></span><span></span><span></span></div>
              <div className="url-bar">
                <i data-lucide="lock" width="12" height="12"></i>
                <span>business.facebook.com</span><span className="path">/adsmanager/manage/campaigns?act=1247853096</span>
              </div>
              <div className="live-pill"><span className="dot"></span>EN VIVO</div>
            </div>

            <div className="meta-panel">
              <div className="meta-panel-head">
                <div className="title">Resumen del rendimiento</div>
                <div className="actions">
                  <button className="meta-btn"><i data-lucide="sliders-horizontal" width="14" height="14"></i> Personalizar métricas</button>
                </div>
              </div>

              <div className="meta-kpis">
                <div className="meta-kpi active">
                  <div className="lbl">Conversaciones con mensajes iniciadas <span className="info">i</span></div>
                  <div className="val" data-meta-count="1194" data-meta-format="comma">0</div>
                  <div className="delta"><span className="arrow">↑</span> <b>121%</b> vs. los 36 días anteriores</div>
                </div>
                <div className="meta-kpi">
                  <div className="lbl">Por conversación con mensajes iniciada <span className="info">i</span></div>
                  <div className="val" data-meta-count="479.46" data-meta-prefix="$" data-meta-decimals="2">$0</div>
                  <div className="delta"><span style={{ color: '#1F7A1F' }}>↓</span> <b style={{ color: '#1F7A1F' }}>21%</b> vs. los 36 días anteriores</div>
                </div>
                <div className="meta-kpi">
                  <div className="lbl">Importe gastado <span className="info">i</span></div>
                  <div className="val" data-meta-count="572475.24" data-meta-prefix="$ " data-meta-decimals="2">$ 0</div>
                  <div className="delta"><span className="arrow">↑</span> <b>74%</b> vs. los 36 días anteriores</div>
                </div>
              </div>

              <div className="meta-chart-block">
                <div className="chart-title">Conversaciones con mensajes iniciadas</div>
                <div className="meta-chart-wrap">
                  <svg id="metaChart" viewBox="0 0 1040 320" preserveAspectRatio="none"></svg>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 28px', background: '#FAFBFC', borderTop: '1px solid #DADDE1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "-apple-system, 'Segoe UI', sans-serif" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1877F2', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>A</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1E21' }}>Cuenta · &quot;Aurora Bet&quot; — Casino Online LATAM</div>
                  <div style={{ fontSize: '12px', color: '#65676B', marginTop: '2px' }}>ID 1247853096 · MX / CO / PE · 36 días · 18 campañas activas</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#65676B' }}>Última actualización: hace 4 min</div>
            </div>
          </div>

          <div className="dash-callouts reveal">
            <div className="callout">
              <div className="ic"><i data-lucide="trending-up" width="16" height="16"></i></div>
              <div className="ttl">+121% en conversaciones</div>
              <div className="desc">Pasamos de 540 a 1.194 conversaciones iniciadas en 36 días, sin caída de calidad del jugador.</div>
            </div>
            <div className="callout">
              <div className="ic"><i data-lucide="trending-down" width="16" height="16"></i></div>
              <div className="ttl">−21% en costo por conversación</div>
              <div className="desc">Bajamos de $610 a $479 con la inversión escalando 1,7x. Tracking server-side y creatividades nuevas.</div>
            </div>
            <div className="callout">
              <div className="ic"><i data-lucide="rocket" width="16" height="16"></i></div>
              <div className="ttl">$572K invertidos</div>
              <div className="desc">De $329K a $572K en el período, manteniendo ROAS y bajando CPA simultáneamente.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── CASOS ──────────────── */}
      <section className="section" id="casos">
        <div className="reveal">
          <div className="section-eyebrow">Casos de éxito</div>
          <h2 className="section-title">Tres operadores, tres mercados,<br />un mismo <em>método</em>.</h2>
          <p className="section-lede">Cada cuenta es distinta. La metodología, no. Aquí los números reales de tres clientes activos, anonimizados por contrato NDA.</p>
        </div>

        <div className="casos-grid reveal">
          <div className="caso-card">
            <div className="caso-head">
              <div>
                <div className="caso-name">Aurora Bet</div>
                <div className="caso-flag">MX · CO · PE  ·  Casino + Sports</div>
              </div>
              <div className="caso-badge">90 días</div>
            </div>
            <div className="caso-headline">&quot;Pasamos de €30K/mes en spend a €180K manteniendo CPA por debajo de €15.&quot;</div>
            <div className="caso-chart"><CasoChart1 /></div>
            <div className="caso-stats">
              <div className="caso-stat"><div className="v">+312%</div><div className="l">FTDs</div></div>
              <div className="caso-stat"><div className="v">−68%</div><div className="l">CPA</div></div>
              <div className="caso-stat"><div className="v">11.8x</div><div className="l">ROAS</div></div>
            </div>
            <div className="caso-quote">
              &quot;Llevábamos 8 meses estancados. Kriptonita reestructuró todo el tracking en 3 semanas y el CPA cayó solo.&quot;
              <span className="who">— CMO, operador iGaming · MX</span>
            </div>
          </div>

          <div className="caso-card">
            <div className="caso-head">
              <div>
                <div className="caso-name">Nova Casino</div>
                <div className="caso-flag">AR · UY · CL  ·  Slots premium</div>
              </div>
              <div className="caso-badge">120 días</div>
            </div>
            <div className="caso-headline">&quot;De cuenta restringida en Meta a Business Partner activo en 4 meses.&quot;</div>
            <div className="caso-chart"><CasoChart2 /></div>
            <div className="caso-stats">
              <div className="caso-stat"><div className="v">+186%</div><div className="l">FTDs</div></div>
              <div className="caso-stat"><div className="v">−54%</div><div className="l">CPA</div></div>
              <div className="caso-stat"><div className="v">7.2x</div><div className="l">ROAS</div></div>
            </div>
            <div className="caso-quote">
              &quot;Tres BMs baneados antes de llegar a ellos. Recuperaron la cuenta, blindaron la estructura y ahora escalamos sin miedo.&quot;
              <span className="who">— Head of Acquisition · AR</span>
            </div>
          </div>

          <div className="caso-card">
            <div className="caso-head">
              <div>
                <div className="caso-name">Lupo Gaming</div>
                <div className="caso-flag">ES · IT  ·  Live casino</div>
              </div>
              <div className="caso-badge">180 días</div>
            </div>
            <div className="caso-headline">&quot;€420K de inversión, €3.6M en GGR atribuible. ROAS sostenido 6 meses.&quot;</div>
            <div className="caso-chart"><CasoChart3 /></div>
            <div className="caso-stats">
              <div className="caso-stat"><div className="v">+248%</div><div className="l">GGR</div></div>
              <div className="caso-stat"><div className="v">−42%</div><div className="l">CPA</div></div>
              <div className="caso-stat"><div className="v">8.6x</div><div className="l">ROAS</div></div>
            </div>
            <div className="caso-quote">
              &quot;Pensábamos que ya habíamos tocado techo en España. Encontraron 3 segmentos nuevos y rompimos el techo.&quot;
              <span className="who">— Founder · ES</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── PROCESO ──────────────── */}
      <section className="proceso-section" id="proceso">
        <div className="section">
          <div className="reveal">
            <div className="section-eyebrow">Cómo trabajamos</div>
            <h2 className="section-title">Cuatro pasos.<br /><em>Sin promesas</em> de tragamonedas.</h2>
            <p className="section-lede">Onboarding en 14 días. Primer mes calibración. Del segundo en adelante, escalamos.</p>
          </div>
          <div className="proceso-grid reveal">
            <div className="paso">
              <div className="paso-num">01</div>
              <div className="paso-name">Auditoría</div>
              <div className="paso-desc">Revisamos pixel, conversiones API, estructura de cuenta, BMs, dominios verificados y health score. Te entregamos un informe de 20 páginas en 5 días hábiles.</div>
              <div className="paso-tag">5 días · sin costo</div>
            </div>
            <div className="paso">
              <div className="paso-num">02</div>
              <div className="paso-name">Reestructura</div>
              <div className="paso-desc">Server-side tracking con Conversion API, dominios redundantes, estructura CBO/ABO según escala, blindaje de cuenta y workflow de creatividades.</div>
              <div className="paso-tag">14 días · onboarding</div>
            </div>
            <div className="paso">
              <div className="paso-num">03</div>
              <div className="paso-name">Calibración</div>
              <div className="paso-desc">Primeras 4 semanas de testeo de audiencias, hooks y formatos. Iteramos 8–12 creatividades semanales. Métrica norte: nCPA en horizonte D7.</div>
              <div className="paso-tag">Mes 1</div>
            </div>
            <div className="paso">
              <div className="paso-num">04</div>
              <div className="paso-name">Escalada</div>
              <div className="paso-desc">Una vez probado el unit economics, escalamos en bloques semanales del 30% sobre las campañas con mejor LTV/CAC. Reporting semanal en vivo.</div>
              <div className="paso-tag">Mes 2 en adelante</div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── STACK / SERVICIOS ──────────────── */}
      <section className="section">
        <div className="reveal">
          <div className="section-eyebrow">Qué hacemos por dentro</div>
          <h2 className="section-title">Un stack <em>completo</em>, no solo media buying.</h2>
        </div>
        <div className="stack-grid reveal">
          <div className="stack-item">
            <div className="ic"><i data-lucide="target" width="20" height="20"></i></div>
            <div className="ttl">Paid Media</div>
            <div className="desc">Meta, Google, TikTok, Push &amp; Native. Gestión completa con buyers especializados en iGaming.</div>
          </div>
          <div className="stack-item">
            <div className="ic"><i data-lucide="shield" width="20" height="20"></i></div>
            <div className="ttl">Cuenta blindada</div>
            <div className="desc">BMs en cascada, dominios verificados, política de compliance. Cero downtime por bans.</div>
          </div>
          <div className="stack-item">
            <div className="ic"><i data-lucide="line-chart" width="20" height="20"></i></div>
            <div className="ttl">Tracking server-side</div>
            <div className="desc">Conversion API + GA4 + tag server. La data llega aunque iOS, Adblock o Safari estén de por medio.</div>
          </div>
          <div className="stack-item">
            <div className="ic"><i data-lucide="film" width="20" height="20"></i></div>
            <div className="ttl">Creatividades</div>
            <div className="desc">Equipo in-house de motion + UGC. 30–60 piezas mensuales con hooks probados por vertical.</div>
          </div>
          <div className="stack-item">
            <div className="ic"><i data-lucide="layout-template" width="20" height="20"></i></div>
            <div className="ttl">Landing pages</div>
            <div className="desc">LPs específicas por geo, bono y oferta. CRO con tests A/B continuos. Lighthouse +90.</div>
          </div>
          <div className="stack-item">
            <div className="ic"><i data-lucide="users-round" width="20" height="20"></i></div>
            <div className="ttl">Segmentación LTV</div>
            <div className="desc">Modelos predictivos de LTV por cohort. Priorizamos audiencias por valor real, no por CTR.</div>
          </div>
          <div className="stack-item">
            <div className="ic"><i data-lucide="message-square" width="20" height="20"></i></div>
            <div className="ttl">CRM + Retención</div>
            <div className="desc">Flujos automáticos en WhatsApp, SMS y email. Reactivación de jugadores en D7, D30, D90.</div>
          </div>
          <div className="stack-item">
            <div className="ic"><i data-lucide="bar-chart-3" width="20" height="20"></i></div>
            <div className="ttl">Reporting</div>
            <div className="desc">Dashboard en vivo con CPA, ROAS, GGR y NGR por canal. Acceso 24/7 para el cliente.</div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp button */}
      <a href={waHref} onClick={handleWaClick} target="_blank" rel="noopener" className="fab-wa" aria-label="Contactar por WhatsApp">
        <WaIcon width={30} height={30} />
      </a>
    </>
  )
}

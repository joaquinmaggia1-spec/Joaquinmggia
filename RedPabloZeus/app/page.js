'use client'

import { useEffect, useRef } from 'react'
import { CONFIG } from './config'

const WA_SVG = (
  <svg className="ic" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.86 9.86 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.437-9.884 9.889-9.884a9.825 9.825 0 0 1 6.993 2.898 9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.889 9.884z"/>
  </svg>
)

const BOLT_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
    <path d="M13 2 4 13.5h6L9 22l11-13h-7l2-7Z"/>
  </svg>
)

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
    // Nav scroll
    const nav = document.getElementById('nav')
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })

    // Año en footer
    const yearEl = document.getElementById('year')
    if (yearEl) yearEl.textContent = new Date().getFullYear()

    // FX partículas
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduce) {
      const mobile = window.innerWidth < 720
      const suits = ['♠', '♥', '♦', '♣']
      const hero = document.getElementById('heroFx')
      const cta = document.getElementById('ctaFx')

      function chip(host, i) {
        const c = document.createElement('div')
        c.className = 'chip'
        const size = 44 + Math.random() * 70
        c.style.width = c.style.height = size + 'px'
        c.style.left = Math.random() * 100 + '%'
        c.style.bottom = (-20 - Math.random() * 40) + '%'
        c.style.setProperty('--op', (0.18 + Math.random() * 0.3).toFixed(2))
        c.style.animationDuration = (14 + Math.random() * 16) + 's'
        c.style.animationDelay = (-Math.random() * 18) + 's'
        const s = document.createElement('span')
        s.textContent = suits[i % suits.length]
        s.style.fontSize = size * 0.4 + 'px'
        if (suits[i % 4] === '♥' || suits[i % 4] === '♦')
          s.style.color = 'color-mix(in srgb,var(--borgona) 65%,transparent)'
        c.appendChild(s)
        host.appendChild(c)
      }
      function spark(host) {
        const s = document.createElement('div')
        s.className = 'spark'
        s.style.left = Math.random() * 100 + '%'
        s.style.top = 40 + Math.random() * 60 + '%'
        s.style.animationDuration = 5 + Math.random() * 6 + 's'
        s.style.animationDelay = -Math.random() * 8 + 's'
        host.appendChild(s)
      }
      const nChips = mobile ? 5 : 11
      const nSparks = mobile ? 8 : 22
      for (let i = 0; i < nChips; i++) chip(hero, i)
      for (let i = 0; i < nSparks; i++) spark(hero)
      if (cta) { for (let i = 0; i < (mobile ? 6 : 14); i++) spark(cta) }
    }

    // Scroll reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))

    // Contadores
    function animateCount(el) {
      const to = parseFloat(el.dataset.to)
      const pre = (el.dataset.prefix || '').replace('&lt;', '<')
      const suf = el.dataset.suffix || ''
      const dur = 1600, start = performance.now()
      function frame(now) {
        const p = Math.min((now - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        const val = Math.round(to * eased)
        el.textContent = pre + val.toLocaleString('es-AR') + suf
        if (p < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    }
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target) } })
    }, { threshold: 0.5 })
    document.querySelectorAll('.count').forEach(el => cio.observe(el))

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="brand" aria-label="RED ZEUS inicio">
            <svg className="mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
              <path d="M13 2 4 13.5h6L9 22l11-13h-7l2-7Z"/>
            </svg>
            <span className="name"><b>RED</b> <span className="z">ZEUS</span></span>
          </a>
          <a href={waHref} onClick={handleWaClick} className="btn btn-wa nav-cta" target="_blank" rel="noopener" style={{fontSize:'15px',padding:'17px 32px',minHeight:'56px'}}>
            {WA_SVG} Quiero mi bono
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="fx" id="heroFx">
          <div className="grid-fx"></div>
          <div className="orb red" style={{top:'-12%',left:'50%',marginLeft:'-300px'}}></div>
          <div className="orb gold" style={{bottom:'-18%',right:'-6%'}}></div>
          <div className="orb em" style={{bottom:'-10%',left:'-12%'}}></div>
          <div className="beam"></div>
          <div className="roulette" style={{width:'520px',height:'520px',right:'-160px',top:'8%'}}></div>
          <div className="roulette" style={{width:'300px',height:'300px',left:'-110px',bottom:'6%',animationDirection:'reverse'}}></div>
        </div>
        <div className="wrap">
          <div className="hero-inner">
            <span className="badge"><span className="dot"></span> Oferta por tiempo limitado</span>
            <h1>Ganá más<br/><span className="em">desde hoy.</span></h1>
            <span className="bonus-flash shimmer">+100%</span>
            <div className="hero-actions">
              <a href={waHref} onClick={handleWaClick} className="btn btn-wa lg" target="_blank" rel="noopener">
                {WA_SVG} Quiero mi bono de 100%
              </a>
            </div>
            <p className="lead">Duplicá tu primera carga con el <b>bono de bienvenida del 100%</b>.</p>
            <p className="sub">Cargá, jugá y retirá. Reclamás tu bono en menos de un minuto, directo por WhatsApp. Sin vueltas.</p>
            <div className="trust">
              <span className="star">★★★★★</span>
              <span>4.9 / 5 según jugadores</span>
              <span className="sep"></span>
              <span>Retiros en menos de 10 min</span>
              <span className="sep"></span>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="band paper" id="beneficios">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow-row"><span className="rule"></span><span className="overline">Por qué elegirnos</span></div>
            <h2>Una mesa hecha para <em>jugadores reales.</em></h2>
            <p>Pagos veloces, atención de verdad y métodos de carga que ya usás todos los días.</p>
          </div>
          <div className="benefits">
            <div className="benefit reveal">
              <span className="num">01</span>
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2 4 13.5h6L9 22l11-13h-7l2-7Z"/></svg>
              <h3>Retiros en minutos</h3>
              <p>Solicitá y cobrás en menos de 10 minutos. Sin demoras ni excusas.</p>
            </div>
            <div className="benefit reveal d1">
              <span className="num">02</span>
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
              <h3>Soporte 24/7</h3>
              <p>Personas reales por WhatsApp, a cualquier hora, todos los días del año.</p>
            </div>
            <div className="benefit reveal d2">
              <span className="num">03</span>
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <h3>Métodos locales</h3>
              <p>Mercado Pago, transferencia y cripto. Cargás en segundos desde tu celular.</p>
            </div>
            <div className="benefit reveal d3">
              <span className="num">04</span>
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <h3>Juego seguro</h3>
              <p>Plataforma protegida y datos cifrados. Tu información siempre resguardada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BONO */}
      <section className="band ink" id="bono">
        <div className="fx">
          <div className="orb red" style={{top:'-20%',left:'-10%'}}></div>
          <div className="orb gold" style={{bottom:'-25%',right:'-8%'}}></div>
        </div>
        <div className="wrap" style={{position:'relative',zIndex:2}}>
          <div className="sec-head center reveal">
            <div className="eyebrow-row" style={{justifyContent:'center'}}><span className="rule"></span><span className="overline">El bono</span><span className="rule"></span></div>
            <h2>Tu primera carga vale <em>el doble.</em></h2>
          </div>
          <div className="bono-grid">
            <div className="ticket reveal">
              <span className="perf top"></span>
              <span className="tk-label">Bono de bienvenida</span>
              <div className="tk-big shimmer">+100%</div>
              <div className="tk-sub">extra en tu primera carga</div>
              <p className="tk-fine">Cargás $10.000 → jugás con $20.000. Válido para nuevos jugadores.</p>
              <span className="perf bot"></span>
            </div>
            <div className="steps reveal d1">
              <div className="step">
                <span className="sn">1</span>
                <div><h4>Escribinos por WhatsApp</h4><p>Tocá el botón y mandá el mensaje. Te respondemos al instante.</p></div>
              </div>
              <div className="step">
                <span className="sn">2</span>
                <div><h4>Hacé tu primera carga</h4><p>Elegí tu método favorito: Mercado Pago, transferencia o cripto.</p></div>
              </div>
              <div className="step">
                <span className="sn">3</span>
                <div><h4>Recibí tu 100% extra</h4><p>Acreditamos el bono al toque y arrancás a jugar con el doble.</p></div>
              </div>
              <a href={waHref} onClick={handleWaClick} className="btn btn-wa" target="_blank" rel="noopener" style={{marginTop:'10px',alignSelf:'flex-start'}}>
                {WA_SVG} Reclamar mi 100%
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRUEBA SOCIAL */}
      <section className="band" id="jugadores" style={{background:'linear-gradient(180deg,#0b0a0a,#0e0c0b)'}}>
        <div className="fx">
          <div className="orb gold" style={{top:'-18%',right:'-12%'}}></div>
          <div className="orb em" style={{bottom:'-22%',left:'-10%'}}></div>
        </div>
        <div className="wrap" style={{position:'relative',zIndex:2}}>
          <div className="sec-head center reveal">
            <div className="eyebrow-row" style={{justifyContent:'center'}}><span className="rule"></span><span className="overline">Comunidad</span><span className="rule"></span></div>
            <h2>Miles ya están <em>cobrando.</em></h2>
          </div>
          <div className="stats reveal">
            <div className="stat"><span className="n shimmer count" data-to="5200" data-suffix="+">0</span><span className="l">Jugadores activos</span></div>
            <div className="stat"><span className="n shimmer count" data-to="10" data-prefix="&lt;" data-suffix=" min">0</span><span className="l">Retiro promedio</span></div>
            <div className="stat"><span className="n shimmer count" data-to="98" data-suffix="%">0</span><span className="l">Pagos sin demora</span></div>
            <div className="stat"><span className="n shimmer count" data-to="24" data-suffix="/7">0</span><span className="l">Soporte real</span></div>
          </div>
          <div className="reviews">
            <div className="review reveal">
              <div className="rs">★★★★★</div>
              <p>&quot;Cargué a la noche y en 7 minutos ya tenía la plata en Mercado Pago. No lo podía creer.&quot;</p>
              <div className="who"><span className="av">M</span><div><b>Martín R.</b><span>Córdoba</span></div></div>
            </div>
            <div className="review reveal d1">
              <div className="rs">★★★★★</div>
              <p>&quot;El bono del 100% me re sirvió para arrancar. Atención por WhatsApp impecable, te responden al toque.&quot;</p>
              <div className="who"><span className="av">V</span><div><b>Valentina S.</b><span>Rosario</span></div></div>
            </div>
            <div className="review reveal d2">
              <div className="rs">★★★★★</div>
              <p>&quot;Probé otros y este es el único que paga rápido de verdad. Ya soy cliente fijo.&quot;</p>
              <div className="who"><span className="av">D</span><div><b>Diego L.</b><span>Buenos Aires</span></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTODOS DE PAGO */}
      <section className="band paper" id="pagos">
        <div className="wrap">
          <div className="sec-head center reveal">
            <div className="eyebrow-row" style={{justifyContent:'center'}}><span className="rule"></span><span className="overline">Cargá y cobrá fácil</span><span className="rule"></span></div>
            <h2>Tus métodos de <em>siempre.</em></h2>
            <p>Sin tarjetas raras ni pasos de más. Usás lo que ya tenés en el celular.</p>
          </div>
          <div className="pays reveal">
            <div className="pay">
              <svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              <b>Mercado Pago</b><span>Acreditación al instante</span>
            </div>
            <div className="pay">
              <svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <b>Transferencia</b><span>CBU / CVU bancario</span>
            </div>
            <div className="pay">
              <svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <b>Cripto</b><span>USDT y otras</span>
            </div>
            <div className="pay">
              <svg className="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <b>Efectivo</b><span>Puntos de carga</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="final" id="cta">
        <div className="fx" id="ctaFx">
          <div className="grid-fx"></div>
          <div className="orb red" style={{top:'-30%',left:'50%',marginLeft:'-300px'}}></div>
          <div className="beam"></div>
        </div>
        <div className="wrap" style={{position:'relative',zIndex:2}}>
          <div className="reveal">
            <span className="overline" style={{color:'var(--gold)'}}>Cupos limitados</span>
            <h2 style={{marginTop:'18px'}}>Duplicá tu primera carga</h2>
            <div className="fb shimmer">+100%</div>
            <div className="urg">
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Oferta válida solo por hoy
            </div>
            <div className="hero-actions" style={{flexDirection:'row',justifyContent:'center',flexWrap:'wrap'}}>
              <a href={waHref} onClick={handleWaClick} className="btn btn-wa lg" target="_blank" rel="noopener">
                {WA_SVG} Jugar ya con mi bono
              </a>
            </div>
            <p className="sub" style={{margin:'26px auto 0',color:'var(--stone)'}}>+18 · Jugá con responsabilidad. El juego puede generar adicción.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap foot-top">
          <div className="foot-brand">
            <svg className="mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
              <path d="M13 2 4 13.5h6L9 22l11-13h-7l2-7Z"/>
            </svg>
            <span className="name"><b>RED</b> <span className="z">ZEUS</span></span>
          </div>
          <div className="responsible">
            <span className="plus">+18</span>
            <p><b style={{color:'var(--gold-light)'}}>Jugá con responsabilidad.</b> El juego de azar puede generar adicción y debe practicarse con moderación. Prohibida la participación de menores de 18 años. Si el juego deja de ser un entretenimiento, buscá ayuda.</p>
          </div>
          <div className="foot-links">
            <a href="#beneficios">Beneficios</a>
            <a href="#bono">Bono 100%</a>
            <a href="#pagos">Métodos de pago</a>
            <a href="#">Términos y condiciones</a>
            <a href="#">Política de privacidad</a>
            <a href="#">Juego responsable</a>
          </div>
          <p className="foot-copy">© <span id="year"></span> RED ZEUS. Todos los derechos reservados. Este sitio es solo para mayores de 18 años.</p>
        </div>
      </footer>

      {/* WA FLOTANTE */}
      <a href={waHref} onClick={handleWaClick} className="wa-float" target="_blank" rel="noopener" aria-label="Reclamar bono por WhatsApp">
        <span className="tip">Reclamá tu 100%</span>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.86 9.86 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.002-5.45 4.437-9.884 9.889-9.884a9.825 9.825 0 0 1 6.993 2.898 9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.889 9.884z"/>
        </svg>
      </a>
    </>
  )
}

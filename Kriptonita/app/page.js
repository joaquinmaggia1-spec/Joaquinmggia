'use client'

import { useEffect } from 'react'
import { CONFIG } from './config'

const BODY_HTML = `
<!-- ──────────────── NAV ──────────────── -->
<nav>
  <div class="nav-inner">
    <a href="#" class="nav-brand">
      <span class="glyph"></span>
      <span class="word">KR<i>I</i>PTON<i>I</i>TA</span>
    </a>
    <ul class="nav-links">
      <li><a href="#metodo">Método</a></li>
      <li><a href="#resultados">Resultados</a></li>
      <li><a href="#casos">Casos</a></li>
      <li><a href="#proceso">Proceso</a></li>
    </ul>
    <a href="__WA_HREF__" target="_blank" rel="noopener" class="nav-cta wa" onclick="if(typeof fbq==='function'){fbq('track','Contact');}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"/></svg>
      WhatsApp
    </a>
  </div>
</nav>

<!-- ──────────────── HERO ──────────────── -->
<section class="hero">
  <div class="chips-bg" id="chipsBg"></div>

  <div class="hero-left">
    <div class="hero-eyebrow">
      <span class="dot"></span>
      Performance marketing para iGaming
    </div>
    <h1 class="hero-title">
      Escalamos<br>
      casinos online<br>
      con <span class="gold">paid media</span>
      <span class="small-line">— de alto rendimiento, no de suerte.</span>
    </h1>
    <div class="hero-actions">
      <a href="__WA_HREF__" target="_blank" rel="noopener" class="btn-wa" onclick="if(typeof fbq==='function'){fbq('track','Contact');}">
        <span class="sheen"></span>
        <span class="wa-ico">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"/></svg>
        </span>
        <span>Escribime por WhatsApp</span>
        <span class="arrow"><i data-lucide="arrow-right" width="14" height="14"></i></span>
      </a>
    </div>
    <div class="wa-subline">
      <span class="dot"></span>
      Respondemos en menos de 5 minutos · Lun a Vie 9–22h
    </div>
    <p class="hero-sub">
      Operamos campañas en Meta, Google y TikTok para operadores de iGaming. <b>+47 casinos escalados</b>, CPA promedio reducido <b>−63%</b>, y ROAS sostenido sobre <b>8.4x</b>.
    </p>
    <div class="hero-trust">
      <div class="item"><i data-lucide="badge-check" width="14" height="14"></i> Meta Business Partner</div>
      <div class="item"><i data-lucide="shield-check" width="14" height="14"></i> Google Premier</div>
    </div>
  </div>

  <div class="hero-right">
    <!-- Floating decorative chips -->
    <svg class="deco-chip c1" viewBox="0 0 100 100"><defs><radialGradient id="cg1" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#E8D49A"/><stop offset="100%" stop-color="#7A6B4D"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#cg1)"/><circle cx="50" cy="50" r="32" fill="none" stroke="#0B0A0A" stroke-width="2" stroke-dasharray="3 6"/><circle cx="50" cy="50" r="18" fill="#0B0A0A"/><text x="50" y="56" text-anchor="middle" font-family="Cormorant Garamond" font-size="16" fill="#E8D49A" font-style="italic">K</text></svg>

    <svg class="deco-chip c2" viewBox="0 0 100 100"><defs><radialGradient id="cg2" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#C9B99A"/><stop offset="100%" stop-color="#5A4F3C"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#cg2)"/><circle cx="50" cy="50" r="32" fill="none" stroke="#0B0A0A" stroke-width="2" stroke-dasharray="3 6"/><circle cx="50" cy="50" r="18" fill="#0B0A0A"/></svg>

    <!-- SLOT MACHINE -->
    <div class="slot" id="slot">
      <div class="slot-header">
        <div class="label"><span class="led"></span> KRIPTONITA LIVE FEED</div>
        <div class="badge">ACTIVO</div>
      </div>
      <div class="reels">
        <div class="reel"><div class="reel-strip" id="r1"></div></div>
        <div class="reel"><div class="reel-strip" id="r2"></div></div>
        <div class="reel"><div class="reel-strip" id="r3"></div></div>
      </div>
      <div class="slot-foot">
        <div class="stat"><span class="v" id="sl-ftd">312</span><span class="l">FTDs hoy</span></div>
        <div class="stat"><span class="v" id="sl-roas">8.4x</span><span class="l">ROAS</span></div>
        <div class="stat"><span class="v" id="sl-cpa">$14</span><span class="l">CPA Meta</span></div>
        <button class="spin-btn" id="spinBtn">Re-spin</button>
      </div>
    </div>

    <!-- Mini KPIs strip -->
    <div class="hero-kpis">
      <div class="kpi"><div class="l">Operadores activos</div><div class="v" data-count="47" data-suffix="">0</div><div class="d"><i data-lucide="trending-up" width="12" height="12"></i> +12 vs Q4</div></div>
      <div class="kpi"><div class="l">Inversión gestionada</div><div class="v" data-count="2.4" data-prefix="$" data-suffix="M">$0M</div><div class="d"><i data-lucide="trending-up" width="12" height="12"></i> +84% YoY</div></div>
      <div class="kpi"><div class="l">FTDs generados</div><div class="v" data-count="84600" data-suffix="">0</div><div class="d"><i data-lucide="trending-up" width="12" height="12"></i> Últ. 12 meses</div></div>
    </div>
  </div>
</section>

<!-- ──────────────── TICKER ──────────────── -->
<div class="ticker">
  <div class="ticker-track">
    <span class="ticker-item">CPA <b>−63%</b></span><span class="ticker-item"><span class="sep"></span></span>
    <span class="ticker-item"><b>+47</b> casinos escalados</span><span class="ticker-item"><span class="sep"></span></span>
    <span class="ticker-item">ROAS <b>8.4x</b> promedio</span><span class="ticker-item"><span class="sep"></span></span>
    <span class="ticker-item"><b>84.600</b> FTDs generados</span><span class="ticker-item"><span class="sep"></span></span>
    <span class="ticker-item">Meta <b>·</b> Google <b>·</b> TikTok</span><span class="ticker-item"><span class="sep"></span></span>
    <span class="ticker-item">CPA <b>−63%</b></span><span class="ticker-item"><span class="sep"></span></span>
    <span class="ticker-item"><b>+47</b> casinos escalados</span><span class="ticker-item"><span class="sep"></span></span>
    <span class="ticker-item">ROAS <b>8.4x</b> promedio</span><span class="ticker-item"><span class="sep"></span></span>
    <span class="ticker-item"><b>84.600</b> FTDs generados</span><span class="ticker-item"><span class="sep"></span></span>
    <span class="ticker-item">Meta <b>·</b> Google <b>·</b> TikTok</span><span class="ticker-item"><span class="sep"></span></span>
  </div>
</div>

<!-- ──────────────── PROBLEMA / MÉTODO ──────────────── -->
<section class="section" id="metodo">
  <div class="reveal">
    <div class="section-eyebrow">El problema del iGaming</div>
    <h2 class="section-title">No pierdes dinero por <em>mala suerte</em>.<br>Lo pierdes por <em>mala estructura</em>.</h2>
    <p class="section-lede">Los operadores que estancan no es porque su producto sea malo. Es porque están escalando sin un sistema. Nosotros lo arreglamos.</p>
  </div>
  <div class="problem-row reveal">
    <div class="problem-cell">
      <div class="num">01 / SÍNTOMA</div>
      <h3>CPA fuera de control</h3>
      <p>Las campañas funcionan al inicio y luego revientan. La cuenta no aprende porque las conversiones llegan tarde o mal trackeadas.</p>
    </div>
    <div class="problem-cell">
      <div class="num">02 / SÍNTOMA</div>
      <h3>Bans, restricciones y rechazos</h3>
      <p>Meta y Google bloquean campañas cada semana. Pierdes pixel, pierdes data, vuelves a empezar de cero cada vez.</p>
    </div>
    <div class="problem-cell">
      <div class="num">03 / SÍNTOMA</div>
      <h3>Tráfico que no deposita</h3>
      <p>Llegan registros pero no FTDs. El funnel está roto entre el anuncio y la primera ficha cargada, y nadie está mirando.</p>
    </div>
  </div>
</section>

<!-- ──────────────── DASHBOARD META MOCK ──────────────── -->
<section class="dash-section" id="resultados">
  <div class="section">
    <div class="reveal">
      <div class="section-eyebrow">Resultados verificables</div>
      <h2 class="section-title">El <em>panel de Meta Ads</em> de un cliente real.<br>Últimos 90 días.</h2>
      <p class="section-lede">Captura directa del Business Manager. Operador LATAM, ticket promedio €58, mercado MX/CO/PE. Toda la data validada con server-side tracking.</p>
    </div>

    <div class="dash-frame reveal">
      <div class="dash-chrome">
        <div class="lights"><span></span><span></span><span></span></div>
        <div class="url-bar">
          <i data-lucide="lock" width="12" height="12"></i>
          <span>business.facebook.com</span><span class="path">/adsmanager/manage/campaigns?act=1247853096</span>
        </div>
        <div class="live-pill"><span class="dot"></span>EN VIVO</div>
      </div>

      <div class="meta-panel">
        <div class="meta-panel-head">
          <div class="title">Resumen del rendimiento</div>
          <div class="actions">
            <button class="meta-btn"><i data-lucide="sliders-horizontal" width="14" height="14"></i> Personalizar métricas</button>
          </div>
        </div>

        <div class="meta-kpis">
          <div class="meta-kpi active">
            <div class="lbl">Conversaciones con mensajes iniciadas <span class="info">i</span></div>
            <div class="val" data-meta-count="1194" data-meta-format="comma">0</div>
            <div class="delta"><span class="arrow">↑</span> <b>121%</b> vs. los 36 días anteriores</div>
          </div>
          <div class="meta-kpi">
            <div class="lbl">Por conversación con mensajes iniciada <span class="info">i</span></div>
            <div class="val" data-meta-count="479.46" data-meta-prefix="$" data-meta-decimals="2">$0</div>
            <div class="delta"><span style="color:#1F7A1F;">↓</span> <b style="color:#1F7A1F;">21%</b> vs. los 36 días anteriores</div>
          </div>
          <div class="meta-kpi">
            <div class="lbl">Importe gastado <span class="info">i</span></div>
            <div class="val" data-meta-count="572475.24" data-meta-prefix="$ " data-meta-decimals="2">$ 0</div>
            <div class="delta"><span class="arrow">↑</span> <b>74%</b> vs. los 36 días anteriores</div>
          </div>
        </div>

        <div class="meta-chart-block">
          <div class="chart-title">Conversaciones con mensajes iniciadas</div>
          <div class="meta-chart-wrap">
            <svg id="metaChart" viewBox="0 0 1040 320" preserveAspectRatio="none"></svg>
          </div>
        </div>
      </div>

      <div style="padding: 20px 28px; background: #FAFBFC; border-top: 1px solid #DADDE1; display: flex; justify-content: space-between; align-items: center; font-family: -apple-system, 'Segoe UI', sans-serif;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #1877F2; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">A</div>
          <div>
            <div style="font-size: 13px; font-weight: 600; color: #1C1E21;">Cuenta · "Aurora Bet" — Casino Online LATAM</div>
            <div style="font-size: 12px; color: #65676B; margin-top: 2px;">ID 1247853096 · MX / CO / PE · 36 días · 18 campañas activas</div>
          </div>
        </div>
        <div style="font-size: 12px; color: #65676B;">Última actualización: hace 4 min</div>
      </div>
    </div>

    <div class="dash-callouts reveal">
      <div class="callout">
        <div class="ic"><i data-lucide="trending-up" width="16" height="16"></i></div>
        <div class="ttl">+121% en conversaciones</div>
        <div class="desc">Pasamos de 540 a 1.194 conversaciones iniciadas en 36 días, sin caída de calidad del jugador.</div>
      </div>
      <div class="callout">
        <div class="ic"><i data-lucide="trending-down" width="16" height="16"></i></div>
        <div class="ttl">−21% en costo por conversación</div>
        <div class="desc">Bajamos de $610 a $479 con la inversión escalando 1,7x. Tracking server-side y creatividades nuevas.</div>
      </div>
      <div class="callout">
        <div class="ic"><i data-lucide="rocket" width="16" height="16"></i></div>
        <div class="ttl">$572K invertidos</div>
        <div class="desc">De $329K a $572K en el período, manteniendo ROAS y bajando CPA simultáneamente.</div>
      </div>
    </div>
  </div>
</section>

<!-- ──────────────── CASOS ──────────────── -->
<section class="section" id="casos">
  <div class="reveal">
    <div class="section-eyebrow">Casos de éxito</div>
    <h2 class="section-title">Tres operadores, tres mercados,<br>un mismo <em>método</em>.</h2>
    <p class="section-lede">Cada cuenta es distinta. La metodología, no. Aquí los números reales de tres clientes activos, anonimizados por contrato NDA.</p>
  </div>

  <div class="casos-grid reveal">

    <!-- Caso 1 -->
    <div class="caso-card">
      <div class="caso-head">
        <div>
          <div class="caso-name">Aurora Bet</div>
          <div class="caso-flag">MX · CO · PE  ·  Casino + Sports</div>
        </div>
        <div class="caso-badge">90 días</div>
      </div>
      <div class="caso-headline">"Pasamos de €30K/mes en spend a €180K manteniendo CPA por debajo de €15."</div>
      <div class="caso-chart">
        <svg viewBox="0 0 320 100" preserveAspectRatio="none" style="width:100%; height: 100px;">
          <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#E8D49A" stop-opacity="0.4"/><stop offset="100%" stop-color="#E8D49A" stop-opacity="0"/></linearGradient></defs>
          <path d="M0,80 C40,75 80,72 120,60 S200,32 240,22 S300,10 320,8 L320,100 L0,100 Z" fill="url(#g1)"/>
          <path d="M0,80 C40,75 80,72 120,60 S200,32 240,22 S300,10 320,8" fill="none" stroke="#E8D49A" stroke-width="2"/>
          <circle cx="320" cy="8" r="4" fill="#E8D49A"/>
          <circle cx="320" cy="8" r="8" fill="none" stroke="#E8D49A" stroke-opacity="0.4"/>
        </svg>
      </div>
      <div class="caso-stats">
        <div class="caso-stat"><div class="v">+312%</div><div class="l">FTDs</div></div>
        <div class="caso-stat"><div class="v">−68%</div><div class="l">CPA</div></div>
        <div class="caso-stat"><div class="v">11.8x</div><div class="l">ROAS</div></div>
      </div>
      <div class="caso-quote">
        "Llevábamos 8 meses estancados. Kriptonita reestructuró todo el tracking en 3 semanas y el CPA cayó solo."
        <span class="who">— CMO, operador iGaming · MX</span>
      </div>
    </div>

    <!-- Caso 2 -->
    <div class="caso-card">
      <div class="caso-head">
        <div>
          <div class="caso-name">Nova Casino</div>
          <div class="caso-flag">AR · UY · CL  ·  Slots premium</div>
        </div>
        <div class="caso-badge">120 días</div>
      </div>
      <div class="caso-headline">"De cuenta restringida en Meta a Business Partner activo en 4 meses."</div>
      <div class="caso-chart">
        <svg viewBox="0 0 320 100" preserveAspectRatio="none" style="width:100%; height: 100px;">
          <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6BC089" stop-opacity="0.3"/><stop offset="100%" stop-color="#6BC089" stop-opacity="0"/></linearGradient></defs>
          <path d="M0,90 L40,88 L80,70 L120,75 L160,55 L200,45 L240,28 L280,18 L320,12 L320,100 L0,100 Z" fill="url(#g2)"/>
          <path d="M0,90 L40,88 L80,70 L120,75 L160,55 L200,45 L240,28 L280,18 L320,12" fill="none" stroke="#6BC089" stroke-width="2"/>
          <circle cx="320" cy="12" r="4" fill="#6BC089"/>
        </svg>
      </div>
      <div class="caso-stats">
        <div class="caso-stat"><div class="v">+186%</div><div class="l">FTDs</div></div>
        <div class="caso-stat"><div class="v">−54%</div><div class="l">CPA</div></div>
        <div class="caso-stat"><div class="v">7.2x</div><div class="l">ROAS</div></div>
      </div>
      <div class="caso-quote">
        "Tres BMs baneados antes de llegar a ellos. Recuperaron la cuenta, blindaron la estructura y ahora escalamos sin miedo."
        <span class="who">— Head of Acquisition · AR</span>
      </div>
    </div>

    <!-- Caso 3 -->
    <div class="caso-card">
      <div class="caso-head">
        <div>
          <div class="caso-name">Lupo Gaming</div>
          <div class="caso-flag">ES · IT  ·  Live casino</div>
        </div>
        <div class="caso-badge">180 días</div>
      </div>
      <div class="caso-headline">"€420K de inversión, €3.6M en GGR atribuible. ROAS sostenido 6 meses."</div>
      <div class="caso-chart">
        <svg viewBox="0 0 320 100" preserveAspectRatio="none" style="width:100%; height: 100px;">
          <defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C9B99A" stop-opacity="0.35"/><stop offset="100%" stop-color="#C9B99A" stop-opacity="0"/></linearGradient></defs>
          <path d="M0,85 Q60,70 100,68 T180,40 T260,20 T320,8 L320,100 L0,100 Z" fill="url(#g3)"/>
          <path d="M0,85 Q60,70 100,68 T180,40 T260,20 T320,8" fill="none" stroke="#C9B99A" stroke-width="2"/>
          <circle cx="320" cy="8" r="4" fill="#C9B99A"/>
        </svg>
      </div>
      <div class="caso-stats">
        <div class="caso-stat"><div class="v">+248%</div><div class="l">GGR</div></div>
        <div class="caso-stat"><div class="v">−42%</div><div class="l">CPA</div></div>
        <div class="caso-stat"><div class="v">8.6x</div><div class="l">ROAS</div></div>
      </div>
      <div class="caso-quote">
        "Pensábamos que ya habíamos tocado techo en España. Encontraron 3 segmentos nuevos y rompimos el techo."
        <span class="who">— Founder · ES</span>
      </div>
    </div>

  </div>
</section>

<!-- ──────────────── PROCESO ──────────────── -->
<section class="proceso-section" id="proceso">
  <div class="section">
    <div class="reveal">
      <div class="section-eyebrow">Cómo trabajamos</div>
      <h2 class="section-title">Cuatro pasos.<br><em>Sin promesas</em> de tragamonedas.</h2>
      <p class="section-lede">Onboarding en 14 días. Primer mes calibración. Del segundo en adelante, escalamos.</p>
    </div>
    <div class="proceso-grid reveal">
      <div class="paso">
        <div class="paso-num">01</div>
        <div class="paso-name">Auditoría</div>
        <div class="paso-desc">Revisamos pixel, conversiones API, estructura de cuenta, BMs, dominios verificados y health score. Te entregamos un informe de 20 páginas en 5 días hábiles.</div>
        <div class="paso-tag">5 días · sin costo</div>
      </div>
      <div class="paso">
        <div class="paso-num">02</div>
        <div class="paso-name">Reestructura</div>
        <div class="paso-desc">Server-side tracking con Conversion API, dominios redundantes, estructura CBO/ABO según escala, blindaje de cuenta y workflow de creatividades.</div>
        <div class="paso-tag">14 días · onboarding</div>
      </div>
      <div class="paso">
        <div class="paso-num">03</div>
        <div class="paso-name">Calibración</div>
        <div class="paso-desc">Primeras 4 semanas de testeo de audiencias, hooks y formatos. Iteramos 8–12 creatividades semanales. Métrica norte: nCPA en horizonte D7.</div>
        <div class="paso-tag">Mes 1</div>
      </div>
      <div class="paso">
        <div class="paso-num">04</div>
        <div class="paso-name">Escalada</div>
        <div class="paso-desc">Una vez probado el unit economics, escalamos en bloques semanales del 30% sobre las campañas con mejor LTV/CAC. Reporting semanal en vivo.</div>
        <div class="paso-tag">Mes 2 en adelante</div>
      </div>
    </div>
  </div>
</section>

<!-- ──────────────── STACK / SERVICIOS ──────────────── -->
<section class="section">
  <div class="reveal">
    <div class="section-eyebrow">Qué hacemos por dentro</div>
    <h2 class="section-title">Un stack <em>completo</em>, no solo media buying.</h2>
  </div>
  <div class="stack-grid reveal">
    <div class="stack-item">
      <div class="ic"><i data-lucide="target" width="20" height="20"></i></div>
      <div class="ttl">Paid Media</div>
      <div class="desc">Meta, Google, TikTok, Push & Native. Gestión completa con buyers especializados en iGaming.</div>
    </div>
    <div class="stack-item">
      <div class="ic"><i data-lucide="shield" width="20" height="20"></i></div>
      <div class="ttl">Cuenta blindada</div>
      <div class="desc">BMs en cascada, dominios verificados, política de compliance. Cero downtime por bans.</div>
    </div>
    <div class="stack-item">
      <div class="ic"><i data-lucide="line-chart" width="20" height="20"></i></div>
      <div class="ttl">Tracking server-side</div>
      <div class="desc">Conversion API + GA4 + tag server. La data llega aunque iOS, Adblock o Safari estén de por medio.</div>
    </div>
    <div class="stack-item">
      <div class="ic"><i data-lucide="film" width="20" height="20"></i></div>
      <div class="ttl">Creatividades</div>
      <div class="desc">Equipo in-house de motion + UGC. 30–60 piezas mensuales con hooks probados por vertical.</div>
    </div>
    <div class="stack-item">
      <div class="ic"><i data-lucide="layout-template" width="20" height="20"></i></div>
      <div class="ttl">Landing pages</div>
      <div class="desc">LPs específicas por geo, bono y oferta. CRO con tests A/B continuos. Lighthouse +90.</div>
    </div>
    <div class="stack-item">
      <div class="ic"><i data-lucide="users-round" width="20" height="20"></i></div>
      <div class="ttl">Segmentación LTV</div>
      <div class="desc">Modelos predictivos de LTV por cohort. Priorizamos audiencias por valor real, no por CTR.</div>
    </div>
    <div class="stack-item">
      <div class="ic"><i data-lucide="message-square" width="20" height="20"></i></div>
      <div class="ttl">CRM + Retención</div>
      <div class="desc">Flujos automáticos en WhatsApp, SMS y email. Reactivación de jugadores en D7, D30, D90.</div>
    </div>
    <div class="stack-item">
      <div class="ic"><i data-lucide="bar-chart-3" width="20" height="20"></i></div>
      <div class="ttl">Reporting</div>
      <div class="desc">Dashboard en vivo con CPA, ROAS, GGR y NGR por canal. Acceso 24/7 para el cliente.</div>
    </div>
  </div>
</section>





<!-- Floating WhatsApp button -->
<a href="__WA_HREF__" target="_blank" rel="noopener" class="fab-wa" aria-label="Contactar por WhatsApp" onclick="if(typeof fbq==='function'){fbq('track','Contact');}">
  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"/></svg>
</a>
`

function runPageScripts() {

  /* ─────────────────────────────  Lucide  ───────────────────────────── */
  lucide.createIcons();

  /* ─────────────────────────────  Floating chips bg  ───────────────────────────── */
  (function spawnChips() {
    const bg = document.getElementById('chipsBg');
    const colors = [
      ['#E8D49A','#7A6B4D'],
      ['#C9B99A','#5A4F3C'],
      ['#9E8B70','#3A3225'],
      ['#F4E4B8','#9E8B70'],
    ];
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'chip-bg';
      const size = 24 + Math.random()*64;
      el.style.width = el.style.height = size + 'px';
      el.style.left = (Math.random()*100) + '%';
      el.style.top  = (Math.random()*100) + '%';
      el.style.animationDelay = (-Math.random()*18) + 's';
      el.style.animationDuration = (14 + Math.random()*14) + 's';
      el.style.opacity = 0.15 + Math.random()*0.35;
      const [a,b] = colors[Math.floor(Math.random()*colors.length)];
      el.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs><radialGradient id="cgx${i}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></radialGradient></defs>
        <circle cx="50" cy="50" r="48" fill="url(#cgx${i})"/>
        <circle cx="50" cy="50" r="32" fill="none" stroke="#0B0A0A" stroke-width="2" stroke-dasharray="3 6"/>
        <circle cx="50" cy="50" r="14" fill="#0B0A0A" opacity="0.7"/>
      </svg>`;
      bg.appendChild(el);
    }
  })();

  /* ─────────────────────────────  Slot Machine  ───────────────────────────── */
  const SYMBOLS = ['K','R','I','P','T','O','N','I','T','A','★','◆','7','♠','♣'];
  const TARGETS_POOL = [
    ['K','R','I'],
    ['7','7','7'],
    ['★','★','★'],
    ['F','T','D'],
    ['W','I','N'],
    ['R','O','I'],
    ['T','O','P'],
    ['B','E','T'],
  ];
  function buildStrip(stripEl, finalSymbol) {
    // build a long strip ending in the final symbol on the center line
    // each cell is 56px high, viewport is 168px = 3 cells
    // we want the FINAL symbol in the middle slot (cell index 1 from top of visible)
    stripEl.innerHTML = '';
    const total = 30; // 30 cells
    const cells = [];
    for (let i = 0; i < total; i++) {
      cells.push(SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]);
    }
    // place final symbol at index total-2 (so it lands in middle row when translated)
    cells[total - 2] = finalSymbol;
    cells.forEach(c => {
      const d = document.createElement('div');
      d.className = 'reel-cell' + (/[★◆♠♣]/.test(c) ? ' symbol' : '');
      d.textContent = c;
      stripEl.appendChild(d);
    });
    return total;
  }
  let spinTimeout;
  function spinSlot() {
    const r1 = document.getElementById('r1');
    const r2 = document.getElementById('r2');
    const r3 = document.getElementById('r3');
    const target = TARGETS_POOL[Math.floor(Math.random()*TARGETS_POOL.length)];
    // Reset
    [r1, r2, r3].forEach(r => {
      r.style.transition = 'none';
      r.style.transform = 'translateY(0)';
    });
    // Build strips
    const totals = [
      buildStrip(r1, target[0]),
      buildStrip(r2, target[1]),
      buildStrip(r3, target[2]),
    ];
    // force reflow
    void r1.offsetHeight;
    // spin — translate so final symbol (index total-2) lands at center
    const cellH = 56;
    const containerH = 168;
    const reels = [r1, r2, r3];
    reels.forEach((r, i) => {
      const total = totals[i];
      // we want index (total-2) to sit at center cell (index 1 of visible 3)
      // offset = (total - 2) * cellH - cellH = (total - 3) * cellH
      const targetY = (total - 3) * cellH;
      r.style.transition = `transform ${2200 + i*420}ms cubic-bezier(.22,.9,.27,1)`;
      r.style.transform = `translateY(-${targetY}px)`;
    });
    // Update slot foot stats with subtle randomness
    setTimeout(() => {
      const ftd = 240 + Math.floor(Math.random()*180);
      const roas = (7 + Math.random()*5).toFixed(1);
      const cpa = (10 + Math.random()*9).toFixed(0);
      document.getElementById('sl-ftd').textContent = ftd;
      document.getElementById('sl-roas').textContent = roas + 'x';
      document.getElementById('sl-cpa').textContent = '$' + cpa;
    }, 2400);
  }
  // initial fill (no anim)
  spinSlot();
  // auto re-spin every 6s
  function autoSpin() {
    spinTimeout = setTimeout(() => {
      spinSlot();
      autoSpin();
    }, 6500);
  }
  autoSpin();
  document.getElementById('spinBtn').addEventListener('click', () => {
    clearTimeout(spinTimeout);
    spinSlot();
    autoSpin();
  });

  /* ─────────────────────────────  Counters  ───────────────────────────── */
  function animateCounters(container) {
    container.querySelectorAll('[data-count]').forEach(el => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0');
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const format = el.dataset.format;
      let start = null;
      const duration = 1800;
      function fmt(v) {
        let s = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
        if (format === 'comma') s = Number(s).toLocaleString('es-AR');
        return prefix + s + suffix;
      }
      function tick(t) {
        if (!start) start = t;
        const p = Math.min((t - start)/duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(target);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ─────────────────────────────  Meta Ads chart (Resumen del rendimiento)  ─── */
  function drawMetaChart() {
    const svg = document.getElementById('metaChart');
    if (!svg || svg.dataset.drawn) return;
    svg.dataset.drawn = '1';

    const W = 1040, H = 320;
    const padL = 48, padR = 28, padT = 16, padB = 44;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    // Datos diarios — 36 días, suma ≈ 1.194 conversaciones (avg ~33/día, picos ~50–55)
    const data = [14, 9, 11, 16, 14, 21, 19, 22, 21, 26, 24, 28, 27, 31, 28, 31, 30, 36, 34, 37, 35, 39, 41, 37, 43, 40, 46, 45, 43, 49, 45, 51, 48, 52, 49, 46];
    const N = data.length;
    const maxY = 60;

    const xAt = i => padL + (i/(N-1)) * innerW;
    const yAt = v => padT + (1 - v/maxY) * innerH;

    // X labels — every 4 days approximately, real Meta-style Spanish date labels
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    const startDate = new Date(2026, 3, 12); // 12 de abr 2026
    const xLabels = [];
    for (let i = 0; i < N; i += 4) {
      const d = new Date(startDate); d.setDate(startDate.getDate() + i);
      xLabels.push({ i, txt: d.getDate() + ' de ' + months[d.getMonth()] });
    }

    // Grid (horizontal lines + Y labels)
    const yTicks = [0, 10, 20, 30, 40, 50, 60];
    let gridSvg = '';
    yTicks.forEach(t => {
      const y = yAt(t);
      gridSvg += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#E4E6EB" stroke-width="1"/>`;
      gridSvg += `<text x="${padL - 10}" y="${y + 4}" font-size="12" fill="#65676B" text-anchor="end" font-family="-apple-system, 'Segoe UI', sans-serif">${t}</text>`;
    });

    // X axis labels
    let xSvg = '';
    xLabels.forEach(l => {
      const x = xAt(l.i);
      xSvg += `<text x="${x}" y="${H - 18}" font-size="12" fill="#65676B" text-anchor="middle" font-family="-apple-system, 'Segoe UI', sans-serif">${l.txt}</text>`;
    });

    // Hover indicators (two dotted vertical lines, like Meta hover/comparison)
    const hoverIdxA = 29; // ~30 dic
    const hoverIdxB = 30; // ~31 dic
    const hoverA = xAt(hoverIdxA);
    const hoverB = xAt(hoverIdxB);
    const hoverYa = yAt(data[hoverIdxA]);
    const hoverYb = yAt(data[hoverIdxB]);

    // Build smooth path (sharp, like Meta — straight segments)
    const pathD = data.map((v, i) => (i === 0 ? 'M' : 'L') + xAt(i).toFixed(2) + ',' + yAt(v).toFixed(2)).join(' ');

    // Drop discontinuity at indices where value=0 from baseline — actually keep it linear like Meta
    // Real Meta sometimes shows broken segments around 0; we'll just keep continuous

    svg.innerHTML = `
      <!-- Hover dotted verticals (behind line) -->
      <line x1="${hoverA}" y1="${padT}" x2="${hoverA}" y2="${H - padB}" stroke="#65676B" stroke-width="1" stroke-dasharray="2 3" opacity="0.55"/>
      <line x1="${hoverB}" y1="${padT}" x2="${hoverB}" y2="${H - padB}" stroke="#65676B" stroke-width="1" stroke-dasharray="2 3" opacity="0.55"/>

      ${gridSvg}
      ${xSvg}

      <!-- Main line -->
      <path id="metaLine" d="${pathD}" fill="none" stroke="#26C6DA" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>

      <!-- Hover circles (Meta-style: outer ring + inner dot) -->
      <circle cx="${hoverA}" cy="${hoverYa}" r="6" fill="#fff" stroke="#26C6DA" stroke-width="2.4"/>
      <circle cx="${hoverB}" cy="${hoverYb}" r="6" fill="#fff" stroke="#26C6DA" stroke-width="2.4"/>
    `;

    // Animate stroke draw
    const line = svg.querySelector('#metaLine');
    const len = line.getTotalLength();
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.style.transition = 'stroke-dashoffset 2400ms cubic-bezier(0.22, 0.9, 0.27, 1)';
    requestAnimationFrame(() => { line.style.strokeDashoffset = '0'; });
  }

  /* Meta KPI counters (use Argentine number formatting like real Meta panel) */
  function animateMetaCounters(container) {
    container.querySelectorAll('[data-meta-count]').forEach(el => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = parseFloat(el.dataset.metaCount);
      const decimals = parseInt(el.dataset.metaDecimals || '0');
      const prefix = el.dataset.metaPrefix || '';
      const format = el.dataset.metaFormat;
      const duration = 1800;
      let start = null;
      function fmt(v) {
        if (decimals > 0) {
          // Argentine format: thousands "." decimals ","
          const parts = v.toFixed(decimals).split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
          return prefix + parts.join(',');
        }
        let s = Math.round(v).toString();
        if (format === 'comma') s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return prefix + s;
      }
      function tick(t) {
        if (!start) start = t;
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(target);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ─────────────────────────────  Bar fills  ───────────────────────────── */
  function fillBars(container) {
    container.querySelectorAll('.fill').forEach(el => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      setTimeout(() => { el.style.width = el.dataset.w + '%'; }, 120);
    });
  }

  /* ─────────────────────────────  Intersection reveal  ───────────────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        animateCounters(e.target);
        animateMetaCounters(e.target);
        fillBars(e.target);
        if (e.target.querySelector('#metaChart')) drawMetaChart();
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Hero counters animate immediately
  animateCounters(document.querySelector('.hero-kpis'));

  /* ─────────────────────────────  FAQ (removed) — handler kept no-op via empty NodeList  */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => item.classList.toggle('open'));
  });

  /* ─────────────────────────────  Live counter bumps (hero kpis subtle pulse) ─── */
  setInterval(() => {
    const elFtd = document.querySelectorAll('.hero-kpis [data-count]')[2];
    if (!elFtd) return;
    const cur = parseInt(elFtd.textContent.replace(/\D/g,''));
    const next = cur + Math.floor(1 + Math.random()*4);
    elFtd.textContent = next.toLocaleString('es-AR');
  }, 3500);


}

export default function Home() {
  const waHref = `https://wa.me/${CONFIG.numero}?text=${encodeURIComponent(CONFIG.mensaje)}`
  const html = BODY_HTML.split('__WA_HREF__').join(waHref)

  useEffect(() => {
    function boot() {
      if (window.lucide) window.lucide.createIcons()
      try {
        runPageScripts()
      } catch (err) {
        console.error('Kriptonita page script error:', err)
      }
    }

    if (window.lucide) {
      boot()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'
    script.async = true
    script.onload = boot
    document.body.appendChild(script)
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

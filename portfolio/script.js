// Año actual
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

// Generador pseudo-aleatorio con semilla: el campo de estrellas se ve igual en cada carga
function rng(seed) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

// Estrellas
document.querySelectorAll('[data-stars]').forEach((box, n) => {
  const rand = rng(97 + n * 13);
  const count = parseInt(box.dataset.stars, 10);
  for (let i = 0; i < count; i++) {
    const s = document.createElement('i');
    const size = rand() < .85 ? 1 : 2;
    s.style.cssText = `left:${(rand() * 100).toFixed(2)}%;top:${(rand() * 100).toFixed(2)}%;width:${size}px;height:${size}px;--o:${(.25 + rand() * .65).toFixed(2)};opacity:var(--o);animation-delay:${(rand() * 5).toFixed(2)}s`;
    box.appendChild(s);
  }
});

// Líneas de perspectiva que salen del punto de fuga (abajo al centro)
document.querySelectorAll('[data-lines]').forEach(box => {
  const W = 1200, H = 600;
  let lines = '';
  for (let x = -900; x <= 2100; x += 150) lines += `<line x1="${W / 2}" y1="${H + 40}" x2="${x}" y2="0"/>`;
  [90, 170, 260, 360].forEach(y => { lines += `<path d="M0 ${y} Q ${W / 2} ${y - 36} ${W} ${y}"/>`; });
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>`;
});

// Mini barras de tendencia
document.querySelectorAll('[data-bars]').forEach(el => {
  const vals = el.dataset.bars.split(',').map(Number);
  const max = Math.max(...vals);
  const hi = parseInt(el.dataset.hi, 10);
  vals.forEach((v, i) => {
    const b = document.createElement('i');
    b.style.height = `${Math.max(3, Math.round(v / max * 16))}px`;
    if (i === hi) b.className = 'hi';
    el.appendChild(b);
  });
});

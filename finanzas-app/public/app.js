'use strict';
/* Mis Finanzas — app personal de finanzas (PWA, sin dependencias).
 * Los datos viven en el navegador (localStorage) y opcionalmente se
 * sincronizan entre dispositivos vía /api/sync (Vercel + Upstash Redis). */

// ============================================================ Constantes
const STORAGE_KEY = 'finanzas.v1';
const SYNC_KEY = 'finanzas.sync';
const THEME_KEY = 'finanzas.theme';
const CURRENCIES = ['ARS', 'USD', 'EUR', 'BRL', 'UYU', 'CLP', 'PYG', 'MXN'];
const ACCOUNT_TYPES = {
  cash: { label: 'Efectivo', icon: '💵' },
  bank: { label: 'Cuenta bancaria', icon: '🏦' },
  wallet: { label: 'Billetera virtual', icon: '📱' },
  credit: { label: 'Tarjeta de crédito', icon: '💳' },
  savings: { label: 'Ahorro', icon: '🐖' },
  investment: { label: 'Inversión', icon: '📈' },
  other: { label: 'Otra', icon: '👛' },
};
const FREQS = {
  weekly: 'Semanal', biweekly: 'Quincenal', monthly: 'Mensual',
  bimonthly: 'Bimestral', quarterly: 'Trimestral', yearly: 'Anual',
};
const TX_TYPES = { expense: 'Gasto', income: 'Ingreso', transfer: 'Transferencia' };
const PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16', '#06b6d4', '#a855f7', '#e11d48', '#0ea5e9', '#eab308', '#64748b'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const NAV = [
  { route: 'inicio', label: 'Inicio', icon: '🏠' },
  { route: 'movimientos', label: 'Movimientos', icon: '📋' },
  { route: 'cuentas', label: 'Cuentas', icon: '👛' },
  { route: 'presupuestos', label: 'Presupuestos', icon: '🎯' },
  { route: 'reportes', label: 'Reportes', icon: '📊' },
  { route: 'metas', label: 'Metas de ahorro', icon: '🏆' },
  { route: 'recurrentes', label: 'Recurrentes', icon: '🔁' },
  { route: 'categorias', label: 'Categorías', icon: '🏷️' },
  { route: 'ajustes', label: 'Ajustes', icon: '⚙️' },
];
const BOTTOM_NAV = ['inicio', 'movimientos', null, 'reportes', 'mas'];

// ============================================================ Utilidades
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const sum = (arr, f = (x) => x) => arr.reduce((s, x) => s + f(x), 0);

function today() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function monthKey(dateStr) { return dateStr.slice(0, 7); }
function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function toDateStr(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function daysInMonth(y, m0) { return new Date(y, m0 + 1, 0).getDate(); }
function addMonths(dateStr, n, dayHint) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const total = (m - 1) + n;
  const ny = y + Math.floor(total / 12);
  const nm = ((total % 12) + 12) % 12;
  const day = Math.min(dayHint || d, daysInMonth(ny, nm));
  return `${ny}-${pad(nm + 1)}-${pad(day)}`;
}
function addDays(dateStr, n) { const d = parseDate(dateStr); d.setDate(d.getDate() + n); return toDateStr(d); }
function nextDate(dateStr, freq, dayHint) {
  switch (freq) {
    case 'weekly': return addDays(dateStr, 7);
    case 'biweekly': return addDays(dateStr, 14);
    case 'bimonthly': return addMonths(dateStr, 2, dayHint);
    case 'quarterly': return addMonths(dateStr, 3, dayHint);
    case 'yearly': return addMonths(dateStr, 12, dayHint);
    default: return addMonths(dateStr, 1, dayHint);
  }
}
function shiftMonth(mk, n) { return addMonths(mk + '-01', n).slice(0, 7); }
function monthLabel(mk) { const [y, m] = mk.split('-').map(Number); return `${MONTHS[m - 1]} ${y}`; }
function monthShort(mk) { const [y, m] = mk.split('-').map(Number); return `${MONTHS_SHORT[m - 1]} ${String(y).slice(2)}`; }
function dayLabel(dateStr) {
  const t = today();
  if (dateStr === t) return 'Hoy';
  if (dateStr === addDays(t, -1)) return 'Ayer';
  const d = parseDate(dateStr);
  return `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}
function shortDate(dateStr) { const d = parseDate(dateStr); return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`; }

/** Interpreta montos escritos a la argentina ("1.234,56") o internacional ("1234.56"). */
function parseAmount(v) {
  if (typeof v === 'number') return v;
  let s = String(v || '').trim().replace(/[^\d.,-]/g, '');
  if (!s) return NaN;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if ((s.match(/\./g) || []).length > 1) s = s.replace(/\./g, '');
  else if (/^\-?\d{1,3}\.\d{3}$/.test(s)) s = s.replace('.', '');
  return Number(s);
}
const fmtCache = {};
function fmt(n, cur = state.settings.currency, opts = {}) {
  const key = cur + (opts.compact ? 'c' : '') + (opts.decimals ?? '');
  if (!fmtCache[key]) {
    try {
      fmtCache[key] = new Intl.NumberFormat('es-AR', {
        style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: opts.compact ? 1 : (opts.decimals ?? 2),
        minimumFractionDigits: opts.compact ? 0 : (opts.decimals ?? 0),
        notation: opts.compact ? 'compact' : 'standard',
      });
    } catch { fmtCache[key] = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }); }
  }
  let out = fmtCache[key].format(n || 0);
  if (cur === 'USD') out = out.replace(/^(-?)\$/, '$1US$');
  return out;
}
const fmtNum = (n) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(n || 0);
function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

function toast(msg, ms = 2400) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), ms);
}
function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ============================================================ Estado
function defaultCategories() {
  const cats = [];
  let ci = 0;
  const add = (type, icon, name, subs = []) => {
    const color = PALETTE[ci++ % PALETTE.length];
    const id = uid();
    cats.push({ id, type, name, icon, color, parentId: null });
    subs.forEach((s) => cats.push({ id: uid(), type, name: s, icon, color, parentId: id }));
  };
  add('expense', '🏠', 'Vivienda', ['Alquiler', 'Expensas', 'Mantenimiento', 'Seguro hogar']);
  add('expense', '💡', 'Servicios', ['Luz', 'Gas', 'Agua', 'Internet', 'Celular', 'Cable/TV']);
  add('expense', '🛒', 'Supermercado', ['Almacén', 'Verdulería', 'Carnicería']);
  add('expense', '🍽️', 'Comida y salidas', ['Restaurantes', 'Delivery', 'Café', 'Bares']);
  add('expense', '🚗', 'Transporte', ['Combustible', 'Transporte público', 'Taxi / Apps', 'Estacionamiento', 'Peajes', 'Mantenimiento auto', 'Seguro auto']);
  add('expense', '💊', 'Salud', ['Prepaga / Obra social', 'Farmacia', 'Consultas', 'Odontología']);
  add('expense', '📚', 'Educación', ['Cursos', 'Libros', 'Cuota escolar']);
  add('expense', '👕', 'Ropa y calzado');
  add('expense', '🎬', 'Entretenimiento', ['Cine / Teatro', 'Juegos', 'Eventos']);
  add('expense', '📺', 'Suscripciones', ['Streaming', 'Software', 'Gimnasio']);
  add('expense', '🛋️', 'Hogar', ['Muebles', 'Electrodomésticos', 'Limpieza']);
  add('expense', '💈', 'Cuidado personal');
  add('expense', '🐾', 'Mascotas');
  add('expense', '🎁', 'Regalos y donaciones');
  add('expense', '✈️', 'Viajes', ['Pasajes', 'Alojamiento', 'Excursiones']);
  add('expense', '🧾', 'Impuestos', ['Monotributo', 'Ganancias', 'ABL / Inmobiliario', 'Patente']);
  add('expense', '🏦', 'Bancos y comisiones', ['Comisiones', 'Intereses', 'Mantenimiento de cuenta']);
  add('expense', '💻', 'Tecnología');
  add('expense', '👶', 'Hijos');
  add('expense', '📦', 'Otros gastos');
  add('income', '💼', 'Sueldo', ['Sueldo mensual', 'Aguinaldo', 'Bonos']);
  add('income', '🧑‍💻', 'Freelance / Honorarios');
  add('income', '🏷️', 'Ventas');
  add('income', '📈', 'Inversiones', ['Intereses', 'Dividendos', 'Plazo fijo']);
  add('income', '🏘️', 'Alquileres cobrados');
  add('income', '💸', 'Reintegros');
  add('income', '🎉', 'Regalos recibidos');
  add('income', '➕', 'Otros ingresos');
  return cats;
}
function defaultAccounts() {
  return [
    { id: uid(), name: 'Efectivo', type: 'cash', currency: 'ARS', initial: 0, color: '#10b981' },
    { id: uid(), name: 'Cuenta bancaria', type: 'bank', currency: 'ARS', initial: 0, color: '#3b82f6' },
    { id: uid(), name: 'Billetera virtual', type: 'wallet', currency: 'ARS', initial: 0, color: '#06b6d4' },
    { id: uid(), name: 'Tarjeta de crédito', type: 'credit', currency: 'ARS', initial: 0, color: '#8b5cf6', limit: 0 },
    { id: uid(), name: 'Dólares', type: 'cash', currency: 'USD', initial: 0, color: '#84cc16' },
  ];
}
function defaultState() {
  return {
    version: 1,
    updatedAt: 0,
    settings: { name: '', currency: 'ARS', rates: { USD: 1300, EUR: 1500, BRL: 240, UYU: 32 }, dolarKind: 'blue' },
    accounts: defaultAccounts(),
    categories: defaultCategories(),
    transactions: [],
    budgets: [],
    recurring: [],
    goals: [],
  };
}
function migrate(s) {
  const d = defaultState();
  const out = { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) } };
  out.settings.rates = { ...(s.settings?.rates || d.settings.rates) };
  for (const k of ['accounts', 'categories', 'transactions', 'budgets', 'recurring', 'goals']) if (!Array.isArray(out[k])) out[k] = [];
  return out;
}
function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return migrate(JSON.parse(raw)); } catch (e) { console.error(e); }
  return defaultState();
}
let state = loadState();
const ui = {
  route: 'inicio',
  month: monthKey(today()),
  filters: { type: '', account: '', category: '', q: '' },
  catTab: 'expense',
  reportPeriod: '6m',
};

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { toast('No se pudo guardar: almacenamiento lleno'); console.error(e); }
}
function commit(msg) {
  state.updatedAt = Date.now();
  persist();
  indexCats();
  render();
  if (msg) toast(msg);
  scheduleSync();
}

// ============================================================ Consultas
let catMap = new Map();
function indexCats() { catMap = new Map(state.categories.map((c) => [c.id, c])); }
indexCats();
const cat = (id) => catMap.get(id);
const acc = (id) => state.accounts.find((a) => a.id === id);
const rootCat = (id) => { const c = cat(id); return c && c.parentId ? cat(c.parentId) || c : c; };
const childrenOf = (id) => state.categories.filter((c) => c.parentId === id).sort((a, b) => a.name.localeCompare(b.name));
function catLabel(id) {
  const c = cat(id);
  if (!c) return 'Sin categoría';
  const p = c.parentId ? cat(c.parentId) : null;
  return p ? `${p.name} › ${c.name}` : c.name;
}
function rate(cur) {
  const main = state.settings.currency;
  if (cur === main) return 1;
  const r = Number(state.settings.rates?.[cur]);
  return r > 0 ? r : 1;
}
const toMain = (amount, cur) => amount * rate(cur);
const txCurrency = (t) => acc(t.accountId)?.currency || state.settings.currency;
const txMain = (t) => toMain(t.amount, txCurrency(t));

function accountBalance(a) {
  let b = Number(a.initial) || 0;
  for (const t of state.transactions) {
    if (t.accountId === a.id) b += t.type === 'income' ? t.amount : -t.amount;
    if (t.type === 'transfer' && t.toAccountId === a.id) b += t.toAmount ?? t.amount;
  }
  return round2(b);
}
function netWorth() {
  return sum(state.accounts.filter((a) => !a.archived && !a.excludeFromTotal), (a) => toMain(accountBalance(a), a.currency));
}
function txInMonth(mk) { return state.transactions.filter((t) => t.date.startsWith(mk)); }
function txInRange(from, to) { return state.transactions.filter((t) => t.date >= from && t.date <= to); }
function totals(txs) {
  const income = sum(txs.filter((t) => t.type === 'income'), txMain);
  const expense = sum(txs.filter((t) => t.type === 'expense'), txMain);
  return { income, expense, net: income - expense };
}
function byRootCategory(txs, type) {
  const m = new Map();
  for (const t of txs) {
    if (t.type !== type) continue;
    const r = rootCat(t.categoryId);
    const key = r?.id || 'none';
    const cur = m.get(key) || { id: key, label: r ? `${r.icon} ${r.name}` : 'Sin categoría', name: r?.name || 'Sin categoría', color: r?.color || '#94a3b8', value: 0, count: 0 };
    cur.value += txMain(t); cur.count++;
    m.set(key, cur);
  }
  return [...m.values()].sort((a, b) => b.value - a.value);
}
function budgetSpent(b, mk) {
  return sum(txInMonth(mk).filter((t) => t.type === 'expense' && (t.categoryId === b.categoryId || cat(t.categoryId)?.parentId === b.categoryId)), txMain);
}
function sortTx(list) {
  return list.sort((a, b) => (b.date.localeCompare(a.date)) || ((b.createdAt || 0) - (a.createdAt || 0)));
}

// ============================================================ Recurrentes
/** Genera los movimientos de reglas recurrentes vencidas (hasta hoy). */
function processRecurring() {
  const t = today();
  let created = 0;
  for (const r of state.recurring) {
    if (!r.active) continue;
    let guard = 0;
    while (r.nextDate <= t && (!r.endDate || r.nextDate <= r.endDate) && guard++ < 400) {
      state.transactions.push({ ...r.template, id: uid(), date: r.nextDate, recurringId: r.id, createdAt: Date.now() + created });
      created++;
      r.nextDate = nextDate(r.nextDate, r.freq, r.day);
    }
    if (r.endDate && r.nextDate > r.endDate) r.active = false;
  }
  return created;
}

// ============================================================ Gráficos (SVG)
function donut(items, centerTop, centerBottom) {
  const total = sum(items, (i) => i.value);
  if (!total) return '<div class="empty small">Sin datos para graficar</div>';
  const r = 44, C = 2 * Math.PI * r;
  let off = 0;
  const segs = items.map((i) => {
    const len = (i.value / total) * C;
    const s = `<circle r="${r}" cx="60" cy="60" fill="none" stroke="${i.color}" stroke-width="16"
      stroke-dasharray="${len.toFixed(3)} ${(C - len).toFixed(3)}" stroke-dashoffset="${(-off).toFixed(3)}"
      transform="rotate(-90 60 60)"><title>${esc(i.name)}: ${esc(fmt(i.value))}</title></circle>`;
    off += len;
    return s;
  }).join('');
  return `<svg class="donut" viewBox="0 0 120 120" role="img" aria-label="Distribución por categoría">${segs}
    <text x="60" y="56" text-anchor="middle" font-size="8.5" opacity=".65">${esc(centerTop)}</text>
    <text x="60" y="70" text-anchor="middle" font-size="11" font-weight="700">${esc(centerBottom)}</text></svg>`;
}
function legend(items, max = 8) {
  const total = sum(items, (i) => i.value);
  const shown = items.slice(0, max);
  const rest = items.slice(max);
  if (rest.length) shown.push({ name: `Otras (${rest.length})`, label: `Otras (${rest.length})`, color: '#94a3b8', value: sum(rest, (i) => i.value) });
  return `<div class="legend">${shown.map((i) => `
    <div class="legend-row"><span class="dot" style="background:${i.color}"></span>
      <span class="name">${esc(i.label || i.name)}</span>
      <span class="muted small num">${pct(i.value, total)}%</span>
      <span class="num" style="text-align:right;white-space:nowrap">${esc(fmt(i.value, undefined, { decimals: 0 }))}</span></div>`).join('')}</div>`;
}
function donutWithLegend(items, title) {
  const top = items.slice(0, 8);
  const rest = items.slice(8);
  const data = rest.length ? [...top, { name: 'Otras', color: '#94a3b8', value: sum(rest, (i) => i.value) }] : top;
  if (!items.length) return '<div class="empty small">Todavía no hay movimientos en este período</div>';
  return `<div class="chart-wrap">${donut(data, title, fmt(sum(items, (i) => i.value), undefined, { compact: true }))}${legend(items)}</div>`;
}
function barChart(rows) {
  // rows: [{label, income, expense}]
  const W = 640, H = 230, L = 52, B = 26, T = 10;
  const max = Math.max(1, ...rows.flatMap((r) => [r.income, r.expense]));
  const step = niceStep(max / 4);
  const top = Math.ceil(max / step) * step;
  const y = (v) => T + (H - T - B) * (1 - v / top);
  const gw = (W - L - 8) / rows.length;
  const bw = Math.min(26, gw * 0.32);
  let g = '';
  for (let v = 0; v <= top + 1e-9; v += step) {
    g += `<line class="grid-line" x1="${L}" x2="${W - 4}" y1="${y(v)}" y2="${y(v)}"/>
      <text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${esc(fmt(v, undefined, { compact: true }))}</text>`;
  }
  const bars = rows.map((r, i) => {
    const cx = L + gw * i + gw / 2;
    return `<rect x="${cx - bw - 2}" y="${y(r.income)}" width="${bw}" height="${Math.max(0, H - B - y(r.income))}" rx="4" fill="var(--income)"><title>Ingresos ${esc(r.label)}: ${esc(fmt(r.income))}</title></rect>
      <rect x="${cx + 2}" y="${y(r.expense)}" width="${bw}" height="${Math.max(0, H - B - y(r.expense))}" rx="4" fill="var(--expense)"><title>Gastos ${esc(r.label)}: ${esc(fmt(r.expense))}</title></rect>
      <text x="${cx}" y="${H - 8}" text-anchor="middle">${esc(r.label)}</text>`;
  }).join('');
  return `<svg class="bars" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ingresos y gastos por mes">${g}${bars}</svg>
    <div class="chart-key"><span style="--c:var(--income)">Ingresos</span><span style="--c:var(--expense)">Gastos</span></div>`;
}
function niceStep(raw) {
  if (raw <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}
function monthlySeries(n, endMk = monthKey(today())) {
  const rows = [];
  for (let i = n - 1; i >= 0; i--) {
    const mk = shiftMonth(endMk, -i);
    const t = totals(txInMonth(mk));
    rows.push({ mk, label: monthShort(mk), income: t.income, expense: t.expense });
  }
  return rows;
}
function progressBar(spent, limit) {
  const p = limit ? (spent / limit) * 100 : 0;
  const cls = p > 100 ? 'over' : p >= 80 ? 'warn' : '';
  return `<div class="progress ${cls}"><div style="width:${Math.min(100, p).toFixed(1)}%"></div></div>`;
}

// ============================================================ Componentes
function monthNav() {
  return `<div class="month-nav">
    <button class="icon-btn" data-action="month" data-dir="-1" aria-label="Mes anterior">‹</button>
    <span class="label">${monthLabel(ui.month)}</span>
    <button class="icon-btn" data-action="month" data-dir="1" aria-label="Mes siguiente">›</button>
  </div>`;
}
function txItem(t) {
  const a = acc(t.accountId);
  const cur = txCurrency(t);
  let icon, title, sub, amountCls, sign;
  if (t.type === 'transfer') {
    const to = acc(t.toAccountId);
    icon = '🔄'; title = t.note || 'Transferencia';
    sub = `${a?.name || '?'} → ${to?.name || '?'}`; amountCls = 'transfer'; sign = '';
  } else {
    const c = cat(t.categoryId);
    icon = c?.icon || (t.type === 'income' ? '💰' : '💸');
    title = t.note || catLabel(t.categoryId);
    sub = `${t.note ? catLabel(t.categoryId) + ' · ' : ''}${a?.name || 'Cuenta eliminada'}`;
    amountCls = t.type; sign = t.type === 'income' ? '+' : '−';
  }
  const tags = (t.tags || []).map((g) => `<span class="tag">#${esc(g)}</span>`).join('');
  const inst = t.installment ? `<span class="tag">cuota ${t.installment.n}/${t.installment.total}</span>` : '';
  const rec = t.recurringId ? '<span class="tag">🔁</span>' : '';
  const conv = cur !== state.settings.currency ? `<div class="li-sub">≈ ${esc(fmt(txMain(t), undefined, { decimals: 0 }))}</div>` : '';
  const bg = (cat(t.categoryId)?.color || '#94a3b8') + '22';
  return `<button class="list-item" data-action="edit-tx" data-id="${t.id}">
    <span class="avatar" style="background:${t.type === 'transfer' ? 'var(--surface-2)' : bg}">${icon}</span>
    <span class="li-main"><div class="li-title">${esc(title)}${inst}${rec}</div><div class="li-sub">${esc(sub)}${tags}</div></span>
    <span class="li-amount"><div class="num ${amountCls}">${sign}${esc(fmt(t.amount, cur))}</div>${conv}</span>
  </button>`;
}
function txList(txs, { groupByDay = true, limit } = {}) {
  sortTx(txs);
  if (limit) txs = txs.slice(0, limit);
  if (!txs.length) return `<div class="empty"><div class="big">🧾</div>No hay movimientos.<br><button class="btn primary" style="margin-top:12px" data-action="new-tx">Registrar el primero</button></div>`;
  if (!groupByDay) return `<div class="list">${txs.map(txItem).join('')}</div>`;
  const groups = new Map();
  for (const t of txs) { if (!groups.has(t.date)) groups.set(t.date, []); groups.get(t.date).push(t); }
  return [...groups.entries()].map(([d, list]) => {
    const net = sum(list.filter((t) => t.type !== 'transfer'), (t) => (t.type === 'income' ? 1 : -1) * txMain(t));
    return `<div class="tx-day"><div class="tx-day-head"><span>${esc(dayLabel(d))}</span><span class="num ${net >= 0 ? 'income' : 'expense'}">${net >= 0 ? '+' : '−'}${esc(fmt(Math.abs(net), undefined, { decimals: 0 }))}</span></div>
      <div class="list">${list.map(txItem).join('')}</div></div>`;
  }).join('');
}
function kpi(label, value, cls = '', sub = '') {
  return `<div class="card kpi"><div class="label">${esc(label)}</div><div class="value num ${cls}">${esc(value)}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;
}
function accountOptions(selected, { exclude } = {}) {
  return state.accounts.filter((a) => (!a.archived || a.id === selected) && a.id !== exclude)
    .map((a) => `<option value="${a.id}" ${a.id === selected ? 'selected' : ''}>${ACCOUNT_TYPES[a.type]?.icon || ''} ${esc(a.name)} (${a.currency})</option>`).join('');
}
function categoryOptions(type, selected, { rootsOnly = false, allowEmpty = false } = {}) {
  const roots = state.categories.filter((c) => c.type === type && !c.parentId).sort((a, b) => a.name.localeCompare(b.name));
  const opt = (c, indent) => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${indent ? '    ↳ ' : c.icon + ' '}${esc(c.name)}</option>`;
  return (allowEmpty ? '<option value="">— Elegí —</option>' : '') +
    roots.map((r) => opt(r, false) + (rootsOnly ? '' : childrenOf(r.id).map((s) => opt(s, true)).join(''))).join('');
}
function colorSwatches(name, selected) {
  return `<div class="color-swatches">${PALETTE.map((c, i) => `<input type="radio" name="${name}" id="${name}-${i}" value="${c}" ${c === selected ? 'checked' : ''}><label for="${name}-${i}" style="background:${c}" title="${c}"></label>`).join('')}</div>`;
}

// ============================================================ Modal
function openModal({ title, body, submitLabel = 'Guardar', onSubmit, onOpen, extraActions = '', wide = false }) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-backdrop" data-close>
    <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}" ${wide ? 'style="max-width:720px"' : ''}>
      <form id="modal-form" novalidate>
        <div class="modal-head"><h2>${esc(title)}</h2><button type="button" class="icon-btn" data-close aria-label="Cerrar">✕</button></div>
        ${body}
        <div class="modal-actions">${extraActions}${onSubmit ? `<button type="button" class="btn" data-close>Cancelar</button><button type="submit" class="btn primary">${esc(submitLabel)}</button>` : '<button type="button" class="btn" data-close>Cerrar</button>'}</div>
      </form>
    </div></div>`;
  const backdrop = root.firstElementChild;
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('button[data-close]')) closeModal();
  });
  const form = $('#modal-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!onSubmit) return closeModal();
    const fd = Object.fromEntries(new FormData(form).entries());
    const res = onSubmit(fd, form);
    if (res !== false) closeModal();
  });
  onOpen?.(form);
  const first = form.querySelector('[autofocus]');
  if (first && matchMedia('(min-width: 700px)').matches) setTimeout(() => first.focus(), 50);
}
function closeModal() { $('#modal-root').innerHTML = ''; }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#modal-root').innerHTML) closeModal(); });

// ============================================================ Formularios
function txForm(existing, preset = {}) {
  const t = existing || {
    type: 'expense', amount: '', date: today(), note: '', tags: [], categoryId: '', toAccountId: '',
    accountId: state.settings.lastAccountId || state.accounts.find((a) => !a.archived)?.id,
    ...preset,
  };
  if (!existing && !acc(t.accountId)) t.accountId = state.accounts.find((a) => !a.archived)?.id;
  const isEdit = !!existing;
  const types = Object.entries(TX_TYPES).map(([k, v]) => `<input type="radio" name="type" id="tt-${k}" value="${k}" ${t.type === k ? 'checked' : ''}><label for="tt-${k}">${v}</label>`).join('');
  const body = `
    <div class="segmented" style="margin-bottom:14px">${types}</div>
    <div class="form-grid">
      <label class="field full"><span>Monto</span>
        <input class="amount-input num" name="amount" type="text" inputmode="decimal" autocomplete="off" placeholder="0" value="${t.amount !== '' ? esc(String(t.amount).replace('.', ',')) : ''}" required autofocus></label>
      <label class="field" data-show="expense income"><span>Categoría</span><select name="categoryId" id="f-cat"></select></label>
      <label class="field" data-show="expense income transfer"><span id="lbl-acc">Cuenta</span><select name="accountId" id="f-acc">${accountOptions(t.accountId)}</select></label>
      <label class="field" data-show="transfer"><span>Hacia la cuenta</span><select name="toAccountId" id="f-toacc">${accountOptions(t.toAccountId, { exclude: t.accountId })}</select></label>
      <label class="field full" data-show="transfer" id="f-toamount-wrap"><span>Monto recibido (si cambia la moneda)</span>
        <input name="toAmount" type="text" inputmode="decimal" placeholder="Se calcula con la cotización" value="${t.toAmount != null && t.type === 'transfer' ? esc(String(t.toAmount).replace('.', ',')) : ''}"></label>
      <label class="field"><span>Fecha</span><input name="date" type="date" value="${t.date}" required></label>
      <label class="field"><span>Etiquetas</span><input name="tags" type="text" placeholder="ej: vacaciones, trabajo" value="${esc((t.tags || []).join(', '))}"></label>
      <label class="field full"><span>Descripción / nota</span><input name="note" type="text" maxlength="140" placeholder="ej: Compra semanal" value="${esc(t.note || '')}"></label>
      ${isEdit ? '' : `
      <label class="field" data-show="expense"><span>Cuotas</span><input name="installments" type="number" min="1" max="60" value="1"></label>
      <label class="field" data-show="expense income transfer"><span>Repetir</span><select name="repeat"><option value="">No se repite</option>${Object.entries(FREQS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
      <p class="muted small full" data-show="expense" style="margin:0">Con cuotas, el monto es el <b>total</b> de la compra: se registra una cuota por mes.</p>`}
      ${existing?.installment ? `<p class="muted small full" style="margin:0">Cuota ${existing.installment.n} de ${existing.installment.total}. Los cambios aplican solo a esta cuota.</p>` : ''}
      ${existing?.recurringId ? '<p class="muted small full" style="margin:0">Generado por un movimiento recurrente.</p>' : ''}
    </div>`;
  openModal({
    title: isEdit ? 'Editar movimiento' : 'Nuevo movimiento',
    body,
    extraActions: isEdit ? `<button type="button" class="btn danger left" id="btn-del-tx">Eliminar</button><button type="button" class="btn" id="btn-dup-tx">Duplicar</button>` : '',
    onOpen(form) {
      const sync = () => {
        const type = form.type.value;
        $$('[data-show]', form).forEach((el) => { el.hidden = !el.dataset.show.split(' ').includes(type); });
        $('#lbl-acc').textContent = type === 'transfer' ? 'Desde la cuenta' : 'Cuenta';
        if (type !== 'transfer') {
          const sel = form.categoryId;
          const prev = sel.value || t.categoryId;
          sel.innerHTML = categoryOptions(type, cat(prev)?.type === type ? prev : '', { allowEmpty: true });
        } else {
          const from = form.accountId.value;
          const prevTo = form.toAccountId.value;
          form.toAccountId.innerHTML = accountOptions(prevTo, { exclude: from });
          const fa = acc(from), ta = acc(form.toAccountId.value);
          $('#f-toamount-wrap').hidden = !(fa && ta && fa.currency !== ta.currency);
        }
      };
      form.addEventListener('change', (e) => { if (['type', 'accountId', 'toAccountId'].includes(e.target.name)) sync(); });
      sync();
      if (isEdit) {
        $('#btn-del-tx').onclick = () => deleteTx(existing);
        $('#btn-dup-tx').onclick = () => {
          const { type, amount, accountId, categoryId, toAccountId, toAmount, note, tags } = existing;
          closeModal(); txForm(null, { type, amount, accountId, categoryId, toAccountId, toAmount, note, tags: [...(tags || [])] });
        };
      }
    },
    onSubmit(fd) {
      const amount = round2(parseAmount(fd.amount));
      if (!(amount > 0)) { toast('Ingresá un monto mayor a cero'); return false; }
      if (!fd.accountId) { toast('Elegí una cuenta'); return false; }
      if (fd.type !== 'transfer' && !fd.categoryId) { toast('Elegí una categoría'); return false; }
      if (fd.type === 'transfer' && (!fd.toAccountId || fd.toAccountId === fd.accountId)) { toast('Elegí una cuenta destino distinta'); return false; }
      if (!fd.date) { toast('Elegí una fecha'); return false; }
      const base = {
        type: fd.type, amount, accountId: fd.accountId, date: fd.date,
        note: fd.note.trim(), tags: fd.tags.split(',').map((s) => s.trim().replace(/^#/, '')).filter(Boolean),
      };
      if (fd.type === 'transfer') {
        base.toAccountId = fd.toAccountId;
        const fa = acc(fd.accountId), ta = acc(fd.toAccountId);
        const typed = parseAmount(fd.toAmount);
        base.toAmount = fa.currency === ta.currency ? amount : round2(typed > 0 ? typed : amount * rate(fa.currency) / rate(ta.currency));
      } else base.categoryId = fd.categoryId;
      state.settings.lastAccountId = fd.accountId;

      if (isEdit) {
        const keep = { id: existing.id, createdAt: existing.createdAt, installment: existing.installment, recurringId: existing.recurringId };
        Object.keys(existing).forEach((k) => delete existing[k]);
        Object.assign(existing, base, keep);
        return commit('Movimiento actualizado');
      }
      const n = Math.max(1, Math.min(60, parseInt(fd.installments || '1', 10) || 1));
      const now = Date.now();
      if (fd.type === 'expense' && n > 1) {
        const groupId = uid();
        const per = round2(amount / n);
        for (let i = 0; i < n; i++) {
          const amt = i === n - 1 ? round2(amount - per * (n - 1)) : per;
          state.transactions.push({ ...base, id: uid(), amount: amt, date: addMonths(fd.date, i), installment: { n: i + 1, total: n, groupId }, createdAt: now + i });
        }
        return commit(`Compra en ${n} cuotas registrada`);
      }
      const tx = { ...base, id: uid(), createdAt: now };
      if (fd.repeat) {
        const r = { id: uid(), freq: fd.repeat, day: Number(fd.date.slice(8)), template: { ...base }, nextDate: nextDate(fd.date, fd.repeat, Number(fd.date.slice(8))), active: true };
        delete r.template.date;
        tx.recurringId = r.id;
        state.recurring.push(r);
      }
      state.transactions.push(tx);
      processRecurring();
      commit(fd.repeat ? 'Movimiento y repetición guardados' : 'Movimiento guardado');
    },
  });
}
function deleteTx(t) {
  if (t.installment) {
    const others = state.transactions.filter((x) => x.installment?.groupId === t.installment.groupId);
    if (others.length > 1 && confirm(`Esta compra tiene ${others.length} cuotas cargadas.\n\nAceptar: eliminar TODAS las cuotas.\nCancelar: elegir eliminar solo esta.`)) {
      state.transactions = state.transactions.filter((x) => x.installment?.groupId !== t.installment.groupId);
      closeModal(); return commit('Cuotas eliminadas');
    }
  }
  if (!confirm('¿Eliminar este movimiento?')) return;
  state.transactions = state.transactions.filter((x) => x.id !== t.id);
  closeModal(); commit('Movimiento eliminado');
}

function accountForm(existing) {
  const a = existing || { name: '', type: 'bank', currency: state.settings.currency, initial: 0, color: PALETTE[state.accounts.length % PALETTE.length] };
  openModal({
    title: existing ? 'Editar cuenta' : 'Nueva cuenta',
    body: `<div class="form-grid">
      <label class="field full"><span>Nombre</span><input name="name" type="text" required maxlength="40" value="${esc(a.name)}" placeholder="ej: Banco Galicia, Mercado Pago, Visa" autofocus></label>
      <label class="field"><span>Tipo</span><select name="type">${Object.entries(ACCOUNT_TYPES).map(([k, v]) => `<option value="${k}" ${a.type === k ? 'selected' : ''}>${v.icon} ${v.label}</option>`).join('')}</select></label>
      <label class="field"><span>Moneda</span><select name="currency">${CURRENCIES.map((c) => `<option ${a.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
      <label class="field"><span>Saldo inicial</span><input name="initial" type="text" inputmode="decimal" value="${esc(String(a.initial || 0).replace('.', ','))}"></label>
      <label class="field" data-credit><span>Límite de la tarjeta</span><input name="limit" type="text" inputmode="decimal" value="${esc(String(a.limit || '').replace('.', ','))}" placeholder="Opcional"></label>
      <p class="muted small full" data-credit style="margin:0">En tarjetas, el saldo negativo es lo que debés. Pagá la tarjeta con una <b>transferencia</b> desde tu cuenta bancaria.</p>
      <div class="field full"><span class="muted small" style="display:block;margin-bottom:6px">Color</span>${colorSwatches('color', a.color)}</div>
      <label class="check full"><input type="checkbox" name="excludeFromTotal" ${a.excludeFromTotal ? 'checked' : ''}> No sumar al patrimonio total</label>
      ${existing ? `<label class="check full"><input type="checkbox" name="archived" ${a.archived ? 'checked' : ''}> Archivar (ocultar de los listados)</label>` : ''}
    </div>`,
    extraActions: existing ? '<button type="button" class="btn danger left" id="btn-del-acc">Eliminar</button>' : '',
    onOpen(form) {
      const sync = () => $$('[data-credit]', form).forEach((el) => { el.hidden = form.type.value !== 'credit'; });
      form.type.addEventListener('change', sync); sync();
      if (existing) $('#btn-del-acc').onclick = () => {
        const used = state.transactions.filter((t) => t.accountId === a.id || t.toAccountId === a.id).length;
        if (used) return toast(`Tiene ${used} movimientos. Archivala en lugar de eliminarla.`, 3500);
        if (!confirm('¿Eliminar esta cuenta?')) return;
        state.accounts = state.accounts.filter((x) => x.id !== a.id);
        closeModal(); commit('Cuenta eliminada');
      };
    },
    onSubmit(fd) {
      if (!fd.name.trim()) { toast('Poné un nombre'); return false; }
      const data = {
        name: fd.name.trim(), type: fd.type, currency: fd.currency,
        initial: round2(parseAmount(fd.initial) || 0), color: fd.color || a.color,
        limit: fd.type === 'credit' ? round2(parseAmount(fd.limit) || 0) : undefined,
        excludeFromTotal: !!fd.excludeFromTotal, archived: !!fd.archived,
      };
      if (existing) Object.assign(existing, data);
      else state.accounts.push({ id: uid(), ...data });
      commit(existing ? 'Cuenta actualizada' : 'Cuenta creada');
    },
  });
}

function categoryForm(existing, preset = {}) {
  const c = existing || { name: '', type: preset.type || ui.catTab, icon: '📦', color: PALETTE[state.categories.length % PALETTE.length], parentId: preset.parentId || '' };
  const hasChildren = existing && childrenOf(existing.id).length;
  openModal({
    title: existing ? 'Editar categoría' : (c.parentId ? 'Nueva subcategoría' : 'Nueva categoría'),
    body: `<div class="form-grid">
      <label class="field" style="grid-column: span 1"><span>Ícono (emoji)</span><input name="icon" type="text" maxlength="4" value="${esc(c.icon)}" style="font-size:22px;text-align:center"></label>
      <label class="field"><span>Tipo</span><select name="type" ${existing || c.parentId ? 'disabled' : ''}><option value="expense" ${c.type === 'expense' ? 'selected' : ''}>Gasto</option><option value="income" ${c.type === 'income' ? 'selected' : ''}>Ingreso</option></select></label>
      <label class="field full"><span>Nombre</span><input name="name" type="text" required maxlength="40" value="${esc(c.name)}" autofocus></label>
      <label class="field full"><span>Pertenece a</span><select name="parentId" ${hasChildren ? 'disabled' : ''}><option value="">— Ninguna (categoría principal) —</option>${state.categories.filter((x) => !x.parentId && x.type === c.type && x.id !== c.id).sort((a, b) => a.name.localeCompare(b.name)).map((x) => `<option value="${x.id}" ${x.id === c.parentId ? 'selected' : ''}>${x.icon} ${esc(x.name)}</option>`).join('')}</select></label>
      <div class="field full"><span class="muted small" style="display:block;margin-bottom:6px">Color</span>${colorSwatches('color', c.color)}</div>
    </div>`,
    extraActions: existing ? '<button type="button" class="btn danger left" id="btn-del-cat">Eliminar</button>' : '',
    onOpen() {
      if (!existing) return;
      $('#btn-del-cat').onclick = () => {
        const ids = [existing.id, ...childrenOf(existing.id).map((x) => x.id)];
        const used = state.transactions.filter((t) => ids.includes(t.categoryId)).length;
        const target = existing.parentId || '';
        const msg = used
          ? `Hay ${used} movimientos con esta categoría${ids.length > 1 ? ' o sus subcategorías' : ''}. ${target ? 'Pasarán a la categoría principal.' : 'Quedarán "Sin categoría".'} ¿Eliminar?`
          : '¿Eliminar esta categoría' + (ids.length > 1 ? ' y sus subcategorías?' : '?');
        if (!confirm(msg)) return;
        state.transactions.forEach((t) => { if (ids.includes(t.categoryId)) t.categoryId = target; });
        state.recurring.forEach((r) => { if (ids.includes(r.template.categoryId)) r.template.categoryId = target; });
        state.budgets = state.budgets.filter((b) => !ids.includes(b.categoryId));
        state.categories = state.categories.filter((x) => !ids.includes(x.id));
        closeModal(); commit('Categoría eliminada');
      };
    },
    onSubmit(fd) {
      if (!fd.name.trim()) { toast('Poné un nombre'); return false; }
      const parentId = hasChildren ? '' : (fd.parentId ?? c.parentId) || null;
      const parent = parentId ? cat(parentId) : null;
      const data = { name: fd.name.trim(), icon: fd.icon.trim() || '📦', color: fd.color || c.color, parentId, type: parent ? parent.type : (existing ? c.type : fd.type || c.type) };
      if (existing) Object.assign(existing, data);
      else state.categories.push({ id: uid(), ...data });
      commit(existing ? 'Categoría actualizada' : 'Categoría creada');
    },
  });
}

function budgetForm(existing) {
  const b = existing || { categoryId: '', amount: '' };
  const used = new Set(state.budgets.map((x) => x.categoryId));
  openModal({
    title: existing ? 'Editar presupuesto' : 'Nuevo presupuesto mensual',
    body: `<div class="form-grid">
      <label class="field full"><span>Categoría</span><select name="categoryId" ${existing ? 'disabled' : ''}>${categoryOptions('expense', b.categoryId, { allowEmpty: true })}</select></label>
      <label class="field full"><span>Límite por mes (${state.settings.currency})</span><input class="amount-input num" name="amount" type="text" inputmode="decimal" value="${esc(String(b.amount).replace('.', ','))}" autofocus></label>
      <p class="muted small full" style="margin:0">Un presupuesto en una categoría principal incluye todas sus subcategorías.</p>
    </div>`,
    extraActions: existing ? '<button type="button" class="btn danger left" id="btn-del-bud">Eliminar</button>' : '',
    onOpen() {
      if (existing) $('#btn-del-bud').onclick = () => { state.budgets = state.budgets.filter((x) => x.id !== existing.id); closeModal(); commit('Presupuesto eliminado'); };
    },
    onSubmit(fd) {
      const amount = round2(parseAmount(fd.amount));
      if (!(amount > 0)) { toast('Ingresá un monto'); return false; }
      if (existing) { existing.amount = amount; return commit('Presupuesto actualizado'); }
      if (!fd.categoryId) { toast('Elegí una categoría'); return false; }
      if (used.has(fd.categoryId)) { toast('Esa categoría ya tiene presupuesto'); return false; }
      state.budgets.push({ id: uid(), categoryId: fd.categoryId, amount });
      commit('Presupuesto creado');
    },
  });
}

function goalForm(existing) {
  const g = existing || { name: '', icon: '🎯', target: '', saved: 0, currency: state.settings.currency, deadline: '', color: PALETTE[(state.goals.length * 3) % PALETTE.length] };
  openModal({
    title: existing ? 'Editar meta' : 'Nueva meta de ahorro',
    body: `<div class="form-grid">
      <label class="field"><span>Ícono</span><input name="icon" type="text" maxlength="4" value="${esc(g.icon)}" style="font-size:22px;text-align:center"></label>
      <label class="field"><span>Moneda</span><select name="currency">${CURRENCIES.map((c) => `<option ${g.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
      <label class="field full"><span>Nombre</span><input name="name" type="text" maxlength="40" required value="${esc(g.name)}" placeholder="ej: Fondo de emergencia, Viaje, Auto" autofocus></label>
      <label class="field"><span>Objetivo</span><input name="target" type="text" inputmode="decimal" value="${esc(String(g.target).replace('.', ','))}"></label>
      <label class="field"><span>Ya ahorrado</span><input name="saved" type="text" inputmode="decimal" value="${esc(String(g.saved || 0).replace('.', ','))}"></label>
      <label class="field full"><span>Fecha objetivo (opcional)</span><input name="deadline" type="date" value="${esc(g.deadline || '')}"></label>
      <div class="field full"><span class="muted small" style="display:block;margin-bottom:6px">Color</span>${colorSwatches('color', g.color)}</div>
    </div>`,
    extraActions: existing ? '<button type="button" class="btn danger left" id="btn-del-goal">Eliminar</button>' : '',
    onOpen() {
      if (existing) $('#btn-del-goal').onclick = () => { if (!confirm('¿Eliminar esta meta?')) return; state.goals = state.goals.filter((x) => x.id !== existing.id); closeModal(); commit('Meta eliminada'); };
    },
    onSubmit(fd) {
      const target = round2(parseAmount(fd.target));
      if (!fd.name.trim() || !(target > 0)) { toast('Completá nombre y objetivo'); return false; }
      const data = { name: fd.name.trim(), icon: fd.icon.trim() || '🎯', target, saved: round2(parseAmount(fd.saved) || 0), currency: fd.currency, deadline: fd.deadline || '', color: fd.color || g.color };
      if (existing) Object.assign(existing, data);
      else state.goals.push({ id: uid(), history: [], ...data });
      commit(existing ? 'Meta actualizada' : 'Meta creada');
    },
  });
}
function goalMoveForm(g, dir) {
  openModal({
    title: dir > 0 ? `Aportar a "${g.name}"` : `Retirar de "${g.name}"`,
    submitLabel: dir > 0 ? 'Aportar' : 'Retirar',
    body: `<label class="field"><span>Monto (${g.currency})</span><input class="amount-input num" name="amount" type="text" inputmode="decimal" autofocus></label>`,
    onSubmit(fd) {
      const amount = round2(parseAmount(fd.amount));
      if (!(amount > 0)) { toast('Ingresá un monto'); return false; }
      g.saved = round2(Math.max(0, (g.saved || 0) + dir * amount));
      (g.history ||= []).push({ date: today(), amount: dir * amount });
      commit(dir > 0 ? '¡Aporte registrado! 💪' : 'Retiro registrado');
    },
  });
}

function recurringForm(r) {
  const tp = r.template;
  openModal({
    title: 'Editar recurrente',
    body: `<div class="form-grid">
      <label class="field full"><span>Descripción</span><input name="note" type="text" maxlength="140" value="${esc(tp.note || '')}"></label>
      <label class="field"><span>Monto</span><input name="amount" type="text" inputmode="decimal" value="${esc(String(tp.amount).replace('.', ','))}"></label>
      <label class="field"><span>Frecuencia</span><select name="freq">${Object.entries(FREQS).map(([k, v]) => `<option value="${k}" ${r.freq === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      ${tp.type !== 'transfer' ? `<label class="field"><span>Categoría</span><select name="categoryId">${categoryOptions(tp.type, tp.categoryId)}</select></label>` : ''}
      <label class="field"><span>Cuenta</span><select name="accountId">${accountOptions(tp.accountId)}</select></label>
      <label class="field"><span>Próxima fecha</span><input name="nextDate" type="date" value="${r.nextDate}"></label>
      <label class="field"><span>Termina (opcional)</span><input name="endDate" type="date" value="${r.endDate || ''}"></label>
      <label class="check full"><input type="checkbox" name="active" ${r.active ? 'checked' : ''}> Activo</label>
      <p class="muted small full" style="margin:0">Los cambios aplican a los próximos movimientos; los ya generados no se modifican.</p>
    </div>`,
    extraActions: '<button type="button" class="btn danger left" id="btn-del-rec">Eliminar</button>',
    onOpen() {
      $('#btn-del-rec').onclick = () => {
        if (!confirm('¿Eliminar esta regla? Los movimientos ya generados se conservan.')) return;
        state.recurring = state.recurring.filter((x) => x.id !== r.id);
        closeModal(); commit('Recurrente eliminado');
      };
    },
    onSubmit(fd) {
      const amount = round2(parseAmount(fd.amount));
      if (!(amount > 0)) { toast('Monto inválido'); return false; }
      Object.assign(tp, { note: fd.note.trim(), amount, accountId: fd.accountId });
      if (fd.categoryId) tp.categoryId = fd.categoryId;
      if (tp.type === 'transfer') {
        const fa = acc(tp.accountId), ta = acc(tp.toAccountId);
        if (fa && ta && fa.currency === ta.currency) tp.toAmount = amount;
      }
      r.freq = fd.freq; r.nextDate = fd.nextDate || r.nextDate; r.day = Number(r.nextDate.slice(8));
      r.endDate = fd.endDate || ''; r.active = !!fd.active;
      processRecurring();
      commit('Recurrente actualizado');
    },
  });
}

// ============================================================ Vistas
const views = {};

views.inicio = () => {
  const mk = ui.month;
  const txs = txInMonth(mk);
  const t = totals(txs);
  const prev = totals(txInMonth(shiftMonth(mk, -1)));
  const diff = prev.expense ? Math.round(((t.expense - prev.expense) / prev.expense) * 100) : null;
  const expCats = byRootCategory(txs, 'expense');
  const savingsRate = t.income ? Math.round((t.net / t.income) * 100) : null;
  const budgets = state.budgets.map((b) => ({ b, spent: budgetSpent(b, mk) })).sort((x, y) => y.spent / y.b.amount - x.spent / x.b.amount).slice(0, 5);
  const upcoming = state.recurring.filter((r) => r.active && r.nextDate <= addDays(today(), 30)).sort((a, b) => a.nextDate.localeCompare(b.nextDate)).slice(0, 6);
  const accounts = state.accounts.filter((a) => !a.archived);
  const hello = state.settings.name ? `Hola, ${esc(state.settings.name)} 👋` : 'Resumen';
  const empty = !state.transactions.length;
  return `
    <div class="row between wrap" style="margin-bottom:14px"><div class="muted">${hello}</div>${monthNav()}</div>
    ${empty ? `<div class="notice info" style="margin-bottom:14px">👋 ¡Bienvenido! Empezá cargando tus saldos en <a href="#/cuentas">Cuentas</a> y registrá tu primer movimiento con el botón <b>+</b>. ¿Querés ver cómo queda? <button class="btn sm" data-action="demo">Cargar datos de ejemplo</button></div>` : ''}
    <div class="grid kpis">
      ${kpi('Ingresos', fmt(t.income, undefined, { decimals: 0 }), 'income')}
      ${kpi('Gastos', fmt(t.expense, undefined, { decimals: 0 }), 'expense', diff === null ? '' : `${diff > 0 ? '▲' : '▼'} ${Math.abs(diff)}% vs mes anterior`)}
      ${kpi('Balance del mes', fmt(t.net, undefined, { decimals: 0 }), t.net >= 0 ? 'income' : 'expense', savingsRate === null ? '' : `Ahorro: ${savingsRate}% de los ingresos`)}
      ${kpi('Patrimonio total', fmt(netWorth(), undefined, { decimals: 0 }), '', `${accounts.length} cuentas`)}
    </div>
    <div class="grid two-col">
      <div class="card"><div class="card-head"><h2>Gastos por categoría</h2><a href="#/reportes" class="small">Ver reportes</a></div>${donutWithLegend(expCats, 'Gastos')}</div>
      <div class="card"><div class="card-head"><h2>Últimos 6 meses</h2></div>${barChart(monthlySeries(6, mk))}</div>
    </div>
    <div class="grid two-col">
      <div class="card"><div class="card-head"><h2>Últimos movimientos</h2><a href="#/movimientos" class="small">Ver todos</a></div>${txList(txs, { groupByDay: false, limit: 8 })}</div>
      <div class="stack">
        <div class="card"><div class="card-head"><h2>Presupuestos</h2><a href="#/presupuestos" class="small">Gestionar</a></div>
          ${budgets.length ? budgets.map(({ b, spent }) => { const c = cat(b.categoryId); return `
            <div style="margin-bottom:12px"><div class="row between small" style="margin-bottom:4px"><span>${c?.icon || ''} ${esc(catLabel(b.categoryId))}</span><span class="num">${esc(fmt(spent, undefined, { decimals: 0 }))} / ${esc(fmt(b.amount, undefined, { decimals: 0 }))}</span></div>${progressBar(spent, b.amount)}</div>`; }).join('')
            : '<div class="muted small">Definí límites mensuales por categoría para controlar tus gastos. <a href="#/presupuestos">Crear presupuesto</a></div>'}
        </div>
        <div class="card"><div class="card-head"><h2>Próximos 30 días</h2><a href="#/recurrentes" class="small">Recurrentes</a></div>
          ${upcoming.length ? `<div class="list">${upcoming.map((r) => recurringItem(r)).join('')}</div>` : '<div class="muted small">No hay pagos o cobros programados. Al cargar un movimiento elegí “Repetir” para automatizarlo (sueldo, alquiler, servicios…).</div>'}
        </div>
        <div class="card"><div class="card-head"><h2>Cuentas</h2><a href="#/cuentas" class="small">Ver todas</a></div>
          <div class="list">${accounts.slice(0, 6).map((a) => accountRow(a)).join('')}</div>
        </div>
      </div>
    </div>`;
};

function accountRow(a) {
  const bal = accountBalance(a);
  return `<button class="list-item" data-action="go" data-route="movimientos" data-account="${a.id}">
    <span class="avatar" style="background:${a.color}22">${ACCOUNT_TYPES[a.type]?.icon || '👛'}</span>
    <span class="li-main"><div class="li-title">${esc(a.name)}</div><div class="li-sub">${ACCOUNT_TYPES[a.type]?.label || ''} · ${a.currency}</div></span>
    <span class="li-amount num ${bal < 0 ? 'expense' : ''}">${esc(fmt(bal, a.currency))}</span></button>`;
}
function recurringItem(r) {
  const tp = r.template;
  const c = cat(tp.categoryId);
  const a = acc(tp.accountId);
  const cur = a?.currency || state.settings.currency;
  const title = tp.note || (tp.type === 'transfer' ? 'Transferencia' : catLabel(tp.categoryId));
  const sign = tp.type === 'income' ? '+' : tp.type === 'expense' ? '−' : '';
  return `<button class="list-item" data-action="edit-rec" data-id="${r.id}" style="${r.active ? '' : 'opacity:.55'}">
    <span class="avatar" style="background:${(c?.color || '#94a3b8')}22">${tp.type === 'transfer' ? '🔄' : c?.icon || '🔁'}</span>
    <span class="li-main"><div class="li-title">${esc(title)}</div><div class="li-sub">${FREQS[r.freq]} · ${r.active ? 'próximo ' + esc(shortDate(r.nextDate)) : 'pausado'} · ${esc(a?.name || '')}</div></span>
    <span class="li-amount num ${tp.type}">${sign}${esc(fmt(tp.amount, cur))}</span></button>`;
}

views.movimientos = () => {
  const f = ui.filters;
  let txs = txInMonth(ui.month);
  if (f.type) txs = txs.filter((t) => t.type === f.type);
  if (f.account) txs = txs.filter((t) => t.accountId === f.account || t.toAccountId === f.account);
  if (f.category) txs = txs.filter((t) => t.categoryId === f.category || cat(t.categoryId)?.parentId === f.category);
  if (f.q) {
    const q = f.q.toLowerCase();
    txs = txs.filter((t) => [t.note, catLabel(t.categoryId), acc(t.accountId)?.name, ...(t.tags || [])].join(' ').toLowerCase().includes(q) || String(t.amount).includes(q));
  }
  const t = totals(txs);
  return `
    <div class="row between wrap" style="margin-bottom:12px">${monthNav()}
      <div class="row"><button class="btn sm" data-action="export-csv" data-scope="filtered">⬇︎ CSV</button></div></div>
    <div class="toolbar">
      <input type="search" id="f-q" placeholder="Buscar descripción, categoría, etiqueta…" value="${esc(f.q)}">
      <select id="f-type"><option value="">Todos los tipos</option>${Object.entries(TX_TYPES).map(([k, v]) => `<option value="${k}" ${f.type === k ? 'selected' : ''}>${v}s</option>`).join('')}</select>
      <select id="f-account"><option value="">Todas las cuentas</option>${accountOptions(f.account)}</select>
      <select id="f-category"><option value="">Todas las categorías</option><optgroup label="Gastos">${categoryOptions('expense', f.category)}</optgroup><optgroup label="Ingresos">${categoryOptions('income', f.category)}</optgroup></select>
      ${f.type || f.account || f.category || f.q ? '<button class="btn sm ghost" data-action="clear-filters">Limpiar</button>' : ''}
    </div>
    <div class="grid kpis" style="margin-bottom:14px">
      ${kpi('Ingresos', fmt(t.income, undefined, { decimals: 0 }), 'income')}
      ${kpi('Gastos', fmt(t.expense, undefined, { decimals: 0 }), 'expense')}
      ${kpi('Balance', fmt(t.net, undefined, { decimals: 0 }), t.net >= 0 ? 'income' : 'expense')}
      ${kpi('Movimientos', String(txs.length))}
    </div>
    ${txList(txs)}`;
};

views.cuentas = () => {
  const active = state.accounts.filter((a) => !a.archived);
  const archived = state.accounts.filter((a) => a.archived);
  const byCur = {};
  active.filter((a) => !a.excludeFromTotal).forEach((a) => { byCur[a.currency] = (byCur[a.currency] || 0) + accountBalance(a); });
  const debt = sum(active.filter((a) => a.type === 'credit'), (a) => Math.min(0, toMain(accountBalance(a), a.currency)));
  const card = (a) => {
    const bal = accountBalance(a);
    const t = ACCOUNT_TYPES[a.type] || ACCOUNT_TYPES.other;
    const credit = a.type === 'credit' && a.limit ? `<div class="small muted" style="margin-top:8px">Disponible: ${esc(fmt(a.limit + Math.min(0, bal), a.currency))} de ${esc(fmt(a.limit, a.currency))}</div>${progressBar(-Math.min(0, bal), a.limit)}` : '';
    const conv = a.currency !== state.settings.currency ? `<div class="small muted">≈ ${esc(fmt(toMain(bal, a.currency), undefined, { decimals: 0 }))}</div>` : '';
    return `<div class="card account-card" style="--acc:${a.color}" data-action="edit-account" data-id="${a.id}">
      <div class="row between"><span class="small muted">${t.icon} ${t.label} · ${a.currency}</span>${a.excludeFromTotal ? '<span class="tag">fuera del total</span>' : ''}</div>
      <div style="font-weight:650;margin-top:4px">${esc(a.name)}</div>
      <div class="balance num ${bal < 0 ? 'expense' : ''}">${esc(fmt(bal, a.currency))}</div>${conv}${credit}
      <div class="row" style="margin-top:10px"><button class="btn sm" data-action="go" data-route="movimientos" data-account="${a.id}">Movimientos</button></div>
    </div>`;
  };
  return `
    <div class="grid kpis">
      ${kpi('Patrimonio total', fmt(netWorth(), undefined, { decimals: 0 }), '', `en ${state.settings.currency}, al tipo de cambio de Ajustes`)}
      ${Object.entries(byCur).slice(0, 2).map(([c, v]) => kpi(`Total en ${c}`, fmt(v, c))).join('')}
      ${kpi('Deuda en tarjetas', fmt(-debt, undefined, { decimals: 0 }), debt < 0 ? 'expense' : '')}
    </div>
    <div class="row between" style="margin:20px 0 10px"><div class="section-title" style="margin:0">Mis cuentas</div><button class="btn primary sm" data-action="new-account">+ Nueva cuenta</button></div>
    <div class="grid accounts-grid">${active.map(card).join('')}</div>
    ${archived.length ? `<div class="section-title">Archivadas</div><div class="grid accounts-grid" style="opacity:.6">${archived.map(card).join('')}</div>` : ''}
    <p class="muted small" style="margin-top:18px">💡 Para mover plata entre cuentas (pagar la tarjeta, extraer efectivo, comprar dólares) usá un movimiento de tipo <b>Transferencia</b>: no cuenta como gasto ni ingreso.</p>`;
};

views.presupuestos = () => {
  const mk = ui.month;
  const rows = state.budgets.map((b) => ({ b, c: cat(b.categoryId), spent: budgetSpent(b, mk) })).sort((x, y) => (x.c?.name || '').localeCompare(y.c?.name || ''));
  const totalB = sum(rows, (r) => r.b.amount);
  const totalS = sum(rows, (r) => r.spent);
  const now = new Date();
  const isCurrent = mk === monthKey(today());
  const dim = daysInMonth(+mk.slice(0, 4), +mk.slice(5) - 1);
  const elapsed = isCurrent ? now.getDate() / dim : 1;
  const unbudgeted = byRootCategory(txInMonth(mk), 'expense').filter((x) => !state.budgets.some((b) => b.categoryId === x.id));
  return `
    <div class="row between wrap" style="margin-bottom:14px">${monthNav()}<button class="btn primary sm" data-action="new-budget">+ Nuevo presupuesto</button></div>
    ${rows.length ? `
    <div class="grid kpis">
      ${kpi('Presupuestado', fmt(totalB, undefined, { decimals: 0 }))}
      ${kpi('Gastado', fmt(totalS, undefined, { decimals: 0 }), totalS > totalB ? 'expense' : '')}
      ${kpi('Disponible', fmt(totalB - totalS, undefined, { decimals: 0 }), totalB - totalS < 0 ? 'expense' : 'income')}
      ${kpi('Usado', pct(totalS, totalB) + '%', '', isCurrent ? `${Math.round(elapsed * 100)}% del mes transcurrido` : '')}
    </div>
    <div class="list" style="margin-top:14px">${rows.map(({ b, c, spent }) => {
      const left = b.amount - spent;
      const forecast = isCurrent && elapsed > 0.1 ? spent / elapsed : null;
      return `<button class="list-item" data-action="edit-budget" data-id="${b.id}" style="display:block">
        <div class="row between"><span class="li-title">${c?.icon || ''} ${esc(catLabel(b.categoryId))}</span><span class="num small">${esc(fmt(spent, undefined, { decimals: 0 }))} / ${esc(fmt(b.amount, undefined, { decimals: 0 }))}</span></div>
        <div style="margin:8px 0 6px">${progressBar(spent, b.amount)}</div>
        <div class="row between small"><span class="${left < 0 ? 'expense' : 'muted'}">${left < 0 ? 'Excedido en ' + esc(fmt(-left, undefined, { decimals: 0 })) : 'Quedan ' + esc(fmt(left, undefined, { decimals: 0 }))}</span>
          ${forecast && forecast > b.amount && left >= 0 ? `<span class="warn">Proyección: ${esc(fmt(forecast, undefined, { decimals: 0 }))}</span>` : `<span class="muted">${pct(spent, b.amount)}%</span>`}</div>
      </button>`;
    }).join('')}</div>` : `<div class="card empty"><div class="big">🎯</div>Todavía no definiste presupuestos.<br>Poné un límite mensual a categorías como Supermercado, Salidas o Transporte y seguí cuánto te queda.<br><button class="btn primary" style="margin-top:12px" data-action="new-budget">Crear presupuesto</button></div>`}
    ${unbudgeted.length ? `<div class="section-title">Gastos sin presupuesto este mes</div><div class="card">${legend(unbudgeted, 20)}</div>` : ''}`;
};

function periodRange(p) {
  const t = today();
  const mk = monthKey(t);
  switch (p) {
    case '1m': return { from: mk + '-01', to: t, months: 1, label: 'Este mes' };
    case 'prev': { const pm = shiftMonth(mk, -1); return { from: pm + '-01', to: `${pm}-${pad(daysInMonth(+pm.slice(0, 4), +pm.slice(5) - 1))}`, months: 1, label: 'Mes anterior', end: pm }; }
    case '3m': return { from: shiftMonth(mk, -2) + '-01', to: t, months: 3, label: 'Últimos 3 meses' };
    case 'ytd': return { from: t.slice(0, 4) + '-01-01', to: t, months: Number(t.slice(5, 7)), label: 'Este año' };
    case '12m': return { from: shiftMonth(mk, -11) + '-01', to: t, months: 12, label: 'Últimos 12 meses' };
    case 'all': {
      const first = state.transactions.reduce((m, x) => (x.date < m ? x.date : m), t);
      const [y1, m1] = first.split('-').map(Number), [y2, m2] = t.split('-').map(Number);
      return { from: first, to: t, months: Math.max(1, (y2 - y1) * 12 + (m2 - m1) + 1), label: 'Todo' };
    }
    default: return { from: shiftMonth(mk, -5) + '-01', to: t, months: 6, label: 'Últimos 6 meses' };
  }
}
views.reportes = () => {
  const p = periodRange(ui.reportPeriod);
  const txs = txInRange(p.from, p.to);
  const t = totals(txs);
  const exp = byRootCategory(txs, 'expense');
  const inc = byRootCategory(txs, 'income');
  const days = Math.max(1, Math.round((parseDate(p.to) - parseDate(p.from)) / 86400000) + 1);
  const top = sortTx(txs.filter((x) => x.type === 'expense')).sort((a, b) => txMain(b) - txMain(a)).slice(0, 10);
  const series = monthlySeries(Math.min(Math.max(p.months, 6), 24), p.end || monthKey(p.to));
  const byAccount = state.accounts.map((a) => ({ a, v: sum(txs.filter((x) => x.type === 'expense' && x.accountId === a.id), txMain) })).filter((x) => x.v > 0).sort((x, y) => y.v - x.v);
  const tagMap = {};
  txs.filter((x) => x.type === 'expense').forEach((x) => (x.tags || []).forEach((g) => { tagMap[g] = (tagMap[g] || 0) + txMain(x); }));
  const tags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]);
  const subRows = (rootId) => {
    const m = {};
    txs.filter((x) => x.type === 'expense' && rootCat(x.categoryId)?.id === rootId).forEach((x) => { const k = cat(x.categoryId)?.parentId ? cat(x.categoryId).name : '(general)'; m[k] = (m[k] || 0) + txMain(x); });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  };
  const periods = { '1m': 'Este mes', prev: 'Mes anterior', '3m': '3 meses', '6m': '6 meses', ytd: 'Este año', '12m': '12 meses', all: 'Todo' };
  return `
    <div class="tabs">${Object.entries(periods).map(([k, v]) => `<button class="${ui.reportPeriod === k ? 'active' : ''}" data-action="period" data-p="${k}">${v}</button>`).join('')}</div>
    <div class="grid kpis">
      ${kpi('Ingresos', fmt(t.income, undefined, { decimals: 0 }), 'income', p.months > 1 ? `Promedio ${esc(fmt(t.income / p.months, undefined, { decimals: 0 }))}/mes` : '')}
      ${kpi('Gastos', fmt(t.expense, undefined, { decimals: 0 }), 'expense', p.months > 1 ? `Promedio ${esc(fmt(t.expense / p.months, undefined, { decimals: 0 }))}/mes` : `≈ ${esc(fmt(t.expense / days, undefined, { decimals: 0 }))}/día`)}
      ${kpi('Ahorro neto', fmt(t.net, undefined, { decimals: 0 }), t.net >= 0 ? 'income' : 'expense', t.income ? `Tasa de ahorro ${Math.round((t.net / t.income) * 100)}%` : '')}
      ${kpi('Gasto diario', fmt(t.expense / days, undefined, { decimals: 0 }), '', `${days} días`)}
    </div>
    <div class="card"><div class="card-head"><h2>Evolución mensual</h2></div>${barChart(series)}
      <div style="overflow-x:auto;margin-top:12px"><table class="small num" style="width:100%;border-collapse:collapse;min-width:420px">
        <tr class="muted"><th style="text-align:left;padding:4px">Mes</th><th style="text-align:right">Ingresos</th><th style="text-align:right">Gastos</th><th style="text-align:right">Balance</th></tr>
        ${series.slice().reverse().map((r) => `<tr style="border-top:1px solid var(--border)"><td style="padding:6px 4px;text-transform:capitalize">${monthLabel(r.mk)}</td><td style="text-align:right" class="income">${esc(fmt(r.income, undefined, { decimals: 0 }))}</td><td style="text-align:right" class="expense">${esc(fmt(r.expense, undefined, { decimals: 0 }))}</td><td style="text-align:right" class="${r.income - r.expense >= 0 ? 'income' : 'expense'}">${esc(fmt(r.income - r.expense, undefined, { decimals: 0 }))}</td></tr>`).join('')}
      </table></div></div>
    <div class="grid two-col">
      <div class="card"><div class="card-head"><h2>Gastos por categoría</h2></div>${donutWithLegend(exp, 'Gastos')}</div>
      <div class="card"><div class="card-head"><h2>Ingresos por categoría</h2></div>${donutWithLegend(inc, 'Ingresos')}</div>
    </div>
    ${exp.length ? `<div class="card"><div class="card-head"><h2>Detalle por subcategoría</h2></div>
      ${exp.slice(0, 12).map((c) => { const subs = subRows(c.id); return `<details style="border-top:1px solid var(--border);padding:8px 0"><summary class="row between" style="cursor:pointer;list-style:none"><span>${esc(c.label)}</span><span class="num">${esc(fmt(c.value, undefined, { decimals: 0 }))} <span class="muted small">${pct(c.value, t.expense)}%</span></span></summary>
        <div style="padding:6px 0 0 28px">${subs.map(([n, v]) => `<div class="row between small" style="padding:3px 0"><span class="muted">${esc(n)}</span><span class="num">${esc(fmt(v, undefined, { decimals: 0 }))}</span></div>`).join('')}</div></details>`; }).join('')}</div>` : ''}
    <div class="grid two-col">
      <div class="card"><div class="card-head"><h2>Gastos más grandes</h2></div>${top.length ? `<div class="list">${top.map(txItem).join('')}</div>` : '<div class="muted small">Sin gastos en el período</div>'}</div>
      <div class="stack">
        <div class="card"><div class="card-head"><h2>Gastos por cuenta / medio de pago</h2></div>${byAccount.length ? byAccount.map(({ a, v }) => `<div style="margin-bottom:10px"><div class="row between small"><span>${ACCOUNT_TYPES[a.type]?.icon || ''} ${esc(a.name)}</span><span class="num">${esc(fmt(v, undefined, { decimals: 0 }))}</span></div>${progressBar(v, t.expense)}</div>`).join('') : '<div class="muted small">Sin datos</div>'}</div>
        <div class="card"><div class="card-head"><h2>Gastos por etiqueta</h2></div>${tags.length ? tags.slice(0, 12).map(([g, v]) => `<div class="row between small" style="padding:4px 0"><span>#${esc(g)}</span><span class="num">${esc(fmt(v, undefined, { decimals: 0 }))}</span></div>`).join('') : '<div class="muted small">Agregá etiquetas a tus movimientos (ej: #vacaciones) para agruparlos acá.</div>'}</div>
      </div>
    </div>`;
};

views.metas = () => {
  const goals = state.goals;
  return `
    <div class="row between" style="margin-bottom:14px"><span class="muted">Ahorrá para lo que te importa</span><button class="btn primary sm" data-action="new-goal">+ Nueva meta</button></div>
    ${goals.length ? `<div class="grid accounts-grid">${goals.map((g) => {
      const p = pct(g.saved, g.target);
      let hint = '';
      if (g.deadline && g.saved < g.target) {
        const [y1, m1] = today().split('-').map(Number), [y2, m2] = g.deadline.split('-').map(Number);
        const months = (y2 - y1) * 12 + (m2 - m1);
        hint = months > 0 ? `Necesitás ${esc(fmt((g.target - g.saved) / months, g.currency, { decimals: 0 }))}/mes hasta ${esc(shortDate(g.deadline))} ${g.deadline.slice(0, 4)}` : 'La fecha objetivo ya llegó';
      }
      return `<div class="card account-card" style="--acc:${g.color}">
        <div class="row between"><span style="font-size:26px">${esc(g.icon)}</span><button class="btn sm ghost" data-action="edit-goal" data-id="${g.id}">Editar</button></div>
        <div style="font-weight:650;margin-top:4px">${esc(g.name)}</div>
        <div class="balance num">${esc(fmt(g.saved, g.currency, { decimals: 0 }))} <span class="muted small" style="font-weight:400">de ${esc(fmt(g.target, g.currency, { decimals: 0 }))}</span></div>
        <div style="margin:10px 0 6px" class="progress"><div style="width:${Math.min(100, p)}%;background:${g.color}"></div></div>
        <div class="small muted">${p >= 100 ? '🎉 ¡Meta cumplida!' : `${p}% · faltan ${esc(fmt(g.target - g.saved, g.currency, { decimals: 0 }))}`}</div>
        ${hint ? `<div class="small muted" style="margin-top:4px">${hint}</div>` : ''}
        <div class="row" style="margin-top:12px"><button class="btn sm primary" data-action="goal-add" data-id="${g.id}">+ Aportar</button><button class="btn sm" data-action="goal-sub" data-id="${g.id}">Retirar</button></div>
      </div>`;
    }).join('')}</div>` : `<div class="card empty"><div class="big">🏆</div>Creá metas como “Fondo de emergencia”, “Vacaciones” o “Auto nuevo”<br>y registrá tus aportes para ver cuánto te falta.<br><button class="btn primary" style="margin-top:12px" data-action="new-goal">Crear meta</button></div>`}`;
};

views.recurrentes = () => {
  const list = state.recurring.slice().sort((a, b) => (b.active - a.active) || a.nextDate.localeCompare(b.nextDate));
  const monthlyFactor = { weekly: 52 / 12, biweekly: 26 / 12, monthly: 1, bimonthly: 0.5, quarterly: 1 / 3, yearly: 1 / 12 };
  const mExp = sum(list.filter((r) => r.active && r.template.type === 'expense'), (r) => toMain(r.template.amount, acc(r.template.accountId)?.currency || state.settings.currency) * monthlyFactor[r.freq]);
  const mInc = sum(list.filter((r) => r.active && r.template.type === 'income'), (r) => toMain(r.template.amount, acc(r.template.accountId)?.currency || state.settings.currency) * monthlyFactor[r.freq]);
  return `
    <div class="grid kpis" style="margin-bottom:14px">
      ${kpi('Gastos fijos / mes', fmt(mExp, undefined, { decimals: 0 }), 'expense')}
      ${kpi('Ingresos fijos / mes', fmt(mInc, undefined, { decimals: 0 }), 'income')}
      ${kpi('Margen fijo', fmt(mInc - mExp, undefined, { decimals: 0 }), mInc - mExp >= 0 ? 'income' : 'expense')}
      ${kpi('Reglas activas', String(list.filter((r) => r.active).length))}
    </div>
    ${list.length ? `<div class="list">${list.map(recurringItem).join('')}</div>` : '<div class="card empty"><div class="big">🔁</div>No hay movimientos recurrentes.<br>Al crear un movimiento, elegí <b>Repetir</b> (mensual, semanal, anual…) y se van a registrar solos en cada fecha.<br><button class="btn primary" style="margin-top:12px" data-action="new-tx">Nuevo movimiento</button></div>'}
    <p class="muted small" style="margin-top:14px">Los movimientos recurrentes se generan automáticamente al abrir la app cuando llega su fecha.</p>`;
};

views.categorias = () => {
  const type = ui.catTab;
  const roots = state.categories.filter((c) => c.type === type && !c.parentId).sort((a, b) => a.name.localeCompare(b.name));
  const count = (id) => state.transactions.filter((t) => t.categoryId === id).length;
  return `
    <div class="row between wrap" style="margin-bottom:6px">
      <div class="tabs" style="margin:0"><button class="${type === 'expense' ? 'active' : ''}" data-action="cat-tab" data-t="expense">Gastos</button><button class="${type === 'income' ? 'active' : ''}" data-action="cat-tab" data-t="income">Ingresos</button></div>
      <button class="btn primary sm" data-action="new-cat">+ Nueva categoría</button>
    </div>
    <div class="stack" style="margin-top:14px">${roots.map((r) => `
      <div class="list">
        <button class="list-item" data-action="edit-cat" data-id="${r.id}"><span class="avatar" style="background:${r.color}22">${esc(r.icon)}</span>
          <span class="li-main"><div class="li-title">${esc(r.name)}</div><div class="li-sub">${childrenOf(r.id).length} subcategorías · ${count(r.id)} movimientos</div></span><span class="dot" style="width:12px;height:12px;border-radius:4px;background:${r.color}"></span></button>
        ${childrenOf(r.id).map((s) => `<button class="list-item" data-action="edit-cat" data-id="${s.id}" style="padding-left:62px"><span class="li-main"><div class="li-title" style="font-weight:500">↳ ${esc(s.name)}</div></span><span class="muted small">${count(s.id)}</span></button>`).join('')}
        <button class="list-item muted small" data-action="new-subcat" data-id="${r.id}" style="padding-left:62px">+ Agregar subcategoría</button>
      </div>`).join('')}</div>`;
};

views.ajustes = () => {
  const s = state.settings;
  const used = [...new Set([...state.accounts.map((a) => a.currency), ...state.goals.map((g) => g.currency)])].filter((c) => c !== s.currency);
  const rateCurs = [...new Set([...used, ...(s.currency === 'ARS' ? ['USD'] : [])])];
  const sc = syncCfg;
  return `
    <div class="grid two-col">
    <div class="card"><h2>General</h2>
      <form id="settings-form" class="form-grid">
        <label class="field full"><span>Tu nombre</span><input name="name" type="text" maxlength="30" value="${esc(s.name)}" placeholder="Para el saludo"></label>
        <label class="field full"><span>Moneda principal (para totales y reportes)</span><select name="currency">${CURRENCIES.map((c) => `<option ${s.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
        ${rateCurs.map((c) => `<label class="field"><span>1 ${c} = ? ${s.currency}</span><input name="rate_${c}" type="text" inputmode="decimal" value="${esc(String(s.rates?.[c] ?? '').replace('.', ','))}"></label>`).join('')}
        ${s.currency === 'ARS' ? `<div class="field full"><span class="muted small" style="display:block;margin-bottom:6px">Actualizar dólar automáticamente (dolarapi.com, precio de venta)</span>
          <div class="row wrap"><select name="dolarKind" style="width:auto">${['oficial', 'blue', 'bolsa', 'contadoconliqui', 'tarjeta', 'cripto'].map((k) => `<option value="${k}" ${s.dolarKind === k ? 'selected' : ''}>${{ oficial: 'Oficial', blue: 'Blue', bolsa: 'MEP', contadoconliqui: 'CCL', tarjeta: 'Tarjeta', cripto: 'Cripto' }[k]}</option>`).join('')}</select>
          <button type="button" class="btn sm" data-action="fetch-dolar">Actualizar cotización</button></div>
          ${s.rateUpdated ? `<div class="muted small" style="margin-top:6px">Última actualización: ${esc(new Date(s.rateUpdated).toLocaleString('es-AR'))}</div>` : ''}</div>` : ''}
        <div class="full"><button class="btn primary" type="submit">Guardar ajustes</button></div>
      </form>
    </div>

    <div class="card"><h2>☁️ Sincronizar entre PC y celular</h2>
      <p class="muted small" style="margin-top:0">Tus datos se guardan en este dispositivo. Activá la sincronización para usar los mismos datos en todos lados (requiere configurar la base de datos en Vercel: ver README).</p>
      <form id="sync-form" class="form-grid">
        <label class="field full"><span>Contraseña de sincronización (APP_PASSWORD)</span><input name="password" type="password" autocomplete="current-password" value="${esc(sc.password || '')}" placeholder="La que definiste en Vercel"></label>
        <div class="full row wrap">
          <button class="btn primary" type="submit">${sc.enabled ? 'Guardar y sincronizar' : 'Activar sincronización'}</button>
          ${sc.enabled ? '<button type="button" class="btn" data-action="sync-now">Sincronizar ahora</button><button type="button" class="btn ghost" data-action="sync-off">Desactivar</button>' : ''}
        </div>
        <div class="full small ${syncState.status === 'error' ? 'expense' : 'muted'}">${esc(syncStatusText())}</div>
      </form>
    </div>

    <div class="card"><h2>Copias de seguridad y exportación</h2>
      <div class="row wrap">
        <button class="btn" data-action="export-json">⬇︎ Descargar backup (JSON)</button>
        <button class="btn" data-action="import-json">⬆︎ Restaurar backup</button>
        <button class="btn" data-action="export-csv" data-scope="all">⬇︎ Exportar movimientos (CSV/Excel)</button>
      </div>
      <p class="muted small">Descargá un backup de vez en cuando, sobre todo si no usás la sincronización.</p>
      <input type="file" id="import-file" accept="application/json,.json" hidden>
    </div>

    <div class="card"><h2>Instalar en el celular</h2>
      <p class="small" style="margin-top:0"><b>Android (Chrome):</b> menú ⋮ → “Instalar app” / “Agregar a pantalla principal”.<br><b>iPhone (Safari):</b> botón Compartir → “Agregar a inicio”.<br><b>PC (Chrome/Edge):</b> ícono de instalar en la barra de direcciones.</p>
      ${installPrompt ? '<button class="btn primary" data-action="install">Instalar ahora</button>' : ''}
      <hr>
      <h2>Datos</h2>
      <div class="row wrap">
        ${!state.transactions.length ? '<button class="btn" data-action="demo">Cargar datos de ejemplo</button>' : ''}
        <button class="btn danger" data-action="reset">Borrar todos los datos</button>
      </div>
      <p class="muted small">${state.transactions.length} movimientos · ${state.accounts.length} cuentas · ${state.categories.length} categorías</p>
    </div>
    </div>`;
};

views.mas = () => `
  <div class="more-grid">${NAV.filter((n) => !BOTTOM_NAV.includes(n.route)).map((n) => `<button data-action="go" data-route="${n.route}"><span class="ico">${n.icon}</span>${n.label}</button>`).join('')}</div>`;

// ============================================================ Render y navegación
function render() {
  const route = views[ui.route] ? ui.route : 'inicio';
  const nav = NAV.find((n) => n.route === route);
  $('#page-title').textContent = route === 'mas' ? 'Más' : nav?.label || 'Inicio';
  document.title = `${route === 'mas' ? 'Más' : nav?.label || 'Inicio'} · Mis Finanzas`;
  $('#view').innerHTML = views[route]();
  $('#side-nav').innerHTML = NAV.map((n) => `<button class="${n.route === route ? 'active' : ''}" data-action="go" data-route="${n.route}"><span class="ico">${n.icon}</span>${n.label}</button>`).join('');
  const moreActive = !BOTTOM_NAV.includes(route);
  $('#bottom-nav').innerHTML = BOTTOM_NAV.map((r) => {
    if (!r) return '<span class="spacer"></span>';
    if (r === 'mas') return `<button class="${moreActive ? 'active' : ''}" data-action="go" data-route="mas"><span class="ico">☰</span>Más</button>`;
    const n = NAV.find((x) => x.route === r);
    return `<button class="${r === route ? 'active' : ''}" data-action="go" data-route="${r}"><span class="ico">${n.icon}</span>${n.label}</button>`;
  }).join('');
  bindViewInputs();
  renderSyncIndicator();
}
function bindViewInputs() {
  const q = $('#f-q');
  if (q) {
    q.addEventListener('input', () => { ui.filters.q = q.value; clearTimeout(q._t); q._t = setTimeout(() => { const pos = q.selectionStart; render(); const nq = $('#f-q'); nq.focus(); nq.setSelectionRange(pos, pos); }, 250); });
    ['type', 'account', 'category'].forEach((k) => $('#f-' + k).addEventListener('change', (e) => { ui.filters[k] = e.target.value; render(); }));
  }
  const sf = $('#settings-form');
  if (sf) sf.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(sf).entries());
    const s = state.settings;
    const prevCur = s.currency;
    s.name = fd.name.trim();
    Object.keys(fd).filter((k) => k.startsWith('rate_')).forEach((k) => { const v = parseAmount(fd[k]); if (v > 0) s.rates[k.slice(5)] = v; });
    if (fd.dolarKind) s.dolarKind = fd.dolarKind;
    if (fd.currency !== prevCur) {
      // re-expresar cotizaciones en la nueva moneda principal
      const base = s.rates[fd.currency] > 0 ? s.rates[fd.currency] : 1;
      const nr = {};
      for (const c of CURRENCIES) { if (c === fd.currency) continue; const r = c === prevCur ? 1 : s.rates[c]; if (r > 0) nr[c] = round2(r / base * 10000) / 10000; }
      s.rates = nr; s.currency = fd.currency;
      Object.keys(fmtCache).forEach((k) => delete fmtCache[k]);
    }
    commit('Ajustes guardados');
  });
  const syf = $('#sync-form');
  if (syf) syf.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = new FormData(syf).get('password').trim();
    if (!pw) return toast('Ingresá la contraseña');
    const changed = pw !== syncCfg.password;
    syncCfg.password = pw; syncCfg.enabled = true;
    if (changed) { syncCfg.remoteUpdatedAt = 0; syncCfg.lastLocalSyncedAt = 0; }
    saveSyncCfg();
    await syncNow({ interactive: true });
    render();
  });
  const fi = $('#import-file');
  if (fi) fi.addEventListener('change', async () => {
    const file = fi.files[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data || !Array.isArray(data.transactions) || !Array.isArray(data.accounts)) throw new Error('formato');
      if (!confirm(`Restaurar backup con ${data.transactions.length} movimientos? Se reemplazarán los datos actuales.`)) return;
      state = migrate(data); commit('Backup restaurado');
    } catch { toast('El archivo no es un backup válido'); }
  });
}
function go(route) {
  if (location.hash !== '#/' + route) location.hash = '#/' + route;
  else { ui.route = route; render(); }
}
window.addEventListener('hashchange', () => {
  ui.route = location.hash.replace(/^#\/?/, '') || 'inicio';
  closeModal(); render(); window.scrollTo(0, 0);
});

// ============================================================ Acciones
const actions = {
  'new-tx': () => txForm(null, ui.route === 'movimientos' && ui.filters.account ? { accountId: ui.filters.account } : {}),
  'edit-tx': (d) => { const t = state.transactions.find((x) => x.id === d.id); if (t) txForm(t); },
  go: (d) => {
    if (d.account) { ui.filters = { type: '', account: d.account, category: '', q: '' }; }
    go(d.route);
  },
  month: (d) => { ui.month = shiftMonth(ui.month, Number(d.dir)); render(); },
  'clear-filters': () => { ui.filters = { type: '', account: '', category: '', q: '' }; render(); },
  'new-account': () => accountForm(),
  'edit-account': (d) => accountForm(acc(d.id)),
  'new-budget': () => budgetForm(),
  'edit-budget': (d) => budgetForm(state.budgets.find((b) => b.id === d.id)),
  'new-goal': () => goalForm(),
  'edit-goal': (d) => goalForm(state.goals.find((g) => g.id === d.id)),
  'goal-add': (d) => goalMoveForm(state.goals.find((g) => g.id === d.id), 1),
  'goal-sub': (d) => goalMoveForm(state.goals.find((g) => g.id === d.id), -1),
  'edit-rec': (d) => recurringForm(state.recurring.find((r) => r.id === d.id)),
  'cat-tab': (d) => { ui.catTab = d.t; render(); },
  'new-cat': () => categoryForm(null, { type: ui.catTab }),
  'new-subcat': (d) => categoryForm(null, { type: ui.catTab, parentId: d.id }),
  'edit-cat': (d) => categoryForm(cat(d.id)),
  period: (d) => { ui.reportPeriod = d.p; render(); },
  'toggle-theme': () => {
    const cur = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, cur); } catch { /* sin almacenamiento */ }
    applyTheme();
  },
  'export-json': () => download(`finanzas-backup-${today()}.json`, JSON.stringify(state, null, 2), 'application/json'),
  'import-json': () => $('#import-file').click(),
  'export-csv': (d) => exportCsv(d.scope),
  'fetch-dolar': async () => {
    const kind = $('#settings-form [name=dolarKind]')?.value || state.settings.dolarKind || 'blue';
    try {
      const r = await fetch(`https://dolarapi.com/v1/dolares/${kind}`);
      const j = await r.json();
      if (!(j.venta > 0)) throw new Error('sin datos');
      state.settings.rates.USD = j.venta; state.settings.dolarKind = kind; state.settings.rateUpdated = Date.now();
      commit(`Dólar ${j.nombre || kind}: ${fmt(j.venta, 'ARS')}`);
    } catch { toast('No se pudo obtener la cotización. Cargala a mano.'); }
  },
  demo: () => { loadDemo(); commit('Datos de ejemplo cargados'); },
  reset: () => {
    if (!confirm('¿Borrar TODOS los datos de este dispositivo? Esta acción no se puede deshacer.\n\nTip: descargá un backup antes.')) return;
    if (!confirm('¿Seguro? Se eliminarán movimientos, cuentas, presupuestos y metas.')) return;
    const keepUpdated = state.updatedAt;
    state = defaultState(); state.updatedAt = keepUpdated;
    commit('Datos borrados');
  },
  install: async () => { if (!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; render(); },
  'sync-now': async () => { await syncNow({ interactive: true }); render(); },
  'sync-off': () => { syncCfg.enabled = false; saveSyncCfg(); syncState.status = 'off'; render(); toast('Sincronización desactivada'); },
};
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = actions[el.dataset.action];
  if (fn) { e.preventDefault(); fn(el.dataset, el, e); }
});

function exportCsv(scope) {
  let txs = state.transactions.slice();
  if (scope === 'filtered') {
    const f = ui.filters;
    txs = txInMonth(ui.month).filter((t) => (!f.type || t.type === f.type) && (!f.account || t.accountId === f.account || t.toAccountId === f.account) && (!f.category || t.categoryId === f.category || cat(t.categoryId)?.parentId === f.category));
  }
  sortTx(txs);
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const num = (n) => String(n).replace('.', ',');
  const head = ['Fecha', 'Tipo', 'Monto', 'Moneda', `Monto en ${state.settings.currency}`, 'Cuenta', 'Cuenta destino', 'Categoría', 'Subcategoría', 'Descripción', 'Etiquetas', 'Cuota'];
  const rows = txs.map((t) => {
    const c = cat(t.categoryId); const p = c?.parentId ? cat(c.parentId) : null;
    return [t.date, TX_TYPES[t.type], num(t.amount), txCurrency(t), num(round2(txMain(t))), acc(t.accountId)?.name, acc(t.toAccountId)?.name || '', p ? p.name : c?.name || '', p ? c.name : '', t.note, (t.tags || []).join(' '), t.installment ? `${t.installment.n}/${t.installment.total}` : ''].map(q).join(';');
  });
  download(`movimientos-${scope === 'filtered' ? ui.month : today()}.csv`, '﻿' + [head.map(q).join(';'), ...rows].join('\r\n'), 'text/csv;charset=utf-8');
}

// ============================================================ Datos de ejemplo
function loadDemo() {
  const A = (type, cur) => state.accounts.find((a) => a.type === type && a.currency === cur)?.id || state.accounts[0].id;
  const C = (name) => state.categories.find((c) => c.name === name)?.id;
  const bank = A('bank', 'ARS'), cash = A('cash', 'ARS'), card = A('credit', 'ARS'), wallet = A('wallet', 'ARS'), usd = A('cash', 'USD');
  state.accounts.find((a) => a.id === bank).initial = 850000;
  state.accounts.find((a) => a.id === cash).initial = 450000;
  state.accounts.find((a) => a.id === wallet).initial = 300000;
  state.accounts.find((a) => a.id === usd).initial = 1200;
  const cardAcc = state.accounts.find((a) => a.id === card); cardAcc.limit = 2500000;
  const rnd = (a, b) => Math.round((a + Math.random() * (b - a)) / 100) * 100;
  const t0 = today();
  const push = (type, amount, accountId, categoryId, date, note = '', extra = {}) => {
    if (date > t0) return;
    state.transactions.push({ id: uid(), type, amount, accountId, categoryId, date, note, tags: [], createdAt: Date.now() + state.transactions.length, ...extra });
  };
  for (let i = 4; i >= 0; i--) {
    const mk = shiftMonth(monthKey(t0), -i);
    push('income', 1850000, bank, C('Sueldo mensual'), `${mk}-01`, 'Sueldo');
    push('income', rnd(200000, 450000), wallet, C('Freelance / Honorarios'), `${mk}-12`, 'Proyecto freelance');
    push('expense', 520000, bank, C('Alquiler'), `${mk}-05`, 'Alquiler depto');
    push('expense', 95000, bank, C('Expensas'), `${mk}-08`);
    push('expense', rnd(25000, 40000), bank, C('Luz'), `${mk}-14`);
    push('expense', rnd(12000, 22000), bank, C('Gas'), `${mk}-16`);
    push('expense', 28000, card, C('Internet'), `${mk}-10`);
    push('expense', 18500, card, C('Celular'), `${mk}-11`);
    push('expense', 145000, bank, C('Prepaga / Obra social'), `${mk}-03`);
    push('expense', 16999, card, C('Streaming'), `${mk}-15`, 'Netflix + Spotify', { tags: ['suscripciones'] });
    push('expense', 38000, card, C('Gimnasio'), `${mk}-02`);
    for (const d of ['04', '11', '18', '25']) push('expense', rnd(45000, 90000), d === '18' ? cash : card, C('Supermercado'), `${mk}-${d}`, 'Compra semanal');
    for (const d of ['06', '13', '20', '27']) push('expense', rnd(12000, 38000), wallet, C(['Delivery', 'Restaurantes', 'Café', 'Bares'][Number(d) % 4]), `${mk}-${d}`);
    for (const d of ['07', '21']) push('expense', rnd(35000, 55000), card, C('Combustible'), `${mk}-${d}`);
    push('expense', rnd(8000, 15000), wallet, C('Transporte público'), `${mk}-09`, 'Carga SUBE');
    push('expense', rnd(10000, 30000), cash, C('Farmacia'), `${mk}-19`);
    push('expense', 58000, wallet, C('Monotributo'), `${mk}-20`);
    if (i > 0) push('transfer', 0, bank, undefined, `${mk}-26`, 'Pago resumen tarjeta', { toAccountId: card });
  }
  // pagos de tarjeta = gastos con tarjeta del mes anterior (aprox.)
  state.transactions.filter((t) => t.type === 'transfer' && t.amount === 0).forEach((t) => {
    const mk = shiftMonth(monthKey(t.date), -1);
    const v = round2(sum(state.transactions.filter((x) => x.type === 'expense' && x.accountId === card && x.date.startsWith(mk)), (x) => x.amount));
    t.amount = v || 100000; t.toAmount = t.amount;
  });
  const groupId = uid();
  const start = addMonths(t0, -2);
  for (let i = 0; i < 6; i++) push('expense', 75000, card, C('Electrodomésticos'), addMonths(start, i), 'Heladera', { installment: { n: i + 1, total: 6, groupId } });
  push('expense', 350, usd, C('Pasajes'), addDays(t0, -40), 'Vuelo vacaciones', { tags: ['vacaciones'] });
  push('expense', 420, usd, C('Alojamiento'), addDays(t0, -38), 'Hotel', { tags: ['vacaciones'] });
  state.transactions.forEach((t) => { if (t.type === 'transfer' && t.toAmount == null) t.toAmount = t.amount; });
  state.budgets = [
    { id: uid(), categoryId: C('Supermercado'), amount: 300000 },
    { id: uid(), categoryId: C('Comida y salidas'), amount: 90000 },
    { id: uid(), categoryId: C('Transporte'), amount: 120000 },
    { id: uid(), categoryId: C('Suscripciones'), amount: 60000 },
  ];
  state.goals = [
    { id: uid(), name: 'Fondo de emergencia', icon: '🛟', target: 3000, saved: 1200, currency: 'USD', deadline: addMonths(t0, 10), color: '#10b981', history: [] },
    { id: uid(), name: 'Vacaciones de verano', icon: '🏖️', target: 1500000, saved: 450000, currency: 'ARS', deadline: addMonths(t0, 4), color: '#f59e0b', history: [] },
  ];
  const nextOf = (day) => { let d = `${monthKey(t0)}-${pad(day)}`; if (d <= t0) d = addMonths(d, 1); return d; };
  state.recurring = [
    { id: uid(), freq: 'monthly', day: 1, nextDate: nextOf(1), active: true, template: { type: 'income', amount: 1850000, accountId: bank, categoryId: C('Sueldo mensual'), note: 'Sueldo', tags: [] } },
    { id: uid(), freq: 'monthly', day: 5, nextDate: nextOf(5), active: true, template: { type: 'expense', amount: 520000, accountId: bank, categoryId: C('Alquiler'), note: 'Alquiler depto', tags: [] } },
    { id: uid(), freq: 'monthly', day: 15, nextDate: nextOf(15), active: true, template: { type: 'expense', amount: 16999, accountId: card, categoryId: C('Streaming'), note: 'Netflix + Spotify', tags: ['suscripciones'] } },
  ];
  if (!state.settings.name) state.settings.name = '';
}

// ============================================================ Sincronización
let syncCfg = (() => { try { return JSON.parse(localStorage.getItem(SYNC_KEY)) || {}; } catch { return {}; } })();
const syncState = { status: syncCfg.enabled ? 'idle' : 'off', message: '', timer: null, busy: false, last: 0 };
function saveSyncCfg() { try { localStorage.setItem(SYNC_KEY, JSON.stringify(syncCfg)); } catch { /* sin almacenamiento */ } }
function syncStatusText() {
  if (!syncCfg.enabled) return 'Sincronización desactivada.';
  if (syncState.status === 'error') return '⚠️ ' + syncState.message;
  if (syncState.busy) return 'Sincronizando…';
  return syncState.last ? `✓ Sincronizado ${new Date(syncState.last).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}` : 'Activada.';
}
function renderSyncIndicator() {
  const el = $('#sync-indicator');
  if (!syncCfg.enabled) { el.hidden = true; return; }
  el.hidden = false;
  el.className = 'sync-pill ' + (syncState.status === 'error' ? 'err' : syncState.busy ? '' : 'ok');
  el.textContent = syncState.status === 'error' ? '⚠︎ Sin sincronizar' : syncState.busy ? '⟳ Sincronizando' : '☁︎ Sincronizado';
  el.title = syncStatusText();
}
async function syncApi(method, body) {
  const r = await fetch('/api/sync', {
    method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + syncCfg.password },
    body: body ? JSON.stringify(body) : undefined, cache: 'no-store',
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(j.error || `Error ${r.status}`); e.status = r.status; throw e; }
  return j;
}
function scheduleSync() {
  if (!syncCfg.enabled) return;
  clearTimeout(syncState.timer);
  syncState.timer = setTimeout(() => syncNow(), 1500);
}
async function push(force = false) {
  const res = await syncApi('PUT', { data: state, baseUpdatedAt: syncCfg.remoteUpdatedAt || 0, force });
  syncCfg.remoteUpdatedAt = res.updatedAt; syncCfg.lastLocalSyncedAt = state.updatedAt; saveSyncCfg();
}
function applyRemote(remote) {
  state = migrate(remote.data);
  persist(); indexCats();
  syncCfg.remoteUpdatedAt = remote.updatedAt; syncCfg.lastLocalSyncedAt = state.updatedAt; saveSyncCfg();
  if (processRecurring()) { state.updatedAt = Date.now(); persist(); }
  Object.keys(fmtCache).forEach((k) => delete fmtCache[k]);
}
/** Trae cambios de la nube y/o sube los locales. Si ambos cambiaron, pregunta. */
async function syncNow({ interactive = false } = {}) {
  if (!syncCfg.enabled || !syncCfg.password || syncState.busy) return;
  if (!navigator.onLine) { syncState.status = 'error'; syncState.message = 'Sin conexión. Se sincronizará al volver.'; renderSyncIndicator(); return; }
  syncState.busy = true; renderSyncIndicator();
  try {
    const remote = await syncApi('GET');
    const remoteChanged = remote.updatedAt && remote.updatedAt !== syncCfg.remoteUpdatedAt;
    const localChanged = state.updatedAt !== (syncCfg.lastLocalSyncedAt || 0);
    if (!remote.data) await push(true);
    else if (remoteChanged && !localChanged) { applyRemote(remote); render(); if (interactive) toast('Datos actualizados desde la nube'); }
    else if (remoteChanged && localChanged) {
      const neverSynced = !syncCfg.remoteUpdatedAt;
      const useCloud = confirm(neverSynced
        ? `Ya hay datos en la nube (${remote.data.transactions?.length || 0} movimientos).\n\nAceptar: usar los datos de la nube en este dispositivo.\nCancelar: reemplazar la nube con los datos de este dispositivo (${state.transactions.length} movimientos).`
        : 'Hubo cambios en este dispositivo y en otro a la vez.\n\nAceptar: quedarse con la versión de la nube.\nCancelar: quedarse con la de este dispositivo.');
      if (useCloud) { applyRemote(remote); render(); } else await push(true);
    } else if (localChanged) await push(false);
    syncState.status = 'idle'; syncState.message = ''; syncState.last = Date.now();
    if (interactive) toast('✓ Sincronizado');
  } catch (e) {
    syncState.status = 'error';
    syncState.message = e.status === 409 ? 'Conflicto, reintentando…' : e.message;
    if (e.status === 409) { syncState.busy = false; syncCfg.remoteUpdatedAt = -1; return syncNow({ interactive }); }
    if (interactive) toast(e.message, 3500);
  } finally {
    syncState.busy = false; renderSyncIndicator();
    if ($('#sync-form')) { const el = $('#sync-form .full.small'); if (el) { el.textContent = syncStatusText(); el.className = 'full small ' + (syncState.status === 'error' ? 'expense' : 'muted'); } }
  }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { if (processRecurring()) commit(); else syncNow(); } });
window.addEventListener('online', () => syncNow());

// ============================================================ Tema, PWA e inicio
function applyTheme() {
  let t = null;
  try { t = localStorage.getItem(THEME_KEY); } catch { /* sin almacenamiento */ }
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
  $('meta[name=theme-color]').content = t === 'dark' ? '#0b1220' : '#f4f6fa';
}
let installPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; if (ui.route === 'ajustes') render(); });
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
ui.route = location.hash.replace(/^#\/?/, '') || 'inicio';
if (processRecurring()) { state.updatedAt = Date.now(); persist(); }
render();
syncNow();

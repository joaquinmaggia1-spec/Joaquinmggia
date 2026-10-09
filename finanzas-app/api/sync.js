// Sincronización opcional entre dispositivos (PC <-> celular).
// Guarda todo el estado de la app como un único documento JSON en Upstash Redis
// (disponible en Vercel > Storage > Marketplace > "Upstash for Redis").
//
// Variables de entorno necesarias en Vercel:
//   APP_PASSWORD                                   contraseña que vas a escribir en la app
//   KV_REST_API_URL / KV_REST_API_TOKEN            (las crea Vercel al conectar Upstash)
//   o bien UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
import crypto from 'node:crypto';

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PASSWORD = process.env.APP_PASSWORD;
const KEY = 'finanzas:state';
const PREV_KEY = 'finanzas:state:prev';

async function redis(command) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || `Redis HTTP ${r.status}`);
  return j.result;
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!PASSWORD || !REDIS_URL || !REDIS_TOKEN) {
    return res.status(503).json({
      configured: false,
      error: 'La sincronización no está configurada en Vercel (faltan APP_PASSWORD y/o la base Upstash Redis).',
    });
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !safeEqual(token, PASSWORD)) {
    await new Promise((r) => setTimeout(r, 600)); // frena intentos por fuerza bruta
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  try {
    if (req.method === 'GET') {
      const raw = await redis(['GET', KEY]);
      return res.status(200).json(raw ? JSON.parse(raw) : { data: null, updatedAt: 0 });
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      if (!body.data || typeof body.data !== 'object') {
        return res.status(400).json({ error: 'Datos inválidos' });
      }
      const raw = await redis(['GET', KEY]);
      const current = raw ? JSON.parse(raw) : null;
      if (current && !body.force && body.baseUpdatedAt !== current.updatedAt) {
        return res.status(409).json({ error: 'conflict', updatedAt: current.updatedAt });
      }
      const updatedAt = Date.now();
      if (raw) await redis(['SET', PREV_KEY, raw]); // copia de la versión anterior por las dudas
      await redis(['SET', KEY, JSON.stringify({ data: body.data, updatedAt })]);
      return res.status(200).json({ updatedAt });
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    return res.status(500).json({ error: 'Error del servidor: ' + e.message });
  }
}

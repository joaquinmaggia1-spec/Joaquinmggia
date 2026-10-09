// Sincronización en la nube para Mis Finanzas (función serverless de Vercel).
// Guarda todos los datos en Upstash Redis. Variables de entorno necesarias:
//   SYNC_PASSWORD                         → la clave que vas a escribir en cada dispositivo
//   KV_REST_API_URL / KV_REST_API_TOKEN   → las agrega solas la integración de Upstash en Vercel
//   (también acepta UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)
const crypto = require('crypto');

const KEY = 'misfinanzas:state';
const VER = 'misfinanzas:version';
const MAX_FAILS = 10;          // intentos con clave incorrecta antes de bloquear
const LOCK_SECONDS = 15 * 60;  // por 15 minutos

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Guarda solo si nadie más guardó desde la versión que leyó el cliente (evita pisar datos).
const SAVE_IF_UNCHANGED = `
if (redis.call('GET', KEYS[2]) or '') ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], ARGV[2])
redis.call('SET', KEYS[2], ARGV[3])
return 1`;

async function redis(...command) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function sameSecret(a, b) {
  const h = s => crypto.createHash('sha256').update(String(s)).digest();
  return crypto.timingSafeEqual(h(a), h(b));
}

module.exports = async function handler(req, res) {
  const password = process.env.SYNC_PASSWORD;
  if (!REDIS_URL || !REDIS_TOKEN || !password) {
    return send(res, 503, {
      error: 'not_configured',
      missing: [!password && 'SYNC_PASSWORD', !REDIS_URL && 'KV_REST_API_URL', !REDIS_TOKEN && 'KV_REST_API_TOKEN'].filter(Boolean),
    });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const failKey = `misfinanzas:fail:${ip}`;

  try {
    if ((Number(await redis('GET', failKey)) || 0) >= MAX_FAILS) return send(res, 429, { error: 'too_many_attempts' });

    if (!sameSecret(req.headers['x-sync-key'] || '', password)) {
      await redis('INCR', failKey);
      await redis('EXPIRE', failKey, LOCK_SECONDS);
      return send(res, 401, { error: 'unauthorized' });
    }

    if (req.method === 'GET') {
      const [raw, version] = await redis('MGET', KEY, VER); // lectura atómica de datos + versión
      return send(res, 200, { data: raw ? JSON.parse(raw) : null, version: version || '' });
    }

    if (req.method === 'PUT') {
      const body = await readBody(req);
      if (!body || typeof body.data !== 'object' || !Array.isArray(body.data?.txs)) return send(res, 400, { error: 'bad_request' });
      const version = Date.now().toString(36) + crypto.randomBytes(4).toString('hex');
      const ok = await redis('EVAL', SAVE_IF_UNCHANGED, 2, KEY, VER, String(body.baseVersion || ''), JSON.stringify(body.data), version);
      if (!ok) return send(res, 409, { error: 'conflict' });
      return send(res, 200, { version });
    }

    res.setHeader('Allow', 'GET, PUT');
    return send(res, 405, { error: 'method_not_allowed' });
  } catch (e) {
    console.error('sync error:', e.message);
    return send(res, 500, { error: 'server_error' });
  }
};

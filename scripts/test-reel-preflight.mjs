// Pruebas de la verificación previa de generaciones de reels.
// Ejecutar: node scripts/test-reel-preflight.mjs
import assert from 'node:assert/strict';
import { validateReelVideoPayload, assertReelVideoPayload } from '../lib/reelVideoPreflight.js';

const valid = {
  model: 'seedance_2_5',
  mode: 'omni_reference',
  generate_audio: true,
  duration: 10,
  resolution: '1080p',
  aspect_ratio: '9:16',
  prompt: 'Plano vertical de producto',
  medias: [
    { role: 'image_references', value: '11111111-1111-4111-8111-111111111111' },
    { role: 'audio_references', value: '22222222-2222-4222-8222-222222222222' },
  ],
};

// Caso válido
assert.deepEqual(validateReelVideoPayload(valid), []);
assert.equal(assertReelVideoPayload(valid), valid);

// Sin audio de referencia
assert.ok(validateReelVideoPayload({ ...valid, medias: [valid.medias[0]] })
  .some((e) => e.includes('falta el audio de referencia')));

// Audio como URL en vez de media_id
assert.ok(validateReelVideoPayload({
  ...valid,
  medias: [{ role: 'audio_references', value: 'https://example.com/a.mp3' }],
}).some((e) => e.includes('media_id confirmado')));

// generate_audio false o ausente
assert.ok(validateReelVideoPayload({ ...valid, generate_audio: false })
  .some((e) => e.includes('generate_audio')));
const { generate_audio, ...noAudioFlag } = valid;
assert.ok(validateReelVideoPayload(noAudioFlag).some((e) => e.includes('generate_audio')));

// Modo distinto de omni_reference
assert.ok(validateReelVideoPayload({ ...valid, mode: 't2v' })
  .some((e) => e.includes('omni_reference')));

// Modelo incorrecto
assert.ok(validateReelVideoPayload({ ...valid, model: 'kling3_0' })
  .some((e) => e.includes('seedance_2_5')));

// assert lanza excepción con el detalle
assert.throws(() => assertReelVideoPayload({ ...valid, generate_audio: false }),
  /Generación de reel rechazada/);

console.log('OK: 7 grupos de pruebas de la verificación de reels pasaron');

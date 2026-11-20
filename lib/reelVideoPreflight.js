// Verificación previa al envío de generaciones de video para reels.
//
// Regla del proyecto: todo video de reel se genera con un AUDIO DE REFERENCIA
// subido (medias con rol "audio_references") y con generate_audio en true.
// Esta función valida el payload antes de llamar a Higgsfield y devuelve la
// lista de errores; si está vacía, el payload cumple la regla.

export const VIDEO_MODEL = 'seedance_2_5';
export const REQUIRED_MODE = 'omni_reference';
export const AUDIO_ROLE = 'audio_references';

/**
 * @param {object} payload  Objeto `params` que se enviará a generate_video.
 * @returns {string[]} errores (vacío = válido)
 */
export function validateReelVideoPayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') {
    return ['El payload no es un objeto'];
  }

  if (payload.model !== VIDEO_MODEL) {
    errors.push(`model debe ser "${VIDEO_MODEL}" (recibido: "${payload.model}")`);
  }

  // Las referencias de audio solo son válidas en omni_reference.
  if (payload.mode !== REQUIRED_MODE) {
    errors.push(`mode debe ser "${REQUIRED_MODE}" (recibido: "${payload.mode}")`);
  }

  // generate_audio debe estar explícitamente en true (no basta con el valor por defecto).
  if (payload.generate_audio !== true) {
    errors.push('generate_audio debe ser true explícitamente');
  }

  const medias = Array.isArray(payload.medias) ? payload.medias : [];
  const audioRefs = medias.filter((m) => m && m.role === AUDIO_ROLE);
  if (audioRefs.length === 0) {
    errors.push(`falta el audio de referencia: añade un media con role "${AUDIO_ROLE}"`);
  }
  for (const ref of audioRefs) {
    // Debe ser un media_id/job_id ya confirmado, no una URL.
    if (!ref.value || /^https?:\/\//i.test(ref.value)) {
      errors.push('el audio de referencia debe ser un media_id confirmado (no una URL)');
    }
  }

  return errors;
}

/**
 * Lanza un error si el payload no cumple la regla. Úsalo justo antes de generar.
 */
export function assertReelVideoPayload(payload) {
  const errors = validateReelVideoPayload(payload);
  if (errors.length > 0) {
    throw new Error(`Generación de reel rechazada:\n- ${errors.join('\n- ')}`);
  }
  return payload;
}

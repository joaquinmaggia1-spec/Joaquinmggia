# Flujo de generación con IA para reels

Este documento define qué modelos usamos para generar imágenes y videos de los reels,
las reglas obligatorias del audio de referencia y cómo se verifica cada generación.

## 1. Plataforma y modelos

Todas las generaciones se hacen a través de **Higgsfield** (MCP `Higgsfield`).

| Uso | Plataforma | Modelo (ID en Higgsfield) | Proveedor |
|-----|------------|---------------------------|-----------|
| Imágenes | Higgsfield | `gpt_image_2_6` (GPT Image 2.6) | OpenAI |
| Videos | Higgsfield | `seedance_2_5` (Seedance 2.5) | ByteDance |
| Guiones y prompts | ChatGPT | — (redacción de prompts, no genera el archivo final) | OpenAI |

> Interpretación del requisito: "Image 2" se implementa con GPT Image 2.6 y "Sedance 2.5"
> con Seedance 2.5, ambos disponibles en Higgsfield. Los prompts se redactan con ChatGPT y
> se pegan en Higgsfield. Si la intención era otra, hay que corregir esta tabla.

Parámetros verificados en el catálogo de Higgsfield (`models_explore`):

- **GPT Image 2.6**: `quality`, `resolution` (1k/2k/4k), `output_format` (png, jpeg, webp,
  gif, svg), `aspect_ratio` (incluye 9:16), hasta 16 imágenes de referencia.
- **Seedance 2.5**: `mode` (`t2v`, `omni_reference`, `video_edit`, `video_extension`),
  `duration` (4–30 s), `resolution` (480p, 720p, 1080p, 4k), **`generate_audio`** (por defecto
  `true`), `aspect_ratio` (incluye 9:16). Roles de medios: `start_image`, `end_image`,
  `image_references`, `video_references`, **`audio_references`** (máx. 10).

## 2. Reglas obligatorias

### 2.1 Todo video lleva audio de referencia

Cada video de reel se genera con **un audio de referencia subido** en el rol
`audio_references`. No se permite generar un video sin esa referencia.

### 2.2 Modo y generación de audio en `true`

Para que el audio de referencia se use, la generación debe cumplir:

| Campo | Valor obligatorio |
|-------|-------------------|
| `model` | `seedance_2_5` |
| `mode` | `omni_reference` (el rol `audio_references` solo funciona en este modo) |
| `generate_audio` | `true` (explícito, no confiar en el valor por defecto) |
| `medias` | incluye un elemento con `role: "audio_references"` y `value` = media_id confirmado |

### 2.3 Cómo se verifica

La verificación tiene dos momentos.

**Antes de enviar** (obligatoria): el payload se valida con `lib/reelVideoPreflight.js`.
Si falta algo, la generación se bloquea y se devuelve la lista de errores.

```js
import { assertReelVideoPayload } from './lib/reelVideoPreflight.js';

const params = assertReelVideoPayload({
  model: 'seedance_2_5',
  mode: 'omni_reference',
  generate_audio: true,
  duration: 10,
  resolution: '1080p',
  aspect_ratio: '9:16',
  prompt: '...',
  medias: [
    { role: 'image_references', value: '<media_id de la imagen>' },
    { role: 'audio_references', value: '<media_id del audio>' },
  ],
});
// Después, llamar a generate_video con { params }
```

Pasos previos del audio:

1. Subir el archivo de audio con `media_upload`, subirlo con `curl PUT` a la `upload_url` y
   confirmarlo con `media_confirm`. Si el archivo no es legible, usar `media_upload_widget`.
2. Usar el `media_id` devuelto. Nunca una URL.

**Después de generar** (obligatoria): al terminar el job, confirmar con `jobs_wait` que:

- El job terminó en estado correcto (no `failed` ni `nsfw`).
- El video resultante tiene pista de audio (`ffprobe` debe listar un stream `audio`).
- La generación registrada tiene `generate_audio: true` y el audio de referencia adjunto.

Comprobación local del archivo descargado:

```bash
ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 reels/media/video.mp4
```

Si no devuelve ningún códec de audio, el video no cumple y no se usa en el reel.

## 3. Flujo resumido

1. Redactar el guion y los prompts (ChatGPT).
2. Generar la imagen con `gpt_image_2_6` (Higgsfield), formato 9:16 para reels.
3. Preparar el audio de referencia y subirlo (`media_upload` → PUT → `media_confirm`).
4. Validar el payload con `assertReelVideoPayload`.
5. Estimar costo (`estimate_video_cost`) y generar el video con `seedance_2_5`, `mode: omni_reference`.
6. Esperar con `jobs_wait` y verificar audio con `ffprobe`.
7. Montar el reel final con ffmpeg (ver `docs/HERRAMIENTAS_REELS.md`).

## 4. Pruebas

```bash
node scripts/test-reel-preflight.mjs
```

## 5. Costos y límites

- Antes de cada video, estimar el costo con `estimate_video_cost`. No lanzar generaciones
  sin confirmar el costo con el usuario.
- Duración máxima en Seedance 2.5: 30 s. Para reels, usar 4–15 s por clip y unir con ffmpeg.

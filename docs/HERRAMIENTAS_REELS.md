# Herramientas para generar reels con IA

Este documento describe las herramientas que usa el proyecto para producir reels,
cómo instalarlas, cómo comprobar que funcionan y cómo usarlas.

## 1. Herramientas

| Herramienta | Para qué sirve en el pipeline | Versión probada | Verificación |
|-------------|-------------------------------|-----------------|--------------|
| **ffmpeg** (incluye `ffprobe`) | Recortar, escalar a formato vertical 9:16, unir clips, añadir audio y subtítulos, renderizar el video final | 6.1.1 | `ffmpeg -version` |
| **yt-dlp** | Descargar videos o audio desde las fuentes que se indiquen | 2026.10.26 | `yt-dlp --version` |

Requisitos de codecs de ffmpeg: `libx264` (video H.264) y `aac` (audio). El filtro
`ass`/`subtitles` (para subtítulos quemados) y `drawtext` (texto en pantalla) también
son útiles y vienen en la mayoría de las compilaciones.

> Nota: yt-dlp se actualiza con frecuencia porque las plataformas cambian sus
> sitios. Si una descarga falla de repente, lo primero es actualizarlo (ver §5).

## 2. Instalación

### Automática (recomendada)

Desde la raíz del proyecto:

```bash
bash scripts/setup-tools.sh
```

El script:

1. Comprueba si `ffmpeg`/`ffprobe` existen y tienen `libx264` y `aac`. Si no, los instala
   (`apt-get`, `brew` o `dnf`, según el sistema).
2. Comprueba si `yt-dlp` existe. Si no, lo instala con `pip` (o `brew`/`pipx`).
3. Renderiza un clip de prueba 9:16 con audio para confirmar que ffmpeg funciona de verdad.

Es idempotente: si todo está instalado, no cambia nada.

Para **solo verificar** sin instalar nada:

```bash
bash scripts/setup-tools.sh --check
```

También hay atajos en `package.json`:

```bash
npm run tools:check    # solo verifica
npm run tools:setup    # instala lo que falte y verifica
```

El script devuelve código de salida `0` si todo está listo y `1` si algo falta.

### Manual

**Linux (Debian/Ubuntu):**

```bash
sudo apt-get update && sudo apt-get install -y ffmpeg
python3 -m pip install -U yt-dlp
```

**macOS (Homebrew):**

```bash
brew install ffmpeg yt-dlp
```

**Windows:** instala ffmpeg desde <https://www.gyan.dev/ffmpeg/builds/> (añade la carpeta
`bin` al `PATH`) e instala yt-dlp con `winget install yt-dlp.yt-dlp` o `pip install -U yt-dlp`.

## 3. Verificación manual

```bash
ffmpeg -version | head -1
ffprobe -version | head -1
ffmpeg -hide_banner -encoders | grep -E "libx264|aac"
yt-dlp --version
```

## 4. Estructura de carpetas de medios

Los archivos de medios no se versionan en git. Las carpetas siguientes están
ignoradas en `.gitignore`:

```
reels/
└── media/          # descargas y renders intermedios y finales (ignorada por git)
```

Crea la carpeta cuando la necesites: `mkdir -p reels/media`.

## 5. Uso básico

### 5.1 Descargar un video con yt-dlp

```bash
yt-dlp -f "bv*[height<=1920]+ba/b" --merge-output-format mp4 \
  -o "reels/media/%(id)s.%(ext)s" "URL_DEL_VIDEO"
```

Solo audio:

```bash
yt-dlp -x --audio-format mp3 -o "reels/media/%(id)s.%(ext)s" "URL_DEL_VIDEO"
```

Actualizar yt-dlp:

```bash
yt-dlp -U                       # si se instaló como binario
python3 -m pip install -U yt-dlp  # si se instaló con pip
```

> Descarga solo contenido sobre el que tengas derechos o permiso de uso. Revisa los
> términos de cada plataforma.

### 5.2 Convertir a formato vertical 9:16 (1080×1920)

Para un video horizontal (16:9), escala a alto 1920 y recorta el centro:

```bash
ffmpeg -i reels/media/entrada.mp4 \
  -vf "scale=-2:1920,crop=1080:1920" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  reels/media/salida_9x16.mp4
```

### 5.3 Recortar un fragmento (por ejemplo, 15 segundos desde el segundo 5)

```bash
ffmpeg -ss 5 -i reels/media/entrada.mp4 -t 15 -c copy reels/media/corte.mp4
```

Para un corte preciso al cuadro, usa `-c:v libx264 -c:a aac` en lugar de `-c copy`.

### 5.4 Añadir subtítulos quemados (SRT)

```bash
ffmpeg -i reels/media/salida_9x16.mp4 -vf "subtitles=reels/media/subs.srt" \
  -c:a copy reels/media/final.mp4
```

### 5.5 Inspeccionar un archivo

```bash
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height \
  -of default=nw=1 reels/media/salida_9x16.mp4
```

## 6. Solución de problemas

**`ffmpeg: command not found` tras instalar.** Abre una terminal nueva o revisa que la
carpeta de instalación esté en el `PATH`.

**ffmpeg no tiene `libx264`.** Instala una compilación completa (en apt, el paquete
`ffmpeg` de Ubuntu/Debian ya la incluye; en Windows usa una build `full`).

**`yt-dlp` falla con `Requested format is not available` o errores de extracción.**
Actualiza yt-dlp; es la causa más común.

**yt-dlp o la instalación devuelven `403 Forbidden` del proxy
(`agent proxy: no rule or network setting allows this host`).** Es una restricción de
red del entorno, no un fallo de la herramienta. El host bloqueado debe añadirse a la lista
de dominios permitidos del entorno en la configuración de la sesión (o cambiar el nivel de
acceso de red). Mientras tanto, las descargas de ese sitio no funcionarán, aunque ffmpeg sí
funciona con archivos locales.

**`pip install` falla con `externally-managed-environment`.** Usa un entorno virtual
(`python3 -m venv .venv && . .venv/bin/activate && pip install -U yt-dlp`) o instala con
`pipx install yt-dlp`.

**El script dice que la prueba funcional falló.** Ejecuta
`ffmpeg -hide_banner -encoders | grep -E "libx264|aac"` para ver qué codec falta.

## 7. Mantenimiento

- Ejecuta `npm run tools:check` antes de empezar a trabajar en una sesión nueva.
- Actualiza yt-dlp de forma periódica (al menos cada pocas semanas).
- Si cambias una versión de herramienta, actualiza la tabla de la sección 1.

#!/usr/bin/env bash
# =============================================================================
# setup-tools.sh — Instala y verifica las herramientas del pipeline de reels.
#
# Herramientas:
#   - ffmpeg / ffprobe  → edición y renderizado de video
#   - yt-dlp            → descarga de videos/audio de fuentes
#
# Uso:
#   bash scripts/setup-tools.sh           # instala lo que falte y verifica
#   bash scripts/setup-tools.sh --check   # solo verifica, no instala
#
# Es idempotente: si todo está instalado, no cambia nada.
# Documentación completa: docs/HERRAMIENTAS_REELS.md
# =============================================================================
set -euo pipefail

CHECK_ONLY=0
if [[ "${1:-}" == "--check" ]]; then
  CHECK_ONLY=1
fi

# Versión mínima de ffmpeg requerida (para filtros modernos como xfade/drawtext)
FFMPEG_MIN_MAJOR=4

ok()   { printf '  \033[32m✔\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
err()  { printf '  \033[31m✘\033[0m %s\n' "$*"; }
step() { printf '\n\033[1m%s\033[0m\n' "$*"; }

OS="$(uname -s)"
SUDO=""
if [[ "$(id -u)" -ne 0 ]] && command -v sudo >/dev/null 2>&1; then
  SUDO="sudo"
fi

have() { command -v "$1" >/dev/null 2>&1; }

# ---------------------------------------------------------------------------
# ffmpeg / ffprobe
# ---------------------------------------------------------------------------
check_ffmpeg() {
  have ffmpeg && have ffprobe || return 1
  local major
  major="$(ffmpeg -version 2>/dev/null | head -1 | sed -E 's/^ffmpeg version n?([0-9]+).*/\1/')"
  [[ "$major" =~ ^[0-9]+$ ]] || return 1
  (( major >= FFMPEG_MIN_MAJOR )) || return 1
  # Se guarda la salida en una variable: con "set -o pipefail", un "grep -q"
  # dentro de una tubería haría fallar la comprobación por SIGPIPE.
  local encoders
  encoders="$(ffmpeg -hide_banner -encoders 2>/dev/null)"
  grep -q 'libx264' <<<"$encoders" || return 1
  grep -qE '[[:space:]]aac[[:space:]]' <<<"$encoders" || return 1
  return 0
}

install_ffmpeg() {
  if have apt-get; then
    $SUDO apt-get update -y
    $SUDO apt-get install -y ffmpeg
  elif have brew; then
    brew install ffmpeg
  elif have dnf; then
    $SUDO dnf install -y ffmpeg
  else
    err "No encuentro un gestor de paquetes conocido (apt-get, brew, dnf)."
    err "Instala ffmpeg manualmente: https://ffmpeg.org/download.html"
    return 1
  fi
}

# ---------------------------------------------------------------------------
# yt-dlp
# ---------------------------------------------------------------------------
check_ytdlp() {
  have yt-dlp && yt-dlp --version >/dev/null 2>&1
}

install_ytdlp() {
  # pip es la vía recomendada por el proyecto yt-dlp: permite actualizar fácil
  if have python3 && python3 -m pip --version >/dev/null 2>&1; then
    python3 -m pip install -U yt-dlp || python3 -m pip install -U --user yt-dlp
  elif have brew; then
    brew install yt-dlp
  elif have pipx; then
    pipx install yt-dlp
  else
    err "Necesitas python3 con pip, brew o pipx para instalar yt-dlp."
    return 1
  fi
}

# ---------------------------------------------------------------------------
# Prueba funcional: render real de un clip 9:16 con audio
# ---------------------------------------------------------------------------
smoke_test_ffmpeg() {
  local tmp
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' RETURN
  if ffmpeg -hide_banner -loglevel error -y \
      -f lavfi -i "testsrc=duration=1:size=1080x1920:rate=30" \
      -f lavfi -i "sine=frequency=440:duration=1" \
      -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest \
      "$tmp/test.mp4" \
    && ffprobe -v error -show_entries format=duration -of csv=p=0 "$tmp/test.mp4" >/dev/null; then
    return 0
  fi
  return 1
}

# ---------------------------------------------------------------------------
# Flujo principal
# ---------------------------------------------------------------------------
FAILED=0

step "1/2 ffmpeg / ffprobe"
if check_ffmpeg; then
  ok "ffmpeg $(ffmpeg -version | head -1 | awk '{print $3}') listo (libx264 + aac)"
elif (( CHECK_ONLY )); then
  err "ffmpeg no está instalado o le faltan codecs (libx264/aac)"
  FAILED=1
else
  warn "ffmpeg no encontrado o incompleto. Instalando…"
  if install_ffmpeg && check_ffmpeg; then
    ok "ffmpeg instalado correctamente"
  else
    err "No se pudo instalar ffmpeg"
    FAILED=1
  fi
fi

step "2/2 yt-dlp"
if check_ytdlp; then
  ok "yt-dlp $(yt-dlp --version) listo"
elif (( CHECK_ONLY )); then
  err "yt-dlp no está instalado"
  FAILED=1
else
  warn "yt-dlp no encontrado. Instalando…"
  if install_ytdlp && check_ytdlp; then
    ok "yt-dlp $(yt-dlp --version) instalado correctamente"
  else
    err "No se pudo instalar yt-dlp"
    FAILED=1
  fi
fi

if (( FAILED == 0 )) && ! (( CHECK_ONLY )); then
  step "Prueba funcional"
  if smoke_test_ffmpeg; then
    ok "ffmpeg renderiza un clip de prueba 9:16 con audio"
  else
    err "ffmpeg no pudo renderizar el clip de prueba"
    FAILED=1
  fi
fi

echo
if (( FAILED == 0 )); then
  printf '\033[32mTodas las herramientas están listas.\033[0m\n'
  exit 0
else
  printf '\033[31mHay herramientas pendientes. Revisa docs/HERRAMIENTAS_REELS.md (sección Solución de problemas).\033[0m\n'
  exit 1
fi

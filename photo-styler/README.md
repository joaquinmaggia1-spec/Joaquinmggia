# Photo Styler

App que toma las fotos que subís y te devuelve versiones **hiperrealistas**, optimizadas y listas para subir a redes sociales (feed cuadrado, feed 4:5 e historias/reels 9:16).

El look hiperreal se mantiene siempre como base. Además podés:

- Elegir entre estilos ya guardados.
- Crear tus propios estilos (nombre + descripción del mood/paleta/iluminación + imágenes de referencia).
- Escribir instrucciones extra puntuales para una foto en particular.

## Cómo funciona

1. El backend arma un prompt que combina: el estilo hiperreal base (siempre) + el estilo elegido (descripción + imágenes de referencia, si las tiene) + tus instrucciones extra.
2. Ese prompt junto con tu foto (y las referencias, si las hay) se envía a **Gemini 2.5 Flash Image** ("Nano Banana"), el modelo de Google que edita imágenes preservando el contenido original.
3. La imagen resultante se procesa con `sharp` para generar variantes optimizadas: cuadrado 1080x1080, feed vertical 1080x1350, historia/reel 1080x1920, y una versión "original" comprimida.

## Requisitos

- Node.js 18+
- Una API key de [Google AI Studio](https://aistudio.google.com/apikey) con acceso al modelo `gemini-2.5-flash-image`

## Instalación

```bash
cd photo-styler
npm install
cp .env.example .env
# Editá .env y agregá tu GEMINI_API_KEY
npm start
```

Abrí `http://localhost:3100`.

## Estructura

```
photo-styler/
├── server.js                # Servidor Express + rutas API
├── lib/
│   ├── styleManager.js      # CRUD de estilos (JSON + imágenes de referencia)
│   ├── geminiClient.js      # Arma el prompt y llama a Gemini para estilizar la foto
│   └── imageOptimizer.js    # Genera variantes optimizadas para redes con sharp
├── public/                  # Frontend (HTML/CSS/JS vanilla)
├── data/
│   ├── styles.json          # Estilos guardados (incluye el estilo base "Hiperreal")
│   └── style-refs/          # Imágenes de referencia por estilo
├── uploads/                 # (runtime, no versionado)
└── outputs/                 # Resultados generados por job (runtime, no versionado)
```

## API

- `GET /api/styles` — Lista de estilos guardados.
- `POST /api/styles` — Crea un estilo `{ name, description }`.
- `DELETE /api/styles/:id` — Borra un estilo (el estilo base hiperreal no se puede borrar).
- `POST /api/styles/:id/reference` — Sube una imagen de referencia (`multipart/form-data`, campo `reference`).
- `POST /api/process` — Procesa una foto (`multipart/form-data`: `photo`, `styleId`, `extraInstructions`). Devuelve URLs de descarga para cada variante.
- `GET /api/download/:jobId/:filename` — Descarga un resultado generado.

## Notas

- Las fotos subidas se procesan en memoria y no quedan guardadas; solo se persisten los resultados generados en `outputs/`.
- Si Gemini no puede generar la imagen (por ejemplo, por políticas de contenido), la API devuelve un error con el detalle.

# Guía de estilo: cómo replicar los 3 reels de Pinterest

Los tres son **talking-head verticales 9:16 (720×1280, 30 fps)** con el texto animado como protagonista.
Contact sheets en esta carpeta:

| Video | Duración | Partes | Sheets |
|---|---|---|---|
| video1 (creadora con gorra NY) | 16.9 s | 2 | `contact_sheet_video1_partes.jpg`, `contact_sheet_video1_timeline.jpg` |
| video2 (creadora con micrófono) | 34.9 s | 9 | `contact_sheet_video2_partes.jpg`, `contact_sheet_video2_timeline.jpg` |
| video3 (caso McDonald's, portugués) | 115.3 s | 16 | `contact_sheet_video3_partes.jpg`, `contact_sheet_video3_timeline.jpg` |

Los clips sueltos de cada corte están en `videoN_partes/parte_XX.mp4`.

---

## ADN común (lo que tienen los tres)

1. **Plano base:** medio-corto frontal, sujeto centrado, fondo oscuro con luz cálida práctica (lámparas, estantes, plantas) y bokeh. Low-key, contraste alto, piel cálida.
2. **Subtítulos palabra por palabra en el centro del cuadro** (a la altura del pecho, no abajo), sincronizados con el audio.
3. **Jerarquía tipográfica en 2 niveles:** palabra-clave GRANDE en sans-serif bold/black + palabras de relleno chicas y finas encima o debajo ("If the **Prospects**", "maior o poder de **renegociação**").
4. **Un solo color de acento** por video, para resaltar las palabras clave.
5. **Ritmo:** cambio visual cada 2–4 s (B-roll, pantalla gráfica, punch-in o efecto). Los planos largos del presentador (14–20 s) siempre llevan texto animado para que no se caigan.
6. **Cierre** con CTA ("caption below", "share this reel") o un end-card de marca.

---

## Estilo A: "neón editorial" (video1)

- **Acento:** verde lima / amarillo neón (#D4FF3A aprox.) con glow exterior suave; el texto secundario en blanco.
- **Texto:** palabra clave enorme (casi de borde a borde), texto chico superpuesto, que entra con escala y blur.
- **Efectos:** tachado rojo sobre una palabra ("~~Content~~ is failing"), flecha/cursor dibujado, círculo-anillo luminoso que enmarca la cara, transición con barras verticales (glitch/persiana) en 4.2 s, desenfoque de movimiento en los saltos.
- **Overlays UI:** marco de cámara "● REC" con esquinas, "chips" de notificación en rojo translúcido con íconos (⚠ what to say? / ✖ how it turns to revenue?) que se apilan.
- **Edición:** casi sin cortes reales: se trabaja con punch-ins y reencuadres dentro de la misma toma (solo 1 corte duro en 6.2 s, a un plano con micrófono y cámara).

## Estilo B: "minimal rojo y blanco" (video2)

- **Acento:** rojo carmesí (#C8102E aprox.) + blanco; tipografía sans-serif heavy con **sombra paralela larga y 3D suave**.
- **Alterna** presentadora (fondo oscuro) ↔ **pantallas blancas limpias** (fondo gris perla con sombra diagonal suave) cada ~5 s, para las ideas clave: "10K", "founders, content creators", "scripting", "simple way".
- **Recursos:** bloque rojo detrás de una palabra (highlighter), número gigante 3D sobre cuadrícula fina, ícono 3D (documento con lupa), mezcla con script/manuscrita ("rewrite"), texto que entra deslizando lateralmente.
- **Subtítulo** en blanco con la palabra clave en bold; las palabras siguientes aparecen en gris semitransparente (efecto karaoke).

## Estilo C: "documental verde" (video3)

- **Acento:** verde esmeralda neón (#1FE06A aprox.) con glow, coherente con el set (pared verde, sillón verde, luces amarillas).
- **Dos tipos de texto:** (1) subtítulo base en blanco condensado bold con sombra, centrado y siempre visible; (2) palabras clave en verde neón con glow, más grandes, y texto chico en itálica.
- **B-roll de archivo tratado:** fotos históricas en B/N o color saturado con **halftone/textura de papel, grano y aberración cromática**, rayos radiales detrás de un logo, "parallax" 2.5D de fotos, ilustraciones IA estilo retro, marco de TV/pantalla curva con bordes negros.
- **Etiquetas de personaje:** nombre en verde + rol chico ("Ray Kroc / empresário").
- **Ritmo:** hook con B-roll rápido (cada 2–3 s durante los primeros 20 s), luego presentador largo con punch-ins (zoom 100→115 %) y recortes a blanco y negro para frases dramáticas.
- **Cierre:** end-card de marca sobre degradado verde con líneas diagonales (6 s).

---

## Receta para replicarlo (CapCut / Premiere / After Effects)

1. **Grabación:** 4K vertical, lente 35–50 mm, sujeto a 1–1.5 m, key light suave a 45° + luz práctica cálida al fondo, fondo a 2+ m para bokeh. Exposición para piel, fondo 2–3 stops abajo.
2. **Color:** bajar sombras, subir contraste, calentar medios y llevar las sombras hacia el color de acento (verde/teal o neutro).
3. **Corte:** eliminar silencios (jump cuts) y cada 3–5 s hacer un punch-in de 10–20 % o meter B-roll / pantalla gráfica.
4. **Subtítulos:** auto-captions, 1–4 palabras por página, centro del cuadro. Fuente: *Inter / Satoshi / Montserrat Black* (A y B) o *Bebas / Anton* condensada (C). Palabra clave a ~2.5× el tamaño, en color de acento + glow (A, C) o bloque rojo (B).
5. **Animación de texto:** entrada pop (escala 80→100 % + blur 10→0, 6–8 frames, ease-out) o "typewriter"; salida rápida (3–4 frames).
6. **Gráficos:** 1 recurso especial cada 5–8 s (tachado, flecha, anillo, chip de UI, número 3D, ícono 3D).
7. **Sonido:** whoosh en cada transición, pop/click al aparecer la palabra clave, cama musical lo-fi/tech a −20 dB.
8. **Estructura:** hook con dolor del espectador (0–3 s) → promesa → 2–3 puntos con prueba → CTA.

**Paleta rápida:** Neón `#D4FF3A` / glow `#A8FF00` · Rojo `#C8102E` + blanco `#F4F4F2` · Verde `#1FE06A` + set `#0E2A1C`.

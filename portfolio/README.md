# Portfolio — Joaquín Maggia

Sitio one-page de estilo oscuro con glow violeta y tarjetas glass (HTML/CSS/JS sin dependencias) + versión PDF para enviar como CV.

- `index.html` — contenido del portfolio
- `styles.css` — estilos de pantalla y `@media print` (A4) para el PDF
- `script.js` — animaciones de entrada y navegación activa
- `joaquin-maggia-portfolio.pdf` — PDF generado desde el mismo HTML (fondo oscuro)

## Qué reemplazar

Todo lo que está entre corchetes `[ ... ]` es un placeholder:

- **Sobre mí**: años de experiencia, marcas gestionadas, inversión administrada.
- **Caso 1 (Stride Lab)**: es un caso **ilustrativo** con marca y datos inventados (rotulado en pantalla). Reemplazalo por un cliente real, o mantené el rótulo si lo enviás así.
- **Casos 2 y 3**: nombre del cliente, desafío, estrategia y los 3 KPIs de cada caso.
  Los recuadros "Reemplazar por captura / creatividad" son para un `<img>` (captura de Ads Manager, creatividad o feed).
- **Experiencia**: año de inicio en Vértice y experiencia previa.
- **Contacto**: WhatsApp (`https://wa.me/549XXXXXXXXXX`), LinkedIn e Instagram.

## Regenerar el PDF

Abrí `index.html` en Chrome → Imprimir → Guardar como PDF (A4, márgenes: ninguno, "Gráficos de fondo" activado),
y guardalo como `joaquin-maggia-portfolio.pdf` en esta carpeta.

## Deploy

Igual que las otras landings del repo: en Vercel, crear un proyecto con **Root Directory = `portfolio`** (usa `vercel.json`).

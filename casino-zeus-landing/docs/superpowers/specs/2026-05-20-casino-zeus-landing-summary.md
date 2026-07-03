# Casino Zeus Landing Summary

La landing activa del proyecto es para Casino Zeus y reemplaza la identidad anterior.

## Datos activos

- Marca: Casino Zeus
- Dominio: `https://casinzeus.com/`
- WhatsApp: `5491125506025`
- Meta Pixel: `1915753495774670`
- Oferta principal: bono de bienvenida del 100%

## Implementacion

- Archivos fuente: `src/landing/`
- Build publico: `dist/`
- Configuracion de deploy: `vercel.json`
- Redirect configurado: `www.casinzeus.com` hacia `https://casinzeus.com/`
- SEO: `robots.txt` y `sitemap.xml` se sirven desde la raiz del dominio
- `src/landing/app.js`, `styles.css` y `design-system/colors_and_type.css` son un
  borrador de rediseno visual que no esta conectado a `index.html` (la pagina
  activa es autocontenida). No se eliminaron para no perder ese trabajo, pero
  no afectan la pagina publicada.

## Verificacion

Los tests inspeccionan que la landing use Casino Zeus, el WhatsApp correcto, el Pixel de Meta, metadata de dominio, el redirect de `www` y que no queden datos publicables de la landing anterior.

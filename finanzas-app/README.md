# 💰 Mis Finanzas

App personal para controlar tus finanzas: ingresos, gastos, cuentas, tarjetas, presupuestos, metas de ahorro y reportes.
Funciona en **PC y celular** (se instala como app) y se publica gratis en **Vercel**.

## Qué incluye

| Módulo | Detalle |
|---|---|
| **Movimientos** | Gastos, ingresos y transferencias entre cuentas. Categoría + subcategoría, nota, etiquetas (#vacaciones), fecha. Búsqueda y filtros por mes, tipo, cuenta y categoría. Duplicar movimientos. |
| **Cuotas** | Compras en N cuotas: se registra una cuota por mes automáticamente. |
| **Recurrentes** | Sueldo, alquiler, servicios, suscripciones… (semanal, quincenal, mensual, bimestral, trimestral, anual). Se cargan solos al llegar la fecha. Muestra gastos e ingresos fijos por mes. |
| **Cuentas** | Efectivo, banco, billetera virtual, tarjeta de crédito (con límite y disponible), ahorro, inversión. Multimoneda (ARS, USD, EUR, BRL…). Patrimonio total y deuda en tarjetas. |
| **Presupuestos** | Límite mensual por categoría, barra de progreso, alertas al 80 % / excedido y proyección de fin de mes. |
| **Metas de ahorro** | Objetivo, aportes/retiros, % cumplido y cuánto ahorrar por mes para llegar a la fecha. |
| **Reportes** | Ingresos vs gastos por mes, gastos e ingresos por categoría y subcategoría, por medio de pago, por etiqueta, gastos más grandes, tasa de ahorro y gasto diario. Períodos: mes, 3/6/12 meses, año, todo. |
| **Cotización** | Tipo de cambio manual o automático desde dolarapi.com (oficial, blue, MEP, CCL, tarjeta, cripto). |
| **Categorías** | ~30 categorías y subcategorías pensadas para Argentina, 100 % editables (nombre, emoji, color). |
| **Datos** | Backup/restauración JSON, exportación a CSV (abre en Excel), datos de ejemplo, modo oscuro. |
| **Sincronización** | Opcional: mismos datos en PC y celular, protegidos con contraseña. |

La app se inspira en lo mejor de apps como YNAB (presupuestos), Wallet by BudgetBakers (cuentas y multimoneda),
Monefy (carga rápida), Money Manager (cuotas y tarjetas) y Actual Budget (datos privados, sin publicidad).

## Cómo funciona por dentro

- Sitio estático (HTML + CSS + JavaScript, sin dependencias ni build) en `public/`.
- Los datos se guardan en tu navegador. **Nada se envía a terceros**.
- `api/sync.js` es una función serverless de Vercel que guarda una copia en tu propia base Upstash Redis
  (solo si activás la sincronización).
- Es una PWA: se puede instalar y abrir sin conexión.

## Publicar en Vercel (5 minutos)

1. Entrá a [vercel.com](https://vercel.com) con tu cuenta de GitHub → **Add New… → Project**.
2. Importá el repositorio `Joaquinmggia`.
3. En **Root Directory** elegí `finanzas-app`. Framework Preset: **Other**. No hace falta tocar nada más.
4. **Deploy**. Vas a tener una URL tipo `https://mis-finanzas-xxxx.vercel.app`.

Con eso la app ya funciona (cada dispositivo guarda sus propios datos).

### Activar la sincronización PC ⇄ celular (recomendado)

1. En el proyecto de Vercel: **Storage → Create Database → Upstash for Redis** (plan gratuito) → conectalo al proyecto.
   Vercel crea solo las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN`.
2. **Settings → Environment Variables** → agregá `APP_PASSWORD` con una contraseña larga que solo vos sepas.
3. **Deployments → ⋯ → Redeploy** para que tome las variables.
4. En la app: **Ajustes → Sincronizar entre PC y celular** → escribí la contraseña → *Activar*. Repetí en cada dispositivo.

Los cambios se suben solos a los pocos segundos y se descargan al abrir la app. Si dos dispositivos cambiaron a la vez, la app te pregunta con cuál versión quedarte. El servidor guarda además la versión anterior (`finanzas:state:prev`) por seguridad.

## Instalar en el celular

- **Android (Chrome):** abrí la URL → menú ⋮ → *Instalar app*.
- **iPhone (Safari):** abrí la URL → Compartir → *Agregar a inicio*.

## Probar en tu PC

```bash
cd finanzas-app
npx serve public        # solo la app (sin sincronización)
npx vercel dev          # app + API de sincronización
```

## Consejos de uso

- Pagar la tarjeta, sacar efectivo o comprar dólares = **Transferencia** (no cuenta como gasto).
- Al cargar una compra en cuotas, poné el **monto total**.
- Descargá un backup de vez en cuando desde Ajustes.

# 💰 Mis Finanzas — app personal de gastos y análisis financiero

App para registrar gastos e ingresos y analizar tus finanzas personales. Es **un solo archivo** (`index.html`): no hace falta instalar nada, no necesita internet y **tus datos no salen de tu computadora**.

## Cómo usarla

1. Descargá la carpeta `finanzas-personales/` (o solo `index.html`).
2. Abrí `index.html` con doble clic. Se abre en Chrome, Edge, Firefox o Safari.
3. Tip: guardala en favoritos o creá un acceso directo en el escritorio.
4. Para probarla con datos de ejemplo: **⚙️ Ajustes → Cargar datos de ejemplo**. Después usá **Borrar todo** y empezá con tus datos reales.

> ⚠️ Los datos se guardan en el navegador que usás. Si borrás el historial o los datos de sitios, se pierden.
> Hacé un backup seguido en **Ajustes → Exportar backup (JSON)** (por ejemplo, a Google Drive).
> Usá siempre el mismo navegador y la misma ubicación del archivo.

Atajo: tecla **N** para cargar un movimiento nuevo.

## Qué incluye

| Sección | Qué hace |
|---|---|
| 📊 **Panel** | Ingresos, gastos, balance, patrimonio neto, gráfico por categoría, ingresos vs gastos (6 meses), regla 50/30/20 y **análisis automático** del mes |
| 📒 **Movimientos** | Gastos, ingresos y transferencias entre cuentas. Búsqueda y filtros por tipo, categoría y cuenta |
| 🎯 **Presupuesto** | Un tope mensual por categoría (sistema de "sobres"). Avisa si gastás más rápido de lo que avanza el mes. Botón para sugerir el presupuesto según tus últimos 3 meses |
| 🏦 **Cuentas** | Efectivo, banco, tarjeta, billetera virtual (Mercado Pago, etc.), inversiones. Saldos y evolución del patrimonio en 12 meses |
| 🔁 **Recurrentes** | Alquiler, sueldo, suscripciones, cuotas: se registran solos cada mes. Muestra cuánto suman por mes y por año |
| 🏁 **Metas** | Metas de ahorro con fecha. Calcula cuánto tenés que ahorrar por mes para llegar |
| 📈 **Análisis** | Promedios, tasa de ahorro, proyección anual, gastos inusuales y tendencia por categoría |
| ⚙️ **Ajustes** | Moneda (ARS, USD, EUR…), tema claro/oscuro, categorías, **reglas de auto-categorización**, importar extractos bancarios en CSV, exportar a CSV/Excel y backups |

### Análisis automático
- Tasa de ahorro frente al 20% recomendado
- Variación de gastos contra el mes anterior
- Categorías que pasaron su presupuesto
- Categoría con el mayor gasto
- Proyección del gasto a fin de mes
- Meses cubiertos por tu fondo de emergencia
- Costo anual de tus gastos fijos y suscripciones
- Gastos inusuales (30% por encima de tu promedio)

### Importar el extracto del banco
Exportá los movimientos de tu home banking en CSV y subilo en **Ajustes → Importar extracto bancario**.
Detecta columnas como `fecha`, `descripción`/`concepto` e `importe`/`monto`, acepta separador `,` o `;`, fechas `dd/mm/aaaa` y montos con formato `1.234,56`. Los montos negativos se cargan como gastos. Las reglas (por ejemplo, "netflix" → Suscripciones) asignan la categoría solas.

## Investigación: en qué se basa

Revisé las apps de finanzas personales open source mejor valoradas y los métodos de presupuesto más recomendados, y tomé lo mejor de cada una:

| Referencia | Qué tomé |
|---|---|
| **Actual Budget** (open source, local-first) | Presupuesto por sobres, datos locales y privados, funciona sin conexión |
| **Firefly III** (open source, autohospedada) | Varias cuentas, transferencias, reglas de auto-categorización, importación CSV |
| **Maybe / Sure** (open source) | Patrimonio neto y su evolución |
| **ezBookkeeping** | Carga rápida y simple, pensada para el uso diario |
| **YNAB / EveryDollar** | Que cada peso tenga un destino: el "sin asignar" del presupuesto |
| **Regla 50/30/20** | 50% necesidades, 30% deseos, 20% ahorro/deudas, con cada categoría clasificada |
| **Fondo de emergencia** | De 3 a 6 meses de gastos en dinero líquido |

Un punto en común de las apps open source es la **privacidad**: muchas apps comerciales comparten tus datos financieros con terceros (por ejemplo, a través de Plaid). Por eso esta app guarda todo localmente.

Fuentes:
- [Firefly III vs Actual Budget — guía 2026 (beancount.io)](https://beancount.io/blog/2026/07/26/firefly-iii-vs-actual-budget-self-hosted-open-source-budgeting-guide)
- [Alternativas open source a Firefly III (openalternative.co)](https://openalternative.co/alternatives/firefly-iii)
- [Cómo elegir un sistema de presupuesto (NerdWallet)](https://www.nerdwallet.com/article/finance/how-to-choose-the-right-budget-system)
- [Apps de presupuesto base cero (WalletHub)](https://wallethub.com/answers/b/zero-based-budget-app-2140884105/)

## Si querés más adelante
- **Sincronizar entre compu y celular**: autohospedar [Actual Budget](https://actualbudget.org) o [Firefly III](https://www.firefly-iii.org) con Docker. Podés exportar tus movimientos a CSV desde acá e importarlos allá.

# VÉRTICE Presentation Generator

Un generador automático de presentaciones impulsado por IA, diseñado específicamente para VÉRTICE STUDIO con estilo minimalista y moderno.

## Características

✨ **Generación Automática**: Crea presentaciones completas a partir de tus ideas  
📊 **Múltiples Formatos**: Exporta a PPTX (editable) y PDF (compartible)  
🎨 **Branding Customizable**: Personaliza colores, nombre, tagline de la marca  
☁️ **Google Drive**: Guarda automáticamente en Google Drive  
📱 **Web App**: Interfaz limpia y minimalista, accesible desde cualquier dispositivo  
💾 **Historial**: Acceso rápido a todas tus presentaciones generadas  
⚡ **Rápido**: Genera presentaciones en segundos usando Claude AI

## Requisitos

- Node.js 16+
- npm o yarn
- Clave API de Anthropic

## Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd presentation-generator
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Edita .env y añade tu ANTHROPIC_API_KEY
```

4. **Iniciar el servidor**
```bash
npm start
# O para desarrollo con hot reload:
npm run dev
```

5. **Acceder a la app**
```
http://localhost:3000
```

## Configuración

El archivo `config.yaml` contiene:

- **Branding**: Identidad visual de VÉRTICE STUDIO (colores, tipografía)
- **Presentation**: Configuración de generación de presentaciones
- **Theme**: Tema visual por defecto (modern-minimalist)

## Uso Rápido

1. **Ingresa tu idea** (ej: "Propuesta de Marketing Digital")
2. **(Opcional) Añade contexto** - audiencia, objetivos, etc.
3. **Selecciona cantidad de diapositivas** (5-50)
4. **Haz clic en "Generar Presentación"**
5. **Descarga** en PPTX (editable) o PDF (compartible)

## Customización de Branding

1. Haz click en **⚙️** (arriba a la derecha)
2. Personaliza:
   - Nombre de la marca
   - Tagline
   - Colores (primario/secundario)
   - Email, teléfono, sitio web
3. Haz click en "Guardar Configuración"

## Google Drive (Opcional)

Para guardar automáticamente en Google Drive:

1. Sigue la guía en [GOOGLE_DRIVE_SETUP.md](./GOOGLE_DRIVE_SETUP.md)
2. Coloca `credentials.json` en la raíz del proyecto
3. Activa en configuración (⚙️)
4. Las nuevas presentaciones se guardarán automáticamente

## Estructura del Proyecto

```
.
├── server.js                 # Servidor Express
├── config.yaml              # Configuración de branding
├── package.json
├── lib/
│   ├── presentationGenerator.js   # Lógica de generación con Claude
│   └── configManager.js            # Gestión de configuración
└── public/
    ├── index.html           # Interfaz web
    ├── styles.css           # Estilos minimalistas
    └── app.js               # Lógica del frontend
```

## API Endpoints

### POST /api/generate
Genera una nueva presentación.

**Body:**
```json
{
  "idea": "Tu idea aquí",
  "context": "Contexto adicional (opcional)",
  "numSlides": 10
}
```

### GET /api/presentations
Obtiene todas las presentaciones generadas.

### GET /api/config
Obtiene la configuración actual.

## Tecnologías

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **IA**: Anthropic Claude API
- **Configuración**: YAML

## Licencia

VÉRTICE STUDIO © 2026

# Configurar Google Drive Integration

## Paso 1: Crear credenciales en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Google Drive API**
4. Crea credenciales de tipo "Cuenta de Servicio"
5. Descarga el JSON de credenciales

## Paso 2: Guardar credenciales

1. Renombra el archivo descargado a `credentials.json`
2. Colócalo en la raíz del proyecto (junto a `server.js`)

## Paso 3: Habilitar en la aplicación

1. Abre la app en `http://localhost:3000`
2. Haz click en ⚙️ (configuración)
3. Marca "Guardar automáticamente en Google Drive"
4. Haz click en "Guardar Configuración"

## Paso 4: (Opcional) Especificar una carpeta

Si quieres que las presentaciones se guarden en una carpeta específica:

1. Abre Google Drive
2. Crea una carpeta (ej: "Presentaciones Generadas")
3. Copia el ID de la carpeta desde la URL
4. Edita `config.yaml`:
   ```yaml
   googleDrive:
     enabled: true
     folderId: "aquí-va-el-id"
   ```

## Troubleshooting

- **"credentials.json not found"**: Asegúrate de haber puesto el archivo en la raíz del proyecto
- **"Permission denied"**: Verifica que la cuenta de servicio tenga acceso a la carpeta en Google Drive
- **Uploads no funcionan**: Asegúrate de que Google Drive API está habilitada en Google Cloud

## Nota de Seguridad

⚠️ **Nunca compartas el archivo `credentials.json`**  
Contiene credenciales sensibles. Añádelo a `.gitignore` (ya está configurado).

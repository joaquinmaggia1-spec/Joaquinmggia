import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';
import { getReferenceImagePath, HYPERREAL_BASE_ID, getStyle } from './styleManager.js';

const MODEL = 'gemini-2.5-flash-image';

let client;
function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Falta configurar GEMINI_API_KEY en el archivo .env');
  }
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

function mimeFromExt(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
}

function buildPrompt(style, extraInstructions) {
  const base = getStyle(HYPERREAL_BASE_ID).description;
  const parts = [
    'Editá esta foto aplicando el estilo descripto a continuación, pero conservando siempre la identidad, la pose, la composición y el encuadre original de la persona/escena.',
    `Estilo base obligatorio (nunca lo pierdas): ${base}`,
  ];

  if (style && style.id !== HYPERREAL_BASE_ID) {
    parts.push(`Estilo adicional a aplicar: ${style.description}`);
    if (style.referenceImages?.length) {
      parts.push(
        'Además de la descripción, te adjunto imágenes de referencia de ese estilo (paleta de color, iluminación, mood, grano, contraste). Usalas como guía visual del estilo, pero la foto de referencia NO debe reemplazar el contenido ni las personas de la foto original.'
      );
    }
  }

  if (extraInstructions) {
    parts.push(`Instrucciones adicionales del usuario: ${extraInstructions}`);
  }

  parts.push(
    'El resultado final tiene que seguir siendo una fotografía hiperrealista apta para redes sociales: nítida, bien expuesta, sin artefactos, sin texto ni marcas de agua agregadas.'
  );

  return parts.join('\n\n');
}

export async function styleImage({ imageBuffer, imageFilename, styleId, extraInstructions }) {
  const style = getStyle(styleId);
  const prompt = buildPrompt(style, extraInstructions);

  const contentParts = [{ text: prompt }];

  contentParts.push({
    inlineData: {
      mimeType: mimeFromExt(imageFilename),
      data: imageBuffer.toString('base64'),
    },
  });

  for (const refFilename of style.referenceImages || []) {
    const refPath = getReferenceImagePath(style.id, refFilename);
    const refBuffer = readFileSync(refPath);
    contentParts.push({
      inlineData: {
        mimeType: mimeFromExt(refFilename),
        data: refBuffer.toString('base64'),
      },
    });
  }

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: contentParts,
  });

  const candidateParts = response.candidates?.[0]?.content?.parts || [];
  const imagePart = candidateParts.find((p) => p.inlineData);

  if (!imagePart) {
    const textPart = candidateParts.find((p) => p.text);
    throw new Error(
      textPart?.text
        ? `Gemini no devolvió una imagen: ${textPart.text}`
        : 'Gemini no devolvió ninguna imagen'
    );
  }

  return {
    buffer: Buffer.from(imagePart.inlineData.data, 'base64'),
    mimeType: imagePart.inlineData.mimeType || 'image/png',
  };
}

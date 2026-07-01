import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config } from 'dotenv';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import {
  listStyles,
  createStyle,
  deleteStyle,
  addReferenceImage,
  getReferenceImagePath,
  HYPERREAL_BASE_ID,
} from './lib/styleManager.js';
import { styleImage } from './lib/geminiClient.js';
import { optimizeForSocial, listFormats } from './lib/imageOptimizer.js';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUTS_DIR = join(__dirname, 'outputs');
if (!existsSync(OUTPUTS_DIR)) mkdirSync(OUTPUTS_DIR, { recursive: true });

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ---- Estilos ----

app.get('/api/styles', (req, res) => {
  res.json(listStyles());
});

app.get('/api/formats', (req, res) => {
  res.json(listFormats());
});

app.post('/api/styles', (req, res) => {
  try {
    const { name, description } = req.body;
    const style = createStyle({ name, description });
    res.json(style);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/styles/:id', (req, res) => {
  try {
    deleteStyle(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/styles/:id/reference', upload.single('reference'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Falta la imagen de referencia' });
    const filename = addReferenceImage(req.params.id, req.file.buffer, req.file.originalname);
    res.json({ filename });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/styles/:id/reference/:filename', (req, res) => {
  try {
    const filepath = getReferenceImagePath(req.params.id, req.params.filename);
    const refsRoot = join(__dirname, 'data', 'style-refs');
    if (!filepath.startsWith(refsRoot)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.sendFile(filepath);
  } catch (error) {
    res.status(404).json({ error: 'Not found' });
  }
});

// ---- Procesamiento de fotos ----

app.post('/api/process', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Falta la foto a procesar' });

    const styleId = req.body.styleId || HYPERREAL_BASE_ID;
    const extraInstructions = req.body.extraInstructions || '';

    const styled = await styleImage({
      imageBuffer: req.file.buffer,
      imageFilename: req.file.originalname,
      styleId,
      extraInstructions,
    });

    const variants = await optimizeForSocial(styled.buffer);

    const jobId = randomUUID();
    const jobDir = join(OUTPUTS_DIR, jobId);
    mkdirSync(jobDir, { recursive: true });

    const files = {};
    for (const [variantId, buffer] of Object.entries(variants)) {
      const filename = `${variantId}.jpg`;
      writeFileSync(join(jobDir, filename), buffer);
      files[variantId] = {
        downloadUrl: `/api/download/${jobId}/${filename}`,
      };
    }

    res.json({ success: true, jobId, files });
  } catch (error) {
    console.error('Error procesando la foto:', error);
    res.status(500).json({ error: 'No se pudo procesar la foto', details: error.message });
  }
});

app.get('/api/download/:jobId/:filename', (req, res) => {
  try {
    const { jobId, filename } = req.params;
    const filepath = join(OUTPUTS_DIR, jobId, filename);

    if (!filepath.startsWith(OUTPUTS_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (!existsSync(filepath)) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.download(filepath, filename);
  } catch (error) {
    res.status(500).json({ error: 'Download failed', details: error.message });
  }
});

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`Photo Styler corriendo en http://localhost:${PORT}`);
});

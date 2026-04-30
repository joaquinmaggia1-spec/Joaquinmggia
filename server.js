import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { generatePresentation } from './lib/presentationGenerator.js';
import { generatePPTX } from './lib/pptxGenerator.js';
import { loadConfig, savePresentation } from './lib/configManager.js';

config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const appConfig = loadConfig();

app.post('/api/generate', async (req, res) => {
  try {
    const { idea, context, numSlides } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    const presentation = await generatePresentation({
      idea,
      context: context || '',
      numSlides: numSlides || appConfig.presentation.defaultSlides,
      branding: appConfig.branding,
      theme: appConfig.theme
    });

    // Generate PPTX
    const pptxInfo = await generatePPTX(presentation);

    // Save presentation metadata
    const saved = savePresentation({
      ...presentation,
      pptxFile: pptxInfo.filename,
      downloadUrl: `/api/download/${pptxInfo.filename}`
    });

    res.json({
      success: true,
      presentation: {
        ...presentation,
        pptxFile: pptxInfo.filename,
        downloadUrl: `/api/download/${pptxInfo.filename}`
      },
      saved
    });
  } catch (error) {
    console.error('Error generating presentation:', error);
    res.status(500).json({
      error: 'Failed to generate presentation',
      details: error.message
    });
  }
});

app.get('/api/config', (req, res) => {
  res.json(appConfig);
});

app.put('/api/config', (req, res) => {
  try {
    const updated = { ...appConfig, ...req.body };
    // Save updated config to yaml
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

app.get('/api/presentations', (req, res) => {
  try {
    const presentations = loadConfig().savedPresentations || [];
    res.json(presentations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load presentations' });
  }
});

app.get('/api/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = join(__dirname, `downloads/${filename}`);

    // Security: prevent directory traversal
    if (!filepath.startsWith(join(__dirname, 'downloads'))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Download failed' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Download failed', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎨 Presentation Generator running at http://localhost:${PORT}`);
  console.log(`🎯 VÉRTICE STUDIO branding ready`);
});

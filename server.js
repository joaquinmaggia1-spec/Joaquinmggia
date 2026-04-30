import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { generatePresentation } from './lib/presentationGenerator.js';
import { generatePPTX } from './lib/pptxGenerator.js';
import { generatePDF } from './lib/pdfGenerator.js';
import { loadConfig, savePresentation } from './lib/configManager.js';
import { initGoogleDrive, uploadToGoogleDrive, uploadPDFToGoogleDrive, isGoogleDriveAvailable } from './lib/googleDriveManager.js';

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

    // Generate PDF
    const pdfInfo = await generatePDF(presentation, appConfig.branding);

    // Upload to Google Drive if enabled
    let googleDriveLinks = null;
    if (appConfig.googleDrive?.enabled && isGoogleDriveAvailable()) {
      const pptxGD = await uploadToGoogleDrive(
        pptxInfo.filepath,
        pptxInfo.filename,
        appConfig.googleDrive.folderId
      );
      const pdfGD = await uploadPDFToGoogleDrive(
        pdfInfo.filepath,
        pdfInfo.filename,
        appConfig.googleDrive.folderId
      );
      googleDriveLinks = { pptx: pptxGD, pdf: pdfGD };
    }

    // Save presentation metadata
    const presentationData = {
      ...presentation,
      pptxFile: pptxInfo.filename,
      pdfFile: pdfInfo.filename,
      downloadUrls: {
        pptx: `/api/download/${pptxInfo.filename}`,
        pdf: `/api/download/${pdfInfo.filename}`
      },
      googleDriveLinks: googleDriveLinks
    };

    const saved = savePresentation(presentationData);

    res.json({
      success: true,
      presentation: presentationData,
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

    // If Google Drive settings changed, reinitialize
    if (req.body.googleDrive?.enabled !== undefined) {
      if (req.body.googleDrive.enabled) {
        initGoogleDrive().then(success => {
          if (success) {
            console.log('✓ Google Drive initialized');
          }
        });
      }
    }

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

// Initialize Google Drive if enabled
if (appConfig.googleDrive?.enabled) {
  initGoogleDrive().then(success => {
    if (success) {
      console.log('✓ Google Drive integration ready');
    } else {
      console.log('⚠️  Google Drive integration not available');
    }
  });
}

app.listen(PORT, () => {
  console.log(`🎨 Presentation Generator running at http://localhost:${PORT}`);
  console.log(`🎯 VÉRTICE STUDIO branding ready`);
  console.log(`📥 Downloads folder: ./downloads`);
  console.log(`📄 Formats: PPTX + PDF`);
});

import officegen from 'officegen';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function generatePPTX(presentation) {
  const pres = officegen('pptx');

  // Create downloads folder if it doesn't exist
  const downloadsDir = path.join(__dirname, '../downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  // Title Slide
  const slide1 = pres.addSlide();
  slide1.background = { color: '000000' };

  slide1.addText('VÉRTICE STUDIO', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 1,
    fontSize: 54,
    bold: true,
    color: 'FFFFFF',
    align: 'left'
  });

  slide1.addText('Generador de Presentaciones', {
    x: 0.5,
    y: 1.7,
    w: 9,
    h: 0.5,
    fontSize: 18,
    color: '999999',
    align: 'left'
  });

  slide1.addText(presentation.title, {
    x: 0.5,
    y: 2.8,
    w: 9,
    h: 2,
    fontSize: 44,
    bold: true,
    color: 'FFFFFF',
    align: 'left'
  });

  // Add description if available
  if (presentation.description) {
    slide1.addText(presentation.description, {
      x: 0.5,
      y: 5.0,
      w: 9,
      h: 1.5,
      fontSize: 14,
      color: 'CCCCCC',
      align: 'left'
    });
  }

  // Content Slides
  presentation.slides.forEach((slide, index) => {
    const contentSlide = pres.addSlide();
    contentSlide.background = { color: 'FFFFFF' };

    // Top bar
    const shapeProperties = {
      fill: '000000',
      line: { color: '000000' }
    };

    // Title
    contentSlide.addText(slide.title, {
      x: 0.5,
      y: 0.4,
      w: 8.5,
      h: 0.8,
      fontSize: 32,
      bold: true,
      color: '000000',
      align: 'left'
    });

    // Slide number
    contentSlide.addText(`${slide.slideNumber}`, {
      x: 9.2,
      y: 0.5,
      w: 0.5,
      h: 0.4,
      fontSize: 10,
      color: '666666',
      align: 'right'
    });

    // Content
    const contentLines = slide.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-•*]\s+/, '').trim());

    let yPos = 1.4;
    contentLines.forEach((line) => {
      contentSlide.addText('• ' + line, {
        x: 1.0,
        y: yPos,
        w: 8.5,
        h: 0.5,
        fontSize: 14,
        color: '333333',
        align: 'left'
      });
      yPos += 0.55;
    });
  });

  // Final Slide
  const finalSlide = pres.addSlide();
  finalSlide.background = { color: '000000' };

  finalSlide.addText('¡Gracias!', {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 1,
    fontSize: 48,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });

  finalSlide.addText('VÉRTICE STUDIO', {
    x: 0.5,
    y: 4.0,
    w: 9,
    h: 0.5,
    fontSize: 16,
    color: '999999',
    align: 'center'
  });

  // Save PPTX
  const filename = `presentation-${presentation.id}.pptx`;
  const filepath = path.join(downloadsDir, filename);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filepath);

    pres.generate(stream);

    stream.on('finish', () => {
      try {
        const stats = fs.statSync(filepath);
        resolve({
          filename,
          filepath,
          size: stats.size
        });
      } catch (error) {
        reject(error);
      }
    });

    stream.on('error', reject);
  });
}

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function generatePDF(presentation, branding) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40
  });

  const downloadsDir = path.join(__dirname, '../downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  const filename = `presentation-${presentation.id}.pdf`;
  const filepath = path.join(downloadsDir, filename);

  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  // Colors
  const primaryColor = branding.colors.primary.replace('#', '');
  const secondaryColor = branding.colors.secondary.replace('#', '');

  // Title Page
  doc.fillColor(primaryColor);
  doc.fontSize(48).font('Helvetica-Bold').text(branding.name, { align: 'left' });
  doc.fontSize(14).fillColor('#666666').text(branding.tagline, { align: 'left' });
  doc.moveDown();

  doc.fontSize(32).fillColor(primaryColor).font('Helvetica-Bold').text(presentation.title);
  doc.moveDown();

  if (presentation.description) {
    doc.fontSize(12).fillColor('#333333').font('Helvetica').text(presentation.description);
  }

  doc.moveDown(2);
  doc.fontSize(10).fillColor('#999999').text(`Generado: ${new Date().toLocaleDateString('es-AR')}`);

  // Content Pages
  presentation.slides.forEach((slide, index) => {
    doc.addPage();

    // Header
    doc.fillColor(primaryColor);
    doc.fontSize(24).font('Helvetica-Bold').text(slide.title);
    doc.strokeColor('#000000').lineWidth(2).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown();

    // Content
    const contentLines = slide.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-•*]\s+/, '').trim());

    doc.fontSize(11).fillColor('#333333').font('Helvetica');
    contentLines.forEach(line => {
      doc.text(`• ${line}`, 60, doc.y, { width: 450 });
    });

    // Footer
    doc.fontSize(9).fillColor('#999999');
    doc.text(`${slide.slideNumber} de ${presentation.slides.length}`, {
      align: 'right',
      y: doc.page.height - 40
    });
  });

  // Final Page
  doc.addPage();
  doc.fillColor(primaryColor);
  doc.fontSize(40).font('Helvetica-Bold').text('¡Gracias!', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(16).fillColor('#666666').text(branding.name, { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(branding.contact.email, { align: 'center' });
  doc.text(branding.contact.phone, { align: 'center' });
  doc.text(branding.contact.website, { align: 'center' });

  doc.end();

  return new Promise((resolve, reject) => {
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

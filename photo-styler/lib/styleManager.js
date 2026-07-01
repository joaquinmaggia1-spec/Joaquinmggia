import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const STYLES_FILE = join(DATA_DIR, 'styles.json');
const REFS_DIR = join(DATA_DIR, 'style-refs');

export const HYPERREAL_BASE_ID = 'hyperreal-base';

function ensureDirs() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(REFS_DIR)) mkdirSync(REFS_DIR, { recursive: true });
}

function readStyles() {
  ensureDirs();
  if (!existsSync(STYLES_FILE)) return [];
  return JSON.parse(readFileSync(STYLES_FILE, 'utf-8'));
}

function writeStyles(styles) {
  ensureDirs();
  writeFileSync(STYLES_FILE, JSON.stringify(styles, null, 2));
}

export function listStyles() {
  return readStyles();
}

export function getStyle(id) {
  const style = readStyles().find((s) => s.id === id);
  if (!style) throw new Error(`Style "${id}" not found`);
  return style;
}

export function createStyle({ name, description }) {
  if (!name || !description) {
    throw new Error('name and description are required to create a style');
  }
  const styles = readStyles();
  const style = {
    id: randomUUID(),
    name,
    description,
    referenceImages: [],
    protected: false,
    createdAt: new Date().toISOString(),
  };
  styles.push(style);
  writeStyles(styles);
  return style;
}

export function deleteStyle(id) {
  const styles = readStyles();
  const target = styles.find((s) => s.id === id);
  if (!target) throw new Error(`Style "${id}" not found`);
  if (target.protected) throw new Error('El estilo base hiperreal no se puede eliminar');
  writeStyles(styles.filter((s) => s.id !== id));
}

export function addReferenceImage(styleId, buffer, originalName) {
  ensureDirs();
  const styles = readStyles();
  const style = styles.find((s) => s.id === styleId);
  if (!style) throw new Error(`Style "${styleId}" not found`);

  const styleRefDir = join(REFS_DIR, styleId);
  if (!existsSync(styleRefDir)) mkdirSync(styleRefDir, { recursive: true });

  const ext = (originalName.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const filename = `${randomUUID()}.${ext}`;
  writeFileSync(join(styleRefDir, filename), buffer);

  style.referenceImages.push(filename);
  writeStyles(styles);
  return filename;
}

export function getReferenceImagePath(styleId, filename) {
  return join(REFS_DIR, styleId, filename);
}

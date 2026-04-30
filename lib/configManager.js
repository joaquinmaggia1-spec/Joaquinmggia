import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, '../config.yaml');
const PRESENTATIONS_DB = path.join(__dirname, '../presentations.json');

export function loadConfig() {
  try {
    const fileContents = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = yaml.load(fileContents);

    // Load saved presentations
    if (fs.existsSync(PRESENTATIONS_DB)) {
      const presentations = JSON.parse(fs.readFileSync(PRESENTATIONS_DB, 'utf8'));
      return { ...config, savedPresentations: presentations };
    }

    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    return getDefaultConfig();
  }
}

export function savePresentation(presentation) {
  try {
    let presentations = [];

    if (fs.existsSync(PRESENTATIONS_DB)) {
      presentations = JSON.parse(fs.readFileSync(PRESENTATIONS_DB, 'utf8'));
    }

    presentations.push({
      ...presentation,
      savedAt: new Date().toISOString()
    });

    fs.writeFileSync(PRESENTATIONS_DB, JSON.stringify(presentations, null, 2));

    return {
      success: true,
      path: PRESENTATIONS_DB
    };
  } catch (error) {
    console.error('Error saving presentation:', error);
    return { success: false, error: error.message };
  }
}

function getDefaultConfig() {
  return {
    branding: {
      name: 'VÉRTICE STUDIO',
      style: 'minimalist',
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#333333'
      }
    },
    presentation: {
      defaultSlides: 10,
      format: 'gamma_link'
    },
    theme: {
      name: 'modern-minimalist'
    }
  };
}

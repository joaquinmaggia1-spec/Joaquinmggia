import sharp from 'sharp';

const SOCIAL_FORMATS = {
  square: { width: 1080, height: 1080, label: 'Cuadrado (Feed 1:1)' },
  feed: { width: 1080, height: 1350, label: 'Feed vertical (4:5)' },
  story: { width: 1080, height: 1920, label: 'Historia/Reel (9:16)' },
};

export function listFormats() {
  return Object.entries(SOCIAL_FORMATS).map(([id, cfg]) => ({ id, ...cfg }));
}

export async function optimizeForSocial(buffer) {
  const variants = {};

  for (const [id, { width, height }] of Object.entries(SOCIAL_FORMATS)) {
    variants[id] = await sharp(buffer)
      .resize(width, height, { fit: 'cover', position: 'attention' })
      .toColorspace('srgb')
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();
  }

  variants.original = await sharp(buffer)
    .resize({ width: 2048, withoutEnlargement: true })
    .toColorspace('srgb')
    .jpeg({ quality: 95, mozjpeg: true })
    .toBuffer();

  return variants;
}

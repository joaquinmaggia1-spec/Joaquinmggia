import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../src/landing/index.html', import.meta.url), 'utf8');
const privacidad = await readFile(new URL('../src/landing/privacidad.html', import.meta.url), 'utf8');
const robots = await readFile(new URL('../src/landing/robots.txt', import.meta.url), 'utf8');
const sitemap = await readFile(new URL('../src/landing/sitemap.xml', import.meta.url), 'utf8');
const vercel = await readFile(new URL('../vercel.json', import.meta.url), 'utf8');
const packageJson = await readFile(new URL('../package.json', import.meta.url), 'utf8');

const OLD_WHATSAPP_NUMBERS = [
  '5491169815723',
  '5491169817253',
  '5491169817254',
  '5491169817270',
  '5493412696419',
  '5491100000000',
];

test('landing includes Casino Zeus brand, offer, whatsapp link, and legal copy', () => {
  assert.match(html, /CASINO ZEUS/);
  assert.match(html, /100%/);
  assert.match(html, /Reclamar mi 100%/i);
  assert.match(html, /numero:\s*"5491125506025"/);
  for (const oldNumber of OLD_WHATSAPP_NUMBERS) {
    assert.doesNotMatch(html, new RegExp(oldNumber));
  }
  assert.match(html, /\+18/);
});

test('deployable landing metadata no longer uses the old landing identity', () => {
  assert.match(packageJson, /"name": "casino-zeus-landing"/);
  assert.doesNotMatch(html + vercel + packageJson, /RED PABLO|red-pablo|5491100000000/);
});

test('landing includes Meta Pixel pageview and noscript fallback', () => {
  assert.match(html, /fbq\('init', '1915753495774670'\)/);
  assert.match(html, /fbq\('track', 'PageView'\)/);
  assert.match(html, /facebook\.com\/tr\?id=1915753495774670&ev=PageView/);
});

test('production domain is configured in metadata and Vercel redirects', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/casinzeus\.com\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/casinzeus\.com\/">/);
  assert.match(html, /<meta property="og:site_name" content="Casino Zeus">/);
  assert.match(vercel, /www\.casinzeus\.com/);
  assert.match(vercel, /https:\/\/casinzeus\.com\/\$1/);
});

test('whatsapp CTAs fire a Meta lead event before navigation', () => {
  assert.match(html, /class="[^"]*\bwa-link\b[^"]*"/);
  assert.match(html, /fbq\("track", "Lead"\)/);
  assert.match(html, /addEventListener\("click"/);
});

test('basic SEO/perf assets are present and consistent', () => {
  assert.match(html, /<link rel="icon" href="data:image\/svg\+xml/);
  assert.match(html, /<meta name="description" content="[^"]{20,160}">/);
  assert.match(robots, /Sitemap: https:\/\/casinzeus\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/casinzeus\.com\/<\/loc>/);
});

test('privacy page matches the active brand and stays out of the sitemap', () => {
  assert.match(privacidad, /Casino Zeus/);
  assert.match(privacidad, /noindex, nofollow/);
  assert.doesNotMatch(sitemap, /privacidad/);
});

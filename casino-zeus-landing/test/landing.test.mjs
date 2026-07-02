import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = await readFile(new URL('../src/landing/index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/landing/styles.css', import.meta.url), 'utf8');
const js = await readFile(new URL('../src/landing/app.js', import.meta.url), 'utf8');
const vercel = await readFile(new URL('../vercel.json', import.meta.url), 'utf8');
const packageJson = await readFile(new URL('../package.json', import.meta.url), 'utf8');

test('landing includes Casino Zeus brand, offer, whatsapp link, and legal copy', () => {
  assert.match(html, /CASINO ZEUS/);
  assert.match(html, /50%/);
  assert.match(html, /Reclamar mi bono/i);
  assert.match(html, /https:\/\/wa\.me\/5491169815723/);
  assert.doesNotMatch(html, /5491169817254/);
  assert.doesNotMatch(html, /5491169817270/);
  assert.doesNotMatch(html, /5491169817253/);
  assert.doesNotMatch(html, /5493412696419/);
  assert.doesNotMatch(html + js, /5491100000000/);
  assert.match(html, /\+18/);
});

test('deployable landing metadata no longer uses the old landing identity', () => {
  assert.match(packageJson, /"name": "casino-zeus-landing"/);
  assert.doesNotMatch(html + css + js + vercel + packageJson, /RED PABLO|red-pablo|5491100000000/);
});

test('landing includes Meta Pixel pageview and noscript fallback', () => {
  assert.match(html, /2085018025390140/);
  assert.doesNotMatch(html, /978114254613561/);
  assert.match(html, /fbq\('track', 'PageView'\)/);
  assert.match(html, /facebook\.com\/tr\?id=2085018025390140&ev=PageView/);
});

test('production domain is configured in metadata and Vercel redirects', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/casinzeus\.com\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/casinzeus\.com\/">/);
  assert.match(html, /<meta property="og:site_name" content="Casino Zeus">/);
  assert.match(vercel, /www\.casinzeus\.com/);
  assert.match(vercel, /https:\/\/casinzeus\.com\/\$1/);
});

test('whatsapp CTAs trigger a Meta contact event before navigation', () => {
  assert.match(html, /data-track="whatsapp"/);
  assert.match(js, /fbq\('track', 'Contact'/);
  assert.match(js, /addEventListener\('click'/);
});

test('imported premium casino visual system is represented in markup and styles', () => {
  assert.match(html, /class="stage"/);
  assert.match(html, /class="roulette"/);
  assert.match(html, /class="slot-strip"/);
  assert.match(html, /class="wa-cta"/);
  assert.match(css, /\.bonus-frame/);
  assert.match(css, /\.wa-cta/);
  assert.match(css, /@keyframes spin/);
  assert.match(css, /@keyframes reelSpin/);
  assert.match(css, /@media \(max-width: 960px\)/);
});

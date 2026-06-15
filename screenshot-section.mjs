import puppeteer from 'puppeteer';
import { readdir, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const url = process.argv[2] || 'http://localhost:3000';
const selector = process.argv[3];
const label = process.argv[4] || 'section';

if (!selector) { console.error('usage: node screenshot-section.mjs <url> <css-selector> [label]'); process.exit(1); }

const OUT_DIR = resolve(new URL('.', import.meta.url).pathname, 'temporary screenshots');
await mkdir(OUT_DIR, { recursive: true });

const existing = (await readdir(OUT_DIR)).filter(f => /^screenshot-\d+/.test(f));
const nextN = existing
  .map(f => Number(f.match(/^screenshot-(\d+)/)?.[1] ?? 0))
  .reduce((a, b) => Math.max(a, b), 0) + 1;
const outPath = join(OUT_DIR, `screenshot-${nextN}-${label}.png`);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  const el = await page.$(selector);
  if (!el) throw new Error(`selector not found: ${selector}`);
  await el.screenshot({ path: outPath });
  console.log(outPath);
} finally { await browser.close(); }

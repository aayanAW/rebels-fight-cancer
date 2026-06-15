import puppeteer from 'puppeteer';
import { readdir, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const OUT_DIR = resolve(new URL('.', import.meta.url).pathname, 'temporary screenshots');
await mkdir(OUT_DIR, { recursive: true });

const existing = (await readdir(OUT_DIR)).filter(f => /^screenshot-\d+/.test(f));
const nextN = existing
  .map(f => Number(f.match(/^screenshot-(\d+)/)?.[1] ?? 0))
  .reduce((a, b) => Math.max(a, b), 0) + 1;

const filename = label
  ? `screenshot-${nextN}-${label}.png`
  : `screenshot-${nextN}.png`;
const outPath = join(OUT_DIR, filename);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(outPath);
} finally {
  await browser.close();
}

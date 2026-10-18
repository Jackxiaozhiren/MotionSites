/** Render an original SVG social card to a browser-compatible 1280×640 JPG.
 * This includes NO third-party images, screenshots or fonts. Required for
 * GitHub's repository Social preview (manual upload) and Open Graph sharing.
 *
 * node scripts/render_social_card.mjs [output.jpg]
 * Requires the Playwright Chromium dependency used by GitHub Actions.
 */
import { readFile, mkdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(process.argv[2] ?? 'artifacts/motionsites-social-preview.jpg');
if (!output.toLowerCase().endsWith('.jpg')) throw Error('Output file must be a .jpg');
const svg = await readFile(resolve(root, 'assets/motionsites-social-card.svg'), 'utf8');
const src = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
await mkdir(dirname(output), { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><meta charset="UTF-8"><style>
    html,body{margin:0;width:1280px;height:640px;overflow:hidden;background:#0c0b15}
    img{display:block;width:1280px;height:640px}
  </style></head><body><img id="card" alt="MotionSites vector brand illustration" src="${src}"></body></html>`);
  const decoded = await page.locator('#card').evaluate(image => image.complete && image.naturalWidth === 1280 && image.naturalHeight === 640);
  if (!decoded) throw Error('Social card SVG failed to decode');
  await page.screenshot({ path: output, type: 'jpeg', quality: 86 });
  const stats = await stat(output);
  if (stats.size > 1_000_000) throw Error('Social JPG exceeds the 1 MB GitHub preview recommendation');
  console.log(`Rendered original 1280×640 social card: ${output} (${stats.size} bytes)`);
} finally {
  await browser.close();
}

/**
 * Browser smoke checks for MotionSites' static gallery and guide pages.
 * Run on GitHub Actions after installing Playwright + Chromium.
 * No demo source builds or remote media rights are asserted here.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'http://127.0.0.1:4197';
const server = spawn('python3', ['-m', 'http.server', '4197', '--bind', '127.0.0.1', '--directory', resolve(root, 'site')], {
  stdio: 'ignore',
});
let browser;

async function ready() {
  for (let attempt = 0; attempt < 45; attempt++) {
    try {
      const response = await fetch(origin + '/');
      if (response.ok) return;
    } catch { /* server may still be starting */ }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw Error('Local static server failed to start');
}

const log = label => process.stdout.write('PASS ' + label + '\n');
try {
  await ready();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // First verify graceful behavior when no preview manifest is published.
  await page.route('**/previews/manifest.json', route =>
    route.fulfill({ status: 404, body: 'not published' }));
  await page.goto(origin + '/', { waitUntil: 'load' });
  await page.locator('#grid .card').first().waitFor();
  assert.equal(await page.locator('#grid .card').count(), 30);
  assert.equal(await page.locator('.project-badge--neutral').count(), 30);
  log('30 source-only cards without a deployed demo manifest');

  await page.locator('button[data-tag="GSAP"]').click();
  assert.equal(await page.locator('#grid .card').count(), 2);
  await page.locator('#search').fill('Axion');
  assert.equal(await page.locator('#grid .card').count(), 1);
  assert.match(page.url(), /stack=GSAP/);
  assert.match(page.url(), /q=Axion/);
  log('stack filtering, search and shareable URL state');

  await page.locator('#demo-only').check();
  assert.equal(await page.locator('#grid .card').count(), 0);
  assert.equal(await page.locator('#empty').isVisible(), true);
  await page.locator('#reset-filters').click();
  assert.equal(await page.locator('#grid .card').count(), 30);
  log('demo-only and reset behavior');

  await page.keyboard.press('/');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'search');
  await page.keyboard.type('Prisma');
  assert.equal(await page.locator('#grid .card').count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#search').inputValue(), '');
  log('keyboard shortcuts');

  await page.goto(origin + '/project.html?id=20');
  await page.locator('#detail-content').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#detail-title').innerText(), 'Axion Studio');
  assert.ok(await page.locator('#detail-notes a').count() >= 1);
  assert.match(await page.locator('#detail-command').innerText(), /npm run dev/);
  assert.equal(await page.locator('#detail-demo').isVisible(), false);
  log('source-backed detail guide without a demo manifest');

  await page.goto(origin + '/project.html?id=404');
  assert.equal(await page.locator('#detail-content').isVisible(), false);
  assert.match(await page.locator('#detail-status').innerText(), /Choose a project/);
  log('invalid project ID');

  // Simulate a correctly generated CI manifest: no remote demos required.
  await page.unroute('**/previews/manifest.json');
  await page.route('**/previews/manifest.json', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      captures: [{ id: 20, image: 'previews/axion-studio.jpg', demo: 'demos/axion-studio/' }],
    }) }));
  await page.goto(origin + '/?demos=1');
  await page.locator('#grid .card').first().waitFor();
  assert.equal(await page.locator('#grid .card').count(), 1);
  assert.match(await page.locator('.open--demo').getAttribute('href'), /demos\/axion-studio/);
  log('published manifest correctly enables a verified demo link');

  await page.getByText('Screenshot failed to load · Try live demo').waitFor();
  log('missing gallery screenshot renders a truthful fallback');

  await page.goto(origin + '/project.html?id=20');
  await page.locator('#detail-content').waitFor({ state: 'visible' });
  await page.getByText('Screenshot unavailable · Live demo link may still work').waitFor();
  log('missing guide screenshot renders a truthful fallback');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(origin + '/');
  await page.locator('#grid .card').first().waitFor();
  const metrics = await page.evaluate(() => ({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    orbAnimation: getComputedStyle(document.querySelector('.orb')).animationName,
  }));
  assert.ok(metrics.documentWidth <= metrics.viewport + 2, JSON.stringify(metrics));
  assert.equal(metrics.orbAnimation, 'none');
  log('390px mobile overflow and reduced-motion CSS');

  assert.deepEqual(errors, []);
  log('no uncaught browser page errors');
  await page.close();
} finally {
  if (browser) await browser.close();
  server.kill();
}

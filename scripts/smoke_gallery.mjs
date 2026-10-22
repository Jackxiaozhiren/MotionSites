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
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // First verify graceful behavior when no preview manifest is published.
  await page.route('**/previews/manifest.json', async route => {
    // Hold the manifest request open to ensure the UI does not claim a source-only
    // state before it knows whether verified live demos have been published.
    await new Promise(resolve => setTimeout(resolve, 1200));
    await route.fulfill({ status: 404, body: 'not published' });
  });
  await page.goto(origin + '/', { waitUntil: 'load' });
  await page.locator('#grid .card').first().waitFor();
  assert.equal(await page.locator('#grid .card').count(), 30);
  assert.equal(await page.locator('.project-badge--neutral').first().innerText(), 'Checking demo…');
  await page.waitForFunction(() => {
    const badges = [...document.querySelectorAll('.project-badge--neutral')];
    return badges.length === 30 && badges.every(badge => badge.textContent.trim() === 'Source only');
  });
  assert.equal(await page.locator('.hero-stage .stage-shot').count(), 3);
  assert.equal(await page.locator('.hero-stage .stage-shot img[src]').count(), 0,
    'Hero must not request screenshots before the published manifest verifies them');
  assert.equal(await page.locator('.hero-stage .stage-placeholder').count(), 3,
    'Authored typographic artwork should replace unverified screenshots');
  assert.equal(await page.locator('.feature-focus-card').count(), 2);
  assert.equal(await page.locator('.feature-focus-media img[src]').count(), 0,
    'Extra editorial features must not load unverified photos');
  assert.equal(await page.locator('.feature-focus-card a[href^="demos/"]').count(), 2,
    'Featured studies must link to real demos');
  assert.equal(await page.locator('#reading-progress').count(), 1);
  assert.equal(await page.locator('#back-to-top').isVisible(), false);
  assert.equal(await page.locator('.orb').count(), 0,
    'The old generic placeholder orb must not be shown in the new hero');
  log('editorial hero has named real-project links and honest screenshot fallbacks');
  log('30 source-only cards without a manifest; loading state avoids premature labels');

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
      captures: [{ id: 20, image: 'previews/missing-test-fixture.jpg', demo: 'demos/axion-studio/' }],
    }) }));
  await page.goto(origin + '/?demos=1');
  await page.locator('#grid .card').first().waitFor();
  assert.equal(await page.locator('#grid .card').count(), 1);
  assert.match(await page.locator('.open--demo').getAttribute('href'), /demos\/axion-studio/);
  assert.equal(await page.locator('.stage-shot img[src]').count(), 0,
    'A one-project manifest must not mark unlisted hero screenshots as verified');
  assert.equal(await page.locator('.feature-focus-media img[src]').count(), 1,
    'Only a verified featured project should load its true screenshot');
  log('published manifest correctly enables a verified demo link');

  // Card previews may load automatically. Turn them off and await teardown
  // *before* installing the request counter for the separate modal test.
  // Otherwise an in-flight card request is mistaken for a second modal load.
  await page.locator('#live-previews').uncheck();
  await page.waitForFunction(() => document.querySelectorAll('.live-layer iframe').length === 0);
  // The explicit modal never leaves a frame running after Close or Escape.
  let demoLoads = 0;
  await page.route('**/demos/axion-studio/', async route => {
    demoLoads += 1;
    await new Promise(resolve => setTimeout(resolve, 650));
    return route.fulfill({
      status: 200, contentType: 'text/html',
      body: '<!doctype html><title>Fixture Demo</title><main id="inline-sample">A genuine interactive demo is now ready for the visitor to explore.</main>',
    });
  });
  assert.equal(demoLoads, 0, 'Demo must not load before a visitor opens it');
  // The modal test is separate from autoplaying card previews.
  const inlineButton = page.locator('button[data-preview-id="20"]');
  assert.equal(await inlineButton.count(), 1);
  assert.equal(await page.locator('#demo-frame').getAttribute('src'), null);
  await inlineButton.click();
  assert.equal(await page.locator('#demo-loading').isVisible(), true);
  assert.equal(await page.locator('#demo-dialog').evaluate(node => node.open), true);
  assert.match(await page.locator('#demo-frame').getAttribute('src'), /^demos\/axion-studio\/$/);
  await page.frameLocator('#demo-frame').locator('#inline-sample').waitFor();
  await page.locator('#demo-loading').waitFor({ state: 'hidden', timeout: 5000 });
  assert.equal(demoLoads, 1);

  assert.equal(await page.locator('#demo-dialog-title').innerText(), 'Axion Studio');
  assert.match(await page.locator('#demo-source').getAttribute('href'), /projects\/axion-studio/);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#demo-dialog').open && !document.querySelector('#demo-frame').hasAttribute('src'));
  assert.equal(await page.locator('#demo-frame').getAttribute('src'), null);
  assert.equal(demoLoads, 1);
  log('user-triggered inline demo and Escape cleanup on desktop');


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
    editorialHero: Boolean(document.querySelector('.hero-stage .stage-shot')),
    featuredPanels: document.querySelectorAll('.hero-stage .stage-shot').length,
    stageTransition: getComputedStyle(document.querySelector('.stage-shot')).transitionDuration,
  }));
  assert.ok(metrics.documentWidth <= metrics.viewport + 2, JSON.stringify(metrics));
  assert.equal(metrics.featuredPanels, 3, 'Hero should feature three real site previews');
  assert.equal(metrics.editorialHero, true);
  assert.equal(metrics.stageTransition, '0s', 'Reduced motion disables decorative transitions');
  assert.equal(await page.locator('.feature-focus-card').first()
    .evaluate(el => getComputedStyle(el).transitionDuration), '0s');
  assert.equal(await page.locator('nav').evaluate(el => getComputedStyle(el).position), 'sticky');
  await page.evaluate(() => scrollTo(0, 1400));
  await page.locator('#back-to-top').waitFor({state:'visible'});
  const railTransform = await page.locator('#reading-progress')
    .evaluate(el => getComputedStyle(el).transform);
  assert.notEqual(railTransform, 'matrix(0, 0, 0, 1, 0, 0)');
  await page.locator('#back-to-top').click();
  await page.waitForFunction(() => scrollY < 5);
  log('sticky reading-progress rail and keyboard-focusable return-to-top');

  // Mobile dialog should remain inside the viewport and respond to Close.
  await page.unroute('**/previews/manifest.json');
  await page.route('**/previews/manifest.json', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      captures: [{ id: 20, image: 'previews/missing-test-fixture.jpg', demo: 'demos/axion-studio/' }],
    }) }));
  await page.goto(origin + '/?demos=1');
  await page.locator('button[data-preview-id="20"]').click();
  const dialogBounds = await page.locator('#demo-dialog').boundingBox();
  assert.ok(dialogBounds && dialogBounds.x >= 0 && dialogBounds.x + dialogBounds.width <= 391,
    JSON.stringify(dialogBounds));
  assert.equal(await page.locator('#demo-frame').getAttribute('src'), 'demos/axion-studio/');
  await page.locator('#demo-close').click();
  await page.waitForFunction(() => !document.querySelector('#demo-frame').hasAttribute('src'));
  assert.equal(await page.locator('#demo-frame').getAttribute('src'), null);
  log('mobile demo overlay fits and releases its iframe');

  log('390px mobile overflow and reduced-motion CSS');

  assert.deepEqual(errors, []);
  log('no uncaught browser page errors');
  await page.close();
} finally {
  if (browser) await browser.close();
  server.kill();
}

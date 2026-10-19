/** Verify the publicly deployed GitHub Pages site in real Chromium.
 * Called only after actions/deploy-pages has completed. This checks routing and
 * built assets, not copyright, media licensing, Lighthouse, or external video.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const origin = (process.env.MOTIONSITES_PAGE_URL || 'https://jackxiaozhiren.github.io/MotionSites/').replace(/\/?$/, '/');
const browser = await chromium.launch({ headless: true });
let success = false;
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      errors.length = 0;
      await page.goto(origin, { waitUntil: 'load', timeout: 20000 });
      await page.locator('#grid .card').first().waitFor({ timeout: 12000 });
      assert.equal(await page.locator('#grid .card').count(), 30);

      await page.goto(origin + 'project.html?id=20', { waitUntil: 'load', timeout: 20000 });
      await page.locator('#detail-content').waitFor({ state: 'visible', timeout: 12000 });
      assert.equal(await page.locator('#detail-title').innerText(), 'Axion Studio');

      const asset = await page.request.get(origin + 'assets/social-preview.jpg', { timeout: 12000 });
      assert.equal(asset.status(), 200, 'Rendered social JPG not served');
      const bytes = await asset.body();
      assert.ok(bytes.length >= 10000 && bytes.length < 1_000_000, 'Invalid social JPG size');
      assert.equal(bytes[0], 0xff);
      assert.equal(bytes[1], 0xd8);

      const response = await page.request.get(origin + 'previews/manifest.json', { timeout: 12000 });
      if (response.ok()) {
        const manifest = await response.json();
        assert.ok(Array.isArray(manifest.captures), 'Invalid manifest payload');
        for (const capture of manifest.captures) {
          assert.match(capture.image, /^previews\/[a-z0-9-]+\.jpg$/);
          assert.match(capture.demo, /^demos\/[a-z0-9-]+\/$/);
          const [image, demo] = await Promise.all([
            page.request.get(origin + capture.image, { timeout: 12000 }),
            page.request.get(origin + capture.demo, { timeout: 12000 }),
          ]);
          assert.equal(image.status(), 200, 'Broken screenshot: ' + capture.image);
          assert.equal(demo.status(), 200, 'Broken demo: ' + capture.demo);
        }
        console.log('Verified ' + manifest.captures.length + ' published demo and screenshot links.');

        // Verify the full production preview lifecycle, not just HTTP 200s.
        // Axion is selected because its current build exposes real body content
        // without needing a third-party autoplay permission.
        const axion = manifest.captures.find(item => item.id === 20);
        if (axion) {
          const frameRequests = [];
          page.on('request', request => {
            if (request.isNavigationRequest() &&
                request.url().startsWith(origin + 'demos/')) {
              frameRequests.push(request.url());
            }
          });
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await page.goto(origin + '?demos=1', { waitUntil: 'load', timeout: 20000 });
          await page.waitForFunction(expected => document.querySelectorAll('#grid .card').length === expected,
            manifest.captures.length, { timeout: 15000 });
          assert.equal(await page.locator('#demo-frame').getAttribute('src'), null,
            'Preview iframe should not load on gallery entry');
          assert.equal(frameRequests.length, 0, 'A demo was requested before user interaction');

          await page.locator('button[data-preview-id="20"]').click();
          assert.equal(await page.locator('#demo-dialog').evaluate(node => node.open), true);
          assert.equal(await page.locator('#demo-frame').getAttribute('src'), axion.demo);
          await page.waitForFunction(() => {
            const frame = document.querySelector('#demo-frame');
            try {
              const doc = frame?.contentDocument;
              return doc?.readyState === 'complete' &&
                (doc.body?.innerText?.trim().length || 0) >= 30;
            } catch { return false; }
          }, null, { timeout: 20000 });
          await page.locator('#demo-loading').waitFor({ state: 'hidden', timeout: 5000 });
          assert.ok(frameRequests.length >= 1, 'Click did not initiate demo navigation');
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => {
            const dialog = document.querySelector('#demo-dialog');
            return !dialog.open && !document.querySelector('#demo-frame').hasAttribute('src');
          });
          assert.equal(await page.evaluate(() => document.activeElement?.dataset?.previewId), '20',
            'Keyboard focus should return to the preview button after Escape');

          await page.setViewportSize({ width: 390, height: 844 });
          await page.goto(origin + '?demos=1', { waitUntil: 'load', timeout: 20000 });
          await page.waitForFunction(() => document.querySelector('button[data-preview-id="20"]') !== null);
          await page.locator('button[data-preview-id="20"]').click();
          const bounds = await page.locator('#demo-dialog').boundingBox();
          assert.ok(bounds && bounds.x >= -1 && bounds.x + bounds.width <= 392,
            'Mobile dialog overflows the viewport: ' + JSON.stringify(bounds));
          await page.locator('#demo-close').click();
          await page.waitForFunction(() => !document.querySelector('#demo-dialog').open &&
            !document.querySelector('#demo-frame').hasAttribute('src'));
          console.log('PASS live inline preview: lazy-load, readable iframe, focus restoration, mobile bounds and cleanup.');
        }
      } else if (response.status() === 404) {
        console.log('No demo manifest published; gallery remains source-only.');
      } else {
        throw Error('Unexpected manifest response: ' + response.status());
      }

      assert.deepEqual(errors, [], 'Uncaught browser exceptions');
      console.log('PASS public site: gallery, 30 cards, Axion guide, social JPG and demo routes at ' + origin);
      success = true;
      break;
    } catch (error) {
      console.warn('Deployment check attempt ' + attempt + '/10: ' + String(error));
      if (attempt < 10) await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  await page.close();
} finally {
  await browser.close();
}
if (!success) throw Error('Live GitHub Pages smoke checks failed after deployment retries');

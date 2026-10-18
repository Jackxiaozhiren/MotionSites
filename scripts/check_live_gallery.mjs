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

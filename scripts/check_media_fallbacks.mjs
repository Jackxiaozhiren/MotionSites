/**
 * Regression checks for the seven previously reported media-error demos.
 * Run after scripts/capture_previews.mjs builds site/demos in CI.
 * Neither remote assets nor their licenses are copied or assumed.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'http://127.0.0.1:4196/';
const projects = [
  'aethera', 'vex', 'asme-motion', 'securify', 'linkflow',
  'axion-studio-subproject', 'equilibrium',
];
const server = spawn('python3', ['-m', 'http.server', '4196', '--bind', '127.0.0.1',
  '--directory', resolve(root, 'site')], { stdio: 'ignore' });
let browser;
async function ready() {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(origin)).ok) return; } catch { /* server starting */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw Error('Gallery test server unavailable');
}
try {
  await ready();
  browser = await chromium.launch({headless:true});
  for (const slug of projects) {
    const errors = [];
    const context = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
    const page = await context.newPage();
    const remoteMediaRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      try {
        const path = new URL(request.url()).pathname.toLowerCase();
        if (/\.(?:mp4|webm|mov)$/.test(path)) remoteMediaRequests.push(path.split('/').pop());
      } catch { /* ignore malformed external request URL */ }
    });
    try {
      const response = await page.goto(origin+'demos/'+slug+'/',{waitUntil:'domcontentloaded',timeout:20000});
      assert.equal(response?.status(),200,slug+' demo not served');
      await page.waitForTimeout(350);
      assert.equal(await page.locator('video').count(),0,slug+' still mounts decorative video with reduced motion');
      assert.equal(remoteMediaRequests.length,0,slug+' still requests external video despite reduced motion');
      assert.ok(await page.locator('body').innerText().then(s=>s.trim().length>=30),slug+' lost useful content');
      assert.deepEqual(errors,[],slug+' had an uncaught JS exception');
      console.log('PASS reduced motion: '+slug+' — static, readable, no video requests.');
    } finally { await context.close(); }

    const failureContext = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
    const failedPage = await failureContext.newPage();
    const failureErrors = [];
    failedPage.on('pageerror', error=>failureErrors.push(error.message));
    await failedPage.route('**/*', route => {
      try {
        const path = new URL(route.request().url()).pathname.toLowerCase();
        if (/\.(?:mp4|webm|mov)$/.test(path)) return route.abort('failed');
      } catch { /* regular routing */ }
      return route.continue();
    });
    try {
      await failedPage.goto(origin+'demos/'+slug+'/',{waitUntil:'domcontentloaded',timeout:20000});
      await failedPage.waitForTimeout(450);
      assert.ok(await failedPage.locator('body').innerText().then(s=>s.trim().length>=30),
        slug+' lost page content after remote media failure');
      assert.deepEqual(failureErrors,[],slug+' threw when media was blocked');
      console.log('PASS media unavailable: '+slug+' — page remains usable.');
    } finally { await failureContext.close(); }
  }
} finally {
  if(browser) await browser.close();
  server.kill();
}

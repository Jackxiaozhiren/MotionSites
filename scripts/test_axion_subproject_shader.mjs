/** Browser regression for the Axion subproject's decorative Shader rendering.
 * No external asset or media dependency is required to pass.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(repo, 'projects/axion-studio-subproject');
const origin = 'http://127.0.0.1:4287/';
const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4287', '--strictPort'], {
  cwd: dir,
  stdio: 'ignore',
});
let browser;
try {
  let ready = false;
  for (let n = 0; n < 100; n++) {
    try {
      if ((await fetch(origin)).ok) { ready = true; break; }
    } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  assert.ok(ready, 'Axion Vite server did not start');
  browser = await chromium.launch({headless: true});

  const reduced = await browser.newPage({viewport:{width:1000,height:800},reducedMotion:'reduce'});
  const errors = [];
  reduced.on('pageerror', error => errors.push(error.message));
  await reduced.goto(origin, {waitUntil:'domcontentloaded'});
  await reduced.locator('h1').waitFor();
  assert.equal(await reduced.locator('canvas[data-renderer="shaders"]').count(), 0,
    'prefers-reduced-motion: reduce must not allocate a WebGL/WebGPU canvas');
  assert.match(
    await reduced.locator('section').first().locator('div.pointer-events-none').first()
      .evaluate(el => getComputedStyle(el).backgroundImage),
    /gradient/, 'Reduced-motion mode must retain a visible static fallback');
  console.log('PASS Axion: reduced motion uses a visible static background, without shader canvas');

  await reduced.emulateMedia({reducedMotion:'no-preference'});
  await reduced.locator('canvas[data-renderer="shaders"]').waitFor({state:'attached'});
  const full = await reduced.locator('.shader').evaluate(el => ({
    elementWidth: el.getBoundingClientRect().width,
    containerWidth: el.parentElement.getBoundingClientRect().width,
    cssWidth: parseFloat(getComputedStyle(el).width),
  }));
  assert.ok(Math.abs(full.elementWidth - full.containerWidth) < 2, 'Shader still covers the full hero');
  assert.ok(Math.abs(full.cssWidth / full.containerWidth - 0.75) < 0.025,
    'Full demo should render at 75% resolution: ' + JSON.stringify(full));
  await reduced.emulateMedia({reducedMotion:'reduce'});
  await reduced.waitForFunction(() => document.querySelectorAll('canvas[data-renderer="shaders"]').length === 0);
  assert.deepEqual(errors, [], 'Unexpected page JavaScript error on motion-mode toggle');
  console.log('PASS Axion: normal mode preserves full-size visual coverage; motion setting changes live');
  await reduced.close();

  const outer = await browser.newPage({viewport: {width:1100,height:880}});
  await outer.goto(origin, {waitUntil:'domcontentloaded'});
  await outer.setContent('<iframe title="Embedded Axion" style="width:1000px;height:800px;border:0" src="' + origin + '"></iframe>');
  const inside = outer.frameLocator('iframe[title="Embedded Axion"]');
  await inside.locator('.shader').waitFor();
  const embedded = await inside.locator('.shader').evaluate(el => ({
    width: el.getBoundingClientRect().width,
    containerWidth: el.parentElement.getBoundingClientRect().width,
    cssWidth: parseFloat(getComputedStyle(el).width),
  }));
  assert.ok(Math.abs(embedded.width - embedded.containerWidth) < 2, 'Embedded shader fills its hero');
  assert.ok(Math.abs(embedded.cssWidth / embedded.containerWidth - 0.60) < 0.025,
    'Gallery iframe should use 60% internal resolution: ' + JSON.stringify(embedded));
  console.log('PASS Axion: embedded previews retain full coverage at lower render resolution');
  await outer.close();
} finally {
  await browser?.close();
  server.kill();
}
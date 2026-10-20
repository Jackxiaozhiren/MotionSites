/**
 * WebKit (Safari-engine) regression test for the zero-dependency gallery.
 * Uses local source and mocked same-origin demo routes, so this checks a PR's
 * proposed code instead of whichever version currently happens to be online.
 * Playwright WebKit is NOT equivalent to native Safari or iPhone QA.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webkit } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'http://127.0.0.1:4203/';
const server = spawn('python3', [
  '-m','http.server','4203','--bind','127.0.0.1',
  '--directory',resolve(root,'site'),
],{stdio:'ignore'});
let browser;

async function ready() {
  for (let n=0;n<50;n++) {
    try { if ((await fetch(origin)).ok) return; } catch { /* server starting */ }
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  throw Error('Static gallery server did not start');
}

try {
  await ready();
  browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route('**/previews/manifest.json', route => route.fulfill({
    status:200,contentType:'application/json',
    body:JSON.stringify({ captures: [
      {id:20,image:'previews/nonexistent-webkit-test.jpg',demo:'demos/axion-studio/'},
    ] }),
  }));
  let demoLoads=0;
  await page.route('**/demos/axion-studio/', route => {
    demoLoads++;
    return route.fulfill({
      status:200,contentType:'text/html',
      body:'<!doctype html><html><body><main id="webkit-demo">A verified local WebKit test demo with readable content.</main></body></html>',
    });
  });

  await page.goto(origin+'?demos=1',{waitUntil:'load'});
  await page.waitForFunction(()=>document.querySelectorAll('#grid .card').length===1);
  assert.equal(demoLoads,0,'iframe loaded before explicit user action');
  const opener=page.locator('button[data-preview-id="20"]');
  assert.equal(await opener.count(),1);
  assert.equal(await page.locator('#demo-frame').getAttribute('src'),null);

  // On macOS WebKit, a pointer click may not focus its button. The native
  // dialog then closes with focus on body unless the app explicitly restores it.
  await opener.click();
  assert.equal(await page.locator('#demo-dialog').evaluate(el=>el.open),true);
  await page.frameLocator('#demo-frame').locator('#webkit-demo').waitFor({timeout:10000});
  await page.locator('#demo-loading').waitFor({state:'hidden',timeout:5000});
  assert.equal(demoLoads,1,'preview should load once after request');
  const box=await page.locator('#demo-dialog').boundingBox();
  assert.ok(box && box.x >= -1 && box.x+box.width <= 392,
    'Dialog exceeds 390px viewport '+JSON.stringify(box));

  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>
    !document.querySelector('#demo-dialog').open &&
    !document.querySelector('#demo-frame').hasAttribute('src'));
  await page.waitForFunction(()=>
    document.activeElement?.dataset?.previewId === '20');
  console.log('PASS WebKit: pointer-opened dialog returns focus on Escape');

  // Also check keyboard activation and explicit Close button.
  await opener.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#demo-dialog').evaluate(el=>el.open),true);
  await page.locator('#demo-close').click();
  await page.waitForFunction(()=>
    !document.querySelector('#demo-dialog').open &&
    !document.querySelector('#demo-frame').hasAttribute('src') &&
    document.activeElement?.dataset?.previewId === '20');
  console.log('PASS WebKit: keyboard-opened dialog returns focus on Close');

  await page.goto(origin+'project.html?id=20',{waitUntil:'load'});
  await page.locator('#detail-content').waitFor({state:'visible'});
  assert.equal(await page.locator('#detail-title').innerText(),'Axion Studio');
  const layout=await page.evaluate(()=>({
    width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
  }));
  assert.ok(layout.scrollWidth <= layout.width+2,
    'Mobile WebKit guide overflows: '+JSON.stringify(layout));
  assert.deepEqual(pageErrors,[],'Uncaught errors in WebKit');
  console.log('PASS WebKit: 390px guide, mobile overflow and JavaScript exceptions');
  await context.close();
} finally {
  if(browser) await browser.close();
  server.kill();
}

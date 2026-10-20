/** Verify real card auto-scroll without 30 simultaneous iframes.
 * Uses the PR's gallery source and same-origin deterministic fixture pages.
 * Run with Playwright Chromium and WebKit to protect both engines.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'http://127.0.0.1:4205/';
const server = spawn('python3', [
  '-m', 'http.server', '4205', '--bind', '127.0.0.1',
  '--directory', resolve(root, 'site'),
], { stdio: 'ignore' });
const engine = process.env.MOTIONSITES_TEST_ENGINE === 'webkit' ? webkit : chromium;
let browser;

async function ready() {
  for (let i = 0; i < 45; i++) {
    try { if ((await fetch(origin)).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw Error('Test gallery server unavailable');
}

try {
  await ready();
  browser = await engine.launch({ headless: true });
  const context = await browser.newContext({ viewport: {width:390,height:844} });
  const page = await context.newPage();
  const errors = [];
  let requests = 0;
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/previews/manifest.json', route => route.fulfill({
    status:200,contentType:'application/json',
    body:JSON.stringify({captures:[
      {id:20,image:'previews/axion-studio.jpg',demo:'demos/axion-studio/'},
      {id:22,image:'previews/wanderful.jpg',demo:'demos/wanderful/'},
    ]}),
  }));
  await page.route('**/demos/*/', route => {
    requests++;
    return route.fulfill({
      status:200,contentType:'text/html',
      body:`<!doctype html><html lang="en"><head><title>Scrolling fixture</title>
        <style>html{scroll-behavior:auto}body{margin:0;background:#123;color:white}
        main{height:2600px;display:flex;flex-direction:column;justify-content:space-between}</style>
        </head><body><main><h1>Motion preview at top</h1>
        <footer>Motion preview at the bottom of a long sample project</footer></main>
        </body></html>`,
    });
  });

  await page.goto(origin, {waitUntil:'load'});
  await page.waitForFunction(() => document.querySelectorAll('#grid .card').length === 30);
  assert.equal(await page.locator('#live-previews').isChecked(), true);
  assert.equal(await page.locator('.live-layer iframe').count(), 0,
    'Do not prefetch 30 demos on page entry');
  assert.equal(requests,0);
  const first = page.locator('.card[data-demo="demos/axion-studio/"]');
  await first.scrollIntoViewIfNeeded();
  await first.locator('.live-layer iframe').waitFor({timeout:10000});
  await page.waitForFunction(() => {
    const frame=document.querySelector('.card[data-demo="demos/axion-studio/"] .live-layer iframe');
    return !!frame?.contentDocument?.body &&
      frame.contentDocument.scrollingElement?.scrollTop > 30;
  },null,{timeout:7500});
  const scroll = await first.locator('iframe').evaluate(frame => ({
    top:frame.contentDocument.scrollingElement.scrollTop,
    height:frame.contentDocument.scrollingElement.scrollHeight,
  }));
  assert.ok(scroll.top>30 && scroll.height>1800,JSON.stringify(scroll));
  assert.ok(await page.locator('.live-layer iframe').count()<=1,
    '390px mobile must run at most one iframe');
  console.log('PASS '+engine.name()+': actual visible iframe scrolls down automatically');

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForFunction(()=>document.querySelectorAll('.live-layer iframe').length===0,
    null,{timeout:7500});
  console.log('PASS '+engine.name()+': offscreen demo iframe unloaded');

  await first.scrollIntoViewIfNeeded();
  await first.locator('.live-layer iframe').waitFor();
  await page.locator('#live-previews').uncheck();
  assert.equal(await page.locator('.live-layer iframe').count(),0);
  assert.equal(await page.locator('.grid.live-grid').count(),0);
  console.log('PASS '+engine.name()+': manual screenshot mode stops all demos');
  await page.locator('#live-previews').check();
  await first.scrollIntoViewIfNeeded();
  await first.locator('.live-layer iframe').waitFor();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(()=>document.querySelectorAll('.live-layer iframe').length===0);
  assert.equal(await page.locator('#live-previews').isDisabled(),true);
  console.log('PASS '+engine.name()+': reduced motion disables automatic previews');

  assert.deepEqual(errors,[],'JavaScript errors in gallery');
  await context.close();
} finally {
  if(browser) await browser.close();
  server.kill();
}

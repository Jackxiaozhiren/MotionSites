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
        main{height:1350px;display:flex;flex-direction:column;justify-content:space-between}
        #hover-target{position:fixed;top:70px;left:20px;height:70px;width:140px;background:rgb(150,0,0)}
        #hover-target:hover{background:rgb(0,150,0)}</style>
        </head><body><main><h1>Motion preview at top</h1>
        <footer>Motion preview at the bottom of a long sample project</footer></main>
        <div id="hover-target">Hover animation</div>
        </body></html>`,
    });
  });

  await page.goto(origin, {waitUntil:'load'});
  await page.waitForFunction(() => document.querySelectorAll('#grid .card').length === 30);
  assert.equal(await page.locator('#live-previews').isChecked(), true);
  assert.ok(await page.locator('.live-layer iframe').count() <= 2,
    'Never prefetch more than two nearby mobile iframes');
  assert.ok(requests <= 2, 'Do not eagerly fetch all 30 demos');
  const first = page.locator('.card[data-demo="demos/axion-studio/"]');
  await first.scrollIntoViewIfNeeded();
  await first.locator('.live-layer iframe').waitFor({timeout:10000});
  await page.waitForFunction(() => {
    const frame=document.querySelector('.card[data-demo="demos/axion-studio/"] .live-layer iframe');
    return !!frame?.contentDocument?.body &&
      frame.contentDocument.scrollingElement?.scrollTop > 30;
  },null,{timeout:7500});
  const scroll = await first.locator('iframe').evaluate(frame => {
    const layer = frame.closest('.live-layer');
    const rect = frame.getBoundingClientRect();
    return {
      top:frame.contentDocument.scrollingElement.scrollTop,
      height:frame.contentDocument.scrollingElement.scrollHeight,
      frameVisibleHeight:rect.height,
      cardVisibleHeight:layer.getBoundingClientRect().height,
    };
  });
  assert.ok(scroll.top>30 && scroll.height>1200,JSON.stringify(scroll));
  assert.ok(Math.abs(scroll.frameVisibleHeight-scroll.cardVisibleHeight)<2,
    'Scaled iframe viewport must fill the card crop: '+JSON.stringify(scroll));
  assert.ok(await page.locator('.live-layer iframe').count()<=2,
    '390px mobile must run at most two nearby iframes');

  // Reaching the DOM scroll limit is not enough: the actual footer must
  // become visible through the cropped live card instead of hiding beneath it.
  await page.waitForFunction(() => {
    const frame=document.querySelector('.card[data-demo="demos/axion-studio/"] .live-layer iframe');
    const doc=frame?.contentDocument;
    const footer=doc?.querySelector('footer');
    if (!footer) return false;
    const bounds=footer.getBoundingClientRect();
    const viewport=frame.getBoundingClientRect().height;
    const layer=frame.closest('.live-layer').getBoundingClientRect().height;
    return bounds.bottom <= doc.documentElement.clientHeight + 3 &&
      Math.abs(viewport-layer) < 2;
  }, null, {timeout:11000});
  console.log('PASS '+engine.name()+': mobile frame scrolls until its real footer is visible');

  // Short scroll reversals no longer destroy and rebuild the iframe.
  // Regression: the old 35% intersection threshold often unloaded it.
  const originalFrame = await first.locator('iframe').elementHandle();
  const beforeRequests = requests;
  await page.evaluate(() => scrollBy(0,60));
  await page.waitForTimeout(250);
  await page.evaluate(() => scrollBy(0,-60));
  await page.waitForTimeout(250);
  assert.ok(await first.locator('iframe').evaluate((el, original) => el === original,
    originalFrame),'Brief scroll reversals must preserve the iframe');
  assert.equal(requests,beforeRequests,'Brief scroll reversals must not re-fetch demo');
  console.log('PASS '+engine.name()+': near-viewport scrolling keeps iframe alive');

  if (await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)) {
    const hover = first.frameLocator('iframe').locator('#hover-target');
    await hover.hover({timeout:5000});
    const color=await hover.evaluate(el=>getComputedStyle(el).backgroundColor);
    assert.equal(color,'rgb(0, 150, 0)','Native CSS hover must work within live iframe');
    const outerBefore=await page.evaluate(()=>scrollY);
    await page.mouse.wheel(0,145);
    await page.waitForFunction(before=>scrollY>before+25,outerBefore,{timeout:5000});
    console.log('PASS '+engine.name()+': hover works; wheel scrolls parent gallery');
  }

  await page.setViewportSize({width:1440,height:900});
  await first.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const frame=document.querySelector('.card[data-demo="demos/axion-studio/"] .live-layer iframe');
    if (!frame) return false;
    const crop=frame.closest('.live-layer').getBoundingClientRect().height;
    return Math.abs(frame.getBoundingClientRect().height - crop)<2;
  },null,{timeout:7500});
  assert.ok(await page.locator('.live-layer iframe').count()<=3,
    'Desktop must run at most three nearby iframes');
  console.log('PASS '+engine.name()+': desktop frame scales to the visible card crop');

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForFunction(()=>document.querySelectorAll('.live-layer iframe').length===0,
    null,{timeout:7500});
  console.log('PASS '+engine.name()+': offscreen demo iframe unloaded');

  await first.scrollIntoViewIfNeeded();
  await first.locator('.live-layer iframe').waitFor();
  await page.locator('#live-previews').uncheck();
  await page.waitForFunction(() =>
    document.querySelectorAll('.live-layer iframe').length === 0 &&
    !document.querySelector('#grid').classList.contains('live-grid'));
  assert.equal(await page.locator('.live-layer iframe').count(),0);
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

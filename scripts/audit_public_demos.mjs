/**
 * Read-only real-public-Demo audit, 390px / reduced-motion Chromium.
 * Results are observations (not performance grades, licensing decisions or
 * claims that every external video will play on actual phones).
 * Only relative paths and hostnames are persisted; no remote URL query tokens.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const motionMode = process.env.MOTIONSITES_MOTION === 'no-preference' ? 'no-preference' : 'reduce';
const origin = 'https://jackxiaozhiren.github.io/MotionSites/';
const output = resolve('artifacts/production-browser');
const responseJSON = async path => {
  const response = await fetch(origin + path);
  if (!response.ok) throw Error(path + ' HTTP ' + response.status);
  return response.json();
};
const [catalog, manifest] = await Promise.all([
  responseJSON('projects.json'), responseJSON('previews/manifest.json'),
]);
assert.equal(catalog.length, 30, 'Catalog does not contain 30 projects');
assert.equal(manifest.captures.length, 30, 'Production manifest must contain 30 verified demos');
const captures = new Map(manifest.captures.map(item=>[item.id,item]));
assert.equal(captures.size, 30, 'Duplicate capture IDs');
const browser = await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const items = [];
let next = 0;
try {
  const workers = Array.from({length:3}, () => (async () => {
    while (next < catalog.length) {
      const project = catalog[next++];
      const capture = captures.get(project.id);
      if (!capture || !/^demos\/[a-z0-9-]+\/$/.test(capture.demo)) {
        items.push({id:project.id, title:project.title, problem:'Manifest path missing or invalid'});
        continue;
      }
      const item = {
        id:project.id, title:project.title, demo:capture.demo, viewport:'390x844', motionMode,
        status:null, textLength:0, horizontalOverflowPx:null,
        scriptErrors:0, brokenImageElements:0, mediaErrors:0,
        failedRequestsByHost:{}, failedHttpByHost:{}, failedHttpPaths:[], notes:[],
      };
      const context = await browser.newContext({
        viewport:{width:390,height:844}, reducedMotion:motionMode,
      });
      const page = await context.newPage();
      page.on('pageerror', () => item.scriptErrors++);
      page.on('requestfailed', request => {
        const hostname = new URL(request.url()).hostname;
        if (request.failure()?.errorText === 'net::ERR_ABORTED') return;
        item.failedRequestsByHost[hostname] = (item.failedRequestsByHost[hostname]||0)+1;
      });
      page.on('response', response => {
        if (response.status() >= 400) {
          const url = new URL(response.url());
          const hostname = url.hostname;
          item.failedHttpByHost[hostname] = (item.failedHttpByHost[hostname]||0)+1;
          // Record only this site's relative asset path; never persist external
          // URL paths or query strings that could contain sensitive tokens.
          if (url.origin === new URL(origin).origin) {
            const basePath = new URL(origin).pathname;
            const relativePath = url.pathname.startsWith(basePath)
              ? url.pathname.slice(basePath.length)
              : url.pathname.replace(/^\//, '');
            item.failedHttpPaths.push(relativePath + ' HTTP ' + response.status());
          }
        }
      });
      try {
        const response = await page.goto(origin+capture.demo, {waitUntil:'domcontentloaded',timeout:22000});
        item.status = response?.status() ?? null;
        // Wait for SPA content instead of assuming hydration finishes in 1.4s.
        // The bounded wait still flags pages that never render readable content.
        await page.waitForFunction(
          () => (document.body?.innerText?.trim().length || 0) >= 20,
          null,
          { timeout: 8000, polling: 200 },
        ).catch(() => {});
        const state=await page.evaluate(() => ({
          textLength:document.body?.innerText?.trim().length||0,
          horizontalOverflowPx:Math.max(0,document.documentElement.scrollWidth-innerWidth),
          brokenImageElements:[...document.images].filter(img=>img.complete && img.naturalWidth===0).length,
          mediaErrors:[...document.querySelectorAll('video,audio')].filter(node=>node.error).length,
        }));
        Object.assign(item,state);
        if (item.status!==200 || item.textLength<20) item.notes.push('Structural page or text loading problem');
        if (item.failedHttpPaths.length) item.notes.push('Same-origin HTTP errors: ' + item.failedHttpPaths.join(', '));
        if (item.horizontalOverflowPx>2) item.notes.push('Potential horizontal overflow on 390px');
        if (item.scriptErrors) item.notes.push('JavaScript runtime errors observed');
        if (item.brokenImageElements) item.notes.push('Broken image elements observed');
      } catch (error) {
        item.notes.push(error.name === 'TimeoutError' ? 'Navigation timeout' : 'Browser navigation or inspection failed');
      } finally {
        await context.close();
        items.push(item);
        console.log('Audited '+items.length+'/30: '+project.id+' '+project.title+' — '+item.notes.join('; '));
      }
    }
  })());
  await Promise.all(workers);
} finally { await browser.close(); }
items.sort((a,b)=>a.id-b.id);
const tally = key => items.filter(x=>(x[key]||0)>0).length;
const summary = {
  scope:'Published URLs, 390×844 '+motionMode+' Chromium, one navigation per demo',
  caveat:'Automated snapshot: dynamic content, external media, licensing, browser diversity, and real mobile hardware require further review.',
  total:items.length, navigated200:items.filter(x=>x.status===200).length,
  structuralProblems:items.filter(x=>x.status!==200 || x.textLength<20).length,
  horizontalOverflow:items.filter(x=>(x.horizontalOverflowPx||0)>2).length,
  pagesWithScriptErrors:tally('scriptErrors'), pagesWithBrokenImages:tally('brokenImageElements'),
  pagesWithMediaErrors:tally('mediaErrors'),
  pagesWithFailedRequests:items.filter(x=>Object.keys(x.failedRequestsByHost).length).length,
  pagesWithSameOriginHttpErrors:items.filter(x=>x.failedHttpPaths.length).length,
};
await mkdir(output,{recursive:true});
await writeFile(resolve(output, motionMode === 'reduce' ? 'all-demos.json' : 'all-demos-normal-motion.json'),JSON.stringify({summary,items},null,2)+'\n');
const lines=[
  '## Public 30-demo mobile browser audit ('+motionMode+')',
  '',
  '**Real published URLs in GitHub Actions Chromium, 390×844, motion setting '+motionMode+'. This is not manual iOS/Safari, a license determination or a field performance test.**',
  '',
  '| Metric | Count |','|---|---:|',
  ...Object.entries(summary).filter(([k,v])=>typeof v==='number').map(([key,value])=>'| '+key+' | '+value+' |'),
  '',
  'Full per-demo observations (hostnames only, no external URL tokens): Actions artifact for this motion setting.',
];
const markdown=lines.join('\n')+'\n';
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
if (summary.structuralProblems) throw Error(summary.structuralProblems+' published demos have structural/browser loading problems');

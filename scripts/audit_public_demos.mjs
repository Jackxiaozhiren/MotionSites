/**
 * Read-only real-public-Demo audit, 390px Chromium in both motion modes.
 * Results are observations (not performance grades, licensing decisions or
 * claims that every external video will play on actual phones).
 * Only relative paths and hostnames are persisted; no remote URL query tokens.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';

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
const motions = ['reduce', 'no-preference'];
const jobs = motions.flatMap(motion => catalog.map(project => ({project, motion})));
let next = 0;
try {
  const workers = Array.from({length:3}, () => (async () => {
    while (next < jobs.length) {
      const {project, motion} = jobs[next++];
      const capture = captures.get(project.id);
      if (!capture || !/^demos\/[a-z0-9-]+\/$/.test(capture.demo)) {
        items.push({id:project.id, title:project.title, motion, problem:'Manifest path missing or invalid'});
        continue;
      }
      const item = {
        id:project.id, title:project.title, demo:capture.demo, viewport:'390x844', motion,
        status:null, textLength:0, horizontalOverflowPx:null,
        scriptErrors:0, brokenImageElements:0, mediaErrors:0,
        videoElements:0, mediaPlayingElements:0,
        failedRequestsByHost:{}, failedHttpByHost:{}, failedHttpPaths:[], notes:[],
      };
      const context = await browser.newContext({
        viewport:{width:390,height:844}, reducedMotion:motion,
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
        // Allow a short bounded window for remote video error/playback state.
        // A video that has not started here is not necessarily broken.
        await page.waitForTimeout(1200);
        const state=await page.evaluate(() => ({
          textLength:document.body?.innerText?.trim().length||0,
          horizontalOverflowPx:Math.max(0,document.documentElement.scrollWidth-innerWidth),
          brokenImageElements:[...document.images].filter(img=>img.complete && img.naturalWidth===0).length,
          mediaErrors:[...document.querySelectorAll('video,audio')].filter(node=>node.error).length,
          videoElements:document.querySelectorAll('video').length,
          mediaPlayingElements:[...document.querySelectorAll('video,audio')].filter(node=>!node.paused && node.readyState >= 2).length,
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
        console.log('Audited '+items.length+'/'+jobs.length+' ['+motion+']: '+project.id+' '+project.title+' — '+item.notes.join('; '));
      }
    }
  })());
  await Promise.all(workers);
} finally { await browser.close(); }
items.sort((a,b)=>a.id-b.id || a.motion.localeCompare(b.motion));

function summarize(mode) {
  const observations = items.filter(item => item.motion === mode);
  const tally = key => observations.filter(item => (item[key] || 0) > 0).length;
  return {
    scope: 'Published URLs, 390×844 Chromium, motion='+mode+', one visit per demo',
    caveat: 'Automated snapshot. Media playing status is not proof of audible/visible playback, third-party availability or licensing. Physical Safari/Android and real-user metrics require additional testing.',
    total: observations.length,
    navigated200: observations.filter(item => item.status === 200).length,
    structuralProblems: observations.filter(item => item.status !== 200 || item.textLength < 20).length,
    horizontalOverflow: observations.filter(item => (item.horizontalOverflowPx || 0) > 2).length,
    pagesWithScriptErrors: tally('scriptErrors'),
    pagesWithBrokenImages: tally('brokenImageElements'),
    pagesWithMediaErrors: tally('mediaErrors'),
    pagesWithFailedRequests: observations.filter(item => Object.keys(item.failedRequestsByHost || {}).length).length,
    pagesWithSameOriginHttpErrors: observations.filter(item => (item.failedHttpPaths || []).length).length,
    pagesWithVideoElements: tally('videoElements'),
    pagesWithPlayingMediaAtSnapshot: tally('mediaPlayingElements'),
  };
}
const summary = summarize('reduce');
const normalMotionSummary = summarize('no-preference');

await mkdir(output,{recursive:true});
await writeFile(resolve(output,'all-demos.json'),JSON.stringify({
  methodology: '60 public Demo visits, 30 IDs in each motion mode; 390×844 Chromium with SPA hydration and a 1.2s media observation window.',
  summary, normalMotionSummary, items,
},null,2)+'\\n'.replace('\\n','\n'));

const metrics = [
  'navigated200', 'structuralProblems', 'horizontalOverflow', 'pagesWithScriptErrors',
  'pagesWithBrokenImages', 'pagesWithMediaErrors', 'pagesWithFailedRequests',
  'pagesWithSameOriginHttpErrors', 'pagesWithVideoElements', 'pagesWithPlayingMediaAtSnapshot',
];
const lines=[
  '## Public 30-demo browser audit — both motion preferences',
  '',
  '**Public URLs on 390×844 GitHub Actions Chromium. Media-playing elements at a 1.2s snapshot are not proof of usable playback. This is neither physical-device QA nor a license determination.**',
  '',
  '| Metric | Reduced motion (30 demos) | Normal motion (30 demos) |',
  '|---|---:|---:|',
  ...metrics.map(key => '| '+key+' | '+summary[key]+' | '+normalMotionSummary[key]+' |'),
  '',
  'Per-project error counts and failure hostnames: Actions artifact `production-demo-audit`.',
];
const markdown=lines.join('\\n'.replace('\\n','\n'))+'\\n'.replace('\\n','\n');
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
if (summary.structuralProblems || normalMotionSummary.structuralProblems) {
  throw Error('Structural failures: reduced '+summary.structuralProblems+', normal '+normalMotionSummary.structuralProblems);
}

/**
 * A read-only, time-separated normal-motion probe for two decorative videos.
 * This catches video failures missed by an early 1.2s gallery snapshot.
 *
 * Real production Chromium observations are not evidence of asset rights,
 * Safari compatibility, or video playback for all visitors.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = 'https://jackxiaozhiren.github.io/MotionSites/';
const targets = [
  { id: 20, name: 'Axion Studio' },
  { id: 22, name: 'Wanderful' },
];
const response = await fetch(origin + 'previews/manifest.json');
if (!response.ok) throw Error('Public manifest unavailable: HTTP ' + response.status);
const manifest = await response.json();
assert.ok(Array.isArray(manifest.captures), 'Missing published capture list');
const captures = new Map(manifest.captures.map(item => [item.id, item]));
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
const observations = [];
try {
  for (const target of targets) {
    const capture = captures.get(target.id);
    assert.ok(capture && /^demos\/[a-z0-9-]+\/$/.test(capture.demo),
      'Missing published demo for ' + target.name);

    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    const exceptions = [];
    const failedHosts = {};
    page.on('pageerror', error => exceptions.push(error.name));
    page.on('requestfailed', request => {
      if (request.failure()?.errorText === 'net::ERR_ABORTED') return;
      const hostname = new URL(request.url()).hostname;
      failedHosts[hostname] = (failedHosts[hostname] ?? 0) + 1;
    });

    const snapshot = async (seconds) => page.evaluate(seconds => {
      const video = document.querySelector('video');
      const fallback = document.querySelector('[data-video-fallback]');
      return {
        seconds,
        fallbackState: fallback?.getAttribute('data-video-fallback') ?? null,
        videoPresent: Boolean(video),
        currentTime: video ? Math.round(video.currentTime * 10) / 10 : null,
        readyState: video?.readyState ?? null,
        paused: video?.paused ?? null,
        errorCode: video?.error?.code ?? null,
        frameWidth: video?.videoWidth ?? null,
        textLength: document.body?.innerText?.trim().length ?? 0,
        horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      };
    }, seconds);

    try {
      const documentResponse = await page.goto(origin + capture.demo, {
        waitUntil: 'domcontentloaded',
        timeout: 25000,
      });
      assert.equal(documentResponse?.status(), 200, target.name + ' returned non-200');
      await page.waitForFunction(
        () => (document.body?.innerText?.trim().length ?? 0) >= 20,
        null,
        { timeout: 10000, polling: 200 },
      );
      const early = await snapshot(0);
      await page.waitForTimeout(3000);
      const middle = await snapshot(3);
      await page.waitForTimeout(3500);
      const late = await snapshot(6.5);
      assert.ok(late.textLength >= 20, target.name + ' stopped showing text');
      assert.equal(late.horizontalOverflow, 0, target.name + ' overflowed mobile viewport');
      assert.equal(exceptions.length, 0, target.name + ' raised page exceptions');

      const progressed = Boolean(late.videoPresent && late.readyState >= 2 &&
        late.currentTime !== null &&
        late.currentTime - (early.currentTime ?? 0) >= 0.5);
      const fallback = late.fallbackState === 'error';
      const outcome = progressed ? 'playback-progress-observed'
        : fallback ? 'media-error-handled-by-fallback'
        : 'playback-not-confirmed-within-window';
      observations.push({
        projectId: target.id,
        project: target.name,
        demo: capture.demo,
        outcome,
        early, middle, late,
        exceptions: exceptions.length,
        failedRequestHosts: failedHosts,
      });
      console.log(target.name + ': ' + outcome +
        ' (early=' + early.currentTime + ', late=' + late.currentTime +
        ', fallback=' + late.fallbackState + ')');
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
const output = resolve('artifacts/production-browser');
await mkdir(output, { recursive: true });
await writeFile(resolve(output, 'decorative-video-playback.json'),
  JSON.stringify({
    scope: 'Real public Pages URLs, 390x844 normal-motion Chromium, 6.5s observation after hydration',
    caveat: 'Time progression is a browser playback indicator, not visual quality, rights, field CWV or physical Safari proof.',
    observations,
  }, null, 2) + '\n');
const lines = [
  '## Public decorative video playback — prolonged probe',
  '',
  'Synthetic Chromium with normal motion, 390×844, 6.5s after hydration. A fall back is acceptable but not a successful video playback.',
  '',
  '| Project | Result |',
  '|---|---|',
  ...observations.map(o => '| ' + o.project + ' | ' + o.outcome + ' |'),
  '',
  'Raw snapshots and failed hostnames: production-demo-audit artifact.',
];
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
}

/** Automated WCAG A/AA scan of the actual rendered static gallery.
 * This is a first-pass audit, not certification or a substitute for human testing.
 * Run after installing Playwright Chromium and @axe-core/playwright.
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'http://127.0.0.1:4201';
const server = spawn('python3', [
  '-m', 'http.server', '4201', '--bind', '127.0.0.1',
  '--directory', resolve(root, 'site'),
], { stdio: 'ignore' });
let browser;

async function waitForServer() {
  for (let i = 0; i < 45; i++) {
    try { if ((await fetch(origin + '/')).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw Error('Local gallery server unavailable');
}

const results = [];
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  for (const scenario of [
    { name: 'gallery-desktop', path: '/', width: 1440, height: 900 },
    { name: 'gallery-mobile', path: '/', width: 390, height: 844 },
    { name: 'gallery-preview-desktop', path: '/', width: 1440, height: 900, preview: true },
    { name: 'gallery-preview-mobile', path: '/', width: 390, height: 844, preview: true },
    { name: 'guide-desktop', path: '/project.html?id=20', width: 1440, height: 900 },
    { name: 'guide-mobile', path: '/project.html?id=20', width: 390, height: 844 },
  ]) {
    // axe creates temporary pages in the same context; browser.newPage()
    // creates an owner-bound context where that operation is disallowed.
    const context = await browser.newContext({
      viewport: { width: scenario.width, height: scenario.height },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    try {
      // Do not depend on CI-created demo screenshots for the accessibility scan.
      if (scenario.preview) {
        await page.route('**/previews/manifest.json', route => route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({ captures: [{
            id: 20, image: 'previews/axion-studio.jpg', demo: 'demos/axion-studio/',
          }] }),
        }));
        await page.route('**/demos/axion-studio/', route => route.fulfill({
          status: 200, contentType: 'text/html',
          body: '<!doctype html><html lang="en"><head><title>Embedded demo fixture</title></head><body><h1>A real interactive demo is now loaded and ready to explore.</h1></body></html>',
        }));
      } else {
        await page.route('**/previews/manifest.json', route => route.fulfill({ status: 404, body: 'Not yet published' }));
      }
      await page.goto(origin + scenario.path, { waitUntil: 'load' });
      if (scenario.path === '/') await page.locator('.card').first().waitFor();
      else await page.locator('#detail-content').waitFor({ state: 'visible' });
      if (scenario.preview) {
        await page.locator('button[data-preview-id="20"]').click();
        await page.frameLocator('#demo-frame').locator('h1').waitFor();
      }

      const audit = await new AxeBuilder({ page }).withTags([
        'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa',
      ]).analyze();
      results.push({
        scenario: scenario.name,
        url: scenario.path,
        viewport: `${scenario.width}x${scenario.height}`,
        violations: audit.violations.map(violation => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          nodes: violation.nodes.map(node => ({
            target: node.target,
            failureSummary: node.failureSummary,
          })),
        })),
        incomplete: audit.incomplete.length,
        passes: audit.passes.length,
      });
      console.log(`${scenario.name}: ${audit.violations.length} rule violations, ${audit.incomplete.length} inconclusive checks`);
      for (const violation of audit.violations) {
        console.log('  ' + violation.impact + ' ' + violation.id + ': ' + violation.nodes.length + ' affected nodes');
      }
    } finally {
      await context.close();
    }
  }
} finally {
  if (browser) await browser.close();
  server.kill();
}
const output = resolve(root, 'artifacts/accessibility/axe-results.json');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify({
  caveat: 'Automated WCAG A/AA checks do not establish WCAG conformance; manual review is still required.',
  scenarios: results,
}, null, 2) + '\n');
const serious = results.flatMap(item =>
  item.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
    .map(v => item.scenario + ': ' + v.id));
if (serious.length) {
  console.error('Serious/critical issues found:\n' + serious.join('\n'));
  process.exitCode = 1;
}

// Build and inspect candidate projects without publishing their third-party media.
// Run: node scripts/review_v3_candidate.mjs <slug> (Playwright must be installed).
import { spawn, spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targets = Object.freeze({
  rivr: { dir: 'projects/rivr', id: 18 },
  dot: { dir: 'projects/dot', id: 29 },
  'hero-liquid-glass': { dir: 'projects/hero-liquid-glass', id: 30 },
  mindloop: { dir: 'projects/mindloop', id: 23 },
  cinematic: { dir: 'projects/cinematic', id: 15 }
});
const slug = process.argv[2];
if (!Object.hasOwn(targets, slug)) {
  console.error('Use a known candidate slug:', Object.keys(targets).join(', '));
  process.exit(2);
}
const candidate = targets[slug];
const out = resolve(ROOT, 'artifacts/v3-candidates', slug);
const dir = resolve(ROOT, candidate.dir);
const report = { slug, source: candidate.dir, galleryId: candidate.id, checkedAt: new Date().toISOString(), steps: {}, warnings: [], captures: [] };
await fs.mkdir(out, { recursive: true });
let server, browser;
const exec = (cmd, args, cwd, timeout = 180000) => {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024, timeout,
    env: { ...process.env, CI: 'true' } });
  if (r.stdout) process.stdout.write(r.stdout.slice(-8000));
  if (r.stderr) process.stderr.write(r.stderr.slice(-8000));
  if (r.error || r.status !== 0) throw new Error(cmd + ' failed (' + (r.error?.message || r.status) + ')');
  return r;
};
async function waitFor(url) {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch {}
    await new Promise(r => setTimeout(r, 350));
  }
  throw new Error('Local Vite build did not become available');
}
try {
  exec('npm', ['install','--ignore-scripts','--no-audit','--no-fund'], dir);
  report.steps.dependencies = 'passed';
  // npm audit is advisory: failing on a vulnerability without inspecting its
  // context would hide build results. Never present an audit count as clearance.
  const audit = spawnSync('npm', ['audit','--omit=dev','--json'], {cwd:dir, encoding:'utf8',
    timeout:60000, maxBuffer: 8 * 1024 * 1024});
  try {
    const parsed = JSON.parse(audit.stdout);
    report.dependencyAudit = { counts: parsed.metadata?.vulnerabilities || null,
      advisory: 'Audit findings require manual triage; counts are not proof of exploitation.' };
  } catch { report.warnings.push('npm audit returned no parsable JSON'); }
  exec('npm', ['run','build','--','--base=./'], dir);
  report.steps.build = 'passed';

  server = spawn('python3', ['-m','http.server','4198','--bind','127.0.0.1','--directory',join(dir,'dist')], {cwd:dir, stdio:'ignore'});
  const url = 'http://127.0.0.1:4198/';
  await waitFor(url);
  browser = await chromium.launch({headless:true});
  for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]) {
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e => errors.push(String(e.message).slice(0,180)));
    page.on('requestfailed', req=>{if(errors.length<15)errors.push('request failed: '+new URL(req.url()).hostname);});
    try {
      const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
      await page.waitForTimeout(1800);
      const details=await page.evaluate(()=>({ bodyChars:document.body?.innerText?.trim().length||0,
        title:document.title, overflow:document.documentElement.scrollWidth>window.innerWidth+3,
        imageBroken:[...document.images].filter(img=>!img.complete||img.naturalWidth===0).length }));
      if (!response?.ok()||details.bodyChars<12)throw new Error('Blank or inaccessible page: '+JSON.stringify(details));
      const filename=name+'.jpg';
      await page.screenshot({path:join(out,filename),type:'jpeg',quality:82});
      report.captures.push({file:filename,width,height, ...details, errors:errors.slice(0,12)});
      if(details.overflow)report.warnings.push(name+': horizontal overflow');
      if(details.imageBroken)report.warnings.push(name+': broken image elements '+details.imageBroken);
      if(errors.length)report.warnings.push(name+': '+errors.length+' page/request errors (see JSON)');
      if(/\bvite\s*\+\s*react\b|vite and react/i.test(await page.locator('body').innerText()))
        report.warnings.push(name+': Vite starter/demo boilerplate may still be visible');
    } finally { await page.close(); }
  }
  report.steps.browser = 'passed';
} catch(error) {
  report.failure=String(error);
  console.error('Candidate review failed:',report.failure);
  process.exitCode=1;
} finally {
  if(browser) await browser.close();
  if(server) server.kill();
  await fs.writeFile(join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log('Candidate report:',JSON.stringify(report,null,2));
}

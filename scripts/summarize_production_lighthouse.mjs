/** Summarize production URL Lighthouse CI samples; never claim field data. */
import { readFile, appendFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dir = resolve('artifacts/production-lighthouse');
const manifest = JSON.parse(await readFile(resolve(dir, 'manifest.json'), 'utf8'));
if (!Array.isArray(manifest) || manifest.length !== 6) {
  throw Error('Expected 3 Lighthouse runs for each of 2 public pages; found ' + manifest?.length);
}
const urls = [
  'https://jackxiaozhiren.github.io/MotionSites/',
  'https://jackxiaozhiren.github.io/MotionSites/project.html?id=20',
];
const categories = ['performance','accessibility','best-practices','seo'];
const median = nums => {
  const sorted = [...nums].sort((a,b)=>a-b);
  return sorted[Math.floor(sorted.length/2)];
};
const report = { source: 'Public Pages URL; synthetic GitHub Actions Chromium; Lighthouse simulated throttling',
  samplesPerPage: 3, fieldCoreWebVitals: false, pages: [] };
const lines = [
  '## Production-URL Lighthouse: 3 CI samples per page',
  '',
  '**Synthetic GitHub Actions Chromium tests on public GitHub Pages URLs, not CrUX, field Core Web Vitals or physical-device measurements.**',
  '',
  '| Page | Samples | Performance median (range) | Accessibility median (range) | Best Practices median (range) | SEO median (range) |',
  '|---|---:|---:|---:|---:|---:|',
];
for (const url of urls) {
  const items = manifest.filter(item => item.url === url || item.url?.replace(/\/$/, '') === url.replace(/\/$/, ''));
  if (items.length !== 3) throw Error('Expected 3 reports for '+url+', got '+items.length);
  const metrics = {};
  for (const cat of categories) {
    const values = items.map(item => {
      const value = item.summary?.[cat];
      if (typeof value !== 'number' || value < 0 || value > 1) {
        throw Error('Missing numeric ' + cat + ' score for ' + url);
      }
      return Math.round(value * 100);
    });
    metrics[cat] = { samples: values, median: median(values), min: Math.min(...values), max: Math.max(...values) };
  }
  report.pages.push({url,metrics});
  const display = cat => {
    const m=metrics[cat];
    return m.median+' ('+m.min+'–'+m.max+')';
  };
  lines.push('| '+url.replace('https://jackxiaozhiren.github.io/MotionSites/', '') .replace(/^$/, 'Gallery homepage')+
    ' | 3 | '+categories.map(display).join(' | ')+' |');
}
const markdown=lines.join('\n')+'\n';
console.log(markdown);
await writeFile(resolve(dir,'production-score-summary.json'), JSON.stringify(report,null,2)+'\n');
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,markdown);

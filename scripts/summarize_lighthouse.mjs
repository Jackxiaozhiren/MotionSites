/** Print measured Lighthouse CI scores from the generated manifest.
 * Scores in this output apply only to CI Chromium / simulated settings.
 */
import { readFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const manifest = JSON.parse(await readFile(resolve('artifacts/lighthouse/manifest.json'), 'utf8'));
if (!Array.isArray(manifest) || manifest.length < 2) {
  throw Error('Expected Lighthouse reports for gallery and project guide');
}
const headings = ['URL', 'Performance', 'Accessibility', 'Best practices', 'SEO'];
const lines = [
  '## MotionSites CI Lighthouse baseline',
  '',
  'Measured in GitHub Actions Chromium with Lighthouse simulated throttling. These are **not** real-user metrics or guarantees.',
  '',
  '| ' + headings.join(' | ') + ' |',
  '|' + headings.map(() => '---').join('|') + '|',
];
for (const item of manifest) {
  const score = key => typeof item.summary?.[key] === 'number'
    ? Math.round(item.summary[key] * 100).toString()
    : 'n/a';
  lines.push('| ' + item.url + ' | ' + [
    score('performance'), score('accessibility'), score('best-practices'), score('seo'),
  ].join(' | ') + ' |');
}
console.log(lines.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
}

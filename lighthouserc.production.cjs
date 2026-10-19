/** Public-production Lighthouse audit (separate from the local CI baseline).
 * Fixed public URLs only. Scores are synthetic CI measurements, not field CWV.
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'https://jackxiaozhiren.github.io/MotionSites/',
        'https://jackxiaozhiren.github.io/MotionSites/project.html?id=20',
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './artifacts/production-lighthouse',
    },
  },
};

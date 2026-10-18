/**
 * Baseline Lighthouse CI; do not assert arbitrary green scores without data.
 * Evaluates two local routes; reports stay in GitHub Actions artifacts instead
 * of uploading them to public temporary third-party storage.
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://127.0.0.1:4199/',
        'http://127.0.0.1:4199/project.html?id=20',
      ],
      startServerCommand: 'python3 -m http.server 4199 --bind 127.0.0.1 --directory site',
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './artifacts/lighthouse',
    },
  },
};

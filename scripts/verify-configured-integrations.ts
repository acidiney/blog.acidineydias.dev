import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const temporaryRoot = mkdtempSync(join(tmpdir(), 'blog-configured-integrations-'));
const output = join(temporaryRoot, 'dist');
const expected = {
  ga: 'G-BLOG-TEST',
  client: 'ca-pub-0000000000000000',
  newsletter: 'https://example.invalid/newsletter',
};

try {
  const build = spawnSync('pnpm', ['exec', 'astro', 'build', '--outDir', output], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      PUBLIC_GA_ID: expected.ga,
      VUE_GOOGLE_ADSENSE: expected.client,
      PUBLIC_NEWSLETTER_ENDPOINT: expected.newsletter,
    },
  });
  if (build.status !== 0) {
    process.stderr.write(build.stdout);
    process.stderr.write(build.stderr);
    throw new Error(`configured Astro build exited with ${build.status}`);
  }

  const html = readFileSync(join(output, 'blog', 'a-minha-primeira-vez', 'index.html'), 'utf8');
  const autoAdsPages = [
    join(output, 'index.html'),
    join(output, 'blog', 'index.html'),
    join(output, 'blog', 'a-minha-primeira-vez', 'index.html'),
    join(output, 'poems', 'index.html'),
  ].map((path) => readFileSync(path, 'utf8'));
  const autoAdsLoader = `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${expected.client}`;
  const assertions = [
    ['GA loader and id', html.includes(`https://www.googletagmanager.com/gtag/js?id=${expected.ga}`) && html.includes(expected.ga)],
    ['one Auto Ads loader on every page type', autoAdsPages.every((page) => page.split(autoAdsLoader).length === 2)],
    ['newsletter form and action', html.includes('<form') && html.includes(`action="${expected.newsletter}"`) && html.includes('method="post"')],
  ] as const;
  const failures = assertions.filter(([, passed]) => !passed).map(([label]) => label);
  if (failures.length) throw new Error(`configured output is missing: ${failures.join(', ')}`);
  console.log(`Verified configured GA (${expected.ga}), global Auto Ads, and newsletter form in rendered HTML.`);
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

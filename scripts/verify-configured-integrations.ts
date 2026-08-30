import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const temporaryRoot = mkdtempSync(join(tmpdir(), 'blog-configured-integrations-'));
const output = join(temporaryRoot, 'dist');
const expected = {
  ga: 'G-BLOG-TEST',
  client: 'ca-pub-0000000000000000',
  slot: '0000000000',
  newsletter: 'https://example.invalid/newsletter',
};

try {
  const build = spawnSync('pnpm', ['exec', 'astro', 'build', '--outDir', output], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      PUBLIC_GA_ID: expected.ga,
      PUBLIC_ADSENSE_CLIENT: expected.client,
      PUBLIC_ADSENSE_SLOT: expected.slot,
      PUBLIC_NEWSLETTER_ENDPOINT: expected.newsletter,
    },
  });
  if (build.status !== 0) {
    process.stderr.write(build.stdout);
    process.stderr.write(build.stderr);
    throw new Error(`configured Astro build exited with ${build.status}`);
  }

  const html = readFileSync(join(output, 'blog', 'a-minha-primeira-vez', 'index.html'), 'utf8');
  const assertions = [
    ['GA loader and id', html.includes(`https://www.googletagmanager.com/gtag/js?id=${expected.ga}`) && html.includes(expected.ga)],
    ['configured ad state', html.includes('data-testid="ad-slot"') && html.includes('data-configured="true"')],
    ['AdSense client', html.includes(`data-ad-client="${expected.client}"`)],
    ['AdSense slot', html.includes(`data-ad-slot="${expected.slot}"`)],
    ['AdSense loader', html.includes(`pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${expected.client}`)],
    ['newsletter form and action', html.includes('<form') && html.includes(`action="${expected.newsletter}"`) && html.includes('method="post"')],
  ] as const;
  const failures = assertions.filter(([, passed]) => !passed).map(([label]) => label);
  if (failures.length) throw new Error(`configured output is missing: ${failures.join(', ')}`);
  console.log(`Verified configured GA (${expected.ga}), AdSense client/slot, and newsletter form in rendered blog HTML.`);
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

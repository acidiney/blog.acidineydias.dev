import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import fg from 'fast-glob';

const root = process.cwd();
const dist = join(root, 'dist');
const fail = (message: string): never => { throw new Error(message); };
if (!existsSync(dist)) fail('dist is missing; run pnpm build first');

const posts = fg.sync('src/content/blog/*.md');
if (posts.length !== 8) fail(`expected 8 source posts, found ${posts.length}`);
for (const post of posts) {
  const slug = post.split('/').at(-1)!.replace(/\.md$/, '');
  if (!existsSync(join(dist, 'blog', slug, 'index.html'))) fail(`missing blog route for ${slug}`);
}

const pageOne = readFileSync(join(dist, 'blog/index.html'), 'utf8');
const pageTwo = readFileSync(join(dist, 'blog/page/2/index.html'), 'utf8');
if (existsSync(join(dist, 'blog/page/1/index.html'))) fail('/blog/page/1/ must not be generated');
if (!pageTwo.includes('href="/blog/"')) fail('page 2 must link back to canonical page 1');
const cards = (html: string) => (html.match(/data-testid="blog-card"/g) ?? []).length;
const articlePaths = (html: string) => new Set(
  [...html.matchAll(/href="(\/blog\/[^"#?]+\/)"/g)]
    .map(([, path]) => path)
    .filter((path) => !/^\/blog\/(?:page|tags)\//.test(path)),
);
if (articlePaths(pageOne).size !== 8 || cards(pageTwo) !== 2) {
  fail(`editorial index invariant failed: ${articlePaths(pageOne).size} articles / ${cards(pageTwo)} page 2 cards`);
}

const countItems = (path: string) => (readFileSync(path, 'utf8').match(/<item>/g) ?? []).length;
if (countItems(join(dist, 'blog/rss.xml')) !== 8) fail('blog RSS must contain 8 items');
if (countItems(join(dist, 'poems/rss.xml')) !== 0) fail('poems RSS must be empty');
const sitemap = fg.sync('dist/sitemap-*.xml')[0];
const sitemapXml = sitemap ? readFileSync(sitemap, 'utf8') : '';
if (!sitemap || !sitemapXml.includes('https://blog.acidineydias.dev/')) fail('sitemap canonical host is incorrect');
if (sitemapXml.includes('/blog/page/1/')) fail('sitemap includes duplicate first page');
if (!existsSync(join(dist, 'pagefind/pagefind.js'))) fail('Pagefind index is missing');

const htmlFiles = fg.sync('dist/**/*.html');
if (htmlFiles.length !== 47) fail(`expected 47 HTML files, found ${htmlFiles.length}`);
const missing = new Set<string>();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const raw = match[1].split('#')[0].split('?')[0];
    if (!raw || raw.startsWith('//') || /\.(xml|ico|png|jpe?g|woff2)$/.test(raw)) continue;
    const decoded = decodeURIComponent(raw);
    const target = decoded.endsWith('/') ? join(dist, decoded, 'index.html') : join(dist, decoded);
    if (!existsSync(target)) missing.add(`${relative(dist, file)} -> ${raw}`);
  }
}
if (missing.size) fail(`broken internal links:\n${[...missing].join('\n')}`);

const poems = readFileSync(join(dist, 'poems/index.html'), 'utf8');
for (const hook of ['newsletter', 'ad-slot', 'disqus-thread', 'blog-toc']) if (poems.includes(`data-testid="${hook}"`)) fail(`poems index leaked ${hook}`);

const portuguese = readFileSync(join(dist, 'blog/a-minha-primeira-vez/index.html'), 'utf8');
const english = readFileSync(join(dist, 'blog/i-will-never-be-25-years-old-again/index.html'), 'utf8');
if (!portuguese.includes('<html lang="pt">') || !english.includes('<html lang="en">')) fail('article language metadata is incorrect');
for (const token of ['googletagmanager.com', 'pagead2.googlesyndication.com']) if (portuguese.includes(token)) fail(`credential-free output leaked ${token}`);
if (portuguese.includes('data-testid="ad-slot"')) fail('credential-free output rendered an ad slot');
if (/<section class="newsletter"[\s\S]*?<form/.test(portuguese)) fail('credential-free newsletter rendered a form');

console.log(`Verified ${posts.length} posts, ${htmlFiles.length} HTML files, editorial index 8/2, feeds 8/0, sitemap host, Pagefind, and internal links.`);

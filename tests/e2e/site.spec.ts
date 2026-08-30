import { expect, test } from '@playwright/test';

test('landing page navigates into both editorial zones', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('site-header')).toBeVisible();
  const brand = page.getByRole('link', { name: 'blog.acidineydias.dev' });
  await expect(brand.locator('img')).toHaveAttribute('src', '/assets/img/acidiney-brand.jpg');
  await expect(brand).toContainText('blog.acidineydias.dev');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/assets/img/acidiney-brand.jpg');
  await page.getByRole('link', { name: 'Artigos', exact: true }).first().click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await page.getByRole('link', { name: 'Poemas', exact: true }).click();
  await expect(page).toHaveURL(/\/poems\/$/);
  await expect(page.getByTestId('poems-index')).toContainText('Ainda não publiquei poemas aqui.');
});

test('all eight posts are reachable from the editorial index', async ({ page }) => {
  await page.goto('/blog/');
  const paths = await page.locator('.editorial-grid a[href^="/blog/"]').evaluateAll((links) => [...new Set(links
    .map((link) => (link as HTMLAnchorElement).pathname)
    .filter((path) => path !== '/blog/' && !path.includes('/tags/')))]);
  expect(paths).toHaveLength(8);

  for (const path of paths) {
    await page.goto(path);
    await expect(page.getByTestId('blog-post')).toBeVisible();
    await expect(page.getByTestId('blog-toc')).toBeVisible();
    await expect(page.getByTestId('newsletter')).toHaveCount(0);
    await expect(page.getByTestId('disqus-thread')).toBeVisible();
  }
});

test('poems never load blog-only integrations', async ({ page }) => {
  await page.goto('/poems/');
  for (const hook of ['blog-post', 'blog-toc', 'newsletter', 'disqus-thread']) await expect(page.getByTestId(hook)).toHaveCount(0);
  const thirdParty = new Set<string>();
  page.on('request', (request) => { if (!request.url().startsWith('http://127.0.0.1:4321')) thirdParty.add(new URL(request.url()).hostname); });
  await page.reload();
  expect([...thirdParty]).toEqual([]);
});

test('poems empty state holds the editorial composition across breakpoints', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium');
  await page.setViewportSize({ width: 1974, height: 1336 });
  await page.goto('/poems/');

  const wide = await page.locator('.poems h1').evaluate((element) => {
    const style = getComputedStyle(element);
    const fontSize = parseFloat(style.fontSize);
    const titleBox = element.getBoundingClientRect();
    const emptyBox = document.querySelector('.empty')!.getBoundingClientRect();
    const spineBox = document.querySelector('[data-testid="site-header"] .shell')!.getBoundingClientRect();
    const contentBox = document.querySelector('[data-testid="poems-index"]')!.getBoundingClientRect();
    const footerBox = document.querySelector('.footer')!.getBoundingClientRect();
    return {
      fontSize,
      lineHeightRatio: parseFloat(style.lineHeight) / fontSize,
      onSpine: Math.abs(contentBox.left - spineBox.left) <= 1,
      messageRightOfTitle: emptyBox.left >= titleBox.right,
      messageAlignedToTitleFoot: Math.abs(emptyBox.bottom - titleBox.bottom) <= 4,
      pageOverflows: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      footerAtViewportBottom: Math.abs(footerBox.bottom - window.innerHeight) <= 1,
      documentScrolls: document.documentElement.scrollHeight > window.innerHeight + 1,
    };
  });

  expect(wide.fontSize).toBeLessThanOrEqual(80);
  expect(wide.lineHeightRatio).toBeGreaterThanOrEqual(1.04);
  expect(wide.onSpine).toBe(true);
  expect(wide.messageRightOfTitle).toBe(true);
  expect(wide.messageAlignedToTitleFoot).toBe(true);
  expect(wide.pageOverflows).toBe(false);
  expect(wide.footerAtViewportBottom).toBe(true);
  expect(wide.documentScrolls).toBe(false);
  await expect(page.getByText('∴')).toHaveCount(0);

  await page.setViewportSize({ width: 320, height: 568 });
  await page.reload();

  const narrow = await page.evaluate(() => {
    const titleBox = document.querySelector('.poems h1')!.getBoundingClientRect();
    const emptyBox = document.querySelector('.empty')!.getBoundingClientRect();
    const clientWidth = document.documentElement.clientWidth;
    return {
      stacksInOrder: titleBox.bottom <= emptyBox.top + 1,
      sharedColumn: Math.abs(titleBox.left - emptyBox.left) <= 1,
      titleUsesWidth: titleBox.width >= clientWidth - 40,
      pageOverflows: document.documentElement.scrollWidth > clientWidth,
    };
  });

  expect(narrow.stacksInOrder).toBe(true);
  expect(narrow.sharedColumn).toBe(true);
  expect(narrow.titleUsesWidth).toBe(true);
  expect(narrow.pageOverflows).toBe(false);
});

test('Pagefind returns a known article through the real search UI', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('search-trigger').click();
  const dialog = page.getByTestId('search-dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('searchbox').fill('mercado de capitais');
  await dialog.getByRole('button', { name: 'Pesquisar' }).click();
  await expect(page.getByTestId('search-results')).toContainText('A minha primeira vez');
  await dialog.getByRole('link', { name: 'A minha primeira vez', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/a-minha-primeira-vez\/$/);
});

test('Pagefind searches the English index from the Portuguese landing page', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('search-trigger').click();
  const dialog = page.getByTestId('search-dialog');
  await dialog.getByRole('searchbox').fill('financial freedom');
  await dialog.getByRole('button', { name: 'Pesquisar' }).click();
  await expect(page.getByTestId('search-results')).toContainText('I Will Never Be 25 Years Old Again');
  await dialog.getByRole('link', { name: 'I Will Never Be 25 Years Old Again', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/i-will-never-be-25-years-old-again\/$/);
});

test('search dialog has a reachable close control', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('search-trigger').click();
  const dialog = page.getByTestId('search-dialog');
  const close = dialog.getByRole('button', { name: 'Fechar pesquisa' });
  await expect(dialog).toBeVisible();
  await expect(close).toBeVisible();
  const box = await close.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
  await close.click();
  await expect(dialog).not.toBeVisible();
  await expect(dialog).not.toHaveAttribute('open', '');
});

test('article language follows validated content metadata', async ({ page }) => {
  await page.goto('/blog/i-will-never-be-25-years-old-again/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto('/blog/a-minha-primeira-vez/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
});

test('article byline includes localized reading time', async ({ page }) => {
  await page.goto('/blog/a-minha-primeira-vez/');
  await expect(page.locator('.byline')).toHaveText(/^Por Acidiney Dias · \d+ min de leitura$/);
  await page.goto('/blog/i-will-never-be-25-years-old-again/');
  await expect(page.locator('.byline')).toHaveText(/^By Acidiney Dias · \d+ min read$/);
});

test('desktop article Markdown uses the wider editorial column', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium');
  await page.goto('/blog/a-minha-primeira-vez/');
  const tocBrand = page.getByTestId('blog-toc').getByRole('link', { name: 'blog.acidineydias.dev' });
  await expect(tocBrand.locator('img')).toHaveAttribute('src', '/assets/img/acidiney-brand.jpg');
  const width = await page.locator('.prose').evaluate((element) => element.getBoundingClientRect().width);
  expect(width).toBeGreaterThanOrEqual(940);
  const summary = page.locator('.dek');
  const summaryWidth = await summary.evaluate((element) => element.getBoundingClientRect().width);
  expect(summaryWidth).toBeGreaterThanOrEqual(940);
  await expect(summary).toHaveCSS('font-size', '21.12px');
  await expect(page.locator('.prose > p').first()).toHaveCSS('font-family', /Inter/);
  await expect(page.locator('.prose > p').first()).toHaveCSS('margin-top', '0px');
  const title = page.locator('.article__header h1');
  await expect(title).toHaveCSS('font-family', /sohne/);
  await expect(title).toHaveCSS('font-weight', '700');
  const titleType = await title.evaluate((element) => {
    const style = getComputedStyle(element);
    return parseFloat(style.letterSpacing) / parseFloat(style.fontSize);
  });
  expect(titleType).toBeCloseTo(-0.03, 2);
  const leftEdges = await page.locator('.article__header, .hero-image, .prose, .tags').evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().left)),
  );
  expect(new Set(leftEdges).size).toBe(1);
});

test('desktop article TOC tracks H2 and H3 reading progress', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium');
  await page.goto('/blog/um-pouco-sobre-offline-first-e-granularidade/');
  const heading = page.getByRole('heading', { name: 'Onde eu usei', exact: true });
  await expect(page.getByRole('heading', { name: 'Proxy', exact: true })).toHaveCSS('font-family', /sohne/);
  const link = page.getByTestId('blog-toc').getByRole('link', { name: 'Onde eu usei', exact: true });
  await heading.evaluate((element) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, (element as HTMLElement).offsetTop - 120);
  });
  await expect(link).toHaveAttribute('aria-current', 'location');
  const branchColor = await link.locator('..').evaluate((item) => getComputedStyle(item, '::before').borderTopColor);
  expect(branchColor).toBe('rgb(33, 33, 33)');
  await expect(page.getByTestId('blog-toc').locator('[aria-current="location"]')).toHaveCount(1);
});

test('desktop article TOC fill grows continuously inside the current section', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/blog/um-pouco-sobre-offline-first-e-granularidade/');
  const heading = page.getByRole('heading', { name: 'Proxy', exact: true });
  const list = page.getByTestId('blog-toc').locator('[data-toc-list]');
  await heading.evaluate((element) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, (element as HTMLElement).offsetTop - 120);
  });
  const progressBefore = await list.evaluate((element) => parseFloat(getComputedStyle(element, '::after').height));
  await page.evaluate(() => window.scrollBy(0, 100));
  const progressAfter = await list.evaluate((element) => parseFloat(getComputedStyle(element, '::after').height));
  await expect(page.getByTestId('blog-toc').locator('[aria-current="location"]')).toContainText('Proxy');
  expect(progressAfter).toBeGreaterThan(progressBefore);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const endState = await list.evaluate((element) => ({
    progress: parseFloat(getComputedStyle(element, '::after').height),
    track: parseFloat(getComputedStyle(element, '::before').height),
  }));
  expect(Math.abs(endState.track - endState.progress)).toBeLessThanOrEqual(1);
});

test('desktop article TOC gives orphan H3 headings a readable root layout', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium');
  await page.goto('/blog/pare-de-limitar-o-frontend/');
  const toc = page.getByTestId('blog-toc');
  const firstItem = toc.locator('[data-toc-item]').first();
  await expect(firstItem).toHaveClass(/depth-2/);
  expect((await toc.boundingBox())!.width).toBeGreaterThanOrEqual(210);
  await expect(toc).toHaveCSS('border-left-width', '0px');
});

test('mobile article TOC keeps its compact active state and no-heading fallback', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  await page.goto('/blog/um-pouco-sobre-offline-first-e-granularidade/');
  const heading = page.getByRole('heading', { name: 'Onde eu usei', exact: true });
  const link = page.getByTestId('blog-toc').getByRole('link', { name: 'Onde eu usei', exact: true });
  await heading.evaluate((element) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, (element as HTMLElement).offsetTop - 120);
  });
  await expect(link).toHaveAttribute('aria-current', 'location');
  await expect(link).toHaveCSS('text-decoration-line', 'underline');
  const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
  expect(widths.page).toBeLessThanOrEqual(widths.viewport);

  await page.goto('/blog/a-minha-primeira-vez/');
  await expect(page.getByTestId('blog-toc')).toContainText('Leitura contínua');
  await expect(page.getByTestId('blog-toc').locator('[data-toc-list]')).toHaveCount(0);
});

test('credential-free integrations stay gated and Disqus loads automatically', async ({ page }) => {
  const disqusRequests: string[] = [];
  await page.route('https://acidineydias.disqus.com/**', async (route) => {
    disqusRequests.push(route.request().url());
    await route.abort();
  });
  await page.goto('/blog/a-minha-primeira-vez/');
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  await expect(page.locator('script[src*="pagead2.googlesyndication.com"]')).toHaveCount(0);
  await expect(page.getByTestId('newsletter')).toHaveCount(0);
  await expect(page.getByTestId('disqus-thread').getByRole('button')).toHaveCount(0);
  await expect(page.getByTestId('disqus-thread').locator('p')).toHaveCount(0);
  await expect(page.getByTestId('disqus-thread')).toHaveAttribute('aria-label', 'Comentários');
  await expect(page.getByTestId('disqus-thread').locator('h2')).toHaveCount(0);
  await expect.poll(() => disqusRequests).toEqual(['https://acidineydias.disqus.com/embed.js']);
  const closingEdges = await page.locator('.prose, .tags, [data-testid="disqus-thread"]').evaluateAll((elements) =>
    elements.map((element) => Math.round(element.getBoundingClientRect().left)),
  );
  expect(new Set(closingEdges).size).toBe(1);
});

test('SEO, feeds and custom 404 are served from the built site', async ({ page, request }) => {
  await page.goto('/blog/a-minha-primeira-vez/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://blog.acidineydias.dev/blog/a-minha-primeira-vez/');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /A minha primeira vez/);
  const blogFeed = await request.get('/blog/rss.xml');
  expect((await blogFeed.text()).match(/<item>/g)).toHaveLength(8);
  const poemsFeed = await request.get('/poems/rss.xml');
  expect((await poemsFeed.text()).match(/<item>/g) ?? []).toHaveLength(0);
  // Netlify maps unknown paths to this artifact; the raw static server does not emulate that host behavior.
  await page.goto('/404.html');
  await expect(page.getByText('Esta página não está aqui.')).toBeVisible();
});

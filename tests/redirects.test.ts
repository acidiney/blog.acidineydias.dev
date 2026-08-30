import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const config = readFileSync('netlify.toml', 'utf8');
const redirects = [...config.matchAll(/\[\[redirects\]\]\s+from = "([^"]+)"\s+to = "([^"]+)"\s+status = (\d+)/g)].map((match) => ({ from: match[1], to: match[2], status: Number(match[3]) }));
const postMappings = [
  ['/2026/08/29/a-minha-primeira-vez/', '/blog/a-minha-primeira-vez/'],
  ['/2025/12/28/i-will-never-be-25-years-old-again/', '/blog/i-will-never-be-25-years-old-again/'],
  ['/2020/05/17/lookup-nao-exite-mais/', '/blog/lookup-nao-exite-mais/'],
  ['/2025/12/28/nunca-mais-terei-25-anos-de-idade/', '/blog/nunca-mais-terei-25-anos-de-idade/'],
  ['/2020/06/27/pare-de-limitar-o-frontend/', '/blog/pare-de-limitar-o-frontend/'],
  ['/2020/05/15/refazendo-meu-portfolio-parte-1/', '/blog/refazendo-meu-portfolio-parte-1/'],
  ['/2025/09/18/reflexoes-inss-exodo-juvenil-futuro-risco/', '/blog/reflexoes-inss-exodo-juvenil-futuro-risco/'],
  ['/2020/09/26/um-pouco-sobre-offline-first-e-granularidade/', '/blog/um-pouco-sobre-offline-first-e-granularidade/'],
] as const;

describe('Netlify redirects', () => {
  it('maps every exact date route and short route with a 301', () => {
    for (const [dated, destination] of postMappings) {
      const slug = `/${destination.split('/').at(-2)}/`;
      expect(redirects).toContainEqual({ from: dated, to: destination, status: 301 });
      expect(redirects).toContainEqual({ from: slug, to: destination, status: 301 });
    }
  });

  it('scopes the only wildcard to legacy tags and preserves feed endpoints', () => {
    expect(redirects).toContainEqual({ from: '/blog/page/1/', to: '/blog/', status: 301 });
    expect(redirects).toContainEqual({ from: '/tag/UI/UX/', to: '/blog/tags/ui-ux/', status: 301 });
    expect(redirects).toContainEqual({ from: '/tag/:tag/', to: '/blog/tags/:tag/', status: 301 });
    expect(redirects.findIndex((rule) => rule.from === '/tag/UI/UX/')).toBeLessThan(redirects.findIndex((rule) => rule.from === '/tag/:tag/'));
    for (const from of ['/rss.xml', '/feed.atom', '/feed.json']) expect(redirects).toContainEqual({ from, to: '/blog/rss.xml', status: 301 });
    expect(redirects.some((rule) => rule.from === '/*')).toBe(false);
    expect(redirects).toHaveLength(22);
  });
});

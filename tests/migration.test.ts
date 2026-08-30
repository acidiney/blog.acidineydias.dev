import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { blogImage, readingTimeMinutes, sortByDate } from '../src/lib/content';
import { blogSchema, poemSchema } from '../src/lib/schemas';

const root = process.cwd();
const blogDir = join(root, 'src/content/blog');
const posts = readdirSync(blogDir).filter((name) => name.endsWith('.md'));
const expectedLegacy = new Map([
  ['a-minha-primeira-vez.md', '/2026/08/29/a-minha-primeira-vez/'],
  ['i-will-never-be-25-years-old-again.md', '/2025/12/28/i-will-never-be-25-years-old-again/'],
  ['lookup-nao-exite-mais.md', '/2020/05/17/lookup-nao-exite-mais/'],
  ['nunca-mais-terei-25-anos-de-idade.md', '/2025/12/28/nunca-mais-terei-25-anos-de-idade/'],
  ['pare-de-limitar-o-frontend.md', '/2020/06/27/pare-de-limitar-o-frontend/'],
  ['refazendo-meu-portfolio-parte-1.md', '/2020/05/15/refazendo-meu-portfolio-parte-1/'],
  ['reflexoes-inss-exodo-juvenil-futuro-risco.md', '/2025/09/18/reflexoes-inss-exodo-juvenil-futuro-risco/'],
  ['um-pouco-sobre-offline-first-e-granularidade.md', '/2020/09/26/um-pouco-sobre-offline-first-e-granularidade/'],
]);

describe('content migration', () => {
  it('keeps all eight posts and explicit legacy metadata', () => {
    expect(posts.sort()).toEqual([...expectedLegacy.keys()].sort());
    for (const file of posts) {
      const source = readFileSync(join(blogDir, file), 'utf8');
      expect(source).toMatch(/^---\n[\s\S]+?\n---\n/);
      expect(source).toContain(`legacyPath: ${expectedLegacy.get(file)}`);
      for (const field of ['title:', 'date:', 'author:', 'summary:', 'tags:', 'featuredimg:', 'featuredimgWidth:', 'featuredimgHeight:']) expect(source).toContain(field);
    }
  });

  it('uses the one recoverable VuePress Disqus hash and does not invent others', () => {
    const withIdentifiers = posts.filter((file) => readFileSync(join(blogDir, file), 'utf8').includes('legacyIdentifier:'));
    expect(withIdentifiers).toEqual(['refazendo-meu-portfolio-parte-1.md']);
    expect(readFileSync(join(blogDir, withIdentifiers[0]), 'utf8')).toContain('legacyIdentifier: v-1f7a93f4');
  });

  it('keeps poems empty and locks the light background with dark primary', () => {
    expect(readdirSync(join(root, 'src/content/poems')).filter((name) => /\.mdx?$/.test(name))).toHaveLength(0);
    const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
    expect(css).toContain('--color-background: #f4f2ec');
    expect(css).toContain('--color-primary: #212121');
  });

  it('keeps the poem layout free of blog integrations', () => {
    const layout = readFileSync(join(root, 'src/layouts/PoemLayout.astro'), 'utf8');
    for (const integration of ['Newsletter', 'DisqusThread', 'BlogToc', 'medium-zoom']) expect(layout).not.toContain(integration);
  });

  it('lets an original poem validate without blog legacy or image metadata', () => {
    const poem = poemSchema.parse({ title: 'Um título', date: '2026-08-29', summary: 'Uma breve descrição.' });
    expect(poem).toMatchObject({ author: 'Acidiney Dias', language: 'pt', tags: [] });
    expect(poem).not.toHaveProperty('legacyPath');
    expect(blogSchema.safeParse({ title: 'Artigo incompleto', date: '2026-08-29', summary: 'Sem imagem.' }).success).toBe(false);
  });

  it('falls back to declared image metadata when no optimized derivative exists', () => {
    expect(blogImage('future-post', '/assets/img/future.jpg', 1600, 900)).toEqual({
      src: '/assets/img/future.jpg', width: 1600, height: 900,
    });
  });

  it('uses an id tie-breaker when publication dates match', () => {
    const date = new Date('2025-12-28T22:00:00Z');
    expect(sortByDate([{ id: 'zulu', data: { date } }, { id: 'alpha', data: { date } }]).map(({ id }) => id)).toEqual(['alpha', 'zulu']);
  });

  it('defaults content to Portuguese and marks the English article explicitly', () => {
    expect(poemSchema.parse({ title: 'Poema', date: '2026-08-29', summary: 'Resumo' }).language).toBe('pt');
    expect(readFileSync(join(blogDir, 'i-will-never-be-25-years-old-again.md'), 'utf8')).toContain('language: en');
  });

  it('estimates reading time with a one-minute minimum and rounds up', () => {
    expect(readingTimeMinutes('')).toBe(1);
    expect(readingTimeMinutes('palavra '.repeat(220))).toBe(1);
    expect(readingTimeMinutes('palavra '.repeat(221))).toBe(2);
  });
});

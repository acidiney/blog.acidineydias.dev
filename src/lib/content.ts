import type { CollectionEntry } from 'astro:content';

export const SITE = 'https://blog.acidineydias.dev';
export const POSTS_PER_PAGE = 6;
export const SITE_COPYRIGHT = '2020–2026';

export function sortByDate<T extends { id: string; data: { date: Date } }>(entries: T[]): T[] { return [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id)); }
export function blogPath(post: CollectionEntry<'blog'>): string { return `/blog/${post.id}/`; }
export function poemPath(poem: CollectionEntry<'poems'>): string { return `/poems/${poem.id}/`; }
export function tagSegment(tag: string): string { return tag.includes('/') ? tag.toLowerCase().replaceAll('/', '-') : tag; }
export function tagPath(tag: string): string { return `/blog/tags/${encodeURIComponent(tagSegment(tag))}/`; }
export function readingTimeMinutes(markdown: string): number {
  const readableText = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~|-]/g, ' ');
  const words = readableText.match(/[\p{L}\p{N}]+(?:['’–-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 220));
}
export const blogImageDimensions: Record<string, readonly [number, number]> = {
  'a-minha-primeira-vez': [1200, 675],
  'i-will-never-be-25-years-old-again': [1200, 800],
  'lookup-nao-exite-mais': [1200, 750],
  'nunca-mais-terei-25-anos-de-idade': [1200, 800],
  'pare-de-limitar-o-frontend': [1200, 675],
  'refazendo-meu-portfolio-parte-1': [1200, 561],
  'reflexoes-inss-exodo-juvenil-futuro-risco': [1200, 654],
  'um-pouco-sobre-offline-first-e-granularidade': [1200, 765],
};
export interface BlogImageSource { src: string; width: number; height: number; srcset?: string; }
export function blogImage(id: string, source: string, width: number, height: number): BlogImageSource {
  const optimized = blogImageDimensions[id];
  if (!optimized) return { src: source, width, height };
  return {
    src: `/assets/img/optimized/${id}.jpg`,
    width: optimized[0],
    height: optimized[1],
    srcset: `/assets/img/optimized/${id}-640.jpg 640w, /assets/img/optimized/${id}-800.jpg 800w, /assets/img/optimized/${id}.jpg 1200w`,
  };
}
export function formatDate(date: Date, locale = 'pt-PT'): string { return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date); }

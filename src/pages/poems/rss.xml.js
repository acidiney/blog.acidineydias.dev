import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { poemPath, sortByDate } from '../../lib/content';

export async function GET(context) {
  const poems = sortByDate(await getCollection('poems'));
  return rss({ title: 'Poemas · Acidiney Dias', description: 'Poemas de Acidiney Dias.', site: context.site, items: poems.map((poem) => ({ title: poem.data.title, description: poem.data.summary, pubDate: poem.data.date, link: poemPath(poem), categories: poem.data.tags })) });
}

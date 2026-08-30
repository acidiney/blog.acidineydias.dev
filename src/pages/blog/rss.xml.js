import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { blogPath, sortByDate } from '../../lib/content';

export async function GET(context) {
  const posts = sortByDate(await getCollection('blog'));
  return rss({
    title: 'Artigos · Acidiney Dias',
    description: 'Textos de Acidiney Dias sobre software, trabalho, dinheiro, Angola e vida.',
    site: context.site,
    items: posts.map((post) => ({ title: post.data.title, description: post.data.summary, pubDate: post.data.date, link: blogPath(post), categories: post.data.tags })),
    customData: '<language>pt-PT</language>',
  });
}

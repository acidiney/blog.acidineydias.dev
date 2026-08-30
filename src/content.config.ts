import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema, poemSchema } from './lib/schemas';

const blog = defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }), schema: blogSchema });
const poems = defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/poems' }), schema: poemSchema });

export const collections = { blog, poems };

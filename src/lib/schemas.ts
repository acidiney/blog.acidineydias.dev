import { z } from 'astro/zod';

export const editorialSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  author: z.string().default('Acidiney Dias'),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  language: z.enum(['pt', 'en']).default('pt'),
});

export const blogSchema = editorialSchema.extend({
  featuredimg: z.string(),
  featuredimgWidth: z.number().int().positive(),
  featuredimgHeight: z.number().int().positive(),
  legacyPath: z.string().regex(/^\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+\/$/),
  legacyIdentifier: z.string().optional(),
});

export const poemSchema = editorialSchema;

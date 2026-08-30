import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://blog.acidineydias.dev',
  output: 'static',
  trailingSlash: 'always',
  integrations: [vue(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dulaldenislam.netlify.app',
  integrations: [sitemap()],
});

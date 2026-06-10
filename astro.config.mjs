import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dulaldenislam.netlify.app',
  // sitemap-index.xml / sitemap-0.xml をビルド時に自動生成
  // （public/sitemap.xml の手動管理は廃止 → 削除してOK）
  integrations: [sitemap()],
});

// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // Lightning CSS mengubah `backdrop-filter` menjadi prefix WebKit saja.
      // Chrome Linux tidak mendukung bentuk prefix itu, sehingga efek glass
      // hilang setelah build production. Esbuild mempertahankan properti
      // standar yang juga dipakai saat development.
      cssMinify: 'esbuild',
    },
  },
});

import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// The site is served from https://mdbatey.github.io/dictionary/
export default defineConfig({
  base: '/dictionary/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        colors: resolve(import.meta.dirname, 'colors.html'),
      },
    },
  },
});

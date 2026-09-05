import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist/ui',
    emptyOutDir: true,
    modulePreload: false,
    assetsInlineLimit: 4096,
    cssMinify: true,
    minify: 'esbuild',
    sourcemap: false,
  },
});

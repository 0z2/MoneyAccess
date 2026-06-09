import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Сборка прототипа мониторинга на компонентах t-ds.
// Выходная папка — ../docs (её отдаёт GitHub Pages).
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      // Алиас на исходники дизайн-системы (в имени папки есть пробел —
      // алиас избавляет от проблем с ним в путях импорта).
      '@tds': fileURLToPath(new URL('../design system/src', import.meta.url)),
    },
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
});

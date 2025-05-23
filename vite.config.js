import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './', // Ajoutez cette ligne pour les chemins relatifs
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
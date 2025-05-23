import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/', // Corrige ici pour le déploiement
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
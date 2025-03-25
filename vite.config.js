// filepath: /Users/loriecrettex/Desktop/visualdon_global_daily_cost/vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Définit la racine du projet
  server: {
    port: 3000, // Port du serveur de développement
  },
  build: {
    outDir: 'dist', // Répertoire de sortie pour les fichiers buildés
  }
});
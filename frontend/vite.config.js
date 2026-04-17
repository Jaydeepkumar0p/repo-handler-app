import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The proxy ALWAYS runs in dev mode.
 * It rewrites /api/* → http://localhost:5000/api/*
 *
 * This means:
 *   - You do NOT need a .env file locally at all
 *   - VITE_API_URL should only be set on Vercel for production
 */
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // No rewrite — keeps /api prefix so backend routes match
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
  },
});

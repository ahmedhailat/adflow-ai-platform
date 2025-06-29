import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

export default defineConfig({
  plugins: [
    react(),
    chunkSplitPlugin({
      strategy: 'unbundle',
      customSplitting: {
        'react-vendor': ['react', 'react-dom'],
        'router': ['react-router-dom'],
        'state-management': ['zustand', 'immer'],
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
});
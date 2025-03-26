
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: '::', // Allow connections from all network interfaces
    port: 8080, // Set the development server port
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for the src directory
    },
  },
}));

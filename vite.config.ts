import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '::', // Allow connections from all network interfaces
    port: 8080, // Set the development server port
  },
  resolve: {
    alias: {
      '@': '/src', // Alias for the src directory
    },
  },
});

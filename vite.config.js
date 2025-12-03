import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  base: '/', // Ensure this is set to '/' for proper routing
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage'
    }
  }
});

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En local la API corre aparte; en Vercel comparten dominio.
    proxy: { '/api': 'http://localhost:4000' },
  },
});

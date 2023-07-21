import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 4000,
    proxy: {
      '/*': {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
});

import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: true, // Permite acesso de qualquer IP (0.0.0.0)
    open: true,
    cors: true, // Habilita CORS
    allowedHosts: [
      '.loca.lt', // Permite todos os subdomínios do LocalTunnel
      'localhost'
    ],
    proxy: {
      // Se a API URL for relativa, proxy para o backend
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configurações de servidor de desenvolvimento
  server: {
    port: 5173,
    host: "localhost", // Mais seguro que 0.0.0.0
    cors: true,
    open: false, // Não abrir browser automaticamente
  },

  // Configurações de preview
  preview: {
    port: 3000,
    host: "localhost",
  },

  // Configurações de build
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false, // Desabilitar sourcemaps em produção por segurança
    minify: "terser",
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          charts: ["chart.js", "react-chartjs-2", "recharts"],
        },
      },
    },
    // Configurações de assets
    assetsInlineLimit: 4096, // 4kb
  },

  // Definir variáveis de ambiente
  define: {
    __APP_VERSION__: '"2.0.0"',
  },

  // Configurações de otimização
  optimizeDeps: {
    include: ["react", "react-dom", "@mui/material", "@mui/icons-material"],
  },
});

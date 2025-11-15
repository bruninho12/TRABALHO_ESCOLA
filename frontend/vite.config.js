import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configurações de servidor de desenvolvimento
  server: {
    port: 5173,
    host: "localhost",
    cors: true,
    open: false,
    hmr: {
      port: 24678, // Porta específica para HMR
      host: "localhost", // Host específico para HMR
    },
    // Configurações de proxy para desenvolvimento
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Configurações de preview
  preview: {
    port: 3000,
    host: "localhost",
  },

  // Configurações de build otimizadas
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
    target: "es2015",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separação estratégica de chunks
          vendor: ["react", "react-dom"],
          mui: [
            "@mui/material",
            "@mui/icons-material",
            "@mui/lab",
            "@emotion/react",
            "@emotion/styled",
          ],
          charts: ["chart.js", "react-chartjs-2", "recharts", "@mui/x-charts"],
          router: ["react-router-dom"],
          utils: ["axios", "date-fns", "sweetalert2"],
          animations: ["framer-motion", "react-confetti"],
        },
        // Otimização de nomes de arquivos
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // Configurações de assets
    assetsInlineLimit: 4096, // 4kb
    reportCompressedSize: false, // Acelerar build
  },

  // Definir variáveis de ambiente
  define: {
    __APP_VERSION__: '"2.0.0"',
    __BUILD_TIME__: Date.now(),
  },

  // Configurações de otimização
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@mui/material",
      "@mui/icons-material",
      "axios",
      "framer-motion",
    ],
    exclude: ["@mui/x-charts"], // Lazy load quando necessário
  },

  // Configurações de resolve
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@utils": "/src/utils",
      "@services": "/src/services",
      "@styles": "/src/styles",
    },
  },
});

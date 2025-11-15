# ==========================================
# 🧪 Configuração de Testes - Vitest
# Setup completo para testes unitários e integração
# ==========================================

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Ambiente de teste
    environment: 'jsdom',
    
    // Arquivos de setup
    setupFiles: ['./src/tests/setup.js'],
    
    // Padrões de arquivos de teste
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Timeout para testes
    testTimeout: 10000,
    
    // Configuração de coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.config.js',
        '**/*.config.ts',
        'src/main.jsx',
        'src/assets/',
        'dist/',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    
    // Configuração de globals
    globals: true,
    
    // Configuração de mocks
    deps: {
      inline: ['@testing-library/user-event']
    },
    
    // Pool de workers
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  },
  
  // Aliases para imports nos testes
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@tests': path.resolve(__dirname, './src/tests'),
    }
  }
});
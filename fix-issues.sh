#!/bin/bash

# Script de Correção Rápida - DespFinancee
# Resolve problemas comuns de CSP e configuração

echo "🔧 Iniciando correções do DespFinancee..."

# 1. Limpar cache do Vite
echo "📦 Limpando cache..."
cd frontend
rm -rf node_modules/.vite
rm -rf dist

# 2. Reinstalar dependências limpas
echo "📥 Reinstalando dependências..."
npm cache clean --force
npm install

# 3. Build de produção
echo "🏗️  Fazendo build otimizado..."
npm run build

# 4. Verificar se backend está rodando
echo "🔍 Verificando backend..."
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo "⚠️  Backend não está rodando. Iniciando..."
    cd ../backend
    npm install
    npm run dev &
    sleep 5
fi

# 5. Teste de conectividade
echo "🌐 Testando conectividade..."
cd ../frontend
if curl -s http://localhost:3001/api/auth > /dev/null; then
    echo "✅ Backend conectado com sucesso!"
else
    echo "❌ Erro de conexão com backend"
fi

# 6. Iniciar servidor de desenvolvimento
echo "🚀 Iniciando frontend..."
npm run dev

echo "✅ Correções aplicadas! Acesse: http://localhost:5173"
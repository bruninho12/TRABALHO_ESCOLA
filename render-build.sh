#!/bin/bash

echo "==== Script de build para o Render ===="
echo "Diretório atual: $(pwd)"
echo "Listando arquivos:"
ls -la

echo "==== Instalando dependências do projeto principal ===="
npm install

echo "==== Verificando pasta backend ===="
if [ ! -d "backend" ]; then
  echo "Pasta backend não existe, criando..."
  mkdir -p backend
  
  echo "Verificando se existe pasta backup..."
  if [ -d "backup" ]; then
    echo "Copiando arquivos de backup para backend..."
    cp -r backup/* backend/
    
    if [ -f "backup/package.json.backup" ]; then
      echo "Usando package.json de backup..."
      cp backup/package.json.backup backend/package.json
    fi
  else
    echo "AVISO: Pasta backup não existe, criando package.json mínimo..."
    echo '{
  "name": "controle-despesas-backend",
  "version": "1.0.0",
  "description": "Backend para o sistema de Controle de Despesas Pessoais",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "xlsx": "^0.18.5"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}' > backend/package.json
    
    echo "Criando index.js mínimo..."
    echo 'import express from "express";
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});' > backend/index.js
  fi
else
  echo "Pasta backend encontrada"
fi

echo "==== Conteúdo da pasta backend ===="
ls -la backend

echo "==== Instalando dependências do backend ===="
cd backend && npm install

echo "==== Build concluído ===="

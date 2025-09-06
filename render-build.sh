#!/bin/bash

echo "Iniciando script de build para o Render..."

# Exibir a estrutura do diretório
echo "Estrutura do diretório atual:"
ls -la

echo "Instalando dependências..."
cd backend && npm install

echo "Verificando a estrutura de diretórios após instalação:"
ls -la

echo "Script de build concluído."

#!/usr/bin/env bash
# exit on error
set -o errexit

echo "🚀 Iniciando build do projeto..."

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install

# Rodar migrações do banco de dados
echo "🗄️ Executando migrações do banco de dados..."
npm run migrate

# Criar usuário admin inicial
echo "👤 Criando usuário admin inicial..."
npm run seed

# Voltar para a raiz e instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd ../frontend
npm install

# Build do frontend
echo "🏗️ Fazendo build do frontend..."
npm run build

echo "✅ Build concluído com sucesso!"

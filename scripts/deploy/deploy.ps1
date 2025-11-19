# ========================================
# 🚀 Script de Deploy - DespFinancee
# ========================================

Write-Host "🚀 Iniciando deploy do DespFinancee..." -ForegroundColor Green

# Verificar se o Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado. Instale em: https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Verificar se o Git está configurado
try {
    $gitUser = git config user.name
    if ([string]::IsNullOrEmpty($gitUser)) {
        Write-Host "⚠️  Configure o Git: git config --global user.name 'Seu Nome'" -ForegroundColor Yellow
        Write-Host "⚠️  Configure o Git: git config --global user.email 'seu@email.com'" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Git configurado para: $gitUser" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Git não encontrado. Instale em: https://git-scm.com" -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Preparando projeto para produção..." -ForegroundColor Cyan

# 1. Instalar dependências do frontend
Write-Host "`n🔧 Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location "frontend"
npm ci --production=false

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do frontend" -ForegroundColor Red
    exit 1
}

# 2. Build do frontend
Write-Host "`n🏗️  Fazendo build do frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build do frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend compilado com sucesso!" -ForegroundColor Green

# 3. Voltar para raiz e preparar backend
Set-Location ".."
Write-Host "`n🔧 Preparando backend..." -ForegroundColor Yellow
Set-Location "backend"
npm ci --production=true

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do backend" -ForegroundColor Red
    exit 1
}

Set-Location ".."

Write-Host "`n✅ Projeto pronto para deploy!" -ForegroundColor Green

# Mostrar opções de deploy
Write-Host "`n🚀 OPÇÕES DE DEPLOY:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Host "1️⃣  VERCEL (Recomendado para Frontend):" -ForegroundColor Yellow
Write-Host "   • npm i -g vercel"
Write-Host "   • cd frontend && vercel"
Write-Host "   • Siga as instruções na tela"
Write-Host ""
Write-Host "2️⃣  NETLIFY (Alternativa para Frontend):" -ForegroundColor Yellow
Write-Host "   • npm i -g netlify-cli"
Write-Host "   • cd frontend && netlify deploy --prod --dir=dist"
Write-Host ""
Write-Host "3️⃣  RAILWAY (Para Backend + Banco):" -ForegroundColor Yellow
Write-Host "   • npm i -g @railway/cli"
Write-Host "   • railway login"
Write-Host "   • railway deploy"
Write-Host ""
Write-Host "4️⃣  DOCKER (Deploy completo):" -ForegroundColor Yellow
Write-Host "   • docker-compose up -d --build"
Write-Host ""
Write-Host "5️⃣  SERVIDOR PRÓPRIO:" -ForegroundColor Yellow
Write-Host "   • Copie a pasta 'dist' para seu servidor web"
Write-Host "   • Configure proxy reverso para o backend"
Write-Host ""

Write-Host "📚 Guia completo: ./DEPLOY_GUIDE.md" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Perguntar se quer fazer deploy imediato
Write-Host "`n❓ Deseja fazer deploy agora? (y/n)" -ForegroundColor Cyan
$response = Read-Host

if ($response -eq "y" -or $response -eq "Y" -or $response -eq "yes") {
    Write-Host "`n🚀 Escolha a opção de deploy:" -ForegroundColor Yellow
    Write-Host "1 - Vercel (Frontend)"
    Write-Host "2 - Netlify (Frontend)" 
    Write-Host "3 - Docker (Completo)"
    
    $option = Read-Host "Digite o número (1-3)"
    
    switch ($option) {
        "1" {
            Write-Host "`n🚀 Instalando Vercel CLI..." -ForegroundColor Cyan
            npm i -g vercel
            Set-Location "frontend"
            Write-Host "🌐 Iniciando deploy no Vercel..." -ForegroundColor Green
            vercel --prod
        }
        "2" {
            Write-Host "`n🚀 Instalando Netlify CLI..." -ForegroundColor Cyan
            npm i -g netlify-cli
            Set-Location "frontend"
            Write-Host "🌐 Iniciando deploy no Netlify..." -ForegroundColor Green
            netlify deploy --prod --dir=dist
        }
        "3" {
            Write-Host "`n🐳 Iniciando deploy com Docker..." -ForegroundColor Cyan
            docker-compose up -d --build
        }
        default {
            Write-Host "❌ Opção inválida" -ForegroundColor Red
        }
    }
} else {
    Write-Host "`n✅ Deploy preparado! Execute quando estiver pronto." -ForegroundColor Green
}

Write-Host "`n🎉 Script concluído!" -ForegroundColor Green
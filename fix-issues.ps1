# Script de Correção Rápida - DespFinancee (PowerShell)
# Resolve problemas comuns de CSP e configuração

Write-Host "🔧 Iniciando correções do DespFinancee..." -ForegroundColor Yellow

# 1. Definir diretórios
$ProjectDir = "c:\Bruno_Souza\Programação\DespFinancee"
$FrontendDir = "$ProjectDir\frontend"
$BackendDir = "$ProjectDir\backend"

# 2. Limpar cache do Vite
Write-Host "📦 Limpando cache..." -ForegroundColor Cyan
Set-Location $FrontendDir
if (Test-Path "node_modules\.vite") {
    Remove-Item "node_modules\.vite" -Recurse -Force
}
if (Test-Path "dist") {
    Remove-Item "dist" -Recurse -Force
}

# 3. Verificar se node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "📥 Instalando dependências do frontend..." -ForegroundColor Green
    npm install
}

# 4. Verificar backend
Set-Location $BackendDir
if (!(Test-Path "node_modules")) {
    Write-Host "📥 Instalando dependências do backend..." -ForegroundColor Green
    npm install
}

# 5. Testar conectividade do backend
Write-Host "🔍 Verificando se backend está rodando..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend já está rodando!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Iniciando backend..." -ForegroundColor Yellow
    Start-Process PowerShell -ArgumentList "-Command", "cd '$BackendDir'; npm run dev" -WindowStyle Normal
    Start-Sleep 8
}

# 6. Build do frontend
Set-Location $FrontendDir
Write-Host "🏗️ Fazendo build otimizado..." -ForegroundColor Cyan
npm run build

# 7. Verificar se build foi bem-sucedido
if (Test-Path "dist\index.html") {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no build do frontend" -ForegroundColor Red
    exit 1
}

# 8. Mostrar status final
Write-Host ""
Write-Host "🎉 Correções aplicadas com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Para iniciar o projeto:" -ForegroundColor Yellow
Write-Host "   Frontend: npm run dev (porta 5173)" -ForegroundColor White
Write-Host "   Backend:  npm run dev (porta 3001)" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs de acesso:" -ForegroundColor Yellow
Write-Host "   App: http://localhost:5173" -ForegroundColor White
Write-Host "   API: http://localhost:3001" -ForegroundColor White
Write-Host "   Docs: http://localhost:3001/api-docs" -ForegroundColor White
Write-Host ""

# 9. Perguntar se deve iniciar frontend
$StartFrontend = Read-Host "Deseja iniciar o frontend agora? (s/n)"
if ($StartFrontend -eq "s" -or $StartFrontend -eq "S") {
    Write-Host "🚀 Iniciando frontend..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "✅ Para iniciar manualmente: cd frontend && npm run dev" -ForegroundColor Yellow
}
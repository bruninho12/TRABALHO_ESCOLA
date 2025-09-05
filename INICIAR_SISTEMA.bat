@echo off
echo ========================================
echo    SISTEMA CONTROLE DE DESPESAS
echo ========================================
echo.
echo Iniciando servidor backend...
echo.

cd backend
start "Servidor Backend" cmd /k "node index.js"

echo Servidor iniciado na porta 3001!
echo.
echo Aguarde 3 segundos e o frontend sera aberto...
timeout /t 3 /nobreak > nul

echo Abrindo frontend no navegador...
start "" "frontend\index.html"

echo.
echo ========================================
echo  SISTEMA PRONTO PARA USO!
echo ========================================
echo.
echo Usuarios de teste:
echo Email: bruno@exemplo.com - Senha: 123456
echo Email: maria@exemplo.com - Senha: 123456
echo.
echo Para parar o servidor, feche a janela do terminal
echo ========================================
pause

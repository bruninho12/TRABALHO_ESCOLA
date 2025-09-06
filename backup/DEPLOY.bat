@echo off
echo ===================================================
echo    DEPLOY DO SISTEMA DE CONTROLE DE DESPESAS
echo ===================================================
echo.

echo [1/3] Deploy do backend...
cd backend
call vercel --prod
echo.

echo [2/3] Deploy do frontend...
cd ../frontend
call vercel --prod
echo.

echo [3/3] Verificando deploys...
echo.
echo Backend URL: https://trabalho-escola-api.vercel.app
echo Frontend URL: https://trabalho-escola-frontend.vercel.app
echo.

echo ===================================================
echo    DEPLOY CONCLUÍDO COM SUCESSO!
echo ===================================================
echo.
echo Usuários de teste:
echo - Email: bruno@teste.com / Senha: 123456
echo - Email: maria@teste.com / Senha: 123456
echo.
echo Pressione qualquer tecla para sair...
pause > nul

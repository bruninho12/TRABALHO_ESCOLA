@echo off
echo ===================================
echo    IMPLANTACAO DO SISTEMA NO VERCEL
echo ===================================

echo.
echo ===== INFORMACOES SOBRE O NOME DO PROJETO =====
echo O nome do projeto deve ser:
echo - O nome que voce quer na URL do Vercel (ex: meu-projeto)
echo - Sem espacos, apenas letras minusculas, numeros e hifens
echo - Se o projeto ja existe no Vercel, use EXATAMENTE o mesmo nome
echo - Exemplo: "controle-despesas" resultara em "controle-despesas.vercel.app"
echo ===============================================
echo.
set /p PROJECT_NAME=Digite o nome do projeto para o Vercel: 
echo.
echo Preparando implantacao para o projeto: %PROJECT_NAME%
echo.

echo Verificando se o Git esta instalado...
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERRO: Git nao esta instalado. Por favor, instale o Git primeiro.
    pause
    exit /b 1
)

echo Verificando se o Vercel CLI esta instalado...
where vercel >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Instalando Vercel CLI...
    npm install -g vercel
    if %ERRORLEVEL% neq 0 (
        echo ERRO: Falha ao instalar o Vercel CLI.
        pause
        exit /b 1
    )
)

echo Preparando para implantacao...

echo Atualizando o repositorio local...
git add .
echo.
echo Digite uma mensagem de commit (ex: "Atualizacao para implantacao"):
set /p COMMIT_MSG=

git commit -m "%COMMIT_MSG%"
git push

echo.
echo Iniciando implantacao no Vercel...
cd frontend
vercel --prod --name %PROJECT_NAME%

echo.
echo IMPLANTACAO CONCLUIDA!
echo Seu projeto "%PROJECT_NAME%" agora esta disponivel no Vercel.
echo URL do seu projeto: https://%PROJECT_NAME%.vercel.app
echo.

pause

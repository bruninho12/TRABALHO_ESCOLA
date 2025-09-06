@echo off
echo ==========================================
echo    VERIFICACAO PRE-DEPLOY PARA O VERCEL
echo ==========================================
echo.

cd frontend

echo Verificando arquivos essenciais...

set MISSING_FILES=0

if not exist index.html (
  echo [ERRO] index.html NAO ENCONTRADO!
  set /A MISSING_FILES+=1
) else (
  echo [OK] index.html encontrado.
)

if not exist style.css (
  echo [ERRO] style.css NAO ENCONTRADO!
  set /A MISSING_FILES+=1
) else (
  echo [OK] style.css encontrado.
)

if not exist app.js (
  echo [ERRO] app.js NAO ENCONTRADO!
  set /A MISSING_FILES+=1
) else (
  echo [OK] app.js encontrado.
)

echo.
echo Criando diretorio public para teste...
if not exist public mkdir public
echo Copiando arquivos para public...
copy index.html public\
copy style.css public\
copy *.js public\

echo.
if %MISSING_FILES% GTR 0 (
  echo [ATENCAO] Faltam %MISSING_FILES% arquivos essenciais!
  echo Corrija os problemas antes de fazer o deploy.
) else (
  echo [SUCESSO] Todos os arquivos essenciais estao presentes!
  echo Seu projeto esta pronto para o deploy no Vercel.
)

echo.
echo ===========================================
echo.

pause

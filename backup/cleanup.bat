@echo off
echo Limpando arquivos desnecessarios...

REM Removendo arquivos de depuracao
del debug-api.js
del teste-api.html
del backend\api-cors.js
del backend\cors-test.js
del backend\index_novo.js
del frontend\cors-test.js
del frontend\firebase-app.js
del frontend\firebase-index.html

REM Removendo documentacao duplicada
del CORS_RESOLVIDO.md
del ERRO_500_RESOLVIDO.md
del MOBILE_OPTIMIZATIONS.md
del README_novo.md
del SOLUCAO_FINAL_CORS.md

REM Limpando logs e arquivos temporarios
if exist backend\*.log del backend\*.log
if exist frontend\*.log del frontend\*.log
if exist *.log del *.log

echo Limpeza concluida!
pause

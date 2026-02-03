@echo off
echo ==========================================
echo       INICIANDO COMUNIDAD TORUS
echo ==========================================
echo.
echo Localizando herramientas (Node.js)...
set "PATH=%PATH%;C:\Program Files\nodejs"
echo.
echo Iniciando servidor...
cd /d "%~dp0"
call npm run dev
pause

@echo off
chcp 65001 >nul
cls

echo ================================================================
echo   🛑 SISTEMA DE AGENDAMENTOS - PARANDO SERVIDORES
echo ================================================================
echo.

REM ====================================
REM MATAR TODOS OS PROCESSOS NODE.JS
REM ====================================
echo [1/2] 🔪 Encerrando processos Node.js...

REM Matar processos na porta 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if not "%%a"=="0" (
        echo    Encerrando processo na porta 3000 (PID: %%a)
        taskkill /F /PID %%a >nul 2>&1
    )
)

REM Matar processos na porta 5173
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    if not "%%a"=="0" (
        echo    Encerrando processo na porta 5173 (PID: %%a)
        taskkill /F /PID %%a >nul 2>&1
    )
)

REM Matar todos os processos node.exe e nodemon
echo    Encerrando todos os processos Node.js...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM nodemon.exe >nul 2>&1

echo.
echo    ✅ Processos encerrados!

REM ====================================
REM LIMPAR CACHES
REM ====================================
echo.
echo [2/2] 🧹 Limpando caches (opcional)...

REM Frontend - Limpar cache do Vite
if exist "frontend\node_modules\.vite" (
    echo    Limpando cache do Vite...
    rmdir /s /q "frontend\node_modules\.vite" >nul 2>&1
    echo    ✅ Cache do Vite limpo!
)

echo.
echo ================================================================
echo   ✅ SERVIDORES PARADOS COM SUCESSO!
echo ================================================================
echo.

pause

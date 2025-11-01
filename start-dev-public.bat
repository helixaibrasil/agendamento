@echo off
chcp 65001 >nul
cls

echo ================================================================
echo   SISTEMA DE AGENDAMENTOS - MODO PUBLICO (LOCALTUNNEL)
echo ================================================================
echo.
echo   Este script expoe TANTO o backend QUANTO o frontend
echo   via LocalTunnel para acesso de qualquer lugar!
echo.
echo ================================================================
echo.

REM ====================================
REM 1. MATAR PROCESSOS NODE.JS NA PORTA 3000 E 5173
REM ====================================
echo [1/6] Matando processos Node.js nas portas 3000 e 5173...

REM Matar processos na porta 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if not "%%a"=="0" (
        taskkill /F /PID %%a >nul 2>&1
    )
)

REM Matar processos na porta 5173
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    if not "%%a"=="0" (
        taskkill /F /PID %%a >nul 2>&1
    )
)

REM Matar todos os processos node.exe e nodemon (seguranca extra)
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM nodemon.exe >nul 2>&1

echo    [OK] Portas liberadas!
timeout /t 2 /nobreak >nul
echo.

REM ====================================
REM 2. LIMPAR CACHES
REM ====================================
echo [2/6] Limpando caches...

if exist "frontend\node_modules\.vite" (
    rmdir /s /q "frontend\node_modules\.vite" >nul 2>&1
)
if exist "frontend\dist" (
    rmdir /s /q "frontend\dist" >nul 2>&1
)

echo    [OK] Caches limpos!
echo.

REM ====================================
REM 3. VERIFICAR DEPENDENCIAS
REM ====================================
echo [3/6] Verificando dependencias...

if not exist "backend\node_modules" (
    echo    [*] Instalando dependencias do backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo    [*] Instalando dependencias do frontend...
    cd frontend
    call npm install
    cd ..
)

echo    [OK] Dependencias OK!
echo.

REM ====================================
REM 4. VERIFICAR .ENV
REM ====================================
echo [4/6] Verificando configuracao...

if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo    [!] Configure backend\.env com credenciais do Mercado Pago!
    )
)

if not exist "frontend\.env" (
    if exist "frontend\.env.example" (
        copy "frontend\.env.example" "frontend\.env" >nul
        echo    [!] Configure frontend\.env com Public Key do Mercado Pago!
    )
)

echo    [OK] Configuracao OK!
echo.

REM ====================================
REM 5. CONFIGURAR SUBDOMINIOS
REM ====================================
echo [5/6] Configurando subdominios do LocalTunnel...

REM Gerar um ID unico usando RANDOM (numeros de 0-32767)
set UNIQUE_ID=%RANDOM%

REM Subdominios fixos (formato: agendamento-api-12345)
set BACKEND_SUBDOMAIN=agendamento-api-%UNIQUE_ID%
set FRONTEND_SUBDOMAIN=agendamento-app-%UNIQUE_ID%

echo.
echo    [*] Seus subdominios para esta sessao:
echo       Backend:  https://%BACKEND_SUBDOMAIN%.loca.lt
echo       Frontend: https://%FRONTEND_SUBDOMAIN%.loca.lt
echo.
echo    [!] Anote essas URLs! Elas mudarao quando reiniciar.
echo.
timeout /t 3 /nobreak >nul

REM ====================================
REM 6. INICIAR SERVIDORES E TUNNELS
REM ====================================
echo [6/6] Iniciando servidores e tunnels...
echo.

REM Iniciar Backend com Tunnel
echo    [*] Iniciando Backend (Porta 3000)...
start "[BACKEND API]" cmd /k "cd /d %~dp0backend && set ENABLE_TUNNEL=true && set TUNNEL_SUBDOMAIN=%BACKEND_SUBDOMAIN% && npm run dev:tunnel"

timeout /t 3 /nobreak >nul

REM Iniciar Frontend
echo    [*] Iniciando Frontend (Porta 5173)...
start "[FRONTEND WEB]" cmd /k "cd /d %~dp0frontend && npm run dev -- --host"

echo    [*] Aguardando Frontend iniciar completamente...
timeout /t 10 /nobreak >nul

REM Iniciar LocalTunnel para o Frontend
echo    [*] Criando tunel para o Frontend...
start "[FRONTEND TUNNEL]" cmd /k "npx localtunnel --port 5173 --subdomain %FRONTEND_SUBDOMAIN%"

echo    [*] Aguardando tunel do Frontend conectar...
timeout /t 5 /nobreak >nul

echo.
echo ================================================================
echo   [OK] SISTEMA PUBLICO INICIADO COM SUCESSO!
echo ================================================================
echo.
echo   ACESSE DE QUALQUER LUGAR:
echo.
echo   * FRONTEND (Site Principal):
echo      https://%FRONTEND_SUBDOMAIN%.loca.lt
echo.
echo   * BACKEND (API):
echo      https://%BACKEND_SUBDOMAIN%.loca.lt/api
echo.
echo   * PAINEL ADMIN:
echo      https://%FRONTEND_SUBDOMAIN%.loca.lt/admin
echo.
echo   * WEBHOOK DO MERCADO PAGO:
echo      https://%BACKEND_SUBDOMAIN%.loca.lt/api/payment/webhook
echo.
echo ================================================================
echo.
echo   [!] IMPORTANTE - VERIFIQUE AS JANELAS ABERTAS:
echo.
echo      1. [BACKEND API] - Deve mostrar "LocalTunnel ativo!"
echo      2. [FRONTEND WEB] - Deve mostrar "ready in XXXms"
echo      3. [FRONTEND TUNNEL] - Deve mostrar a URL do tunel
echo.
echo   [!] PRIMEIRA VEZ? Ao acessar, clique em "Continue" na tela
echo      de seguranca do LocalTunnel.
echo.
echo   [!] ERRO 503? Aguarde mais 10-20 segundos e recarregue a pagina.
echo      O Vite pode demorar para iniciar completamente.
echo.
echo   [*] COMPARTILHE: Envie as URLs acima para quem quiser testar!
echo.
echo   [*] AUTO-RECONNECT: Se cair, reconecta automaticamente.
echo.
echo ================================================================
echo.
echo   DICAS:
echo      - Mantenha seu PC ligado e conectado a internet
echo      - Configure a URL do webhook no painel do Mercado Pago
echo      - As URLs mudam quando voce reiniciar o script
echo      - Verifique as 3 janelas para garantir que tudo iniciou
echo.
echo   PARA PARAR: Feche todas as janelas ou execute stop-dev.bat
echo.
echo ================================================================
echo.

REM Criar arquivo com as URLs para facil acesso
echo https://%FRONTEND_SUBDOMAIN%.loca.lt > TUNNEL_URLS.txt
echo https://%BACKEND_SUBDOMAIN%.loca.lt >> TUNNEL_URLS.txt
echo. >> TUNNEL_URLS.txt
echo https://%FRONTEND_SUBDOMAIN%.loca.lt/admin >> TUNNEL_URLS.txt
echo https://%BACKEND_SUBDOMAIN%.loca.lt/api/payment/webhook >> TUNNEL_URLS.txt

echo   [*] URLs salvas em: TUNNEL_URLS.txt
echo.

timeout /t 3 /nobreak >nul

REM Abrir frontend publico no navegador
echo   [*] Abrindo frontend publico no navegador...
start https://%FRONTEND_SUBDOMAIN%.loca.lt

echo.
echo   [OK] Sistema publico pronto! Compartilhe a vontade!
echo.

pause

# 📜 Scripts de Desenvolvimento

## 🚀 start-dev.bat

Script completo que prepara e inicia todo o ambiente de desenvolvimento.

### O que ele faz:

1. **🔪 Mata processos nas portas 3000 e 5173**
   - Encerra processos Node.js antigos
   - Libera as portas para novos servidores
   - Evita erro "EADDRINUSE"

2. **🧹 Limpa caches e arquivos temporários**
   - Remove cache do Vite (`frontend/node_modules/.vite`)
   - Remove pasta `dist` do frontend
   - Remove cache do backend

3. **📦 Verifica dependências**
   - Verifica se `node_modules` existe
   - Instala automaticamente se necessário
   - Mostra status de cada verificação

4. **🔧 Verifica arquivos .env**
   - Verifica se `.env` existe no backend e frontend
   - Copia de `.env.example` se não existir
   - Alerta para configurar credenciais do Mercado Pago

5. **🚀 Inicia os servidores**
   - Backend com LocalTunnel (porta 3000)
   - Frontend com Vite (porta 5173)
   - Abre navegador automaticamente
   - Mostra todas as URLs importantes

### Como usar:

```bash
# Basta dar duplo clique no arquivo:
start-dev.bat

# Ou executar no terminal:
.\start-dev.bat
```

### O que você verá:

```
================================================================
  🚀 SISTEMA DE AGENDAMENTOS - INICIANDO AMBIENTE DE DEV
================================================================

[1/5] 🔪 Matando processos Node.js nas portas 3000 e 5173...
   ✅ Portas liberadas!

[2/5] 🧹 Limpando caches e arquivos temporários...
   ✅ Caches limpos!

[3/5] 📦 Verificando dependências...
   ✅ Dependências do backend OK!
   ✅ Dependências do frontend OK!

[4/5] 🔧 Verificando arquivos de configuração...
   ✅ backend\.env encontrado!
   ✅ frontend\.env encontrado!

[5/5] 🚀 Iniciando servidores...

================================================================
  ✅ SERVIDORES INICIADOS COM SUCESSO!
================================================================

  📊 Backend (API):       http://localhost:3000/api
  🎨 Frontend (App):      http://localhost:5173
  👨‍💼 Admin Panel:         http://localhost:5173/admin

  🔗 URL Pública do Tunnel aparecerá na janela do Backend
  📌 Configure essa URL no Mercado Pago como webhook!
```

### Janelas abertas:

Após executar, você terá **3 janelas**:

1. **Janela Principal** - Mostra informações e mantém tudo rodando
2. **🔧 BACKEND** - Servidor Node.js com LocalTunnel
3. **🎨 FRONTEND** - Servidor Vite do React

### Como parar:

- Feche a janela principal (fecha tudo automaticamente)
- Ou use o script `stop-dev.bat`
- Ou pressione `CTRL+C` em cada janela

---

## 🛑 stop-dev.bat

Script para parar todos os servidores e limpar processos.

### O que ele faz:

1. **🔪 Encerra todos os processos Node.js**
   - Mata processos nas portas 3000 e 5173
   - Encerra todos os processos node.exe e nodemon
   - Garante que nada ficou rodando

2. **🧹 Limpa caches (opcional)**
   - Remove cache do Vite
   - Prepara para próxima execução

### Como usar:

```bash
# Duplo clique no arquivo:
stop-dev.bat

# Ou no terminal:
.\stop-dev.bat
```

---

## 🎯 Fluxo de Trabalho Recomendado

### Início do Dia:
```bash
1. Abra a pasta do projeto
2. Duplo clique em: start-dev.bat
3. Aguarde os servidores iniciarem
4. Comece a desenvolver!
```

### Durante o Desenvolvimento:
- Backend reinicia automaticamente (nodemon)
- Frontend recarrega automaticamente (Vite HMR)
- LocalTunnel reconecta automaticamente se cair

### Fim do Dia (ou quando quiser parar):
```bash
1. Feche a janela principal, ou
2. Execute: stop-dev.bat
```

---

## 🔧 Troubleshooting

### ❌ "EADDRINUSE: address already in use"

**Solução**: Execute `stop-dev.bat` antes de `start-dev.bat`

### ❌ "backend\.env não encontrado"

**Solução**:
1. O script copia automaticamente de `.env.example`
2. Edite `backend\.env` e configure as credenciais do Mercado Pago

### ❌ "node_modules não encontrado"

**Solução**: O script instala automaticamente! Apenas aguarde.

### ❌ LocalTunnel não conecta

**Solução**:
1. Verifique sua conexão com internet
2. O script tenta reconectar automaticamente
3. Verifique os logs na janela do backend

### ❌ Frontend não abre no navegador

**Solução**:
1. Aguarde alguns segundos
2. Abra manualmente: http://localhost:5173
3. Verifique a janela do frontend por erros

---

## 📝 Configuração Inicial (Primeira Vez)

### 1. Configure o Backend (.env)

Edite `backend\.env`:

```env
# Mercado Pago (obrigatório)
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxx
MP_PUBLIC_KEY=TEST-xxxxxxxxxxxxxxx

# LocalTunnel (opcional)
ENABLE_TUNNEL=true
TUNNEL_SUBDOMAIN=seu-projeto  # Opcional
```

### 2. Configure o Frontend (.env)

Edite `frontend\.env`:

```env
# Mercado Pago Public Key
VITE_MP_PUBLIC_KEY=TEST-xxxxxxxxxxxxxxx

# API URL
VITE_API_URL=http://localhost:3000/api
```

### 3. Execute o Script

```bash
start-dev.bat
```

Pronto! ✨

---

## 🎁 Recursos Adicionais

- **MERCADOPAGO_SETUP.md** - Configuração completa do Mercado Pago
- **QUICK_START.md** - Guia rápido de início
- **INSTALL.md** - Guia de instalação detalhado
- **API-EXAMPLES.md** - Exemplos de uso da API

---

## ⚡ Comandos Rápidos

```bash
# Iniciar LOCALMENTE (apenas você)
start-dev.bat

# Iniciar PUBLICAMENTE (acesso remoto) ⭐
start-dev-public.bat

# Parar tudo
stop-dev.bat

# Apenas backend (sem tunnel)
cd backend && npm run dev

# Backend com tunnel
cd backend && npm run dev:tunnel

# Apenas frontend
cd frontend && npm run dev
```

---

## 🌐 start-dev-public.bat (NOVO!) ⭐

Script para **acesso público** - Compartilhe com clientes e acesse de qualquer lugar!

### O que ele faz:

1. **🔪 Limpa e prepara** - Igual ao start-dev.bat
2. **🌐 Cria 2 túneis LocalTunnel:**
   - Um para o Backend (API)
   - Um para o Frontend (Site)
3. **📝 Salva URLs** - Cria arquivo `TUNNEL_URLS.txt`
4. **🚀 Abre navegador** - Com a URL pública

### URLs geradas:

```
Frontend:  https://agendamento-app-XXXXX.loca.lt
Backend:   https://agendamento-api-XXXXX.loca.lt
Admin:     https://agendamento-app-XXXXX.loca.lt/admin
Webhook:   https://agendamento-api-XXXXX.loca.lt/api/payment/webhook
```

### Quando usar:

- ✅ Demonstrar para cliente
- ✅ Testar em celular
- ✅ Testar webhook do Mercado Pago
- ✅ Compartilhar com testers
- ✅ Apresentação remota

### Como usar:

```bash
# Duplo clique em:
start-dev-public.bat

# Aguarde as URLs aparecerem
# Compartilhe com quem quiser!
```

---

---

## 💡 Dicas

1. **Sempre use `start-dev.bat`** - Ele cuida de tudo automaticamente
2. **Mantenha as janelas abertas** - Mostra logs importantes
3. **Configure o webhook** - Copie a URL do tunnel que aparece nos logs
4. **Fixe o subdomínio** - Configure `TUNNEL_SUBDOMAIN` no `.env`
5. **Leia a documentação** - `MERCADOPAGO_SETUP.md` tem tudo!

---

## 🎉 Pronto para Desenvolver!

Agora você tem um ambiente completo e automatizado! 🚀

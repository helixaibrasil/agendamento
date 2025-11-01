# 🚀 Sistema de Agendamentos - Guia Completo

## 📋 Índice Rápido

- 🏃 **[Quick Start](#-quick-start)** - Comece em 1 minuto
- 📜 **[Scripts](#-scripts-disponíveis)** - Todos os comandos
- 🌐 **[Acesso Público](#-acesso-público-localtunnel)** - Compartilhe com clientes
- 💳 **[Mercado Pago](#-mercado-pago)** - Configuração de pagamentos
- 📚 **[Documentação](#-documentação-completa)** - Guias detalhados

---

## ⚡ Quick Start

### 1️⃣ Primeira Vez (Configuração)

```bash
# 1. Configure as credenciais do Mercado Pago
#    Edite estes arquivos:
backend\.env         # MP_ACCESS_TOKEN e MP_PUBLIC_KEY
frontend\.env        # VITE_MP_PUBLIC_KEY

# 2. Execute o script de inicialização
start-dev.bat
```

### 2️⃣ Uso Diário

```bash
# Desenvolvimento Local (apenas você)
start-dev.bat

# Acesso Público (compartilhar com outros)
start-dev-public.bat

# Parar tudo
stop-dev.bat
```

**Pronto!** 🎉 Acesse: http://localhost:5173

---

## 📜 Scripts Disponíveis

### 🏠 start-dev.bat - Desenvolvimento Local

**Para usar sozinho no seu PC**

```bash
start-dev.bat
```

**O que faz:**
- ✅ Mata processos antigos
- ✅ Limpa caches
- ✅ Verifica dependências
- ✅ Inicia Backend (porta 3000)
- ✅ Inicia Frontend (porta 5173)
- ✅ Inicia LocalTunnel para webhook
- ✅ Abre navegador

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api
- Admin: http://localhost:5173/admin

---

### 🌐 start-dev-public.bat - Acesso Público ⭐

**Para compartilhar com clientes/testers**

```bash
start-dev-public.bat
```

**O que faz:**
- ✅ Tudo do start-dev.bat, MAIS:
- ✅ Cria túnel público para Frontend
- ✅ Cria túnel público para Backend
- ✅ Gera URLs únicas
- ✅ Salva URLs em `TUNNEL_URLS.txt`
- ✅ Abre URL pública no navegador

**URLs Públicas:**
```
Frontend:  https://agendamento-app-XXXXX.loca.lt
Backend:   https://agendamento-api-XXXXX.loca.lt
Admin:     https://agendamento-app-XXXXX.loca.lt/admin
Webhook:   https://agendamento-api-XXXXX.loca.lt/api/payment/webhook
```

**Use quando:**
- 📱 Testar em celular/tablet
- 👥 Demonstrar para cliente
- 🧪 Testar webhook do Mercado Pago
- 🌍 Acesso de qualquer lugar
- 📤 Compartilhar com testers

---

### 🛑 stop-dev.bat - Parar Tudo

**Encerra todos os processos**

```bash
stop-dev.bat
```

**O que faz:**
- ✅ Mata processos nas portas 3000 e 5173
- ✅ Encerra Node.js e Nodemon
- ✅ Limpa caches
- ✅ Libera portas

---

## 🌐 Acesso Público (LocalTunnel)

### Como Funciona

```
Internet → LocalTunnel → Seu PC → Backend/Frontend
```

### Configuração Automática ✅

O sistema já está **100% configurado**:

- ✅ **CORS** aceita URLs `*.loca.lt`
- ✅ **Vite** aceita conexões externas
- ✅ **Auto-reconnect** se cair
- ✅ **IDs únicos** evitam conflitos

### Passo a Passo

1. **Execute:**
   ```bash
   start-dev-public.bat
   ```

2. **Copie as URLs** que aparecerem:
   ```
   Frontend:  https://agendamento-app-123456.loca.lt
   Backend:   https://agendamento-api-123456.loca.lt
   Webhook:   https://agendamento-api-123456.loca.lt/api/payment/webhook
   ```

3. **Primeira vez?**
   - Ao acessar, clique em "Continue" na tela do LocalTunnel

4. **Configure o Webhook** no Mercado Pago:
   - Vá em: https://www.mercadopago.com.br/developers/panel/notifications/webhooks
   - Cole a URL do webhook
   - Pronto!

5. **Compartilhe!**
   - Envie as URLs para quem quiser
   - Funciona em qualquer dispositivo
   - Dados salvos no seu PC

### 📝 URLs Salvas

As URLs são salvas automaticamente em:
```
TUNNEL_URLS.txt
```

---

## 💳 Mercado Pago

### Configuração Rápida

1. **Obtenha as credenciais:**
   - Acesse: https://www.mercadopago.com.br/developers
   - Crie uma aplicação
   - Copie as credenciais de TESTE

2. **Configure o Backend:**
   ```env
   # backend\.env
   MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

3. **Configure o Frontend:**
   ```env
   # frontend\.env
   VITE_MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

4. **Configure o Webhook:**
   - Execute `start-dev-public.bat`
   - Copie a URL do webhook
   - Cole no painel do Mercado Pago

### Cartões de Teste

**Aprovado:**
```
Número: 5031 4332 1540 6351
Validade: 11/30
CVV: 123
Nome: APRO
CPF: 12345678909
```

**Pendente:**
```
Número: 5031 4332 1540 6351
Nome: CONT
```

**Rejeitado:**
```
Número: 5031 4332 1540 6351
Nome: OTHE
```

### Documentação Completa

Veja: **[MERCADOPAGO_SETUP.md](./MERCADOPAGO_SETUP.md)**

---

## 📚 Documentação Completa

### Guias Principais

| Arquivo | Descrição |
|---------|-----------|
| **[QUICK_START.md](./QUICK_START.md)** | Guia rápido de inicialização |
| **[SCRIPTS_README.md](./SCRIPTS_README.md)** | Documentação dos scripts .bat |
| **[LOCALTUNNEL_GUIA.md](./LOCALTUNNEL_GUIA.md)** | Guia completo do LocalTunnel |
| **[MERCADOPAGO_SETUP.md](./MERCADOPAGO_SETUP.md)** | Configuração do Mercado Pago |
| **[INSTALL.md](./INSTALL.md)** | Instalação detalhada |
| **[ESTRUTURA.md](./ESTRUTURA.md)** | Estrutura do projeto |
| **[API-EXAMPLES.md](./API-EXAMPLES.md)** | Exemplos de uso da API |

### Configuração

| Arquivo | Descrição |
|---------|-----------|
| `backend\.env.example` | Exemplo de configuração backend |
| `frontend\.env.example` | Exemplo de configuração frontend |

---

## 🎯 Casos de Uso

### Desenvolvimento Solo
```bash
start-dev.bat
```
- Rápido e sem latência
- Apenas local

### Demonstração para Cliente
```bash
start-dev-public.bat
```
- Envie URL do frontend
- Cliente acessa de qualquer lugar
- Testa pagamentos reais

### Teste em Múltiplos Dispositivos
```bash
start-dev-public.bat
```
- Teste em celular
- Teste em tablet
- Teste em outro computador

### Webhook Mercado Pago
```bash
start-dev-public.bat
```
- Copie URL do webhook
- Configure no painel MP
- Pagamentos funcionam!

---

## 🔧 Troubleshooting

### ❌ Porta 3000 em uso
```bash
stop-dev.bat
# Aguarde 2 segundos
start-dev.bat
```

### ❌ LocalTunnel não conecta
- Verifique sua internet
- O script reconecta automaticamente
- Aguarde alguns segundos

### ❌ Frontend não abre
- Aguarde 5-10 segundos após executar
- Abra manualmente: http://localhost:5173

### ❌ Webhook não funciona
1. Use `start-dev-public.bat` (não `start-dev.bat`)
2. Copie URL do webhook exata
3. Configure no painel do Mercado Pago
4. Teste com um pagamento

### ❌ Credenciais do MP incorretas
- Use credenciais de TESTE (começam com `TEST-`)
- Verifique se copiou corretamente
- Backend e Frontend precisam ter configurações

---

## 📊 Funcionalidades

### ✅ Implementado

- [x] Sistema de agendamentos completo
- [x] Cadastro de clientes e veículos
- [x] Verificação de disponibilidade
- [x] Pagamento PIX com QR Code
- [x] Pagamento com Cartão de Crédito
- [x] Webhooks do Mercado Pago
- [x] Painel administrativo
- [x] LocalTunnel com auto-reconnect
- [x] Notificações por email
- [x] Histórico de agendamentos
- [x] Gestão de configurações

### 🎨 Frontend

- [x] Landing page responsiva
- [x] Formulário multi-step
- [x] Validação de dados
- [x] Integração com Mercado Pago SDK
- [x] Feedback visual de loading
- [x] Mensagens de erro/sucesso

### 🔧 Backend

- [x] API RESTful
- [x] Autenticação JWT
- [x] Banco SQLite
- [x] Migrations automáticas
- [x] Rate limiting
- [x] CORS configurado
- [x] Error handling
- [x] Logs detalhados

---

## 🚀 Próximos Passos

### Para Produção

1. **Servidor VPS**
   - AWS, DigitalOcean, Heroku
   - Domínio próprio
   - HTTPS real

2. **Banco de Dados**
   - PostgreSQL ou MySQL
   - Backup automático
   - Escalável

3. **Credenciais Produção**
   - Ative aplicação no MP
   - Use credenciais SEM `TEST-`
   - Configure webhook permanente

4. **Monitoramento**
   - Logs centralizados
   - Alertas de erro
   - Métricas de uso

---

## 💡 Dicas

1. **Use start-dev.bat** para desenvolvimento
2. **Use start-dev-public.bat** para demonstrações
3. **Mantenha PC ligado** se usando LocalTunnel
4. **Salve URLs** do TUNNEL_URLS.txt
5. **Configure webhook** sempre que reiniciar
6. **Leia a documentação** quando tiver dúvidas

---

## 🆘 Suporte

- 📖 Leia a documentação em `docs/`
- 🐛 Verifique logs no terminal
- 🔍 Consulte troubleshooting acima
- 💬 Verifique console do navegador

---

## ✨ Recursos

- **LocalTunnel**: https://theboroer.github.io/localtunnel-www/
- **Mercado Pago Dev**: https://www.mercadopago.com.br/developers
- **Vite**: https://vitejs.dev/
- **Express**: https://expressjs.com/

---

## 🎉 Tudo Pronto!

Execute `start-dev.bat` e comece a desenvolver!

Quer acesso público? Execute `start-dev-public.bat`!

**Sucesso!** 🚀

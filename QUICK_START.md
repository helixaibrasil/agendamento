# ⚡ Quick Start - Sistema de Agendamentos

## 🚀 Iniciar o Sistema (Desenvolvimento)

### 1️⃣ Backend (com LocalTunnel para webhooks)

```bash
cd backend
npm run dev:tunnel
```

Você verá:
```
🚀 Servidor rodando na porta 3000
🔌 Iniciando LocalTunnel...
✅ LocalTunnel ativo!
🌐 URL Pública: https://xxxxx.loca.lt
📌 Configure este URL como webhook no Mercado Pago:
   https://xxxxx.loca.lt/api/payment/webhook
```

**IMPORTANTE**: Copie a URL e configure no painel do Mercado Pago!

### 2️⃣ Frontend

```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

## 🔧 Configuração Inicial

### Backend (.env)
```env
# Mercado Pago
MP_ACCESS_TOKEN=TEST-xxxxxxxxxx
MP_PUBLIC_KEY=TEST-xxxxxxxxxx

# LocalTunnel
ENABLE_TUNNEL=true
TUNNEL_SUBDOMAIN=meu-projeto  # Opcional
```

### Frontend (.env)
```env
VITE_MP_PUBLIC_KEY=TEST-xxxxxxxxxx
VITE_API_URL=http://localhost:3000/api
```

## 🎯 Funcionalidades

### ✅ O que está funcionando:
- [x] Cadastro de clientes e veículos
- [x] Agendamento com verificação de disponibilidade
- [x] Pagamento PIX com QR Code
- [x] Pagamento com Cartão de Crédito
- [x] Webhooks do Mercado Pago
- [x] LocalTunnel com auto-reconnect
- [x] Notificações de pagamento
- [x] Painel administrativo

### 🧪 Testar Pagamentos

**PIX**: Gerado automaticamente (ambiente de teste)

**Cartão de Crédito**:
```
Número: 5031 4332 1540 6351
Validade: 11/30
CVV: 123
Nome: APRO
CPF: 12345678909
```

## 🛠️ Comandos Úteis

```bash
# Backend normal (sem tunnel)
npm run dev

# Backend com tunnel (recomendado)
npm run dev:tunnel

# Migrar banco de dados
npm run migrate

# Popular dados iniciais
npm run seed

# Setup completo
npm run setup
```

## 📌 URLs Importantes

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Admin Panel: http://localhost:5173/admin
- Health Check: http://localhost:3000/api/health
- Mercado Pago Dev: https://www.mercadopago.com.br/developers

## 🐛 Problemas Comuns

### QR Code PIX não aparece
✅ **RESOLVIDO!** O interceptor axios foi corrigido

### Clicou em Cartão e recarregou a página
✅ **RESOLVIDO!** O callback do Mercado Pago SDK foi corrigido

### LocalTunnel desconectou
✅ **RESOLVIDO!** Auto-reconnect automático implementado

### Webhook não chega
1. Verifique se o tunnel está rodando
2. Atualize a URL no painel do Mercado Pago
3. Verifique os logs: `📥 Webhook received`

## 📖 Documentação Completa

- [Mercado Pago Setup](./MERCADOPAGO_SETUP.md)
- [Instalação](./INSTALL.md)
- [Estrutura](./ESTRUTURA.md)
- [API Examples](./API-EXAMPLES.md)

## 🎉 Tudo Pronto!

Execute `npm run dev:tunnel` no backend e comece a testar! 🚀

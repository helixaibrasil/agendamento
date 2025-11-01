# 🚀 Configuração do Mercado Pago - Guia Completo

Este guia mostra como configurar corretamente o Mercado Pago para processar pagamentos (PIX e Cartão).

## 📋 Pré-requisitos

1. Conta no Mercado Pago (criar em: https://www.mercadopago.com.br)
2. Aplicação criada no Mercado Pago Developers

## 🔑 Passo 1: Obter Credenciais

### 1.1 Acesse o Mercado Pago Developers
- Vá para: https://www.mercadopago.com.br/developers
- Faça login com sua conta Mercado Pago

### 1.2 Crie uma Aplicação
1. Clique em "Suas integrações" ou "Your integrations"
2. Clique em "Criar aplicação" ou "Create application"
3. Preencha:
   - **Nome**: Vistoria Veicular Express
   - **Tipo**: Pagamentos online
   - **Produto**: Checkout Transparente

### 1.3 Obtenha as Credenciais de Teste
1. Entre na aplicação criada
2. Vá em "Credenciais" ou "Credentials"
3. Selecione "Credenciais de teste" ou "Test credentials"
4. Copie:
   - **Public Key**: Começa com `TEST-...`
   - **Access Token**: Começa com `TEST-...`

### 1.4 Configure no Backend
Edite o arquivo `backend/.env`:

```env
# Mercado Pago - Credenciais de TESTE
MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx
```

### 1.5 Configure no Frontend
Edite o arquivo `frontend/.env`:

```env
VITE_MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## 🌐 Passo 2: Configurar Webhooks (Notificações)

### 2.1 Ative o LocalTunnel

O LocalTunnel cria uma URL pública temporária para seu servidor local, permitindo que o Mercado Pago envie notificações.

**Opção 1: Via variável de ambiente** (Recomendado)
```bash
cd backend
set ENABLE_TUNNEL=true  # Windows
# ou
export ENABLE_TUNNEL=true  # Linux/Mac
npm run dev
```

**Opção 2: Via script npm**
```bash
cd backend
npm run dev:tunnel
```

### 2.2 Copie a URL do Tunnel

Quando o servidor iniciar com tunnel ativo, você verá algo como:

```
✅ LocalTunnel ativo!
🌐 URL Pública: https://xxxxxx-xx-xx.loca.lt
📌 Configure este URL como webhook no Mercado Pago:
   https://xxxxxx-xx-xx.loca.lt/api/payment/webhook
```

**IMPORTANTE**: Copie esta URL! Ela muda a cada reinicialização.

### 2.3 Configure no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/notifications/webhooks
2. Clique em "Adicionar URL" ou "Add URL"
3. Cole a URL do webhook: `https://sua-url.loca.lt/api/payment/webhook`
4. Selecione os eventos:
   - ✅ `payment` (Pagamentos)
   - ✅ `payment.updated` (Atualizações de pagamento)
5. Clique em "Salvar"

## 🧪 Passo 3: Testar Pagamentos

### 3.1 Dados de Teste para PIX

O Mercado Pago gera automaticamente QR Codes de teste. Para simular aprovação:

1. Gere o QR Code no seu sistema
2. Use a ferramenta de teste do Mercado Pago:
   - https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

### 3.2 Dados de Teste para Cartão de Crédito

Use estes cartões de teste (já exibidos no formulário):

**Cartão Aprovado:**
```
Número: 5031 4332 1540 6351
Validade: 11/30
CVV: 123
Nome: APRO
CPF: 12345678909
```

**Outros cartões para diferentes cenários:**

- **Pagamento Pendente:**
  ```
  Número: 5031 4332 1540 6351
  Nome: CONT
  ```

- **Pagamento Rejeitado:**
  ```
  Número: 5031 4332 1540 6351
  Nome: OTHE
  ```

### 3.3 Monitorar Webhooks

Acompanhe os logs do backend para ver os webhooks chegando:

```
📥 Webhook received: {...}
💳 Payment status: approved
✅ Payment updated in database
✅ Agendamento confirmed: VST-XXXXX
```

## 🔄 Passo 4: Auto-Reconnect do LocalTunnel

O sistema possui auto-reconnect automático! Se a conexão cair:

```
⚠️  LocalTunnel fechado inesperadamente
🔄 Reconectando em 5 segundos...
🔌 Iniciando LocalTunnel...
✅ LocalTunnel ativo!
🌐 URL Pública: https://nova-url.loca.lt
```

**IMPORTANTE**: Quando a URL mudar, você precisa atualizar no painel do Mercado Pago!

### Dica: Fixar Subdomínio

Para evitar trocar a URL toda hora, você pode fixar um subdomínio:

No arquivo `backend/.env`:
```env
ENABLE_TUNNEL=true
TUNNEL_SUBDOMAIN=vistoria-express
```

Assim sua URL será sempre: `https://vistoria-express.loca.lt`

## ✅ Passo 5: Verificação Final

### Checklist:
- [ ] Credenciais do MP configuradas no backend (.env)
- [ ] Public Key configurada no frontend (.env)
- [ ] LocalTunnel rodando (npm run dev:tunnel)
- [ ] Webhook configurado no painel MP
- [ ] Teste de pagamento PIX funcionando
- [ ] Teste de pagamento Cartão funcionando
- [ ] Logs mostrando webhooks sendo recebidos

## 🚨 Troubleshooting

### Problema: "resource not found" do Mercado Pago

**Causa**: Usando credenciais de TESTE mas tentando acessar pagamento de PRODUÇÃO

**Solução**:
1. Verifique se está usando credenciais de teste (começam com `TEST-`)
2. Use apenas cartões de teste
3. Não tente acessar pagamentos reais em modo de teste

### Problema: QR Code PIX não gera

**Causa**: `payment_id` está como `undefined`

**Solução**: Foi corrigido! O interceptor do axios agora retorna apenas `response.data`

### Problema: Ao clicar em Cartão, página recarrega

**Causa**: Formulário estava enviando antes do Mercado Pago processar

**Solução**: Foi corrigido! O callback `onSubmit` agora processa corretamente

### Problema: Webhook não chega

**Possíveis causas**:
1. LocalTunnel não está rodando → Execute `npm run dev:tunnel`
2. URL do webhook desatualizada → Atualize no painel MP
3. Firewall bloqueando → Verifique configurações

**Debug**:
```bash
# No backend, você deve ver:
📥 Webhook received: {...}
```

## 🌍 Produção

Quando for para produção:

### 1. Ative as Credenciais de Produção
- No painel MP, vá em "Credenciais de produção"
- Ative a aplicação (precisa de aprovação)
- Copie as novas credenciais (sem `TEST-`)

### 2. Use um domínio real
- LocalTunnel é apenas para desenvolvimento
- Em produção, use seu domínio:
  ```
  https://seudominio.com/api/payment/webhook
  ```

### 3. Atualize as variáveis de ambiente
```env
MP_PUBLIC_KEY=APP-xxxxxxxx  # SEM TEST-
MP_ACCESS_TOKEN=APP-xxxxxxxx  # SEM TEST-
ENABLE_TUNNEL=false  # Desative o tunnel
```

## 📚 Recursos Úteis

- **Documentação MP**: https://www.mercadopago.com.br/developers/pt/docs
- **Checkout Transparente**: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration
- **Webhooks**: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
- **Cartões de Teste**: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

## 🆘 Suporte

Se continuar com problemas:

1. Verifique os logs do backend
2. Verifique o console do navegador
3. Confirme que as credenciais estão corretas
4. Teste com os dados de teste fornecidos acima

## 🎉 Pronto!

Agora seu sistema está 100% configurado para processar pagamentos via Mercado Pago! 🚀

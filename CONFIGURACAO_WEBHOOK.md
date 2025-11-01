# 🔗 Configuração do Webhook - Mercado Pago

## 📋 Passo a Passo

### 1. Iniciar o Sistema com Túnel

Execute o arquivo `start-dev.bat`. Ele irá:
- ✅ Instalar dependências (se necessário)
- ✅ Inicializar banco de dados (se necessário)
- ✅ Iniciar Backend (porta 3000)
- ✅ Iniciar Frontend (porta 5173)
- ✅ Criar túnel público com LocalTunnel

### 2. URL do Webhook

Após iniciar o sistema, você terá a seguinte URL pública:

```
https://agendamento.loca.lt/api/payment/webhook
```

**⚠️ IMPORTANTE:** Na primeira vez que acessar `https://agendamento.loca.lt`, você verá uma tela de segurança do LocalTunnel. Clique em **"Continue"** para liberar o acesso.

### 3. Configurar no Mercado Pago

#### Passo 1: Acessar o Painel de Desenvolvedores
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login com sua conta Mercado Pago

#### Passo 2: Ir para Webhooks
1. No menu lateral, clique em **"Suas integrações"**
2. Clique em **"Webhooks"**
3. Clique em **"Configurar notificações"**

#### Passo 3: Configurar a URL
Configure os seguintes campos:

```
URL de produção: https://agendamento.loca.lt/api/payment/webhook
```

**OU se estiver em modo de testes:**

```
URL de testes: https://agendamento.loca.lt/api/payment/webhook
```

#### Passo 4: Selecionar Eventos
Marque as seguintes opções:
- ✅ **Pagamentos** (Payments)
  - payment.created
  - payment.updated

#### Passo 5: Salvar
Clique em **"Salvar"** para ativar o webhook.

### 4. Testar o Webhook

#### Opção 1: Simulador do Mercado Pago
1. No painel de Webhooks, clique em **"Testar"**
2. Selecione um tipo de evento (ex: payment.created)
3. O Mercado Pago enviará uma notificação de teste

#### Opção 2: Fazer um Pagamento Real de Teste
1. Acesse http://localhost:5173
2. Crie um agendamento
3. Pague com os dados de teste:
   ```
   Cartão: 5031 4332 1540 6351
   Validade: 11/30
   CVV: 123
   Nome: APRO
   CPF: 12345678909
   ```
4. O webhook será acionado automaticamente

### 5. Verificar se o Webhook Está Funcionando

No terminal do Backend, você verá logs como:

```
Webhook received: { type: 'payment', data: { id: '12345678' } }
```

E no banco de dados, o agendamento será atualizado para `confirmado` automaticamente.

## 🔍 Troubleshooting

### Problema: LocalTunnel não está funcionando

**Solução:**
```bash
cd backend
npx localtunnel --port 3000 --subdomain agendamento
```

Se o subdomínio "agendamento" não estiver disponível, você receberá uma URL aleatória. Use essa URL no webhook.

### Problema: Webhook não está recebendo notificações

**Verificar:**
1. ✅ O túnel está ativo? Acesse https://agendamento.loca.lt
2. ✅ A URL está correta no Mercado Pago?
3. ✅ Os eventos estão selecionados corretamente?
4. ✅ O backend está rodando?

**Teste manual:**
```bash
curl -X POST https://agendamento.loca.lt/api/payment/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","data":{"id":"123456789"}}'
```

### Problema: Erro 403 ou IP bloqueado

**Solução:**
1. Acesse https://agendamento.loca.lt no navegador
2. Clique em "Continue" para liberar o IP
3. Tente novamente

## 📊 Estrutura do Webhook

O Mercado Pago envia notificações no seguinte formato:

```json
{
  "action": "payment.updated",
  "api_version": "v1",
  "data": {
    "id": "12345678"
  },
  "date_created": "2025-11-01T10:00:00.000Z",
  "id": 123456789,
  "live_mode": false,
  "type": "payment",
  "user_id": "123456"
}
```

Nosso backend processa assim:

1. Recebe o webhook
2. Extrai o `payment_id` de `data.id`
3. Consulta o pagamento no Mercado Pago
4. Atualiza o status no banco de dados
5. Se aprovado, confirma o agendamento automaticamente

## 📱 Eventos Processados

| Evento | Ação no Sistema |
|--------|-----------------|
| `payment.created` | Registra novo pagamento |
| `payment.updated` | Atualiza status do pagamento |
| Status = `approved` | Confirma agendamento automaticamente |
| Status = `rejected` | Mantém agendamento como pendente |
| Status = `cancelled` | Mantém agendamento como pendente |

## 🔐 Segurança

O LocalTunnel é **APENAS para desenvolvimento e testes**.

Para produção, você deve:
1. ✅ Usar um domínio próprio com HTTPS
2. ✅ Implementar autenticação de webhook (verificar assinatura do MP)
3. ✅ Usar variáveis de ambiente para credenciais
4. ✅ Monitorar logs de webhook

## 📚 Documentação Oficial

- [Webhooks - Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [Simulador de Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks#bookmark_simule_o_recebimento_de_notifica%C3%A7%C3%B5es)
- [LocalTunnel](https://theboroer.github.io/localtunnel-www/)

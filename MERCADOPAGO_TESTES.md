# 💳 Guia de Testes - Mercado Pago

## Dados de Teste para Pagamentos

### Cartão de Crédito - Aprovação Automática

Use estes dados para simular um pagamento aprovado:

```
Número do Cartão: 5031 4332 1540 6351
Validade: 11/30
CVV: 123
Nome no Cartão: APRO
CPF: 12345678909
```

### Outros Cartões de Teste

#### Pagamento Pendente
```
Número do Cartão: 5031 4332 1540 6351
Nome no Cartão: CONT
```

#### Pagamento Recusado por Fundos Insuficientes
```
Número do Cartão: 5031 4332 1540 6351
Nome no Cartão: FUND
```

#### Pagamento Recusado por Dados Inválidos
```
Número do Cartão: 5031 4332 1540 6351
Nome no Cartão: FORM
```

#### Pagamento Recusado - Outro Motivo
```
Número do Cartão: 5031 4332 1540 6351
Nome no Cartão: OTHE
```

### PIX - Teste

Para testar o pagamento via PIX:
1. Gere o QR Code
2. O pagamento ficará como "pendente"
3. Use o webhook simulator do Mercado Pago para simular a aprovação

## Status de Pagamento

| Status | Descrição |
|--------|-----------|
| `pending` | Pagamento pendente (aguardando processamento) |
| `approved` | Pagamento aprovado |
| `rejected` | Pagamento recusado |
| `cancelled` | Pagamento cancelado |
| `refunded` | Pagamento estornado |

## Testando o Fluxo Completo

1. **Criar Agendamento**
   - Preencha todos os dados do formulário
   - Escolha data e horário
   - Confirme os dados

2. **Processar Pagamento**
   - Escolha entre PIX ou Cartão
   - Use os dados de teste acima
   - Aguarde a confirmação

3. **Verificar Status**
   - O agendamento será automaticamente confirmado após aprovação
   - Você receberá o protocolo do agendamento

## Webhook do Mercado Pago

Para testes locais, use o ngrok para expor sua aplicação:

```bash
ngrok http 3000
```

Configure o webhook no Mercado Pago:
```
URL: https://seu-dominio.ngrok.io/api/payment/webhook
```

## Documentação Oficial

- [Cartões de Teste - Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)
- [Simulador de Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)

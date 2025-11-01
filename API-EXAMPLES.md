# Exemplos de Uso da API

## Base URL
```
http://localhost:3000/api
```

## Autenticação

### Login Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vistoria.com",
    "senha": "Admin123!@#"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@vistoria.com"
  }
}
```

Use o token em requisições protegidas:
```bash
-H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Endpoints Públicos

### 1. Verificar Disponibilidade

**Datas disponíveis:**
```bash
curl http://localhost:3000/api/availability/dates?days=7
```

**Response:**
```json
[
  {
    "data": "2024-01-20",
    "diaSemana": 6,
    "slotsDisponiveis": 15,
    "slotsTotal": 18
  },
  ...
]
```

**Horários de uma data:**
```bash
curl http://localhost:3000/api/availability/slots?data=2024-01-20
```

**Response:**
```json
[
  {
    "horario": "08:00",
    "disponivel": true,
    "vagasDisponiveis": 3,
    "vagasTotal": 3
  },
  {
    "horario": "09:00",
    "disponivel": true,
    "vagasDisponiveis": 2,
    "vagasTotal": 3
  },
  ...
]
```

**Verificar horário específico:**
```bash
curl "http://localhost:3000/api/availability/check?data=2024-01-20&horario=09:00"
```

**Response:**
```json
{
  "allowed": true
}
```
ou
```json
{
  "allowed": false,
  "reason": "Horário não disponível"
}
```

### 2. Obter Preços

```bash
curl http://localhost:3000/api/availability/prices
```

**Response:**
```json
{
  "cautelar": {
    "valor": 15000,
    "valorFormatado": "R$ 150,00"
  },
  "transferencia": {
    "valor": 12000,
    "valorFormatado": "R$ 120,00"
  },
  "outros": {
    "valor": 10000,
    "valorFormatado": "R$ 100,00"
  }
}
```

### 3. Criar Agendamento

```bash
curl -X POST http://localhost:3000/api/agendamentos \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": {
      "nome": "João Silva",
      "cpf": "123.456.789-00",
      "telefone": "(11) 98765-4321",
      "email": "joao@email.com"
    },
    "veiculo": {
      "placa": "ABC-1234",
      "marca": "Toyota",
      "modelo": "Corolla",
      "ano": 2020,
      "chassi": "9BWZZZ377VT004251"
    },
    "tipo_vistoria": "cautelar",
    "data": "2024-01-20",
    "horario": "09:00",
    "endereco_vistoria": "Rua Exemplo, 123 - São Paulo"
  }'
```

**Response:**
```json
{
  "id": 1,
  "protocolo": "VST-L3K2M9-X7Y4",
  "cliente_id": 1,
  "veiculo_id": 1,
  "tipo_vistoria": "cautelar",
  "data": "2024-01-20",
  "horario": "09:00",
  "preco": 15000,
  "status": "pendente",
  "cliente_email": "joao@email.com",
  "cliente_nome": "João Silva",
  "veiculo_placa": "ABC-1234",
  "veiculo_marca": "Toyota",
  "veiculo_modelo": "Corolla",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### 4. Consultar por Protocolo

```bash
curl http://localhost:3000/api/agendamentos/protocolo/VST-L3K2M9-X7Y4
```

**Response:**
```json
{
  "id": 1,
  "protocolo": "VST-L3K2M9-X7Y4",
  "status": "pendente",
  "data": "2024-01-20",
  "horario": "09:00",
  "cliente_nome": "João Silva",
  "cliente_telefone": "(11) 98765-4321",
  "cliente_email": "joao@email.com",
  "veiculo_placa": "ABC-1234",
  "veiculo_marca": "Toyota",
  "veiculo_modelo": "Corolla",
  ...
}
```

## Endpoints Protegidos (Requerem Token)

### 1. Listar Agendamentos

```bash
curl http://localhost:3000/api/agendamentos \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Com filtros:**
```bash
curl "http://localhost:3000/api/agendamentos?status=pendente&data=2024-01-20" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Response:**
```json
{
  "agendamentos": [
    {
      "id": 1,
      "protocolo": "VST-L3K2M9-X7Y4",
      "cliente_nome": "João Silva",
      ...
    }
  ],
  "total": 10,
  "limit": 100,
  "offset": 0
}
```

### 2. Buscar Agendamento por ID

```bash
curl http://localhost:3000/api/agendamentos/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 3. Atualizar Status

```bash
curl -X PATCH http://localhost:3000/api/agendamentos/1/status \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmado"
  }'
```

**Status válidos:**
- `pendente`
- `confirmado`
- `realizado`
- `cancelado`

### 4. Estatísticas

```bash
curl "http://localhost:3000/api/agendamentos/stats?data_inicio=2024-01-01&data_fim=2024-01-31" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Response:**
```json
{
  "total": 45,
  "confirmados": 30,
  "realizados": 25,
  "cancelados": 5,
  "receita_total": 675000,
  "receita_realizada": 375000
}
```

### 5. Configurações

**Obter todas:**
```bash
curl http://localhost:3000/api/config \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Atualizar:**
```bash
curl -X PUT http://localhost:3000/api/config \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "horario_inicio": "08:00",
    "horario_fim": "19:00",
    "preco_cautelar": "18000",
    "vagas_por_horario": "5"
  }'
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `401` - Não autenticado
- `404` - Não encontrado
- `429` - Muitas requisições (rate limit)
- `500` - Erro do servidor

## Rate Limiting

- **Geral:** 100 requisições por 15 minutos por IP
- **Agendamentos:** 10 criações por hora por IP

Se exceder, receberá:
```json
{
  "error": "Muitas requisições deste IP, tente novamente mais tarde."
}
```

## Exemplos em JavaScript

### Criar Agendamento
```javascript
const response = await fetch('http://localhost:3000/api/agendamentos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    cliente: {
      nome: 'João Silva',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      email: 'joao@email.com'
    },
    veiculo: {
      placa: 'ABC-1234',
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2020
    },
    tipo_vistoria: 'cautelar',
    data: '2024-01-20',
    horario: '09:00'
  })
});

const data = await response.json();
console.log('Protocolo:', data.protocolo);
```

### Login Admin
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@vistoria.com',
    senha: 'Admin123!@#'
  })
});

const { token, usuario } = await response.json();
localStorage.setItem('token', token);
```

### Requisição Autenticada
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/agendamentos', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('Agendamentos:', data.agendamentos);
```

## Postman Collection

Importe esta coleção no Postman para testar a API facilmente:

```json
{
  "info": {
    "name": "Vistoria API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@vistoria.com\",\n  \"senha\": \"Admin123!@#\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

## WebHooks (Futuro)

Em versões futuras, você poderá configurar webhooks para receber notificações:

```javascript
// POST para sua URL quando houver novo agendamento
{
  "event": "agendamento.created",
  "data": {
    "protocolo": "VST-L3K2M9-X7Y4",
    "cliente": "João Silva",
    ...
  }
}
```

## Suporte

Para mais informações, consulte o README.md principal.

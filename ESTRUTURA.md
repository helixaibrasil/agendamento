# Estrutura do Projeto

```
Agendamentos/
│
├── backend/                          # Backend Node.js + Express
│   ├── database/                     # Banco de dados SQLite
│   │   └── agendamentos.db          # Banco criado automaticamente
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Configuração do SQLite
│   │   │
│   │   ├── models/                  # Modelos de dados
│   │   │   ├── Agendamento.js      # CRUD de agendamentos
│   │   │   ├── Cliente.js          # CRUD de clientes
│   │   │   ├── Veiculo.js          # CRUD de veículos
│   │   │   ├── Usuario.js          # CRUD de usuários admin
│   │   │   └── Configuracao.js     # Configurações do sistema
│   │   │
│   │   ├── controllers/             # Lógica de negócio
│   │   │   ├── authController.js   # Autenticação
│   │   │   ├── agendamentoController.js
│   │   │   ├── availabilityController.js
│   │   │   └── configController.js
│   │   │
│   │   ├── routes/                  # Rotas da API
│   │   │   ├── auth.js
│   │   │   ├── agendamentos.js
│   │   │   ├── availability.js
│   │   │   └── config.js
│   │   │
│   │   ├── middleware/              # Middlewares
│   │   │   ├── auth.js             # Verificação JWT
│   │   │   └── errorHandler.js     # Tratamento de erros
│   │   │
│   │   ├── utils/                   # Utilitários
│   │   │   ├── emailService.js     # Envio de emails
│   │   │   ├── validators.js       # Validações
│   │   │   └── availability.js     # Lógica de disponibilidade
│   │   │
│   │   ├── migrations/              # Migrations do banco
│   │   │   ├── run.js              # Criar tabelas
│   │   │   └── seed.js             # Dados iniciais
│   │   │
│   │   └── server.js                # Servidor Express
│   │
│   ├── .env.example                 # Exemplo de variáveis de ambiente
│   ├── .gitignore
│   └── package.json
│
├── frontend/                         # Frontend Vanilla JS + Vite
│   ├── public/                      # Arquivos públicos
│   │
│   ├── src/
│   │   ├── components/              # Componentes JS
│   │   │   └── ScheduleForm.js     # Formulário de agendamento
│   │   │
│   │   ├── services/                # Serviços
│   │   │   └── api.js              # Cliente HTTP (Axios)
│   │   │
│   │   ├── utils/                   # Utilitários
│   │   │   └── validators.js       # Validações e máscaras
│   │   │
│   │   ├── styles/                  # Estilos CSS
│   │   │   ├── main.css            # Estilos principais
│   │   │   └── admin.css           # Estilos do admin
│   │   │
│   │   ├── main.js                  # Entry point da landing page
│   │   └── admin.js                 # Entry point do painel admin
│   │
│   ├── index.html                   # Landing page
│   ├── admin.html                   # Painel administrativo
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
├── README.md                         # Documentação principal
├── INSTALL.md                        # Guia de instalação rápida
├── ESTRUTURA.md                      # Este arquivo
└── .gitignore                        # Arquivos ignorados pelo Git
```

## Fluxo de Dados

### 1. Agendamento (Cliente)
```
Landing Page (index.html)
    ↓
ScheduleForm.js (4 etapas)
    ↓
API Service (axios)
    ↓
Backend Routes (/api/agendamentos)
    ↓
Controller (validações)
    ↓
Model (banco de dados)
    ↓
Email Service (confirmação)
    ↓
Response (protocolo + confirmação)
```

### 2. Gestão (Admin)
```
Admin Panel (admin.html)
    ↓
Login (JWT)
    ↓
Dashboard (estatísticas)
    ↓
Listagem de agendamentos
    ↓
Ações (confirmar/cancelar/visualizar)
    ↓
API Backend (rotas protegidas)
    ↓
Atualização no banco
```

## Principais Arquivos

### Backend

**src/server.js** - Servidor principal
- Configuração do Express
- Middlewares (CORS, Helmet, Rate Limit)
- Rotas
- Error handling

**src/models/Agendamento.js** - Modelo de agendamento
- CRUD completo
- Validações
- Geração de protocolo
- Queries otimizadas

**src/utils/emailService.js** - Serviço de email
- Templates HTML
- Envio de confirmação
- Lembretes automáticos

**src/middleware/auth.js** - Autenticação
- Verificação JWT
- Proteção de rotas
- Validação de usuário

### Frontend

**index.html** - Landing page
- Hero section
- Benefícios
- Preços
- Depoimentos
- Formulário de agendamento

**src/components/ScheduleForm.js** - Formulário wizard
- 4 etapas (dados, veículo, data, confirmação)
- Validações em tempo real
- Máscaras de input
- Integração com API

**admin.html** - Painel administrativo
- Dashboard com estatísticas
- Tabela de agendamentos
- Filtros
- Ações em massa

**src/admin.js** - Lógica do painel
- Autenticação
- Carregamento de dados
- Atualização de status
- Modal de detalhes

## Tecnologias por Camada

### Backend
- **Express** - Framework web
- **better-sqlite3** - Banco de dados
- **jsonwebtoken** - Autenticação
- **bcryptjs** - Hash de senhas
- **nodemailer** - Envio de emails
- **express-validator** - Validações
- **helmet** - Segurança
- **express-rate-limit** - Rate limiting

### Frontend
- **Vite** - Build tool
- **Axios** - HTTP client
- **date-fns** - Manipulação de datas
- **CSS Grid/Flexbox** - Layout
- **Vanilla JS** - Sem frameworks pesados

## Segurança

- ✅ JWT com expiração
- ✅ Senhas com bcrypt (10 rounds)
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet (security headers)
- ✅ CORS configurável
- ✅ Validações duplas (client + server)
- ✅ SQL injection protection (prepared statements)
- ✅ XSS protection

## Performance

- ✅ SQLite com WAL mode
- ✅ Índices no banco de dados
- ✅ Lazy loading de imagens
- ✅ CSS minificado em produção
- ✅ JS bundled com Vite
- ✅ Cache de configurações
- ✅ Queries otimizadas

## Escalabilidade

Para escalar o sistema:

1. **Banco de dados:** Migrar para PostgreSQL ou MySQL
2. **Cache:** Adicionar Redis para sessões e cache
3. **Storage:** Usar S3 para arquivos
4. **Load balancer:** NGINX ou similar
5. **CDN:** CloudFlare para assets estáticos
6. **Monitoramento:** PM2, New Relic ou Datadog

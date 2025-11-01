# Sistema de Agendamento de Vistorias Veiculares

Sistema completo de agendamento online de vistorias veiculares com landing page responsiva, sistema de conversão otimizado para tráfego pago (Meta/Facebook/Instagram) e painel administrativo.

## 📋 Características

### Landing Page
- Design moderno e responsivo (mobile-first)
- Otimizada para conversão de tráfego pago
- Integração com Meta Pixel (Facebook/Instagram)
- Seções de benefícios, preços e depoimentos
- CTA (Call-to-Action) estrategicamente posicionados
- Botão flutuante do WhatsApp
- Indicador de urgência (vagas disponíveis)

### Sistema de Agendamento
- Formulário wizard em 4 etapas
- Validação em tempo real de CPF, telefone, placa, etc.
- Calendário interativo com horários disponíveis
- Cálculo automático de preços
- Geração de protocolo único
- Confirmação instantânea por email
- Prevenção de double-booking
- Sistema de lembretes automáticos

### Painel Administrativo
- Dashboard com estatísticas em tempo real
- Gestão completa de agendamentos
- Filtros por data, status e tipo
- Atualização de status
- Visualização detalhada de agendamentos
- Controle de horários e configurações
- Relatórios de faturamento

### Backend Robusto
- API REST completa
- Autenticação JWT
- Rate limiting para segurança
- Validações no servidor
- Sistema de emails automáticos
- Logs de operações
- Tratamento de erros

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** v18+ com Express
- **SQLite** (fácil migração para PostgreSQL/MySQL)
- **JWT** para autenticação
- **Nodemailer** para envio de emails
- **bcryptjs** para hash de senhas
- **express-validator** para validações
- **helmet** para segurança
- **express-rate-limit** para proteção contra abuso

### Frontend
- **Vanilla JavaScript** (moderno e performático)
- **Vite** para build e desenvolvimento
- **Axios** para requisições HTTP
- **date-fns** para manipulação de datas
- **CSS3** com variáveis e Grid/Flexbox

## 📦 Instalação

### Pré-requisitos
- Node.js v18 ou superior
- npm ou yarn
- Git (opcional)

### Passo 1: Instalar Dependências do Backend

```bash
cd backend
npm install
```

### Passo 2: Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_PATH=./database/agendamentos.db

# JWT Secret (IMPORTANTE: Altere em produção!)
JWT_SECRET=sua_chave_secreta_super_segura_aqui_mude_em_producao

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app_email

# Business Configuration
BUSINESS_NAME=Vistoria Veicular Express
BUSINESS_EMAIL=contato@vistoria.com
BUSINESS_PHONE=(11) 99999-9999
BUSINESS_WHATSAPP=5511999999999

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Meta Pixel (Facebook/Instagram)
META_PIXEL_ID=your_pixel_id_here

# Admin User (First Setup)
ADMIN_EMAIL=admin@vistoria.com
ADMIN_PASSWORD=Admin123!@#
ADMIN_NAME=Administrador
```

### Passo 3: Inicializar o Banco de Dados

```bash
npm run setup
```

Este comando irá:
- Criar todas as tabelas necessárias
- Inserir configurações padrão
- Criar usuário administrador
- Adicionar dados de teste

**IMPORTANTE:** Anote as credenciais do admin que serão exibidas no console!

### Passo 4: Instalar Dependências do Frontend

```bash
cd ../frontend
npm install
```

### Passo 5: Configurar Frontend

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure a URL da API:

```env
VITE_API_URL=http://localhost:3000/api
VITE_META_PIXEL_ID=your_pixel_id_here
```

## 🚀 Executando o Sistema

### Modo Desenvolvimento

Em um terminal, inicie o backend:

```bash
cd backend
npm run dev
```

Em outro terminal, inicie o frontend:

```bash
cd frontend
npm run dev
```

Acesse:
- **Landing Page:** http://localhost:5173
- **Painel Admin:** http://localhost:5173/admin.html
- **API:** http://localhost:3000/api

### Modo Produção

Build do frontend:

```bash
cd frontend
npm run build
```

Inicie o backend em produção:

```bash
cd backend
NODE_ENV=production npm start
```

## 📧 Configuração de Email

### Gmail
1. Ative a verificação em 2 etapas
2. Gere uma senha de app: https://myaccount.google.com/apppasswords
3. Use a senha gerada no `.env` como `EMAIL_PASS`

### Outros Provedores
Ajuste as configurações SMTP no `.env`:
- `EMAIL_HOST`: Servidor SMTP
- `EMAIL_PORT`: Porta (587 para TLS, 465 para SSL)
- `EMAIL_SECURE`: true para SSL, false para TLS
- `EMAIL_USER`: Seu email
- `EMAIL_PASS`: Sua senha

## 🔧 Configurações do Sistema

Acesse o painel admin e vá em Configurações para ajustar:

- **Horário de funcionamento** (início e fim)
- **Duração dos slots** (padrão 60 minutos)
- **Dias de trabalho** (0=Domingo, 6=Sábado)
- **Preços** por tipo de vistoria
- **Antecedência mínima/máxima** para agendamentos
- **Vagas por horário**
- **Emails automáticos** (ativar/desativar)

## 📱 Integração com Meta Pixel (Facebook/Instagram)

1. Crie um Pixel no Facebook Business Manager
2. Copie o ID do Pixel
3. Configure no `.env` do frontend: `VITE_META_PIXEL_ID=seu_pixel_id`
4. Configure também no `index.html` (já está preparado)

Eventos rastreados automaticamente:
- **PageView**: Visualização da landing page
- **Lead**: Conclusão de cada etapa do formulário
- **Schedule**: Agendamento confirmado (conversão)

## 🔐 Segurança

O sistema implementa:

✅ Autenticação JWT com token expirável
✅ Hash de senhas com bcrypt
✅ Rate limiting (proteção contra força bruta)
✅ Validação de dados no frontend e backend
✅ Sanitização de inputs
✅ Proteção contra SQL injection
✅ Headers de segurança com Helmet
✅ CORS configurável
✅ Proteção contra double-booking

### Recomendações de Produção

1. **SEMPRE altere** `JWT_SECRET` para uma chave complexa
2. **Use HTTPS** em produção (configure um reverse proxy com nginx)
3. **Altere a senha do admin** após primeiro login
4. Configure **backups automáticos** do banco de dados
5. Use variáveis de ambiente seguras (não commite `.env`)
6. Configure **firewall** adequado no servidor
7. Mantenha as dependências **atualizadas**

## 📊 API Endpoints

### Públicos (sem autenticação)

```
POST   /api/agendamentos              - Criar agendamento
GET    /api/agendamentos/protocolo/:protocolo - Buscar por protocolo
GET    /api/availability/dates        - Datas disponíveis
GET    /api/availability/slots        - Horários disponíveis
GET    /api/availability/check        - Verificar disponibilidade
GET    /api/availability/prices       - Obter preços
```

### Protegidos (requer autenticação)

```
POST   /api/auth/login                - Login admin
GET    /api/auth/me                   - Dados do usuário logado
POST   /api/auth/change-password      - Alterar senha

GET    /api/agendamentos              - Listar agendamentos
GET    /api/agendamentos/:id          - Buscar por ID
GET    /api/agendamentos/stats        - Estatísticas
PATCH  /api/agendamentos/:id/status   - Atualizar status
PUT    /api/agendamentos/:id          - Atualizar agendamento
DELETE /api/agendamentos/:id          - Excluir agendamento

GET    /api/config                    - Obter configurações
GET    /api/config/:chave             - Obter configuração específica
PUT    /api/config                    - Atualizar configurações
```

## 🗄️ Estrutura do Banco de Dados

```sql
clientes
├── id (PK)
├── nome
├── telefone
├── email
├── cpf (UNIQUE)
└── created_at

veiculos
├── id (PK)
├── placa
├── marca
├── modelo
├── ano
├── chassi
├── cliente_id (FK)
└── created_at

agendamentos
├── id (PK)
├── protocolo (UNIQUE)
├── cliente_id (FK)
├── veiculo_id (FK)
├── tipo_vistoria
├── data
├── horario
├── endereco_vistoria
├── preco
├── status
├── observacoes
├── confirmado_email
├── lembrete_enviado
└── created_at

usuarios_admin
├── id (PK)
├── nome
├── email (UNIQUE)
├── senha_hash
├── ativo
└── created_at

configuracoes
├── id (PK)
├── chave (UNIQUE)
├── valor
└── descricao

horarios_bloqueados
├── id (PK)
├── data
├── horario_inicio
├── horario_fim
├── motivo
└── created_at

email_logs
├── id (PK)
├── agendamento_id (FK)
├── tipo
├── destinatario
├── assunto
├── enviado
├── erro
└── created_at
```

## 🐛 Troubleshooting

### Erro ao conectar ao banco de dados
```bash
# Verifique se o diretório database/ existe
mkdir -p backend/database

# Execute as migrations novamente
cd backend
npm run migrate
```

### Erro de permissão no SQLite
```bash
# No Windows, execute como administrador
# No Linux/Mac:
chmod 755 backend/database
chmod 644 backend/database/*.db
```

### Emails não estão sendo enviados
1. Verifique as credenciais no `.env`
2. Para Gmail, use senha de app (não a senha normal)
3. Verifique logs do console para erros específicos
4. Teste a conexão SMTP manualmente

### Frontend não conecta ao backend
1. Verifique se o backend está rodando (`http://localhost:3000/api/health`)
2. Confira a `VITE_API_URL` no `.env` do frontend
3. Verifique o CORS no backend (`src/server.js`)

### Erro 401 (Unauthorized) no painel admin
1. Verifique se o token está válido
2. Faça logout e login novamente
3. Verifique se `JWT_SECRET` está configurado corretamente

## 📝 Tarefas Pós-Instalação

- [ ] Alterar senha do administrador
- [ ] Configurar email SMTP
- [ ] Ajustar horários de funcionamento
- [ ] Configurar preços das vistorias
- [ ] Adicionar Meta Pixel ID
- [ ] Testar agendamento completo
- [ ] Configurar WhatsApp Business
- [ ] Personalizar textos da landing page
- [ ] Adicionar logo da empresa
- [ ] Configurar domínio e HTTPS

## 🚀 Deploy em Produção

### Opções de Hospedagem

**Backend:**
- VPS (DigitalOcean, Linode, AWS EC2)
- Heroku
- Railway
- Render

**Frontend:**
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Exemplo de Deploy Simples (VPS Ubuntu)

```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar projeto
git clone seu-repositorio.git
cd seu-repositorio

# Backend
cd backend
npm install --production
npm run setup
NODE_ENV=production pm2 start src/server.js --name vistoria-api

# Frontend (build e servir com nginx)
cd ../frontend
npm install
npm run build

# Configurar nginx
sudo cp dist/* /var/www/html/
```

## 🤝 Suporte

Para dúvidas ou problemas:

1. Verifique esta documentação
2. Consulte os logs do console
3. Verifique os arquivos `.env`
4. Teste os endpoints da API individualmente

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar.

## 💳 Integração com Mercado Pago

O sistema possui integração completa com Mercado Pago para pagamentos:

### Funcionalidades
- ✅ Pagamento via PIX (QR Code)
- ✅ Cartão de crédito (até 12x)
- ✅ Cartão de débito
- ✅ Webhooks automáticos para atualização de status
- ✅ Confirmação automática de agendamento após pagamento

### Configuração

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Obtenha suas credenciais (Access Token e Public Key)
4. Configure no `.env`:

```env
MP_ACCESS_TOKEN=seu_access_token_aqui
MP_PUBLIC_KEY=sua_public_key_aqui
```

### Webhooks

Para receber notificações de pagamento em produção, configure o webhook no painel do Mercado Pago:

```
URL: https://seu-dominio.com/api/webhook/mercadopago
Eventos: payment
```

Para desenvolvimento local, use o LocalTunnel:

```bash
npm run dev:tunnel
```

## 📊 Relatórios Profissionais

O painel administrativo inclui um módulo completo de relatórios com:

### Dashboards Interativos
- **Cards de Estatísticas** com gradientes coloridos
  - Total de agendamentos no período
  - Receita total gerada
  - Novos clientes cadastrados
  - Taxa de confirmação de agendamentos

### Gráficos Profissionais
- **📈 Evolução da Receita**: Gráfico de linha mostrando receita diária
- **📊 Distribuição por Status**: Gráfico de pizza com status dos agendamentos
- **🔧 Tipos de Serviços**: Gráfico de barras com tipos de vistoria mais solicitados
- **⏰ Distribuição por Horário**: Agendamentos por hora do dia

### Funcionalidades
- ✅ Seletor de período personalizável (datas customizadas)
- ✅ Atalhos rápidos (Mês Atual, Mês Anterior)
- ✅ **Exportação completa em PDF** com todos os gráficos e dados
- ✅ Ranking Top 5 serviços com receita e ticket médio
- ✅ Indicadores de mudança comparando períodos
- ✅ Design responsivo e profissional

## 🚀 Deploy no Render.com

Para fazer deploy completo no Render.com com PostgreSQL, webhooks e variáveis de ambiente, consulte o guia detalhado:

📖 **[DEPLOY_RENDER.md](./DEPLOY_RENDER.md)**

O guia cobre:
- Configuração do PostgreSQL
- Deploy do backend
- Deploy do frontend (static site)
- Configuração de webhooks do Mercado Pago
- Variáveis de ambiente de produção
- Migração de dados do SQLite para PostgreSQL

## 🎯 Roadmap Futuro

- [x] Integração com Mercado Pago ✅
- [x] Relatórios em PDF ✅
- [x] Dashboards profissionais com Chart.js ✅
- [ ] Integração com Google Calendar
- [ ] App mobile (React Native)
- [ ] Múltiplos idiomas
- [ ] Sistema de avaliações de clientes
- [ ] Exportação para Excel
- [ ] API para integração externa
- [ ] Sistema de notificações push
- [ ] Chat em tempo real com clientes

## 🆕 Atualizações Recentes

### v2.0.0 - 2025-01-01
- ✅ Integração completa com Mercado Pago (PIX, Crédito, Débito)
- ✅ Módulo de relatórios profissionais com dashboards
- ✅ Exportação de relatórios em PDF
- ✅ Gráficos interativos com Chart.js
- ✅ Logotipo aumentado no painel administrativo
- ✅ Webhooks automáticos para pagamentos
- ✅ Melhorias de segurança e performance

---

**Desenvolvido com ❤️ para facilitar o agendamento de vistorias veiculares**

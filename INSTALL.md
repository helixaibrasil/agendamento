# Guia de Instalação Rápida

## Instalação em 5 Minutos

### 1. Pré-requisitos
- Node.js 18+ instalado ([Download aqui](https://nodejs.org/))
- Editor de código (VS Code recomendado)

### 2. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
# Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
npm install
```

### 3. Configurar Ambiente

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edite `backend/.env` com suas informações (mínimo necessário):
```env
JWT_SECRET=minha_chave_secreta_123
ADMIN_EMAIL=admin@seusite.com
ADMIN_PASSWORD=SenhaForte123!
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

### 4. Inicializar Banco de Dados

```bash
cd backend
npm run setup
```

**IMPORTANTE:** Anote o email e senha do admin que aparecerem no terminal!

### 5. Iniciar o Sistema

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Acessar o Sistema

- **Site:** http://localhost:5173
- **Admin:** http://localhost:5173/admin.html
- **API:** http://localhost:3000/api/health

## Configuração do Email (Gmail)

1. Acesse: https://myaccount.google.com/security
2. Ative "Verificação em duas etapas"
3. Acesse: https://myaccount.google.com/apppasswords
4. Gere uma senha para "Email"
5. Copie a senha gerada
6. Cole em `backend/.env` no campo `EMAIL_PASS`

## Primeiro Acesso ao Admin

1. Acesse http://localhost:5173/admin.html
2. Use o email e senha configurados em `ADMIN_EMAIL` e `ADMIN_PASSWORD`
3. **IMPORTANTE:** Altere a senha após o primeiro login!

## Problemas Comuns

### "Cannot connect to database"
```bash
cd backend
mkdir -p database
npm run migrate
```

### "Port already in use"
Altere a porta no `backend/.env`:
```env
PORT=3001
```

E no `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### "Email não enviado"
Verifique:
1. Credenciais corretas no `.env`
2. Senha de app (não a senha normal do Gmail)
3. Verificação em 2 etapas ativada

## Próximos Passos

1. ✅ Testar um agendamento completo
2. ✅ Configurar horários de funcionamento no painel admin
3. ✅ Ajustar preços das vistorias
4. ✅ Personalizar textos da landing page
5. ✅ Configurar WhatsApp no botão flutuante

## Suporte

Consulte o `README.md` para documentação completa.

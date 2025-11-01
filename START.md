# 🚀 Início Rápido

## Comandos Essenciais

### Primeira Instalação (Apenas uma vez)

```bash
# Na raiz do projeto
npm install
npm run setup
```

### Iniciar o Sistema (Diariamente)

```bash
# Na raiz do projeto (inicia backend + frontend)
npm run dev
```

**OU manualmente:**

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

## URLs de Acesso

- 🌐 **Landing Page:** http://localhost:5173
- 👨‍💼 **Painel Admin:** http://localhost:5173/admin.html
- 🔧 **API Health:** http://localhost:3000/api/health

## Credenciais Padrão

**Painel Admin:**
- Email: `admin@vistoria.com`
- Senha: `Admin123!@#`

⚠️ **ALTERE APÓS PRIMEIRO LOGIN!**

## Checklist Pré-Produção

- [ ] Configurar email SMTP no `backend/.env`
- [ ] Alterar `JWT_SECRET` no `backend/.env`
- [ ] Alterar senha do admin
- [ ] Configurar horários de funcionamento
- [ ] Ajustar preços das vistorias
- [ ] Testar agendamento completo end-to-end
- [ ] Configurar Meta Pixel ID
- [ ] Configurar número do WhatsApp
- [ ] Personalizar textos e cores da landing page
- [ ] Adicionar logo da empresa

## Estrutura de Pastas Principais

```
📁 backend/
  ├── 📄 .env                 ← Configurações (EDITE AQUI!)
  ├── 📁 src/server.js        ← Servidor principal
  └── 📁 database/            ← Banco SQLite

📁 frontend/
  ├── 📄 index.html           ← Landing page (PERSONALIZE!)
  ├── 📄 admin.html           ← Painel admin
  └── 📁 src/
      ├── styles/main.css     ← Estilos (CORES AQUI!)
      └── main.js             ← JavaScript principal
```

## Configurações Importantes

### Backend (.env)

```env
# Servidor
PORT=3000

# Segurança (MUDE!)
JWT_SECRET=sua_chave_super_secreta_aqui

# Email
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=senha_de_app_gmail

# Negócio
BUSINESS_NAME=Sua Empresa
BUSINESS_PHONE=(11) 99999-9999
BUSINESS_WHATSAPP=5511999999999
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_META_PIXEL_ID=seu_pixel_id
```

## Personalização Rápida

### Mudar Cores

Edite `frontend/src/styles/main.css`:

```css
:root {
  --primary-color: #007bff;    /* Sua cor primária */
  --primary-dark: #0056b3;     /* Versão escura */
  --success-color: #28a745;    /* Cor de sucesso */
}
```

### Mudar Textos da Landing

Edite `frontend/index.html` e procure por:
- `<h1>` para títulos
- `.hero-subtitle` para subtítulos
- `.benefit-card` para benefícios

### Mudar Preços

Acesse o painel admin → Configurações ou edite `backend/.env`:

```env
PRICE_CAUTELAR=15000        # R$ 150,00 (em centavos)
PRICE_TRANSFERENCIA=12000   # R$ 120,00
PRICE_OUTROS=10000          # R$ 100,00
```

### Mudar Horários

Acesse o painel admin → Configurações ou edite `backend/.env`:

```env
WORKING_HOURS_START=08:00
WORKING_HOURS_END=18:00
WORKING_DAYS=1,2,3,4,5,6    # 0=Dom, 6=Sáb
```

## Comandos Úteis

```bash
# Ver logs do backend
cd backend
npm run dev

# Resetar banco de dados
cd backend
rm database/*.db
npm run setup

# Build para produção
npm run build

# Ver estrutura do projeto
tree -L 2 -I 'node_modules'
```

## Solução de Problemas

### Backend não inicia
```bash
cd backend
rm -rf node_modules
npm install
```

### Frontend não conecta
Verifique se o backend está rodando em http://localhost:3000

### Erro de email
1. Use senha de APP do Gmail (não senha normal)
2. Ative verificação em 2 etapas
3. Gere senha em: https://myaccount.google.com/apppasswords

### Erro de banco de dados
```bash
cd backend
npm run migrate
npm run seed
```

## Próximos Passos

1. ✅ Teste fazer um agendamento
2. ✅ Acesse o painel admin
3. ✅ Configure os horários
4. ✅ Personalize as cores
5. ✅ Configure o email
6. ✅ Teste o email de confirmação
7. ✅ Configure WhatsApp
8. ✅ Adicione seu logo
9. ✅ Teste em mobile
10. ✅ Deploy!

## Deploy Rápido (Vercel + Railway)

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway)
1. Conecte seu repositório Git
2. Configure as variáveis de ambiente
3. Deploy automático!

## Suporte

- 📖 Documentação completa: `README.md`
- 🏗️ Estrutura do projeto: `ESTRUTURA.md`
- 💻 Instalação detalhada: `INSTALL.md`

---

**Dica:** Mantenha este arquivo aberto durante o desenvolvimento! 🎯

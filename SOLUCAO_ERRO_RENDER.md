# ⚠️ SOLUÇÃO PARA O ERRO NO RENDER

## 🐛 O Erro que Você Teve

```
==> Running build command 'yarn install; yarn build'...
error Command "build" not found.
==> Build failed 😞
```

## ❓ Por Que Aconteceu

O Render tentou fazer build **na raiz do projeto** ao invés de entrar nas pastas `backend` ou `frontend`. Isso acontece porque você não especificou o **Root Directory**.

---

## ✅ SOLUÇÃO RÁPIDA (3 passos)

### 🔧 Se você já criou o serviço no Render:

#### 1. Acesse o Serviço

No dashboard do Render, clique no serviço que falhou.

#### 2. Vá em Settings

No menu lateral esquerdo, clique em **"Settings"**

#### 3. Configure o Root Directory

Role até encontrar **"Root Directory"** e preencha:

**Se for o BACKEND:**
```
Root Directory: backend
```

**Se for o FRONTEND:**
```
Root Directory: frontend
```

Clique em **"Save Changes"**

O Render vai fazer redeploy automaticamente e agora vai funcionar! ✅

---

## 🆕 Se você vai criar novo serviço:

### Para o Backend:

1. New + → Web Service
2. Conecte ao GitHub: `helixaibrasil/agendamento`
3. **IMPORTANTE**: Preencha:

```
┌──────────────────────────────────────────────────────────┐
│  Name: agendamentos-backend                              │
│  Branch: main                                            │
│  Root Directory: backend          ⚠️ NÃO ESQUEÇA!        │
│  Runtime: Node                                           │
│  Build Command: npm install && npm run migrate:postgres  │
│  Start Command: npm start                                │
└──────────────────────────────────────────────────────────┘
```

### Para o Frontend:

1. New + → Static Site
2. Conecte ao GitHub: `helixaibrasil/agendamento`
3. **IMPORTANTE**: Preencha:

```
┌────────────────────────────────────────────────────┐
│  Name: agendamentos-frontend                       │
│  Branch: main                                      │
│  Root Directory: frontend      ⚠️ NÃO ESQUEÇA!     │
│  Build Command: npm install && npm run build       │
│  Publish Directory: dist                           │
└────────────────────────────────────────────────────┘
```

---

## 📖 Guia Completo Passo a Passo

Criamos um guia visual completo com todas as configurações necessárias:

👉 **DEPLOY_RENDER_PASSO_A_PASSO.md**

Este arquivo tem:
- Screenshots textuais de cada tela
- Todas as variáveis de ambiente necessárias
- Como configurar PostgreSQL
- Como configurar webhooks do Mercado Pago
- Solução de problemas comuns
- Testes finais

---

## 🎯 Resumo do Que Fazer AGORA

### Opção 1: Consertar o Serviço Existente

1. Acesse o serviço no Render
2. Settings → Root Directory = `backend` ou `frontend`
3. Save Changes
4. Aguarde redeploy (5-10 min)

### Opção 2: Criar Novo Serviço (Recomendado)

1. Delete o serviço que deu erro (Settings → Delete Service)
2. Siga o guia: **DEPLOY_RENDER_PASSO_A_PASSO.md**
3. Preencha Root Directory corretamente
4. Sucesso! ✅

---

## 🔄 Arquivos Atualizados no GitHub

Fiz push de:

✅ **.npmrc** - Força uso de npm (evita conflito com yarn)
✅ **render.yaml** - Configuração automática para o Render
✅ **DEPLOY_RENDER_PASSO_A_PASSO.md** - Guia visual completo
✅ **SOLUCAO_ERRO_RENDER.md** - Este arquivo

---

## 💡 Por Que Isso Resolve

### Antes (ERRADO):
```
/ (raiz)
├── backend/
├── frontend/
└── package.json    ← Render tentava buildar aqui!
```

### Depois (CORRETO):
```
/ (raiz)
├── backend/       ← Render entra aqui para backend
│   └── package.json
└── frontend/      ← Render entra aqui para frontend
    └── package.json
```

Com **Root Directory = backend**, o Render:
1. Entra na pasta `backend/`
2. Roda `npm install` lá dentro
3. Encontra o `package.json` correto
4. Roda `npm run migrate:postgres`
5. Inicia com `npm start`

✅ **Funciona!**

---

## 📞 Precisa de Ajuda?

Siga o guia completo: **DEPLOY_RENDER_PASSO_A_PASSO.md**

Tem screenshots textuais de cada passo, todas as variáveis de ambiente, e solução para problemas comuns.

---

## ✅ Próximos Passos

1. **Configurar Root Directory** (backend ou frontend)
2. **Aguardar build** (~5-10 min)
3. **Testar** `/api/health` (backend) ou abrir site (frontend)
4. **Seguir guia** DEPLOY_RENDER_PASSO_A_PASSO.md para resto

---

**Agora vai funcionar! 🚀**

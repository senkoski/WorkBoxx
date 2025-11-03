# WorkBox - Instruções de Setup Completo

## Visão Geral

Este documento fornece instrções para:
1. Executar o Frontend (Next.js)
2. Implementar o Backend (usando o prompt PROVIDED)
3. Integrar completamente os dois sistemas

---

## Frontend Setup

### 1. Requisitos
- Node.js 18+
- npm ou yarn
- Git

### 2. Instalação

\`\`\`bash
# Clonar o repositório
git clone <seu-repo>
cd workbox-frontend

# Instalar dependências
npm install

# Criar arquivo .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
EOF

# Executar em desenvolvimento
npm run dev
\`\`\`

### 3. Acessar
- Frontend: http://localhost:3000
- Usuário Demo: 
  - ID: `1` ou Email: `joao.silva@empresa.com`
  - Senha: `password123`

---

## Backend Setup

### Usar o Prompt Fornecido

1. Copie o conteúdo do arquivo `BACKEND_PROMPT.md`
2. Cole em uma conversa com sua IA (ChatGPT, Claude, etc)
3. Aguarde a IA gerar o código completo do backend

### Estrutura Esperada do Backend

\`\`\`
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── companies.ts
│   │   ├── products.ts
│   │   ├── invoices.ts
│   │   ├── notifications.ts
│   │   ├── activities.ts
│   │   └── dashboard.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── models/
│   │   └── (Prisma ORM)
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── .env
└── package.json
\`\`\`

### Instalação Backend (Após IA gerar código)

\`\`\`bash
# Clonar ou criar repositório do backend
cd workbox-backend

# Instalar dependências
npm install

# Configurar .env
cat > .env << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/workbox"
JWT_SECRET="seu_secret_muito_seguro_aqui"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EOF

# Setup de Database
npx prisma migrate dev --name init

# Executar em desenvolvimento
npm run dev
\`\`\`

---

## Integração Frontend + Backend

### 1. Verificar Conectividade

No console do navegador (DevTools > Console):

\`\`\`javascript
// Testar conexão com backend
fetch('http://localhost:3001/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
\`\`\`

### 2. Executar Login com Backend

\`\`\`bash
# Terminal 1: Frontend
cd workbox-frontend
npm run dev

# Terminal 2: Backend
cd workbox-backend
npm run dev
\`\`\`

Então:
1. Vá para http://localhost:3000
2. Use credenciais do banco de dados do backend
3. Verifique Network tab (DevTools) para ver requisições à API

### 3. Troubleshooting

**Erro: "API não responde"**
- Verifique se backend está rodando em http://localhost:3001
- Verifique arquivo `.env.local` do frontend
- Verifique CORS no backend

**Erro: "Login falha"**
- Verifique se usuário existe no banco de dados
- Verifique hash da senha
- Verifique logs do backend

**Erro: "CORS bloqueado"**
- Adicione no backend:
  \`\`\`javascript
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))
  \`\`\`

---

## Variáveis de Ambiente

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Backend (.env)
\`\`\`
DATABASE_URL=postgresql://user:password@localhost:5432/workbox
JWT_SECRET=seu_secret_muito_seguro
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
\`\`\`

---

## Deploy em Produção

### Frontend (Vercel)
\`\`\`bash
# Login no Vercel
npm install -g vercel
vercel login

# Deploy
vercel --prod

# Definir variável de ambiente
vercel env add NEXT_PUBLIC_API_URL
# Digite: https://api.seu-dominio.com
\`\`\`

### Backend (Heroku, Railway, etc)

Adicione variáveis de ambiente:
- DATABASE_URL: Seu PostgreSQL em produção
- JWT_SECRET: Secret forte
- CORS_ORIGIN: https://seu-dominio.com
- NODE_ENV: production

---

## Checklist Final

- [ ] Frontend rodando em http://localhost:3000
- [ ] Backend rodando em http://localhost:3001
- [ ] Banco de dados criado e migrado
- [ ] Login funciona
- [ ] Dashboard carrega produtos
- [ ] Filtros e busca funcionam
- [ ] CRUD de produtos funciona
- [ ] Upload de arquivos funciona
- [ ] Notificações funcionam
- [ ] Dark mode funciona
- [ ] Multi-empresa funciona
- [ ] Todas as configurações funcionam

---

## Próximos Passos

1. Execute o prompt do backend
2. Configure o banco de dados
3. Inicie ambos os servidores
4. Teste todas as funcionalidades
5. Deploy em produção

**Suporte:** Em caso de dúvidas, consulte:
- `BACKEND_PROMPT.md` - Especificações do backend
- `API_ROUTES.md` - Mapa de rotas
- `DATABASE_SCHEMA.md` - Estrutura do banco

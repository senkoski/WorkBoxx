# WorkBox Backend

Backend para o sistema WorkBox de gerenciamento de estoque, empresas, produtos e notas fiscais.

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT para autenticação
- Zod para validação
- Multer para upload de arquivos

## Estrutura do Projeto

```
workbox-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   ├── routes/
│   │   ├── activity.routes.js
│   │   ├── auth.routes.js
│   │   ├── company.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── invoice.routes.js
│   │   ├── notification.routes.js
│   │   ├── product.routes.js
│   │   └── user.routes.js
│   ├── services/
│   ├── utils/
│   └── index.js
├── .env
└── package.json
```

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure o arquivo `.env` com suas variáveis de ambiente:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/workbox"
   JWT_SECRET="seu_segredo_jwt"
   PORT=3000
   ```
4. Execute as migrações do Prisma:
   ```
   npx prisma migrate dev
   ```
5. Inicie o servidor:
   ```
   npm run dev
   ```

## Rotas da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/logout` - Logout de usuário
- `POST /api/auth/refresh` - Renovar token JWT

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar novo usuário
- `GET /api/users/:id` - Obter detalhes de um usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Empresas
- `GET /api/companies` - Listar empresas
- `POST /api/companies` - Criar nova empresa
- `GET /api/companies/:id` - Obter detalhes de uma empresa
- `PUT /api/companies/:id` - Atualizar empresa
- `DELETE /api/companies/:id` - Deletar empresa

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar novo produto
- `GET /api/products/:id` - Obter detalhes de um produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto
- `GET /api/products/stock` - Resumo de estoque

### Notas Fiscais
- `GET /api/invoices` - Listar notas fiscais
- `POST /api/invoices` - Fazer upload de nova nota fiscal
- `GET /api/invoices/:id` - Obter detalhes de uma nota fiscal
- `PUT /api/invoices/:id/status` - Atualizar status da nota fiscal
- `DELETE /api/invoices/:id` - Deletar nota fiscal
- `GET /api/invoices/:id/download` - Baixar arquivo XML da nota fiscal

### Notificações
- `GET /api/notifications` - Listar notificações do usuário
- `POST /api/notifications/:id/read` - Marcar notificação como lida
- `POST /api/notifications/read-all` - Marcar todas notificações como lidas
- `DELETE /api/notifications/:id` - Deletar notificação

### Atividades
- `GET /api/activities` - Listar atividades

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/recent-activities` - Atividades recentes
- `GET /api/dashboard/top-products` - Produtos mais ativos
- `GET /api/dashboard/stock-alert` - Alertas de estoque
# 📚 Documentação das Rotas da API - WorkBox

## 🔐 Autenticação

### Login
**POST** `/api/auth/login`

Autentica um usuário no sistema.

**Body:**
```json
{
  "identifier": "usuario@email.com ou ID do usuário",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "role": "admin|manager|user",
    "department": "TI",
    "status": "active"
  },
  "token": "jwt_token_aqui",
  "company": {
    "id": "uuid",
    "name": "Nome da Empresa",
    "cnpj": "00000000000000"
  }
}
```

### Registro (Criar Primeiro Usuário/Admin)
**POST** `/api/auth/register`

Cria um novo usuário administrador no sistema.

**Body:**
```json
{
  "name": "Nome Completo",
  "email": "admin@empresa.com",
  "password": "senha_segura",
  "companyId": "uuid_da_empresa"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Nome Completo",
    "email": "admin@empresa.com",
    "role": "admin",
    "department": "Administração",
    "status": "active"
  },
  "token": "jwt_token_aqui",
  "company": {
    "id": "uuid",
    "name": "Nome da Empresa"
  }
}
```

### Logout
**POST** `/api/auth/logout`

Realiza logout do usuário (opcional, token gerenciado no cliente).

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## 🏢 Empresas

### Listar Empresas
**GET** `/api/companies`

Lista todas as empresas cadastradas.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "companies": [
    {
      "id": "uuid",
      "name": "Empresa ABC",
      "cnpj": "00000000000000",
      "email": "contato@empresa.com",
      "phone": "11999999999",
      "address": "Rua X, 123",
      "logo": "url_da_logo",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Criar Empresa
**POST** `/api/companies`

Cria uma nova empresa (apenas administradores).

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Nome da Empresa",
  "cnpj": "00000000000000",
  "email": "contato@empresa.com",
  "phone": "11999999999",
  "address": "Rua X, 123, Cidade - UF",
  "logo": "https://url-da-logo.com/logo.png"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "company": {
    "id": "uuid",
    "name": "Nome da Empresa",
    "cnpj": "00000000000000",
    "email": "contato@empresa.com",
    "phone": "11999999999",
    "address": "Rua X, 123, Cidade - UF",
    "logo": "https://url-da-logo.com/logo.png",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Obter Empresa por ID
**GET** `/api/companies/:id`

Obtém detalhes de uma empresa específica.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "company": {
    "id": "uuid",
    "name": "Nome da Empresa",
    "cnpj": "00000000000000",
    "email": "contato@empresa.com",
    "phone": "11999999999",
    "address": "Rua X, 123",
    "logo": "url_da_logo"
  }
}
```

### Atualizar Empresa
**PUT** `/api/companies/:id`

Atualiza dados de uma empresa (apenas administradores).

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "phone": "11888888888",
  "address": "Novo Endereço",
  "logo": "nova_url"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "company": {
    "id": "uuid",
    "name": "Novo Nome",
    "email": "novo@email.com",
    ...
  }
}
```

### Deletar Empresa
**DELETE** `/api/companies/:id`

Deleta uma empresa (apenas administradores, não pode ter usuários vinculados).

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Empresa deletada com sucesso"
}
```

---

## 👥 Usuários

### Listar Usuários
**GET** `/api/users`

Lista todos os usuários.

**Headers:**
```
Authorization: Bearer {token}
```

### Criar Usuário
**POST** `/api/users`

Cria um novo usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha123",
  "role": "admin|manager|user",
  "department": "TI",
  "companyId": "uuid_da_empresa"
}
```

### Obter Usuário por ID
**GET** `/api/users/:id`

### Atualizar Usuário
**PUT** `/api/users/:id`

### Deletar Usuário
**DELETE** `/api/users/:id`

---

## 📦 Produtos

### Listar Produtos
**GET** `/api/products`

### Criar Produto
**POST** `/api/products`

### Obter Produto por ID
**GET** `/api/products/:id`

### Atualizar Produto
**PUT** `/api/products/:id`

### Deletar Produto
**DELETE** `/api/products/:id`

### Estatísticas de Produtos
**GET** `/api/products/stats/summary`

---

## 📄 Notas Fiscais

### Listar Notas Fiscais
**GET** `/api/invoices`

### Upload de Nota Fiscal
**POST** `/api/invoices`

**Body:** FormData com arquivo

### Obter Nota Fiscal por ID
**GET** `/api/invoices/:id`

### Atualizar Nota Fiscal
**PUT** `/api/invoices/:id`

### Deletar Nota Fiscal
**DELETE** `/api/invoices/:id`

---

## 🔔 Notificações

### Listar Notificações
**GET** `/api/notifications`

### Marcar como Lida
**POST** `/api/notifications/:id/read`

### Marcar Todas como Lidas
**POST** `/api/notifications/read-all`

---

## 📊 Dashboard

### Estatísticas Gerais
**GET** `/api/dashboard/stats`

### Atividades Recentes
**GET** `/api/dashboard/recent-activities`

### Produtos Mais Vendidos
**GET** `/api/dashboard/top-products`

### Alertas de Estoque
**GET** `/api/dashboard/stock-alert`

---

## 📝 Atividades

### Listar Atividades
**GET** `/api/activities?limit=50&offset=0`

---

## ⚙️ Sistema

### Health Check
**GET** `/api/health`

Verifica se a API está funcionando.

**Resposta:**
```json
{
  "status": "ok",
  "message": "API WorkBox está funcionando!",
  "database": "conectado"
}
```

---

## 🔑 Autenticação

Todas as rotas (exceto `/api/auth/login`, `/api/auth/register` e `/api/health`) requerem autenticação via JWT.

**Header de Autenticação:**
```
Authorization: Bearer {seu_token_jwt}
```

O token é obtido após login bem-sucedido e deve ser armazenado no `localStorage` do navegador.

---

## 🚨 Códigos de Erro Comuns

- **400** - Bad Request (dados inválidos)
- **401** - Unauthorized (não autenticado)
- **403** - Forbidden (sem permissão)
- **404** - Not Found (recurso não encontrado)
- **500** - Internal Server Error (erro no servidor)

---

## 📍 URL Base

**Desenvolvimento:**
```
http://localhost:3001/api
```

**Produção:**
```
https://seu-dominio.com/api
```
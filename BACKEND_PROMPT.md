# Prompt para Desenvolvimento do Backend - WorkBox Sistema de Gestão Empresarial

## Contexto do Projeto

Você está desenvolvendo o **Backend da Plataforma WorkBox**, um sistema completo de gestão empresarial focado em **gestão de patrimônio**. O sistema já possui um frontend totalmente funcional em Next.js 16, e você precisa criar um backend que se integre perfeitamente com ele.

---

## Stack Técnico Recomendado

- **Framework:** Node.js + Express.js ou Fastify
- **Database:** PostgreSQL com Prisma ORM
- **Autenticação:** JWT (JSON Web Tokens)
- **Validação:** Zod ou Yup
- **Upload de Arquivos:** Multer (para XMLs de nota fiscal)
- **CORS:** Habilitado para `http://localhost:3000` e domínios de produção

---

## Estrutura de Banco de Dados

### Tabela: `users` (Usuários)
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'user') DEFAULT 'user',
  status ENUM('active', 'inactive') DEFAULT 'active',
  department VARCHAR(255) NOT NULL,
  last_access TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  avatar VARCHAR(1000),
  company_id UUID NOT NULL REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tabela: `companies` (Empresas)
\`\`\`sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(500) NOT NULL,
  logo VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tabela: `products` (Produtos/Patrimônio)
\`\`\`sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  minimum INTEGER NOT NULL DEFAULT 10,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status ENUM('normal', 'low', 'critical') DEFAULT 'normal',
  company_id UUID NOT NULL REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tabela: `invoices` (Notas Fiscais)
\`\`\`sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number VARCHAR(50) NOT NULL,
  type ENUM('NF-e', 'NFC-e') NOT NULL,
  date DATE NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  status ENUM('processed', 'pending', 'error') DEFAULT 'pending',
  supplier VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_path VARCHAR(500),
  company_id UUID NOT NULL REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tabela: `notifications` (Notificações)
\`\`\`sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Tabela: `activities` (Auditoria)
\`\`\`sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

## Endpoints RESTful Obrigatórios

### Autenticação

#### POST `/api/auth/login`
**Request:**
\`\`\`json
{
  "identifier": "1" OR "joao.silva@empresa.com",
  "password": "password123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao.silva@empresa.com",
    "role": "admin",
    "status": "active",
    "department": "TI",
    "lastAccess": "2024-11-02T10:30:00Z",
    "avatar": "url_ou_base64",
    "createdAt": "2024-11-02T08:00:00Z",
    "companyId": "uuid"
  },
  "token": "jwt_token",
  "company": {
    "id": "uuid",
    "name": "Empresa XYZ",
    "cnpj": "12345678901234",
    "email": "contato@empresa.com",
    "phone": "(11) 1234-5678",
    "address": "Rua das Flores, 123",
    "logo": "url_ou_base64",
    "createdAt": "2024-11-02T08:00:00Z"
  }
}
\`\`\`

**Error (401):**
\`\`\`json
{
  "success": false,
  "error": "ID/Email ou senha incorretos"
}
\`\`\`

---

### Usuários

#### GET `/api/users`
**Headers:** `Authorization: Bearer {token}`

**Response:**
\`\`\`json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao.silva@empresa.com",
      "role": "admin",
      "status": "active",
      "department": "TI",
      "lastAccess": "2024-11-02T10:30:00Z",
      "avatar": "url_ou_base64",
      "createdAt": "2024-11-02T08:00:00Z",
      "companyId": "uuid"
    }
  ]
}
\`\`\`

#### POST `/api/users`
**Request:**
\`\`\`json
{
  "name": "Maria Santos",
  "email": "maria@empresa.com",
  "password": "password123",
  "role": "manager",
  "department": "RH",
  "companyId": "uuid"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Maria Santos",
    "email": "maria@empresa.com",
    "role": "manager",
    "status": "active",
    "department": "RH",
    "lastAccess": "2024-11-02T10:30:00Z",
    "avatar": null,
    "createdAt": "2024-11-02T10:30:00Z",
    "companyId": "uuid"
  }
}
\`\`\`

#### GET `/api/users/{id}`
**Response:**
\`\`\`json
{
  "success": true,
  "user": { /* dados do usuário */ }
}
\`\`\`

#### PUT `/api/users/{id}`
**Request:**
\`\`\`json
{
  "name": "João Silva Atualizado",
  "role": "admin",
  "status": "active",
  "department": "TI"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "user": { /* usuário atualizado */ }
}
\`\`\`

#### DELETE `/api/users/{id}`
**Response:**
\`\`\`json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
\`\`\`

---

### Empresas

#### GET `/api/companies`
**Response:**
\`\`\`json
{
  "success": true,
  "companies": [
    {
      "id": "uuid",
      "name": "Empresa XYZ",
      "cnpj": "12345678901234",
      "email": "contato@empresa.com",
      "phone": "(11) 1234-5678",
      "address": "Rua das Flores, 123",
      "logo": "url_ou_base64",
      "createdAt": "2024-11-02T08:00:00Z"
    }
  ]
}
\`\`\`

#### POST `/api/companies`
**Request:**
\`\`\`json
{
  "name": "Empresa ABC",
  "cnpj": "98765432101234",
  "email": "contato@abc.com",
  "phone": "(11) 9876-5432",
  "address": "Av. Paulista, 1000",
  "logo": "url_ou_base64"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "company": { /* dados da empresa */ }
}
\`\`\`

#### GET `/api/companies/{id}`
**Response:**
\`\`\`json
{
  "success": true,
  "company": { /* dados da empresa */ }
}
\`\`\`

#### PUT `/api/companies/{id}`
**Response:**
\`\`\`json
{
  "success": true,
  "company": { /* empresa atualizada */ }
}
\`\`\`

---

### Produtos

#### GET `/api/products`
**Query Params:** `?search=termo&category=Eletrônicos&status=low`

**Response:**
\`\`\`json
{
  "success": true,
  "products": [
    {
      "id": "uuid",
      "name": "Notebook Dell Inspiron 15",
      "category": "Eletrônicos",
      "stock": 15,
      "minimum": 10,
      "price": "2499.00",
      "description": "Notebook com processador i7",
      "status": "normal",
      "createdAt": "2024-11-02T08:00:00Z",
      "updatedAt": "2024-11-02T08:00:00Z"
    }
  ]
}
\`\`\`

#### POST `/api/products`
**Request:**
\`\`\`json
{
  "name": "Mouse Logitech MX Master",
  "category": "Periféricos",
  "stock": 20,
  "minimum": 15,
  "price": 299.00,
  "description": "Mouse sem fio de alta precisão"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "product": { /* dados do produto */ }
}
\`\`\`

#### GET `/api/products/{id}`
**Response:**
\`\`\`json
{
  "success": true,
  "product": { /* dados do produto */ }
}
\`\`\`

#### PUT `/api/products/{id}`
**Request:**
\`\`\`json
{
  "stock": 18,
  "minimum": 12
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "product": { /* produto atualizado com status recalculado */ }
}
\`\`\`

#### DELETE `/api/products/{id}`
**Response:**
\`\`\`json
{
  "success": true,
  "message": "Produto deletado com sucesso"
}
\`\`\`

---

### Notas Fiscais

#### GET `/api/invoices`
**Query Params:** `?status=pending&type=NF-e`

**Response:**
\`\`\`json
{
  "success": true,
  "invoices": [
    {
      "id": "uuid",
      "number": "12345678901234567890123456",
      "type": "NF-e",
      "date": "2024-11-02",
      "value": "5000.00",
      "status": "processed",
      "supplier": "Fornecedor ABC",
      "fileName": "nf-e.xml",
      "fileSize": 15360,
      "createdAt": "2024-11-02T08:00:00Z"
    }
  ]
}
\`\`\`

#### POST `/api/invoices` (Upload)
**Content-Type:** `multipart/form-data`

**Fields:**
- `file`: XML da nota fiscal
- `type`: "NF-e" ou "NFC-e"

**Response (201):**
\`\`\`json
{
  "success": true,
  "invoice": { /* dados da nota fiscal */ }
}
\`\`\`

#### PUT `/api/invoices/{id}`
**Request:**
\`\`\`json
{
  "status": "processed"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "invoice": { /* invoice atualizada */ }
}
\`\`\`

---

### Notificações

#### GET `/api/notifications`
**Response:**
\`\`\`json
{
  "success": true,
  "notifications": [
    {
      "id": "uuid",
      "title": "Estoque Baixo",
      "message": "Mouse Logitech MX Master está com estoque baixo",
      "type": "warning",
      "read": false,
      "createdAt": "2024-11-02T10:30:00Z"
    }
  ]
}
\`\`\`

#### POST `/api/notifications/{id}/read`
**Response:**
\`\`\`json
{
  "success": true,
  "message": "Notificação marcada como lida"
}
\`\`\`

#### POST `/api/notifications/read-all`
**Response:**
\`\`\`json
{
  "success": true,
  "message": "Todas as notificações marcadas como lidas"
}
\`\`\`

---

### Atividades

#### GET `/api/activities`
**Query Params:** `?limit=50&offset=0`

**Response:**
\`\`\`json
{
  "success": true,
  "activities": [
    {
      "id": "uuid",
      "action": "Produto adicionado",
      "description": "Notebook Dell Inspiron 15",
      "icon": "Plus",
      "color": "text-green-600",
      "userId": "uuid",
      "createdAt": "2024-11-02T08:00:00Z"
    }
  ]
}
\`\`\`

---

### Dashboard

#### GET `/api/dashboard/stats`
**Response:**
\`\`\`json
{
  "success": true,
  "stats": {
    "totalProducts": 150,
    "productsInStock": 120,
    "productsLow": 20,
    "productsCritical": 10,
    "totalInvoices": 45,
    "invoicesProcessed": 40,
    "invoicesPending": 5,
    "recentActivities": [],
    "topProducts": []
  }
}
\`\`\`

---

## Funcionalidades Críticas

### 1. Autenticação Multi-Empresa
- Usuário faz login com ID ou EMAIL + SENHA
- Sistema retorna usuário, empresa associada e token JWT
- Token válido por 24h
- Refresh token para prolongar sessão (opcional)

### 2. Validação de Dados
- Email deve ser único por empresa
- CNPJ deve ser válido
- Stock e minimum devem ser números positivos
- Status de produto calculado automaticamente

### 3. Pesquisa e Filtros
- Busca full-text em produtos (nome, categoria, descrição)
- Filtro por status de estoque
- Filtro por categoria
- Filtro por data (invoices)

### 4. Gerenciamento de Estoque
- Ao atualizar stock, recalcular status (normal/low/critical)
- Status crítico = stock <= minimum * 0.5
- Status baixo = stock entre 50% e 100% do mínimo
- Status normal = stock acima do mínimo

### 5. Auditoria Completa
- Toda ação de usuário registrada em activities
- Incluir timestamp, usuário, ação, descrição
- Limitar a 100 atividades mais recentes

### 6. Notificações Automáticas
- Ao adicionar produto com estoque crítico, gerar notificação
- Ao processar nota fiscal com erro, gerar notificação
- Manter apenas 50 notificações mais recentes

---

## Tratamento de Erros

Todas as respostas devem incluir:

\`\`\`json
{
  "success": false,
  "error": "Mensagem de erro específica"
}
\`\`\`

**Status HTTP:**
- `200` - Sucesso (GET, PUT, DELETE)
- `201` - Criado (POST)
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (sem token ou token inválido)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não existe)
- `500` - Internal Server Error

---

## Middleware Recomendado

1. **Autenticação:** Validar JWT em todas as rotas
2. **Autorização:** Verificar role do usuário
3. **Validação:** Validar input com Zod/Yup
4. **Logging:** Log de todas as requisições
5. **CORS:** Habilitar para frontend
6. **Rate Limiting:** Limitar requisições por IP/usuário

---

## Considerações de Segurança

1. **Senhas:** Hash com bcrypt (min 10 rounds)
2. **JWT:** Secret forte, expiração 24h
3. **SQL Injection:** Usar prepared statements (Prisma)
4. **CORS:** Apenas origens autorizadas
5. **Rate Limiting:** 100 requisições por 15 minutos
6. **Validação:** Validar todos os inputs
7. **HTTPS:** Em produção obrigatório

---

## Deployment

- Backend deve rodar em porta 3001 (ou configurável)
- Database URL em variável de ambiente
- JWT Secret em variável de ambiente
- CORS configurado para `http://localhost:3000` (dev) e domínio de produção

---

## Integração com Frontend

O frontend em `http://localhost:3000` espera:
1. Servidor rodando em `http://localhost:3001`
2. Endpoints exatamente como descrito acima
3. Respostas com campo `success` boolean
4. Objetos de dados com nomes exatos (não modificar estrutura)

---

**Desenvolvedor:** Use este prompt exatamente como está para máxima compatibilidade com o frontend já desenvolvido.

# WorkBox - Database Schema Documentation

## Overview
Este documento descreve a estrutura completa do banco de dados utilizado pelo sistema WorkBox. O sistema utiliza PostgreSQL com Prisma ORM para armazenamento de dados.

---

## Tabelas do Banco de Dados

### 1. **users** (Usuários)
Armazena informações dos usuários do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | Identificador único |
| `name` | string | Nome completo do usuário |
| `email` | string | Email do usuário (único) |
| `password` | string | Senha do usuário (hash) |
| `role` | enum[admin\|manager\|user] | Papel/permissão do usuário |
| `status` | enum[active\|inactive] | Status de ativação |
| `department` | string | Departamento do usuário |
| `lastAccess` | datetime | Data e hora do último acesso |
| `avatar` | string (opcional) | URL ou base64 do avatar |
| `companyId` | string | Chave estrangeira para empresas |
| `createdAt` | datetime | Data de criação do registro |
| `updatedAt` | datetime | Data de atualização do registro |

---

### 2. **companies** (Empresas/Organizações)
Armazena dados das empresas cadastradas no sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | Identificador único |
| `name` | string | Nome da empresa |
| `cnpj` | string | CNPJ da empresa (único) |
| `email` | string | Email de contato |
| `phone` | string | Telefone de contato |
| `address` | string | Endereço completo |
| `logo` | string (opcional) | URL ou base64 do logo |
| `createdAt` | datetime | Data de criação |
| `updatedAt` | datetime | Data de atualização |

---

### 3. **products** (Produtos/Patrimônio)
Armazena informações de produtos e itens do patrimônio.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | Identificador único |
| `name` | string | Nome do produto |
| `category` | string | Categoria (Eletrônicos, Periféricos, Mobiliário, etc) |
| `stock` | integer | Quantidade atual em estoque |
| `minimum` | integer | Quantidade mínima recomendada |
| `price` | decimal(10,2) | Preço unitário |
| `description` | string (opcional) | Descrição detalhada do produto |
| `status` | enum[normal\|low\|critical] | Status do estoque |
| `companyId` | string | Chave estrangeira para empresas |
| `createdAt` | datetime | Data de criação |
| `updatedAt` | datetime | Data da última atualização |

**Status Rules:**
- `normal`: Estoque acima do mínimo
- `low`: Estoque entre 50% e 100% do mínimo
- `critical`: Estoque abaixo de 50% do mínimo

---

### 4. **invoices** (Notas Fiscais)
Armazena informações de notas fiscais e documentos fiscais.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | Identificador único |
| `number` | string | Número da nota fiscal |
| `type` | enum[NFe\|NFCe] | Tipo de nota fiscal eletrônica |
| `date` | datetime | Data de emissão |
| `value` | decimal(12,2) | Valor total |
| `status` | enum[processed\|pending\|error] | Status de processamento |
| `supplier` | string | Nome do fornecedor |
| `fileName` | string | Nome do arquivo XML |
| `fileSize` | integer | Tamanho do arquivo em bytes |
| `filePath` | string (opcional) | Caminho do arquivo no sistema |
| `companyId` | string | Chave estrangeira para empresas |
| `createdAt` | datetime | Data de criação do registro |
| `updatedAt` | datetime | Data de atualização |

---

### 5. **notifications** (Notificações)
Armazena notificações do sistema para os usuários.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | Identificador único |
| `title` | string | Título da notificação |
| `message` | string | Corpo da mensagem |
| `type` | enum[info\|warning\|error\|success] | Tipo de notificação |
| `read` | boolean | Status de leitura |
| `userId` | string | Chave estrangeira para usuários |
| `createdAt` | datetime | Data de criação |

---

### 6. **activities** (Atividades/Auditoria)
Registra todas as atividades e mudanças no sistema para auditoria.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string (UUID) | Identificador único |
| `action` | string | Tipo de ação (ex: "Produto adicionado") |
| `description` | string | Descrição detalhada da ação |
| `icon` | string | Nome do ícone para exibição (ex: "Plus", "Package") |
| `color` | string | Classe de cor Tailwind (ex: "text-green-600") |
| `userId` | string | ID do usuário que realizou a ação |
| `companyId` | string | ID da empresa relacionada |
| `createdAt` | datetime | Hora exata da atividade |

---

## Relacionamentos

```
users
├── companyId → companies.id (N:1)
└── activities (1:N)
└── notifications (1:N)

companies
├── users (1:N)
├── products (1:N)
├── invoices (1:N)
└── activities (1:N)

products
└── companyId → companies.id (N:1)

invoices
└── companyId → companies.id (N:1)

notifications
└── userId → users.id (N:1)

activities
├── userId → users.id (N:1)
└── companyId → companies.id (N:1)
```

---

## Enumerações

### Role
- `admin`: Administrador com acesso total
- `manager`: Gerente com acesso intermediário
- `user`: Usuário comum com acesso limitado

### UserStatus
- `active`: Usuário ativo
- `inactive`: Usuário inativo

### ProductStatus
- `normal`: Estoque normal
- `low`: Estoque baixo
- `critical`: Estoque crítico

### InvoiceType
- `NFe`: Nota Fiscal Eletrônica
- `NFCe`: Nota Fiscal de Consumidor Eletrônica

### InvoiceStatus
- `processed`: Processada
- `pending`: Pendente
- `error`: Erro

### NotificationType
- `info`: Informação
- `warning`: Aviso
- `error`: Erro
- `success`: Sucesso

---

## Prompt SQL para Criação das Tabelas

```sql
-- Criação das tabelas para o sistema WorkBox

-- Tabela de Empresas
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    logo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tipos enumerados
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE user_status AS ENUM ('active', 'inactive');
CREATE TYPE product_status AS ENUM ('normal', 'low', 'critical');
CREATE TYPE invoice_type AS ENUM ('NFe', 'NFCe');
CREATE TYPE invoice_status AS ENUM ('processed', 'pending', 'error');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'error', 'success');

-- Tabela de Usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'active',
    department VARCHAR(100) NOT NULL,
    last_access TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    avatar TEXT,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    minimum INTEGER NOT NULL DEFAULT 10,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    status product_status NOT NULL DEFAULT 'normal',
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Notas Fiscais
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number VARCHAR(50) NOT NULL,
    type invoice_type NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    value DECIMAL(12,2) NOT NULL,
    status invoice_status NOT NULL DEFAULT 'pending',
    supplier VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_path TEXT,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'info',
    read BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Atividades
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_invoices_company ON invoices(company_id);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_company ON activities(company_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
```

---

**Última Atualização:** 2 de Novembro de 2024
**Versão:** 1.1.0

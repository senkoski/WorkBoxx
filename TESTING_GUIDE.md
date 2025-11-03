# Guia de Teste do Sistema WorkBox

Este guia fornece instruções passo a passo para testar o sistema WorkBox, garantindo que todas as funcionalidades estejam operando corretamente.

## Pré-requisitos

- PostgreSQL instalado e rodando (usuário: postgres, senha: mobile, banco: workbox)
- Node.js instalado (versão 14 ou superior)
- NPM ou Yarn instalado

## 1. Configuração do Backend

### 1.1. Iniciar o Backend

```bash
cd workbox-backend
npm install
npm start
```

O servidor deve iniciar na porta 3001. Você verá a mensagem: `🚀 Servidor rodando na porta 3001`

### 1.2. Verificar Conexão com o Banco de Dados

Acesse `http://localhost:3001/api/health` no navegador ou use uma ferramenta como Postman. Você deve receber uma resposta JSON indicando que o banco de dados está conectado:

```json
{
  "status": "ok",
  "message": "API WorkBox está funcionando!",
  "database": "conectado"
}
```

### 1.3. Visualizar o Banco de Dados com Prisma Studio

```bash
cd workbox-backend
npx prisma studio
```

Isso abrirá o Prisma Studio no navegador (geralmente em http://localhost:5556), onde você pode visualizar e gerenciar os dados do banco.

## 2. Teste das Rotas da API

### 2.1. Autenticação

#### Registrar um Usuário Administrador (se não existir)

```
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@workbox.com",
  "password": "admin123",
  "role": "admin",
  "department": "TI",
  "companyId": "ID_DA_EMPRESA" // Substitua pelo ID real da empresa
}
```

#### Login

```
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@workbox.com",
  "password": "admin123"
}
```

Guarde o token JWT retornado para usar nas próximas requisições.

### 2.2. Gerenciamento de Empresas

#### Criar uma Empresa

```
POST http://localhost:3001/api/companies
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT

{
  "name": "Empresa Teste",
  "cnpj": "12345678901234",
  "email": "contato@empresateste.com",
  "phone": "11999999999",
  "address": "Rua Teste, 123"
}
```

#### Listar Empresas

```
GET http://localhost:3001/api/companies
Authorization: Bearer SEU_TOKEN_JWT
```

### 2.3. Gerenciamento de Produtos

#### Criar um Produto

```
POST http://localhost:3001/api/products
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT

{
  "name": "Produto Teste",
  "category": "Eletrônicos",
  "stock": 50,
  "minimum": 10,
  "price": 99.99,
  "description": "Descrição do produto teste",
  "companyId": "ID_DA_EMPRESA" // Substitua pelo ID real da empresa
}
```

#### Listar Produtos

```
GET http://localhost:3001/api/products
Authorization: Bearer SEU_TOKEN_JWT
```

### 2.4. Gerenciamento de Notas Fiscais

#### Enviar uma Nota Fiscal

Use um cliente HTTP que suporte envio de arquivos multipart/form-data (como Postman):

```
POST http://localhost:3001/api/invoices/upload
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: multipart/form-data

form-data:
  file: [selecione um arquivo XML]
  number: "NF123456"
  type: "NFe"
  date: "2023-10-15"
  value: 1500.00
  supplier: "Fornecedor Teste"
  companyId: "ID_DA_EMPRESA" // Substitua pelo ID real da empresa
```

#### Listar Notas Fiscais

```
GET http://localhost:3001/api/invoices
Authorization: Bearer SEU_TOKEN_JWT
```

### 2.5. Dashboard

#### Obter Estatísticas do Dashboard

```
GET http://localhost:3001/api/dashboard/stats
Authorization: Bearer SEU_TOKEN_JWT
```

## 3. Configuração do Frontend

### 3.1. Iniciar o Frontend

```bash
cd ../code
npm install
npm run dev
```

O frontend deve iniciar, geralmente na porta 3000. Acesse `http://localhost:3000` no navegador.

### 3.2. Testar o Login

1. Acesse a página inicial
2. Insira as credenciais criadas anteriormente (admin@workbox.com / admin123)
3. Clique em "Entrar"
4. Você deve ser redirecionado para o dashboard

### 3.3. Testar Funcionalidades do Dashboard

1. **Visualizar Estatísticas**: Verifique se os cards de estatísticas mostram dados corretos
2. **Gerenciar Produtos**: Adicione, edite e exclua produtos
3. **Gerenciar Usuários**: Adicione, edite e exclua usuários
4. **Gerenciar Notas Fiscais**: Faça upload e visualize notas fiscais
5. **Verificar Notificações**: Verifique se as notificações de estoque baixo aparecem corretamente

## 4. Resolução de Problemas Comuns

### 4.1. Problemas de Conexão com o Banco de Dados

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env` do backend
- Execute `npx prisma db push` para garantir que o schema está atualizado

### 4.2. Erros de CORS

- Verifique se o middleware CORS está configurado corretamente no backend
- Confirme se as URLs do frontend e backend estão corretas nos arquivos de configuração

### 4.3. Problemas de Autenticação

- Verifique se o token JWT está sendo enviado corretamente nos headers
- Confirme se o segredo JWT no arquivo `.env` está configurado

## 5. Verificação Final

Para garantir que o sistema está completamente funcional, execute estas verificações finais:

1. Crie um novo usuário com papel de gerente
2. Faça login com este usuário
3. Crie um novo produto com estoque abaixo do mínimo
4. Verifique se uma notificação foi gerada
5. Faça upload de uma nota fiscal
6. Verifique se a atividade foi registrada no painel de atividades recentes

Se todas estas etapas funcionarem corretamente, o sistema está operacional e pronto para uso!
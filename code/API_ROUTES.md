# Mapa Completo de Rotas da API - WorkBox

## Base URL
\`\`\`
http://localhost:3001/api
\`\`\`

## Rotas de Autenticação

| Método | Rota | Descrição | Auth Obrigatória |
|--------|------|-----------|-----------------|
| POST | `/auth/login` | Login com ID/Email + Senha | Não |
| POST | `/auth/logout` | Logout (opcional) | Sim |
| POST | `/auth/refresh` | Refresh token (opcional) | Sim |

---

## Rotas de Usuários

| Método | Rota | Descrição | Auth Obrigatória |
|--------|------|-----------|-----------------|
| GET | `/users` | Listar usuários da empresa | Sim |
| POST | `/users` | Criar novo usuário | Sim (admin/manager) |
| GET | `/users/{id}` | Obter detalhes do usuário | Sim |
| PUT | `/users/{id}` | Atualizar usuário | Sim |
| DELETE | `/users/{id}` | Deletar usuário | Sim (admin) |
| GET | `/users/{id}/companies` | Listar empresas do usuário | Sim |

---

## Rotas de Empresas

| Método | Rota | Descrição | Auth Obrigatória |
|--------|------|-----------|-----------------|
| GET | `/companies` | Listar empresas | Sim |
| POST | `/companies` | Criar empresa | Sim (admin) |
| GET | `/companies/{id}` | Obter detalhes da empresa | Sim |
| PUT | `/companies/{id}` | Atualizar empresa | Sim (admin) |
| DELETE | `/companies/{id}` | Deletar empresa | Sim (admin) |

---

## Rotas de Produtos

| Método | Rota | Descrição | Auth Obrigatória | Query Params |
|--------|------|-----------|-----------------|--------------|
| GET | `/products` | Listar produtos | Sim | `search`, `category`, `status` |
| POST | `/products` | Criar produto | Sim | - |
| GET | `/products/{id}` | Obter detalhes do produto | Sim | - |
| PUT | `/products/{id}` | Atualizar produto | Sim | - |
| DELETE | `/products/{id}` | Deletar produto | Sim (admin) | - |
| GET | `/products/stats/summary` | Resumo de estoque | Sim | - |

---

## Rotas de Notas Fiscais

| Método | Rota | Descrição | Auth Obrigatória | Query Params |
|--------|------|-----------|-----------------|--------------|
| GET | `/invoices` | Listar notas fiscais | Sim | `status`, `type`, `date` |
| POST | `/invoices` | Upload de nota fiscal | Sim | - |
| GET | `/invoices/{id}` | Obter detalhes da NF | Sim | - |
| PUT | `/invoices/{id}` | Atualizar status da NF | Sim | - |
| DELETE | `/invoices/{id}` | Deletar nota fiscal | Sim (admin) | - |
| GET | `/invoices/{id}/download` | Download do arquivo XML | Sim | - |

---

## Rotas de Notificações

| Método | Rota | Descrição | Auth Obrigatória |
|--------|------|-----------|-----------------|
| GET | `/notifications` | Listar notificações do usuário | Sim |
| POST | `/notifications/{id}/read` | Marcar como lida | Sim |
| POST | `/notifications/read-all` | Marcar todas como lidas | Sim |
| DELETE | `/notifications/{id}` | Deletar notificação | Sim |

---

## Rotas de Atividades

| Método | Rota | Descrição | Auth Obrigatória | Query Params |
|--------|------|-----------|-----------------|--------------|
| GET | `/activities` | Listar atividades | Sim | `limit`, `offset`, `userId` |

---

## Rotas de Dashboard

| Método | Rota | Descrição | Auth Obrigatória |
|--------|------|-----------|-----------------|
| GET | `/dashboard/stats` | Estatísticas gerais | Sim |
| GET | `/dashboard/recent-activities` | Atividades recentes | Sim |
| GET | `/dashboard/top-products` | Produtos mais ativos | Sim |
| GET | `/dashboard/stock-alert` | Alertas de estoque | Sim |

---

## Padrão de Resposta

**Sucesso (2xx):**
\`\`\`json
{
  "success": true,
  "data": { /* dados */ }
}
\`\`\`

**Erro (4xx, 5xx):**
\`\`\`json
{
  "success": false,
  "error": "Descrição do erro"
}
\`\`\`

---

## Headers Esperados

**Todas as requisições autenticadas:**
\`\`\`
Authorization: Bearer {jwt_token}
Content-Type: application/json
\`\`\`

**Para upload de arquivos:**
\`\`\`
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
\`\`\`

---

## Exemplo de Integração Frontend

\`\`\`typescript
// Frontend - Chamada de API
const response = await fetch('http://localhost:3001/api/products', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const { success, data, error } = await response.json()

if (success) {
  // Usar dados
} else {
  // Tratar erro
  console.error(error)
}
\`\`\`

---

**Última Atualização:** 2 de Novembro de 2025
**Versão:** 2.0.0

# 🔐 Credenciais de Acesso - WorkBox

## ✅ Sistema Configurado e Funcionando!

### 🌐 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

---

## 👤 Credenciais de Login

### Usuário Administrador
```
Email: admin@workboxdemo.com
Senha: admin123
```

### Usuário Padrão
```
Email: user@workboxdemo.com
Senha: user123
```

---

## 🏢 Empresa Cadastrada

```
Nome: WorkBox Demo
CNPJ: 12345678000190
Email: contato@workboxdemo.com
Telefone: 11999998888
```

Para obter o ID da empresa (necessário para registro de novos usuários), faça login e acesse a página de Empresas.

---

## 📝 Como Registrar Novo Usuário

### Opção 1: Via API Diretamente

```bash
POST http://localhost:3001/api/auth/register

Body (JSON):
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha_segura",
  "companyId": "ID_DA_EMPRESA_AQUI"
}
```

### Opção 2: Via Código Frontend

```javascript
import { authApi } from "@/lib/api"

const response = await authApi.register({
  name: "Nome do Usuário",
  email: "usuario@email.com",
  password: "senha_segura",
  companyId: "ID_DA_EMPRESA" // Obtenha da lista de empresas
})
```

---

## 🚀 Funcionalidades Disponíveis

### ✅ Já Implementadas e Funcionando:

1. **Autenticação**
   - ✅ Login
   - ✅ Registro de usuários
   - ✅ Logout

2. **Gestão de Empresas**
   - ✅ Listar empresas
   - ✅ Cadastrar nova empresa
   - ✅ Editar empresa
   - ✅ Excluir empresa
   - ✅ Validação de CNPJ
   - ✅ Formatação automática

3. **Gestão de Usuários**
   - ✅ Listar usuários
   - ✅ Cadastrar usuário
   - ✅ Editar usuário
   - ✅ Excluir usuário
   - ✅ Controle de permissões (admin/manager/user)

4. **Gestão de Produtos**
   - ✅ Listar produtos
   - ✅ Cadastrar produto
   - ✅ Editar produto
   - ✅ Excluir produto
   - ✅ Alertas de estoque

5. **Dashboard**
   - ✅ Estatísticas gerais
   - ✅ Atividades recentes
   - ✅ Alertas de estoque

6. **Notas Fiscais**
   - ✅ Upload de NF-e/NFC-e
   - ✅ Listagem
   - ✅ Gerenciamento

---

## 🔧 Solução de Problemas

### Erro: "Empresa não encontrada"

1. Faça login com as credenciais acima
2. Acesse a página "Empresas" no menu
3. Copie o ID da empresa "WorkBox Demo"
4. Use esse ID ao registrar novos usuários

### Erro: "Email já está em uso"

Use um email diferente ou faça login com as credenciais existentes.

### Backend não está respondendo

1. Verifique se o backend está rodando: `cd workbox-backend && npm run dev`
2. Verifique se o PostgreSQL está rodando
3. Verifique a conexão no arquivo `.env`

### Frontend não carrega

1. Verifique se o frontend está rodando: `cd code && npm run dev`
2. Limpe o cache: `rm -rf .next`
3. Reinstale dependências: `npm install --legacy-peer-deps`

---

## 📚 Documentação Completa

Consulte o arquivo `ROTAS_API.md` para documentação completa de todas as rotas disponíveis.

---

## 🎯 Próximos Passos

1. ✅ Faça login com as credenciais acima
2. ✅ Explore o dashboard
3. ✅ Cadastre uma nova empresa (se necessário)
4. ✅ Cadastre novos usuários
5. ✅ Adicione produtos ao estoque
6. ✅ Faça upload de notas fiscais

---

**Desenvolvido com ❤️ para WorkBox**
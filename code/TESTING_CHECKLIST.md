# Checklist Completo de Testes - WorkBox

## Como Testar

Abra http://localhost:3000 e siga cada teste abaixo.

---

## 🔐 Testes de Autenticação

### 1. Login Bem-Sucedido
- [ ] Login com ID `1`
- [ ] Login com Email `joao.silva@empresa.com`
- [ ] Login com Senha `password123`
- [ ] Sistema redireciona para `/dashboard`
- [ ] Token salvo em localStorage

### 2. Falha de Login
- [ ] Erro ao usar ID errado: `999`
- [ ] Erro ao usar email errado: `invalid@email.com`
- [ ] Erro ao usar senha errada: `wrongpassword`
- [ ] Mensagem de erro exibida: "ID/Email ou senha incorretos"

---

## 🎨 Testes de Tema (Dark Mode)

### 1. Toggle de Tema (Login)
- [ ] Página de login inicia em modo **claro** (padrão)
- [ ] Clique no botão Sol/Lua muda tema
- [ ] Tema **escuro** aplicado em todo o login
- [ ] Texto e fundo legível em ambos os modos

### 2. Configurações > Aparência
- [ ] Ir para Dashboard > Engrenagem > Configurações
- [ ] Seção "Aparência" está visível
- [ ] Botão "Modo Claro" - clique muda tema
- [ ] Botão "Modo Escuro" - clique muda tema
- [ ] Cor primária alterável (dropdown de cores)
- [ ] Ao selecionar nova cor, tudo muda corretamente
- [ ] Toggle "Ocultar Sidebar" funciona
- [ ] Sidebar desaparece/reaparece

### 3. Persistência de Tema
- [ ] Mude para dark mode
- [ ] Recarregue página (F5)
- [ ] Dark mode continua aplicado
- [ ] Mude cor primária
- [ ] Recarregue página
- [ ] Cor primária mantida

### 4. Cores em Modo Escuro
- [ ] Nenhum fundo branco visível
- [ ] Textos em branco/cinza claro
- [ ] Títulos destacados e legíveis
- [ ] Cards com background escuro
- [ ] Botões com contraste adequado
- [ ] Inputs legíveis em dark mode
- [ ] Sidebar escura
- [ ] Header escuro

---

## 🏢 Testes de Multi-Empresa

### 1. Criar Novas Empresas
- [ ] Sidebar > Companyswitcher > "+ Adicionar Empresa"
- [ ] Preencher dados da empresa:
  - [ ] Nome: "Empresa Teste"
  - [ ] CNPJ: "98765432101234"
  - [ ] Email: "teste@empresa.com"
  - [ ] Telefone: "(11) 9876-5432"
  - [ ] Endereço: "Rua Teste, 123"
- [ ] Botão "Salvar" cria empresa
- [ ] Nova empresa aparece no switcher

### 2. Alternar Entre Empresas
- [ ] CompanySwitcher mostra empresa atual
- [ ] Clique em outra empresa no dropdown
- [ ] Dashboard muda para dados dessa empresa
- [ ] Usuários filtrados por empresa
- [ ] Produtos filtrados por empresa

### 3. Vínculo Usuário-Empresa
- [ ] Novo usuário criado fica vinculado à empresa
- [ ] Ao mudar empresa, usuários não aparecem
- [ ] Ao voltar para empresa original, usuários aparecem

---

## 👥 Testes de Gestão de Usuários

### 1. Listar Usuários
- [ ] Ir para Dashboard > Configurações > Usuários
- [ ] Tabela exibe usuários
- [ ] Colunas: Nome, Email, Departamento, Cargo, Status, Ações
- [ ] Botão "+ Adicionar Usuário" disponível

### 2. Criar Novo Usuário
- [ ] Clique "+ Adicionar Usuário"
- [ ] Modal abre
- [ ] Preencha:
  - [ ] Nome: "Novo User"
  - [ ] Email: "novo@empresa.com"
  - [ ] Senha: "senha123"
  - [ ] Cargo: "user"
  - [ ] Departamento: "RH"
  - [ ] Status: "active"
- [ ] Clique "Salvar"
- [ ] Usuário aparece na tabela

### 3. Editar Usuário
- [ ] Clique ícone editar em um usuário
- [ ] Dados carregam no modal
- [ ] Mude o departamento
- [ ] Salve
- [ ] Dados atualizados na tabela

### 4. Deletar Usuário
- [ ] Clique ícone lixeira
- [ ] Confirme exclusão
- [ ] Usuário sai da tabela
- [ ] Notificação aparece

### 5. Filtros de Usuários
- [ ] Busque por nome: "João"
- [ ] Filtre por Cargo: "admin"
- [ ] Filtre por Status: "active"
- [ ] Combinações funcionam corretamente

---

## 📦 Testes de Gestão de Produtos

### 1. Listar Produtos
- [ ] Ir para Dashboard > Estoque
- [ ] Tabela/cards mostram produtos
- [ ] Cada produto mostra: Nome, Categoria, Stock, Status
- [ ] Status colorido: Verde (normal), Amarelo (low), Vermelho (critical)

### 2. Criar Produto
- [ ] Clique "+ Adicionar Produto"
- [ ] Modal abre
- [ ] Preencha:
  - [ ] Nome: "Monitor LG 24 polegadas"
  - [ ] Categoria: "Eletrônicos"
  - [ ] Stock: "5"
  - [ ] Mínimo: "10"
  - [ ] Preço: "800"
  - [ ] Descrição: "Monitor Full HD"
- [ ] Clique "Salvar"
- [ ] Produto aparece na lista
- [ ] Status automático = "critical" (pois 5 < 10*0.5)

### 3. Editar Produto
- [ ] Clique editar em um produto
- [ ] Altere stock para "20"
- [ ] Salve
- [ ] Status muda para "normal"

### 4. Deletar Produto
- [ ] Clique lixeira
- [ ] Confirme
- [ ] Produto sai da lista

### 5. Buscar Produtos
- [ ] Busque por nome: "Notebook"
- [ ] Filtre por categoria: "Periféricos"
- [ ] Filtre por status: "low"
- [ ] Buscas funcionam corretamente

### 6. Dashboard de Estoque
- [ ] Card "Total de Produtos": mostra contagem
- [ ] Card "Em Estoque": mostra soma de stock > 0
- [ ] Card "Estoque Baixo": mostra produtos com status 'low'
- [ ] Card "Estoque Crítico": mostra produtos com status 'critical'

---

## 📄 Testes de Notas Fiscais

### 1. Listar Notas Fiscais
- [ ] Ir para Dashboard > Fiscal
- [ ] Tabela mostra notas fiscais
- [ ] Colunas: Número, Tipo, Data, Valor, Status, Fornecedor

### 2. Upload de Nota Fiscal
- [ ] Clique "Upload NF-e"
- [ ] Selecione arquivo XML (ou simule)
- [ ] Preencha:
  - [ ] Número da NF
  - [ ] Tipo: "NF-e" ou "NFC-e"
  - [ ] Data
  - [ ] Valor
  - [ ] Fornecedor
- [ ] Clique "Fazer Upload"
- [ ] NF aparece na lista

### 3. Status de NF
- [ ] NF criada inicia com status "pending"
- [ ] Clique editar, mude para "processed"
- [ ] Status atualiza

### 4. Filtros de NF
- [ ] Filtre por Status: "pending"
- [ ] Filtre por Tipo: "NF-e"
- [ ] Combinações funcionam

---

## 📊 Testes de Dashboard

### 1. Cards de Estatísticas
- [ ] Card "Produtos em Estoque": mostra número
- [ ] Card "Notas Fiscais": mostra número
- [ ] Card "Estoque Crítico": mostra número
- [ ] Valores mudam quando produtos são criados/deletados

### 2. Gráficos
- [ ] Se houver gráficos, eles carregam corretamente
- [ ] Dados refletem produtos reais

### 3. Atividades Recentes
- [ ] Ao criar produto, atividade aparece
- [ ] Ao editar produto, atividade aparece
- [ ] Ao deletar produto, atividade aparece
- [ ] Último em cima

---

## 🔔 Testes de Notificações

### 1. Ver Notificações
- [ ] Clique ícone sino no header
- [ ] Dropdown de notificações abre
- [ ] Mostra título, mensagem, tipo

### 2. Marcar Como Lida
- [ ] Clique notificação
- [ ] Notificação marcada como lida (menos opaca)

### 3. Marcar Todas Como Lidas
- [ ] Clique "Marcar todas como lidas"
- [ ] Todas as notificações ficam opacas

### 4. Notificações Automáticas
- [ ] Crie produto com estoque crítico
- [ ] Notificação é criada automaticamente
- [ ] Título: "Estoque Crítico"

---

## ⚙️ Testes de Configurações

### 1. Aparência
- [ ] Dark mode toggle funciona (testado acima)
- [ ] Cor primária muda corretamente
- [ ] Sidebar pode ser ocultada

### 2. Perfil do Usuário
- [ ] Aba "Meu Perfil" existe
- [ ] Dados do usuário logado exibem
- [ ] Avatar editável
- [ ] Nome e email editáveis

### 3. Logout
- [ ] Botão logout existe
- [ ] Clique redireciona para `/`
- [ ] LocalStorage limpo
- [ ] Novo login necessário

---

## 📱 Testes de Responsividade

### 1. Mobile (320px)
- [ ] Abra DevTools (F12)
- [ ] Modo responsivo
- [ ] Toque 375px width
- [ ] [ ] Layout não quebra
- [ ] [ ] Menu funciona (hambúrguer)
- [ ] [ ] Textos legíveis
- [ ] [ ] Botões clicáveis

### 2. Tablet (768px)
- [ ] Largura 768px
- [ ] [ ] Conteúdo adapta
- [ ] [ ] Tabelas viram cards se necessário
- [ ] [ ] Grids reorganizam

### 3. Desktop (1920px+)
- [ ] Largura 1920px
- [ ] [ ] Tudo espaçado
- [ ] [ ] Sem scroll horizontal
- [ ] [ ] Layout completo

---

## 🔗 Testes de Integração com API

*(Se backend estiver rodando em http://localhost:3001)*

### 1. Login via API
- [ ] Abra DevTools > Network
- [ ] Faça login
- [ ] Veja requisição para `POST /api/auth/login`
- [ ] Status 200
- [ ] Response contém `user`, `token`, `company`

### 2. Requisições de Dados
- [ ] Ao abrir Estoque, veja `GET /api/products`
- [ ] Ao abrir Fiscal, veja `GET /api/invoices`
- [ ] Status 200 em todas

### 3. Criações
- [ ] Ao criar produto, veja `POST /api/products`
- [ ] Status 201

### 4. Fallback Local
- [ ] Pare o backend (Ctrl+C no terminal do backend)
- [ ] Faça login
- [ ] Sistema funciona com dados locais
- [ ] Console mostra fallback sendo usado

---

## ✅ Checklist Final

Marque cada item como testado e funcionando:

### Autenticação
- [ ] Login com ID
- [ ] Login com Email
- [ ] Erro em login falho
- [ ] Token salvo

### Interface
- [ ] Dark mode funciona
- [ ] Cores customizáveis
- [ ] Sidebar pode ocultar
- [ ] Responsivo

### Multi-Empresa
- [ ] Criar empresa
- [ ] Alternar empresa
- [ ] Dados filtrados

### Usuários
- [ ] Listar usuários
- [ ] Criar usuário
- [ ] Editar usuário
- [ ] Deletar usuário
- [ ] Filtros funcionam

### Produtos
- [ ] Listar produtos
- [ ] Criar produto
- [ ] Editar produto
- [ ] Deletar produto
- [ ] Status automático
- [ ] Busca funciona

### Fiscal
- [ ] Listar NFs
- [ ] Upload NF
- [ ] Filtros funcionam

### Dashboard
- [ ] Cards atualizam
- [ ] Atividades aparecem

### Notificações
- [ ] Notificações exibem
- [ ] Marcar como lida
- [ ] Notificações automáticas

### Configurações
- [ ] Tema persiste
- [ ] Cor persiste
- [ ] Perfil editável
- [ ] Logout funciona

### Performance
- [ ] Sem errors no console
- [ ] Sem warning de React
- [ ] Loading states visíveis
- [ ] Sem lag ao interagir

---

## 🎉 Se Todos os Testes Passarem

Seu sistema **WorkBox** está **100% pronto para produção**!

Próximos passos:
1. Deploy do Frontend (Vercel)
2. Deploy do Backend (seu server)
3. Configurar domínio
4. SSL Certificate
5. Monitor em produção

---

**Última atualização:** 2 de Novembro de 2024
**Status:** Pronto para Testes Completos

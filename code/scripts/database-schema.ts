// Script para listar todas as tabelas e estruturas do banco de dados
// Este é um arquivo de referência que documenta a estrutura de dados utilizada

export const DATABASE_SCHEMA = {
  tables: [
    {
      name: "users",
      description: "Tabela de usuários do sistema",
      columns: [
        { name: "id", type: "string", description: "Identificador único (timestamp)" },
        { name: "name", type: "string", description: "Nome completo do usuário" },
        { name: "email", type: "string", description: "Email do usuário" },
        { name: "password", type: "string", description: "Senha do usuário (hash)" },
        { name: "role", type: "enum[admin|manager|user]", description: "Papel do usuário" },
        { name: "status", type: "enum[active|inactive]", description: "Status da ativação" },
        { name: "department", type: "string", description: "Departamento" },
        { name: "lastAccess", type: "datetime", description: "Último acesso ao sistema" },
        { name: "avatar", type: "string", description: "URL ou base64 do avatar" },
        { name: "createdAt", type: "datetime", description: "Data de criação" },
        { name: "companyId", type: "string", description: "ID da empresa (foreign key)" },
      ],
    },
    {
      name: "companies",
      description: "Tabela de empresas/organizações",
      columns: [
        { name: "id", type: "string", description: "Identificador único" },
        { name: "name", type: "string", description: "Nome da empresa" },
        { name: "cnpj", type: "string", description: "CNPJ da empresa" },
        { name: "email", type: "string", description: "Email de contato" },
        { name: "phone", type: "string", description: "Telefone de contato" },
        { name: "address", type: "string", description: "Endereço completo" },
        { name: "logo", type: "string", description: "URL ou base64 do logo" },
        { name: "createdAt", type: "datetime", description: "Data de criação" },
      ],
    },
    {
      name: "products",
      description: "Tabela de produtos/patrimônio",
      columns: [
        { name: "id", type: "string", description: "Identificador único" },
        { name: "name", type: "string", description: "Nome do produto" },
        { name: "category", type: "string", description: "Categoria do produto" },
        { name: "stock", type: "number", description: "Quantidade em estoque" },
        { name: "minimum", type: "number", description: "Estoque mínimo" },
        { name: "price", type: "string", description: "Preço unitário" },
        { name: "description", type: "string", description: "Descrição detalhada" },
        { name: "status", type: "enum[normal|low|critical]", description: "Status do estoque" },
        { name: "createdAt", type: "datetime", description: "Data de criação" },
        { name: "updatedAt", type: "datetime", description: "Data da última atualização" },
      ],
    },
    {
      name: "invoices",
      description: "Tabela de notas fiscais e documentos",
      columns: [
        { name: "id", type: "string", description: "Identificador único" },
        { name: "number", type: "string", description: "Número da nota fiscal" },
        { name: "type", type: "enum[NF-e|NFC-e]", description: "Tipo de nota fiscal" },
        { name: "date", type: "date", description: "Data da emissão" },
        { name: "value", type: "string", description: "Valor total" },
        { name: "status", type: "enum[processed|pending|error]", description: "Status do processamento" },
        { name: "supplier", type: "string", description: "Fornecedor" },
        { name: "fileName", type: "string", description: "Nome do arquivo" },
        { name: "fileSize", type: "number", description: "Tamanho do arquivo em bytes" },
        { name: "createdAt", type: "datetime", description: "Data de criação" },
      ],
    },
    {
      name: "notifications",
      description: "Tabela de notificações do sistema",
      columns: [
        { name: "id", type: "string", description: "Identificador único" },
        { name: "title", type: "string", description: "Título da notificação" },
        { name: "message", type: "string", description: "Corpo da mensagem" },
        { name: "type", type: "enum[info|warning|error|success]", description: "Tipo de notificação" },
        { name: "read", type: "boolean", description: "Status de leitura" },
        { name: "createdAt", type: "datetime", description: "Data de criação" },
      ],
    },
    {
      name: "activities",
      description: "Tabela de atividades e auditoria",
      columns: [
        { name: "id", type: "string", description: "Identificador único" },
        { name: "action", type: "string", description: "Tipo de ação realizada" },
        { name: "description", type: "string", description: "Descrição detalhada" },
        { name: "time", type: "datetime", description: "Hora da atividade" },
        { name: "icon", type: "string", description: "Ícone para exibição" },
        { name: "color", type: "string", description: "Cor para exibição" },
        { name: "userId", type: "string", description: "ID do usuário que realizou a ação" },
      ],
    },
  ],
  storageKeys: {
    users: "workbox_users",
    companies: "workbox_companies",
    products: "workbox_products",
    invoices: "workbox_invoices",
    notifications: "workbox_notifications",
    activities: "workbox_activities",
    currentUser: "workbox_current_user",
    currentCompany: "workbox_current_company",
    theme: "theme",
    primaryColor: "primaryColor",
  },
  statistics: {
    totalTables: 6,
    totalColumns: 47,
    primaryStorage: "localStorage (JSON)",
    dataFormat: "JSON",
  },
}

// Função para listar todas as tabelas
export function printDatabaseSchema() {
  console.log("=== WorkBox Database Schema ===\n")

  DATABASE_SCHEMA.tables.forEach((table) => {
    console.log(`Table: ${table.name}`)
    console.log(`Description: ${table.description}`)
    console.log(`Columns: ${table.columns.length}`)
    console.log("Fields:")
    table.columns.forEach((col) => {
      console.log(`  - ${col.name} (${col.type}): ${col.description}`)
    })
    console.log()
  })

  console.log("\n=== Storage Keys ===")
  Object.entries(DATABASE_SCHEMA.storageKeys).forEach(([key, value]) => {
    console.log(`${key}: ${value}`)
  })

  console.log("\n=== Statistics ===")
  console.log(`Total Tables: ${DATABASE_SCHEMA.statistics.totalTables}`)
  console.log(`Total Columns: ${DATABASE_SCHEMA.statistics.totalColumns}`)
  console.log(`Storage Type: ${DATABASE_SCHEMA.statistics.primaryStorage}`)
}

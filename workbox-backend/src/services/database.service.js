const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Mapa de conexões por empresa
const dbConnections = new Map();

// Cliente PostgreSQL para operações administrativas
const adminClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Schema SQL para criar tabelas
const createTablesSQL = `
-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS empresa;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS empresa.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    department TEXT NOT NULL,
    "lastAccess" TIMESTAMP(3),
    avatar TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS empresa.products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    minimum INTEGER NOT NULL DEFAULT 10,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    sku TEXT,
    status TEXT NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'low', 'critical')),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notas fiscais
CREATE TABLE IF NOT EXISTS empresa.invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    number TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('NFe', 'NFCe')),
    date TIMESTAMP(3) NOT NULL,
    value DECIMAL(12,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('processed', 'pending', 'error')),
    supplier TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "filePath" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS empresa.notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    read BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de atividades
CREATE TABLE IF NOT EXISTS empresa.activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relatórios
CREATE TABLE IF NOT EXISTS empresa.reports (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('inventory', 'fiscal', 'users')),
    period TEXT NOT NULL,
    data JSONB NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'error')),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON empresa.users(email);
CREATE INDEX IF NOT EXISTS idx_users_company ON empresa.users("companyId");
CREATE INDEX IF NOT EXISTS idx_products_company ON empresa.products("companyId");
CREATE INDEX IF NOT EXISTS idx_invoices_company ON empresa.invoices("companyId");
CREATE INDEX IF NOT EXISTS idx_activities_company ON empresa.activities("companyId");
CREATE INDEX IF NOT EXISTS idx_reports_company ON empresa.reports("companyId");
`;

class DatabaseService {
  // Conectar ao cliente administrativo
  async connectAdmin() {
    if (!adminClient._connected) {
      await adminClient.connect();
      console.log('✅ Conectado ao banco administrativo');
    }
    return adminClient;
  }

  // Verificar se o banco da empresa existe
  async databaseExists(companyId) {
    try {
      const client = await this.connectAdmin();
      const dbName = `empresa_${companyId}`;

      const result = await client.query(
        'SELECT datname FROM pg_database WHERE datname = $1',
        [dbName]
      );

      return result.rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar existência do banco:', error);
      return false;
    }
  }

  // Criar banco de dados para a empresa
  async createDatabase(companyId) {
    try {
      const client = await this.connectAdmin();
      const dbName = `empresa_${companyId}`;

      console.log(`🏗️ Criando banco de dados: ${dbName}`);

      // Criar banco
      await client.query(`CREATE DATABASE "${dbName}"`);

      // Conectar ao novo banco e criar tabelas
      const companyClient = new Client({
        ...adminClient,
        database: dbName
      });

      await companyClient.connect();

      // Executar script de criação das tabelas
      await companyClient.query(createTablesSQL);

      await companyClient.end();

      console.log(`✅ Banco ${dbName} criado com sucesso`);
      return true;
    } catch (error) {
      console.error('Erro ao criar banco de dados:', error);
      return false;
    }
  }

  // Obter conexão Prisma para uma empresa específica
  async getCompanyPrisma(companyId) {
    const dbName = `empresa_${companyId}`;

    // Verificar se já existe conexão em cache
    if (dbConnections.has(companyId)) {
      return dbConnections.get(companyId);
    }

    // Verificar se o banco existe
    const exists = await this.databaseExists(companyId);
    if (!exists) {
      throw new Error(`Banco de dados para empresa ${companyId} não existe`);
    }

    // Criar nova conexão
    const prismaUrl = process.env.DATABASE_URL.replace(
      /\/[^\/]+$/,
      `/${dbName}`
    );

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: prismaUrl,
        },
      },
      log: ['error', 'warn'],
    });

    // Cache da conexão
    dbConnections.set(companyId, prisma);

    console.log(`🔗 Conexão estabelecida para empresa ${companyId}`);
    return prisma;
  }

  // Migrar usuário para o banco da empresa
  async migrateUserToCompanyDatabase(user, companyId) {
    try {
      const prisma = await this.getCompanyPrisma(companyId);

      // Verificar se usuário já existe no banco da empresa
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (!existingUser) {
        // Criar usuário no banco da empresa
        await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            status: user.status,
            department: user.department,
            lastAccess: user.lastAccess,
            avatar: user.avatar,
            companyId: user.companyId,
          }
        });

        console.log(`👤 Usuário ${user.email} migrado para empresa ${companyId}`);
      }

      return true;
    } catch (error) {
      console.error('Erro ao migrar usuário:', error);
      return false;
    }
  }

  // Fechar todas as conexões
  async closeAllConnections() {
    for (const [companyId, prisma] of dbConnections) {
      await prisma.$disconnect();
      console.log(`🔌 Conexão fechada para empresa ${companyId}`);
    }
    dbConnections.clear();

    if (adminClient._connected) {
      await adminClient.end();
    }
  }
}

const databaseService = new DatabaseService();

module.exports = { databaseService };

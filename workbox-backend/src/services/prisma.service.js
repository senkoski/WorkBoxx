const { PrismaClient } = require('@prisma/client');

// Instância única do Prisma para toda a aplicação
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Função para testar a conexão com o banco de dados
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    return false;
  }
}

module.exports = { prisma, testConnection };
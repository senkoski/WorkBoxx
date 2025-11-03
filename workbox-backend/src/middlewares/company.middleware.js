const { databaseService } = require('../services/database.service');

// Middleware para conectar ao banco da empresa correta
const companyMiddleware = async (req, res, next) => {
  try {
    // Verificar se há companyId no token do usuário
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Empresa não identificada'
      });
    }

    // Verificar se o banco da empresa existe
    const dbExists = await databaseService.databaseExists(companyId);

    if (!dbExists) {
      return res.status(404).json({
        success: false,
        error: 'Banco de dados da empresa não encontrado. Entre em contato com o administrador.'
      });
    }

    // Obter conexão Prisma para a empresa
    const companyPrisma = await databaseService.getCompanyPrisma(companyId);

    // Injetar a conexão no request
    req.companyPrisma = companyPrisma;
    req.companyId = companyId;

    next();
  } catch (error) {
    console.error('Erro no middleware da empresa:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

module.exports = { companyMiddleware };

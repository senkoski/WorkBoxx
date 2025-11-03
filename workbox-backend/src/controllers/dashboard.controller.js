const { prisma } = require('../services/prisma.service');

const dashboardController = {
  // Estatísticas gerais
  getStats: async (req, res) => {
    try {
      const { companyId } = req.user;
      
      // Total de produtos
      const totalProducts = await prisma.product.count({
        where: { companyId }
      });
      
      // Produtos com estoque baixo
      const lowStockProducts = await prisma.product.count({
        where: { 
          companyId,
          OR: [
            { status: 'low' },
            { status: 'critical' }
          ]
        }
      });
      
      // Total de notas fiscais
      const totalInvoices = await prisma.invoice.count({
        where: { companyId }
      });
      
      // Notas fiscais pendentes
      const pendingInvoices = await prisma.invoice.count({
        where: { 
          companyId,
          status: 'pending'
        }
      });
      
      // Total de usuários
      const totalUsers = await prisma.user.count({
        where: { companyId }
      });
      
      return res.status(200).json({
        totalProducts,
        lowStockProducts,
        totalInvoices,
        pendingInvoices,
        totalUsers
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Atividades recentes
  getRecentActivities: async (req, res) => {
    try {
      const { companyId } = req.user;
      
      const activities = await prisma.activity.findMany({
        where: { companyId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
      
      return res.status(200).json(activities);
    } catch (error) {
      console.error('Erro ao obter atividades recentes:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Top produtos
  getTopProducts: async (req, res) => {
    try {
      const { companyId } = req.user;
      
      const products = await prisma.product.findMany({
        where: { companyId },
        orderBy: { stock: 'desc' },
        take: 5
      });
      
      return res.status(200).json(products);
    } catch (error) {
      console.error('Erro ao obter top produtos:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Alertas de estoque
  getStockAlerts: async (req, res) => {
    try {
      const { companyId } = req.user;
      
      const lowStockProducts = await prisma.product.findMany({
        where: { 
          companyId,
          status: 'low'
        },
        take: 5
      });
      
      const criticalStockProducts = await prisma.product.findMany({
        where: { 
          companyId,
          status: 'critical'
        },
        take: 5
      });
      
      return res.status(200).json({
        lowStockProducts,
        criticalStockProducts
      });
    } catch (error) {
      console.error('Erro ao obter alertas de estoque:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = dashboardController;
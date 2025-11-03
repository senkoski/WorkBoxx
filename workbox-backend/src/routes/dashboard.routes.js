const express = require('express');
const router = express.Router();
const { prisma } = require('../services/prisma.service');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Estatísticas gerais
router.get('/stats', authMiddleware, async (req, res) => {
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
        status: 'low'
      }
    });

    // Produtos com estoque crítico
    const criticalStockProducts = await prisma.product.count({
      where: {
        companyId,
        status: 'critical'
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

    return res.json({
      success: true,
      stats: {
        totalProducts,
        lowStockProducts,
        criticalStockProducts,
        totalInvoices,
        pendingInvoices,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter estatísticas'
    });
  }
});

// Atividades recentes
router.get('/recent-activities', authMiddleware, async (req, res) => {
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
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Erro ao obter atividades recentes:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter atividades recentes'
    });
  }
});

// Produtos mais ativos
router.get('/top-products', authMiddleware, async (req, res) => {
  try {
    const { companyId } = req.user;

    const products = await prisma.product.findMany({
      where: { companyId },
      orderBy: {
        stock: 'desc'
      },
      take: 5
    });

    return res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Erro ao obter produtos mais ativos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter produtos mais ativos'
    });
  }
});

// Alertas de estoque
router.get('/stock-alert', authMiddleware, async (req, res) => {
  try {
    const { companyId } = req.user;

    const products = await prisma.product.findMany({
      where: {
        companyId,
        status: { in: ['low', 'critical'] }
      },
      orderBy: {
        stock: 'asc'
      }
    });

    return res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Erro ao obter alertas de estoque:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter alertas de estoque'
    });
  }
});

module.exports = router;
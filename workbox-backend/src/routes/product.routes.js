const express = require('express');
const router = express.Router();
const { prisma } = require('../services/prisma.service');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

// Listar produtos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, category, status } = req.query;

    // Construir filtros
    const filters = {
      companyId: req.user.companyId
    };

    if (search) {
      filters.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    if (category) {
      filters.category = category;
    }

    if (status) {
      filters.status = status;
    }

    const products = await prisma.product.findMany({
      where: filters
    });

    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar produtos'
    });
  }
});

// Criar produto
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, category, stock, minimum, price, description, sku } = req.body;

    // Validar campos obrigatórios
    if (!name || !category || stock === undefined || minimum === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Nome, categoria, estoque, mínimo e preço são obrigatórios'
      });
    }

    // Determinar status baseado no estoque
    let status = 'normal';
    if (stock <= minimum * 0.5) {
      status = 'critical';
    } else if (stock <= minimum + 5) {
      status = 'low';
    }

    // Criar produto
    const product = await prisma.product.create({
      data: {
        name,
        category,
        stock: parseInt(stock),
        minimum: parseInt(minimum),
        price: parseFloat(price),
        description,
        sku,
        status,
        companyId: req.user.companyId
      }
    });

    // Registrar atividade
    await prisma.activity.create({
      data: {
        action: 'Produto Criado',
        description: `Produto ${name} foi adicionado ao estoque`,
        icon: 'package',
        color: 'green',
        userId: req.user.id,
        companyId: req.user.companyId
      }
    });

    return res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao criar produto'
    });
  }
});

// Obter detalhes do produto
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    // Verificar se o produto pertence à empresa do usuário
    if (product.companyId !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado'
      });
    }

    return res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter produto'
    });
  }
});

// Atualizar produto
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, stock, minStock, status, sku } = req.body;

    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    // Verificar se o produto pertence à empresa do usuário
    if (existingProduct.companyId !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado'
      });
    }

    // Determinar status baseado no estoque atualizado
    const newStock = stock !== undefined ? stock : existingProduct.stock;
    const newMinStock = minStock !== undefined ? minStock : existingProduct.minimum;

    let productStatus = 'normal';
    if (newStock <= newMinStock * 0.5) {
      productStatus = 'critical';
    } else if (newStock <= newMinStock + 5) {
      productStatus = 'low';
    }

    // Mapear status do frontend para enum do banco
    const statusMapping = {
      'active': 'normal',
      'inactive': 'low'
    };
    if (statusMapping[status]) {
      productStatus = statusMapping[status];
    }

    // Atualizar produto
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        price: price ? parseFloat(price) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        minimum: minStock ? parseInt(minStock) : undefined,
        sku,
        status: productStatus
      }
    });

    // Registrar atividade
    await prisma.activity.create({
      data: {
        action: 'Produto Atualizado',
        description: `Produto ${name || existingProduct.name} foi atualizado`,
        icon: 'edit',
        color: 'blue',
        userId: req.user.id,
        companyId: req.user.companyId
      }
    });

    return res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao atualizar produto'
    });
  }
});

// Deletar produto
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    // Verificar se o produto pertence à empresa do usuário
    if (existingProduct.companyId !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado'
      });
    }

    // Deletar produto
    await prisma.product.delete({
      where: { id }
    });

    // Registrar atividade
    await prisma.activity.create({
      data: {
        action: 'Produto Removido',
        description: `Produto ${existingProduct.name} foi removido do estoque`,
        icon: 'trash',
        color: 'red',
        userId: req.user.id,
        companyId: req.user.companyId
      }
    });

    return res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao deletar produto'
    });
  }
});

// Resumo de estoque
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        companyId: req.user.companyId
      }
    });
    
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.status === 'low').length;
    const criticalStockProducts = products.filter(p => p.status === 'critical').length;
    const totalValue = products.reduce((sum, p) => sum + (p.price.toNumber() * p.stock), 0);
    
    return res.json({
      success: true,
      summary: {
        totalProducts,
        lowStockProducts,
        criticalStockProducts,
        totalValue
      }
    });
  } catch (error) {
    console.error('Erro ao obter resumo de estoque:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter resumo de estoque'
    });
  }
});

module.exports = router;
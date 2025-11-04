const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');

// Listar atividades
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { limit = 20, offset = 0, userId } = req.query;
    
    // Construir filtros
    const filters = {
      companyId: req.user.companyId
    };
    
    if (userId) {
      filters.userId = userId;
    }
    
    const activities = await prisma.activity.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: parseInt(offset),
      take: parseInt(limit)
    });
    
    return res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar atividades'
    });
  }
});

module.exports = router;
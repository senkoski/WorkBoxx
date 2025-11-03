const express = require('express');
const router = express.Router();
const { prisma } = require('../services/prisma.service');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Listar notificações do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    // Também incluir atividades recentes como notificações
    const activities = await prisma.activity.findMany({
      where: {
        companyId: req.user.companyId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Converter atividades em formato de notificação
    const activityNotifications = activities.map(activity => ({
      id: `activity-${activity.id}`,
      title: activity.action,
      message: activity.description,
      type: 'info',
      read: false,
      createdAt: activity.createdAt,
      userId: req.user.id,
      isActivity: true
    }));

    // Combinar notificações e atividades
    const allNotifications = [...notifications, ...activityNotifications];

    // Ordenar por data de criação (mais recentes primeiro)
    allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      success: true,
      notifications: allNotifications.slice(0, 20)
    });
  } catch (error) {
    console.error('Erro ao listar notificações:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar notificações'
    });
  }
});

// Marcar notificação como lida
router.post('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a notificação existe
    const notification = await prisma.notification.findUnique({
      where: { id }
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notificação não encontrada'
      });
    }
    
    // Verificar se a notificação pertence ao usuário
    if (notification.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado'
      });
    }
    
    // Marcar como lida
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    
    return res.json({
      success: true,
      notification: updatedNotification
    });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao marcar notificação como lida'
    });
  }
});

// Marcar todas como lidas
router.post('/read-all', authMiddleware, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        read: false
      },
      data: {
        read: true
      }
    });
    
    return res.json({
      success: true,
      message: 'Todas as notificações foram marcadas como lidas'
    });
  } catch (error) {
    console.error('Erro ao marcar todas notificações como lidas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao marcar todas notificações como lidas'
    });
  }
});

// Deletar notificação
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a notificação existe
    const notification = await prisma.notification.findUnique({
      where: { id }
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notificação não encontrada'
      });
    }
    
    // Verificar se a notificação pertence ao usuário
    if (notification.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado'
      });
    }
    
    // Deletar notificação
    await prisma.notification.delete({
      where: { id }
    });
    
    return res.json({
      success: true,
      message: 'Notificação deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao deletar notificação'
    });
  }
});

module.exports = router;
const { PrismaClient } = require('@prisma/client');
const { prisma } = require('../services/prisma.service');

const notificationController = {
  // Listar notificações do usuário
  getUserNotifications: async (req, res) => {
    try {
      const { userId } = req.user;
      
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      
      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Marcar notificação como lida
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      
      // Verificar se a notificação existe
      const notification = await prisma.notification.findUnique({
        where: { id }
      });
      
      if (!notification) {
        return res.status(404).json({ message: 'Notificação não encontrada' });
      }
      
      // Verificar se a notificação pertence ao usuário
      if (notification.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Marcar como lida
      const updatedNotification = await prisma.notification.update({
        where: { id },
        data: { read: true }
      });
      
      return res.status(200).json(updatedNotification);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Marcar todas as notificações como lidas
  markAllAsRead: async (req, res) => {
    try {
      const { userId } = req.user;
      
      // Marcar todas como lidas
      await prisma.notification.updateMany({
        where: { 
          userId,
          read: false
        },
        data: { read: true }
      });
      
      return res.status(200).json({ message: 'Todas as notificações foram marcadas como lidas' });
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Excluir notificação
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      
      // Verificar se a notificação existe
      const notification = await prisma.notification.findUnique({
        where: { id }
      });
      
      if (!notification) {
        return res.status(404).json({ message: 'Notificação não encontrada' });
      }
      
      // Verificar se a notificação pertence ao usuário
      if (notification.userId !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Excluir notificação
      await prisma.notification.delete({
        where: { id }
      });
      
      return res.status(200).json({ message: 'Notificação excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = notificationController;
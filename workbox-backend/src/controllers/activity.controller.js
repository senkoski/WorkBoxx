
const activityController = {
  // Listar atividades com filtros
  getAllActivities: async (req, res) => {
    try {
      const { companyId } = req.user;
      const { limit = 10, offset = 0, userId } = req.query;
      
      const where = { companyId };
      
      if (userId) {
        where.userId = userId;
      }
      
      const activities = await prisma.activity.findMany({
        where,
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
        take: parseInt(limit),
        skip: parseInt(offset)
      });
      
      return res.status(200).json(activities);
    } catch (error) {
      console.error('Erro ao listar atividades:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = activityController;
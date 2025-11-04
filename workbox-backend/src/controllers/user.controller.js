const bcrypt = require('bcryptjs');

const userController = {
  // Listar usuários por empresa
  getAllUsers: async (req, res) => {
    try {
      const { companyId } = req.user;
      const users = await prisma.user.findMany({
        where: { companyId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          department: true,
          lastAccess: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          company: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      return res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Criar novo usuário
  createUser: async (req, res) => {
    try {
      const { name, email, password, role, department, companyId } = req.body;
      
      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Criar usuário
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          department,
          companyId,
          status: 'active'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          department: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'create_user',
          description: `Usuário ${newUser.name} foi criado`,
          icon: 'user-plus',
          color: 'green',
          userId: req.user.userId,
          companyId: req.user.companyId
        }
      });
      
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Obter detalhes de um usuário
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const { companyId, role } = req.user;
      
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          department: true,
          lastAccess: true,
          avatar: true,
          companyId: true,
          createdAt: true,
          updatedAt: true,
          company: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Verificar se o usuário pertence à mesma empresa ou se é admin
      if (user.companyId !== companyId && role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Atualizar usuário
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role, status, department, password } = req.body;
      const { companyId, role: userRole, userId } = req.user;
      
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id },
        select: { companyId: true, id: true, name: true }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Verificar se o usuário pertence à mesma empresa ou se é admin
      if (user.companyId !== companyId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Preparar dados para atualização
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role && (userRole === 'admin' || userRole === 'manager')) updateData.role = role;
      if (status && (userRole === 'admin' || userRole === 'manager')) updateData.status = status;
      if (department) updateData.department = department;
      if (password) updateData.password = await bcrypt.hash(password, 10);
      
      // Atualizar usuário
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          department: true,
          lastAccess: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'update_user',
          description: `Usuário ${user.name} foi atualizado`,
          icon: 'user-edit',
          color: 'blue',
          userId,
          companyId
        }
      });
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Excluir usuário
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { companyId, role: userRole, userId } = req.user;
      
      // Apenas admin pode excluir usuários
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Apenas administradores podem excluir usuários' });
      }
      
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id },
        select: { companyId: true, id: true, name: true }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Verificar se o usuário pertence à mesma empresa
      if (user.companyId !== companyId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Excluir usuário
      await prisma.user.delete({
        where: { id }
      });
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'delete_user',
          description: `Usuário ${user.name} foi excluído`,
          icon: 'user-minus',
          color: 'red',
          userId,
          companyId
        }
      });
      
      return res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Listar empresas do usuário
  getUserCompanies: async (req, res) => {
    try {
      const { userId } = req.user;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { company: true }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      return res.status(200).json([user.company]);
    } catch (error) {
      console.error('Erro ao listar empresas do usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = userController;
const { prisma } = require('../services/prisma.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controlador para autenticação
const authController = {
  // Login de usuário
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { email },
        include: { company: true }
      });

      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Verificar se o usuário está ativo
      if (user.status !== 'active') {
        return res.status(403).json({ message: 'Usuário inativo. Contate o administrador.' });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Gerar tokens
      const accessToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          companyId: user.companyId
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );

      // Atualizar último acesso
      await prisma.user.update({
        where: { id: user.id },
        data: { lastAccess: new Date() }
      });

      // Retornar dados do usuário e tokens
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          company: {
            id: user.company.id,
            name: user.company.name,
            logo: user.company.logo
          }
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Renovar token
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Token de atualização não fornecido' });
      }

      // Verificar token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { company: true }
      });

      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // Verificar se o usuário está ativo
      if (user.status !== 'active') {
        return res.status(403).json({ message: 'Usuário inativo. Contate o administrador.' });
      }

      // Gerar novo token de acesso
      const accessToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          companyId: user.companyId
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      return res.status(200).json({ accessToken });
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  },

  // Logout (opcional, já que o token é gerenciado no cliente)
  logout: async (req, res) => {
    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  }
};

module.exports = authController;
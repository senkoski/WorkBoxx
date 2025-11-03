const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { prisma } = require('../services/prisma.service');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

// Listar usuários da empresa
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
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
        companyId: true
      }
    });

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar usuários'
    });
  }
});

// Criar novo usuário
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, password, role, department, companyId } = req.body;

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        department,
        companyId
      }
    });

    // Remover senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao criar usuário'
    });
  }
});

// Obter detalhes do usuário
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

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
        createdAt: true,
        companyId: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }



    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter usuário'
    });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, status, department } = req.body;

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }



    // Atualizar usuário
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        role,
        status,
        department
      },
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
        companyId: true
      }
    });

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao atualizar usuário'
    });
  }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Deletar usuário
    await prisma.user.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao deletar usuário'
    });
  }
});

// Listar empresas do usuário
router.get('/:id/companies', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    // Obter empresa do usuário
    const company = await prisma.company.findUnique({
      where: { id: existingUser.companyId }
    });

    return res.json({
      success: true,
      companies: [company]
    });
  } catch (error) {
    console.error('Erro ao listar empresas do usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar empresas do usuário'
    });
  }
});

module.exports = router;
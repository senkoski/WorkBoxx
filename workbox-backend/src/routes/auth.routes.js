const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../services/prisma.service');

// Login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Buscar usuário por ID ou email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier }
        ]
      },
      include: {
        company: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'ID/Email ou senha incorretos'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'ID/Email ou senha incorretos'
      });
    }

    // Atualizar último acesso
    await prisma.user.update({
      where: { id: user.id },
      data: { lastAccess: new Date() }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role,
        companyId: user.companyId
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      user: userWithoutPassword,
      token,
      company: user.company
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar login'
    });
  }
});

// Register (criar primeiro usuário/admin)
router.post('/register', async (req, res) => {
  try {
    const { nome: name, email, senha: password, idEmpresa: companyId, tipoUsuario } = req.body;

    // Validar campos obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'ID da empresa é obrigatório'
      });
    }

    // Verificar se a empresa existe
    const company = await prisma.company.findUnique({
      where: { id: String(companyId) }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Empresa não encontrada. Crie uma empresa primeiro.'
      });
    }
    
    // Verificar se já existe usuário com este email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email já está em uso'
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
        role: 'admin', // Primeiro usuário é admin
        department: 'Administração',
        companyId,
        status: 'active'
      },
      include: {
        company: true
      }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role,
        companyId: user.companyId
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      user: userWithoutPassword,
      token,
      company: user.company
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao processar registro'
    });
  }
});

// Logout (opcional)
router.post('/logout', (req, res) => {
  return res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

// Refresh token (opcional)
router.post('/refresh', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Gerar novo token
    const newToken = jwt.sign(
      { 
        id: decoded.id, 
        email: decoded.email,
        role: decoded.role,
        companyId: decoded.companyId
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado'
    });
  }
});

module.exports = router;
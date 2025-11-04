const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { databaseService } = require('../services/database.service');
const { Client } = require('pg');

// Login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Buscar usuário por ID ou email usando SQL
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const userRes = await client.query(
      'SELECT * FROM empresa.users WHERE id = $1 OR email = $2 LIMIT 1',
      [identifier, identifier]
    );
    const user = userRes.rows[0];

    if (!user) {
      await client.end();
      return res.status(401).json({
        success: false,
        error: 'ID/Email ou senha incorretos'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await client.end();
      return res.status(401).json({
        success: false,
        error: 'ID/Email ou senha incorretos'
      });
    }

    // Atualizar último acesso
    await client.query(
      'UPDATE empresa.users SET "lastAccess" = $1 WHERE id = $2',
      [new Date(), user.id]
    );

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        companyId: user.companyId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user;

    await client.end();
    return res.json({
      success: true,
      user: userWithoutPassword,
      token
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
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const companyRes = await client.query('SELECT * FROM empresa.companies WHERE id = $1', [companyId]);
    const company = companyRes.rows[0];
    if (!company) {
      await client.end();
      return res.status(404).json({
        success: false,
        error: 'Empresa não encontrada. Crie uma empresa primeiro.'
      });
    }
    // Verificar se já existe usuário com este email
    const userRes = await client.query('SELECT * FROM empresa.users WHERE email = $1', [email]);
    if (userRes.rows.length > 0) {
      await client.end();
      return res.status(400).json({
        success: false,
        error: 'Email já está em uso'
      });
    }
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    // Criar usuário
    const insertRes = await client.query(
      'INSERT INTO empresa.users (name, email, password, companyId, role, status, department, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [name, email, hashedPassword, companyId, tipoUsuario || 'user', 'active', '']
    );
    const user = insertRes.rows[0];

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        companyId: user.companyId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha do objeto de resposta
    const { password: _, ...userWithoutPassword } = user;
    await client.end();

    return res.status(201).json({
      success: true,
      user: userWithoutPassword,
      token
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
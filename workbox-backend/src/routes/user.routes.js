const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

// Listar usuários da empresa
router.get('/', async (req, res) => {
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const usersRes = await client.query('SELECT id, name, email, role, status, department, "lastAccess", avatar, "createdAt", "companyId" FROM empresa.users');
    const users = usersRes.rows;
    await client.end();

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
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const userRes = await client.query('SELECT * FROM empresa.users WHERE email = $1', [email]);
    const existingUser = userRes.rows[0];
    if (existingUser) {
      await client.end();
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertRes = await client.query('INSERT INTO empresa.users (name, email, password, role, department, "companyId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, name, email, role, department, "companyId", "createdAt"', [name, email, hashedPassword, role, department, companyId]);
    const user = insertRes.rows[0];
    await client.end();

    // ...existing code...
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

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const userRes = await client.query('SELECT id, name, email, role, status, department, "lastAccess", avatar, "createdAt", "companyId" FROM empresa.users WHERE id = $1', [id]);
    const user = userRes.rows[0];
    await client.end();

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
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const userRes = await client.query('SELECT id FROM empresa.users WHERE id = $1', [id]);
    const existingUser = userRes.rows[0];
    if (!existingUser) {
      await client.end();
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    const updateRes = await client.query('UPDATE empresa.users SET name = $1, role = $2, status = $3, department = $4, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, name, email, role, status, department, "lastAccess", avatar, "createdAt", "companyId"', [name, role, status, department, id]);
    const updatedUser = updateRes.rows[0];
    await client.end();
    return res.json({
      success: true,
      user: updatedUser
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
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const userRes = await client.query('SELECT id FROM empresa.users WHERE id = $1', [id]);
    const existingUser = userRes.rows[0];
    if (!existingUser) {
      await client.end();
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    await client.query('DELETE FROM empresa.users WHERE id = $1', [id]);
    await client.end();
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
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const userRes = await client.query('SELECT "companyId" FROM empresa.users WHERE id = $1', [id]);
    const existingUser = userRes.rows[0];
    if (!existingUser) {
      await client.end();
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    const companyRes = await client.query('SELECT * FROM empresa.companies WHERE id = $1', [existingUser.companyId]);
    const company = companyRes.rows[0];
    await client.end();
    return res.json({
      success: true,
      companies: company ? [company] : []
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
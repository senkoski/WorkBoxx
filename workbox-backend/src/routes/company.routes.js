const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Listar empresas
router.get('/', authMiddleware, companyController.getAllCompanies);

// Criar empresa
router.post('/', authMiddleware, companyController.createCompany);

// Obter detalhes da empresa
router.get('/:id', authMiddleware, companyController.getCompanyById);

// Atualizar empresa
router.put('/:id', authMiddleware, companyController.updateCompany);

// Deletar empresa
router.delete('/:id', authMiddleware, companyController.deleteCompany);

module.exports = router;

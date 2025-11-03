const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const reportController = require('../controllers/report.controller');

// Gerar relatório
router.post('/generate', authMiddleware, reportController.generateReport);

// Listar relatórios salvos
router.get('/', authMiddleware, reportController.getReports);

// Obter relatório específico
router.get('/:id', authMiddleware, reportController.getReport);

// Deletar relatório
router.delete('/:id', authMiddleware, reportController.deleteReport);

module.exports = router;

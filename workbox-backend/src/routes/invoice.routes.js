const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/xml') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos XML são permitidos'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Listar notas fiscais
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, type, date } = req.query;
    
    // Construir filtros
    const filters = {
      companyId: req.user.companyId
    };
    
    if (status) {
      filters.status = status;
    }
    
    if (type) {
      filters.type = type;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      filters.date = {
        gte: startDate,
        lt: endDate
      };
    }
    
    const invoices = await prisma.invoice.findMany({
      where: filters,
      orderBy: {
        date: 'desc'
      }
    });
    
    return res.json({
      success: true,
      invoices
    });
  } catch (error) {
    console.error('Erro ao listar notas fiscais:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar notas fiscais'
    });
  }
});

// Upload de nota fiscal
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado'
      });
    }
    
    const { number, type, date, value, supplier } = req.body;
    
    // Criar registro da nota fiscal
    const invoice = await prisma.invoice.create({
      data: {
        number,
        type,
        date: new Date(date),
        value: parseFloat(value),
        status: 'pending',
        supplier,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        filePath: req.file.path,
        companyId: req.user.companyId
      }
    });
    
    // Registrar atividade
    await prisma.activity.create({
      data: {
        action: 'Nota Fiscal Enviada',
        description: `Nota fiscal ${number} foi enviada para processamento`,
        icon: 'file-text',
        color: 'blue',
        userId: req.user.id,
        companyId: req.user.companyId
      }
    });
    
    return res.status(201).json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Erro ao fazer upload de nota fiscal:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao fazer upload de nota fiscal'
    });
  }
});

// Obter detalhes da nota fiscal
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Nota fiscal não encontrada'
      });
    }
    
    // Verificar se a nota fiscal pertence à empresa do usuário
    if (invoice.companyId !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado'
      });
    }
    
    return res.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Erro ao obter nota fiscal:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter nota fiscal'
    });
  }
});

// Atualizar status da nota fiscal
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Verificar se a nota fiscal existe
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id }
    });
    
    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        error: 'Nota fiscal não encontrada'
      });
    }
    
    // Verificar se a nota fiscal pertence à empresa do usuário
    if (existingInvoice.companyId !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado'
      });
    }
    
    // Atualizar nota fiscal
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status }
    });
    
    // Registrar atividade
    await prisma.activity.create({
      data: {
        action: 'Status de NF Atualizado',
        description: `Nota fiscal ${invoice.number} teve status alterado para ${status}`,
        icon: 'refresh-cw',
        color: 'orange',
        userId: req.user.id,
        companyId: req.user.companyId
      }
    });
    
    return res.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Erro ao atualizar nota fiscal:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao atualizar nota fiscal'
    });
  }
});

// Deletar nota fiscal
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a nota fiscal existe
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id }
    });
    
    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        error: 'Nota fiscal não encontrada'
      });
    }
    
    // Verificar se a nota fiscal pertence à empresa do usuário
    if (existingInvoice.companyId !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado'
      });
    }
    
    // Remover arquivo físico se existir
    if (existingInvoice.filePath && fs.existsSync(existingInvoice.filePath)) {
      fs.unlinkSync(existingInvoice.filePath);
    }
    
    // Deletar nota fiscal
    await prisma.invoice.delete({
      where: { id }
    });
    
    return res.json({
      success: true,
      message: 'Nota fiscal deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar nota fiscal:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao deletar nota fiscal'
    });
  }
});

// Download do arquivo XML
router.get('/:id/download', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id }
    });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Nota fiscal não encontrada'
      });
    }
    
    // Verificar se a nota fiscal pertence à empresa do usuário
    if (invoice.companyId !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Acesso não autorizado'
      });
    }
    
    // Verificar se o arquivo existe
    if (!invoice.filePath || !fs.existsSync(invoice.filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Arquivo não encontrado'
      });
    }
    
    return res.download(invoice.filePath, invoice.fileName);
  } catch (error) {
    console.error('Erro ao fazer download do arquivo:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao fazer download do arquivo'
    });
  }
});

module.exports = router;
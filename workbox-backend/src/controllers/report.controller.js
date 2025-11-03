const { prisma } = require('../services/prisma.service');

const reportController = {
  // Gerar relatório
  generateReport: async (req, res) => {
    try {
      const { companyId } = req.user;
      const { type, period } = req.body;

      if (!type || !period) {
        return res.status(400).json({
          success: false,
          error: 'Tipo e período são obrigatórios'
        });
      }

      // Definir nome do relatório baseado no tipo e período
      const typeNames = {
        inventory: 'Estoque',
        fiscal: 'Fiscal',
        users: 'Usuários'
      };

      const periodNames = {
        today: 'Hoje',
        week: 'Esta Semana',
        month: 'Este Mês',
        quarter: 'Este Trimestre',
        year: 'Este Ano',
        custom: 'Período Personalizado'
      };

      const reportName = `${typeNames[type]} - ${periodNames[period]}`;

      let reportData = [];
      let csvContent = '';

      // Gerar dados baseado no tipo de relatório
      switch (type) {
        case 'inventory':
          reportData = await prisma.product.findMany({
            where: { companyId },
            select: {
              name: true,
              category: true,
              stock: true,
              minimum: true,
              price: true,
              status: true
            }
          });

          if (reportData.length === 0) {
            csvContent = 'Nome,Categoria,Estoque,Mínimo,Preço,Status\nNenhum valor encontrado,,,,,,,,';
          } else {
            csvContent = 'Nome,Categoria,Estoque,Mínimo,Preço,Status\n';
            reportData.forEach(product => {
              csvContent += `${product.name},${product.category},${product.stock},${product.minimum},${product.price},${product.status}\n`;
            });
          }
          break;

        case 'fiscal':
          reportData = await prisma.invoice.findMany({
            where: { companyId },
            select: {
              number: true,
              date: true,
              value: true,
              status: true,
              supplier: true,
              type: true
            },
            orderBy: { date: 'desc' }
          });

          if (reportData.length === 0) {
            csvContent = 'Número,Data,Valor,Status,Fornecedor,Tipo\nNenhum valor encontrado,,,,,,,,';
          } else {
            csvContent = 'Número,Data,Valor,Status,Fornecedor,Tipo\n';
            reportData.forEach(invoice => {
              const formattedDate = invoice.date.toISOString().split('T')[0];
              csvContent += `${invoice.number},${formattedDate},${invoice.value},${invoice.status},${invoice.supplier},${invoice.type}\n`;
            });
          }
          break;

        case 'users':
          reportData = await prisma.user.findMany({
            where: { companyId },
            select: {
              name: true,
              email: true,
              role: true,
              department: true,
              lastAccess: true,
              status: true
            }
          });

          if (reportData.length === 0) {
            csvContent = 'Nome,Email,Cargo,Departamento,Último Acesso,Status\nNenhum valor encontrado,,,,,,,,';
          } else {
            csvContent = 'Nome,Email,Cargo,Departamento,Último Acesso,Status\n';
            reportData.forEach(user => {
              const formattedLastAccess = user.lastAccess ? user.lastAccess.toISOString().split('T')[0] : '';
              csvContent += `${user.name},${user.email},${user.role},${user.department},${formattedLastAccess},${user.status}\n`;
            });
          }
          break;

        default:
          return res.status(400).json({
            success: false,
            error: 'Tipo de relatório inválido'
          });
      }

      // Calcular tamanho do arquivo
      const fileSize = Buffer.byteLength(csvContent, 'utf8');

      // Criar nome do arquivo
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `relatorio_${type}_${timestamp}.csv`;

      // Salvar relatório no banco
      const report = await prisma.report.create({
        data: {
          name: reportName,
          type,
          period,
          data: reportData,
          fileName,
          fileSize,
          companyId
        }
      });

      return res.status(201).json({
        success: true,
        report: {
          id: report.id,
          name: report.name,
          type: report.type,
          period: report.period,
          fileName: report.fileName,
          fileSize: report.fileSize,
          createdAt: report.createdAt,
          data: reportData,
          csvContent
        }
      });

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Listar relatórios salvos
  getReports: async (req, res) => {
    try {
      const { companyId } = req.user;

      const reports = await prisma.report.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          type: true,
          period: true,
          fileName: true,
          fileSize: true,
          status: true,
          createdAt: true
        }
      });

      return res.json({
        success: true,
        reports
      });

    } catch (error) {
      console.error('Erro ao obter relatórios:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Obter relatório específico
  getReport: async (req, res) => {
    try {
      const { companyId } = req.user;
      const { id } = req.params;

      const report = await prisma.report.findFirst({
        where: {
          id,
          companyId
        }
      });

      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Relatório não encontrado'
        });
      }

      // Gerar CSV novamente baseado nos dados salvos
      let csvContent = '';
      const reportData = report.data;

      switch (report.type) {
        case 'inventory':
          if (!reportData || reportData.length === 0) {
            csvContent = 'Nome,Categoria,Estoque,Mínimo,Preço,Status\nNenhum valor encontrado,,,,,,,,';
          } else {
            csvContent = 'Nome,Categoria,Estoque,Mínimo,Preço,Status\n';
            reportData.forEach(product => {
              csvContent += `${product.name},${product.category},${product.stock},${product.minimum},${product.price},${product.status}\n`;
            });
          }
          break;

        case 'fiscal':
          if (!reportData || reportData.length === 0) {
            csvContent = 'Número,Data,Valor,Status,Fornecedor,Tipo\nNenhum valor encontrado,,,,,,,,';
          } else {
            csvContent = 'Número,Data,Valor,Status,Fornecedor,Tipo\n';
            reportData.forEach(invoice => {
              csvContent += `${invoice.number},${invoice.date},${invoice.value},${invoice.status},${invoice.supplier},${invoice.type}\n`;
            });
          }
          break;

        case 'users':
          if (!reportData || reportData.length === 0) {
            csvContent = 'Nome,Email,Cargo,Departamento,Último Acesso,Status\nNenhum valor encontrado,,,,,,,,';
          } else {
            csvContent = 'Nome,Email,Cargo,Departamento,Último Acesso,Status\n';
            reportData.forEach(user => {
              csvContent += `${user.name},${user.email},${user.role},${user.department},${user.lastAccess},${user.status}\n`;
            });
          }
          break;
      }

      return res.json({
        success: true,
        report: {
          id: report.id,
          name: report.name,
          type: report.type,
          period: report.period,
          fileName: report.fileName,
          fileSize: report.fileSize,
          createdAt: report.createdAt,
          data: reportData,
          csvContent
        }
      });

    } catch (error) {
      console.error('Erro ao obter relatório:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  },

  // Deletar relatório
  deleteReport: async (req, res) => {
    try {
      const { companyId } = req.user;
      const { id } = req.params;

      const report = await prisma.report.findFirst({
        where: {
          id,
          companyId
        }
      });

      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Relatório não encontrado'
        });
      }

      await prisma.report.delete({
        where: { id }
      });

      return res.json({
        success: true,
        message: 'Relatório deletado com sucesso'
      });

    } catch (error) {
      console.error('Erro ao deletar relatório:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = reportController;

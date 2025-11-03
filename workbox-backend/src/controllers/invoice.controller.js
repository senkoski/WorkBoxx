const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { prisma } = require('../services/prisma.service');

const invoiceController = {
  // Listar notas fiscais com filtros
  getAllInvoices: async (req, res) => {
    try {
      const { companyId } = req.user;
      const { status, type, startDate, endDate } = req.query;
      
      const where = { companyId };
      
      if (status) where.status = status;
      if (type) where.type = type;
      
      if (startDate && endDate) {
        where.date = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        };
      } else if (startDate) {
        where.date = {
          gte: new Date(startDate)
        };
      } else if (endDate) {
        where.date = {
          lte: new Date(endDate)
        };
      }
      
      const invoices = await prisma.invoice.findMany({
        where,
        orderBy: { date: 'desc' }
      });
      
      return res.status(200).json(invoices);
    } catch (error) {
      console.error('Erro ao listar notas fiscais:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Upload de nova nota fiscal
  uploadInvoice: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado' });
      }
      
      const { number, type, date, value, supplier } = req.body;
      const { companyId, userId } = req.user;
      
      // Criar nota fiscal
      const newInvoice = await prisma.invoice.create({
        data: {
          number,
          type,
          date: new Date(date),
          value: parseFloat(value),
          supplier,
          status: 'pending',
          fileName: req.file.originalname,
          fileSize: req.file.size,
          filePath: req.file.path,
          companyId
        }
      });
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'upload_invoice',
          description: `Nota fiscal ${newInvoice.number} foi enviada`,
          icon: 'file-upload',
          color: 'green',
          userId,
          companyId
        }
      });
      
      return res.status(201).json(newInvoice);
    } catch (error) {
      console.error('Erro ao fazer upload de nota fiscal:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Obter detalhes de uma nota fiscal
  getInvoiceById: async (req, res) => {
    try {
      const { id } = req.params;
      const { companyId } = req.user;
      
      const invoice = await prisma.invoice.findUnique({
        where: { id }
      });
      
      if (!invoice) {
        return res.status(404).json({ message: 'Nota fiscal não encontrada' });
      }
      
      // Verificar se a nota fiscal pertence à empresa do usuário
      if (invoice.companyId !== companyId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      return res.status(200).json(invoice);
    } catch (error) {
      console.error('Erro ao buscar nota fiscal:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Atualizar status da nota fiscal
  updateInvoiceStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { companyId, userId } = req.user;
      
      // Verificar se a nota fiscal existe
      const invoice = await prisma.invoice.findUnique({
        where: { id }
      });
      
      if (!invoice) {
        return res.status(404).json({ message: 'Nota fiscal não encontrada' });
      }
      
      // Verificar se a nota fiscal pertence à empresa do usuário
      if (invoice.companyId !== companyId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Atualizar status
      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: { status }
      });
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'update_invoice',
          description: `Status da nota fiscal ${invoice.number} alterado para ${status}`,
          icon: 'file-edit',
          color: 'blue',
          userId,
          companyId
        }
      });
      
      return res.status(200).json(updatedInvoice);
    } catch (error) {
      console.error('Erro ao atualizar status da nota fiscal:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Excluir nota fiscal
  deleteInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const { companyId, userId, role } = req.user;
      
      // Verificar se é admin
      if (role !== 'admin') {
        return res.status(403).json({ message: 'Apenas administradores podem excluir notas fiscais' });
      }
      
      // Verificar se a nota fiscal existe
      const invoice = await prisma.invoice.findUnique({
        where: { id }
      });
      
      if (!invoice) {
        return res.status(404).json({ message: 'Nota fiscal não encontrada' });
      }
      
      // Verificar se a nota fiscal pertence à empresa do usuário
      if (invoice.companyId !== companyId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Excluir arquivo físico
      if (invoice.filePath && fs.existsSync(invoice.filePath)) {
        fs.unlinkSync(invoice.filePath);
      }
      
      // Excluir nota fiscal
      await prisma.invoice.delete({
        where: { id }
      });
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'delete_invoice',
          description: `Nota fiscal ${invoice.number} foi excluída`,
          icon: 'file-minus',
          color: 'red',
          userId,
          companyId
        }
      });
      
      return res.status(200).json({ message: 'Nota fiscal excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir nota fiscal:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Download do arquivo XML
  downloadInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const { companyId } = req.user;
      
      const invoice = await prisma.invoice.findUnique({
        where: { id }
      });
      
      if (!invoice) {
        return res.status(404).json({ message: 'Nota fiscal não encontrada' });
      }
      
      // Verificar se a nota fiscal pertence à empresa do usuário
      if (invoice.companyId !== companyId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Verificar se o arquivo existe
      if (!invoice.filePath || !fs.existsSync(invoice.filePath)) {
        return res.status(404).json({ message: 'Arquivo não encontrado' });
      }
      
      // Enviar arquivo
      res.download(invoice.filePath, invoice.fileName);
    } catch (error) {
      console.error('Erro ao fazer download da nota fiscal:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = invoiceController;
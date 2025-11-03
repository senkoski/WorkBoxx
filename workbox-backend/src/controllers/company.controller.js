const { PrismaClient } = require('@prisma/client');
const { prisma } = require('../services/prisma.service');

const companyController = {
  // Listar todas as empresas
  getAllCompanies: async (req, res) => {
    try {
      const companies = await prisma.company.findMany();
      return res.status(200).json(companies);
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Criar nova empresa
  createCompany: async (req, res) => {
    try {
      const { name, cnpj, email, phone, address, logo } = req.body;
      const { role, id: userId } = req.user;

      // Verificar se é admin
      if (role !== 'admin') {
        return res.status(403).json({ message: 'Apenas administradores podem criar empresas' });
      }

      // Verificar se CNPJ já existe
      const existingCompany = await prisma.company.findFirst({
        where: { cnpj }
      });

      if (existingCompany) {
        return res.status(400).json({ message: 'CNPJ já está em uso' });
      }

      // Criar empresa
      const newCompany = await prisma.company.create({
        data: {
          name,
          cnpj,
          email,
          phone,
          address,
          logo
        }
      });

      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'create_company',
          description: `Empresa ${newCompany.name} foi criada`,
          icon: 'building-add',
          color: 'green',
          userId,
          companyId: newCompany.id
        }
      });

      return res.status(201).json(newCompany);
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Obter detalhes de uma empresa
  getCompanyById: async (req, res) => {
    try {
      const { id } = req.params;

      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true
            }
          }
        }
      });

      if (!company) {
        return res.status(404).json({ message: 'Empresa não encontrada' });
      }

      return res.status(200).json(company);
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Atualizar empresa
  updateCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, address, logo } = req.body;
      const { role, userId, companyId } = req.user;

      // Verificar se é admin
      if (role !== 'admin') {
        return res.status(403).json({ message: 'Apenas administradores podem atualizar empresas' });
      }

      // Verificar se a empresa existe
      const company = await prisma.company.findUnique({
        where: { id }
      });

      if (!company) {
        return res.status(404).json({ message: 'Empresa não encontrada' });
      }

      // Atualizar empresa
      const updatedCompany = await prisma.company.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          address,
          logo
        }
      });

      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'update_company',
          description: `Empresa ${company.name} foi atualizada`,
          icon: 'building-edit',
          color: 'blue',
          userId,
          companyId
        }
      });

      return res.status(200).json(updatedCompany);
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Excluir empresa
  deleteCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const { role, userId, companyId } = req.user;

      // Verificar se é admin
      if (role !== 'admin') {
        return res.status(403).json({ message: 'Apenas administradores podem excluir empresas' });
      }

      // Verificar se a empresa existe
      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          users: true,
          products: true,
          invoices: true,
          activities: true
        }
      });

      if (!company) {
        return res.status(404).json({ message: 'Empresa não encontrada' });
      }

      // Verificar se há dados vinculados
      const hasData = company.users.length > 0 ||
                     company.products.length > 0 ||
                     company.invoices.length > 0 ||
                     company.activities.length > 0;

      if (hasData) {
        return res.status(400).json({
          message: 'Não é possível excluir a empresa pois existem dados vinculados (usuários, produtos, notas fiscais ou atividades)'
        });
      }

      // Excluir empresa
      await prisma.company.delete({
        where: { id }
      });

      // Registrar atividade (usando companyId do usuário logado, não da empresa excluída)
      await prisma.activity.create({
        data: {
          action: 'delete_company',
          description: `Empresa ${company.name} foi excluída`,
          icon: 'building-remove',
          color: 'red',
          userId,
          companyId  // companyId do usuário logado
        }
      });

      return res.status(200).json({ message: 'Empresa excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = companyController;

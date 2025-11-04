
const productController = {
  // Listar produtos com filtros
  getAllProducts: async (req, res) => {
    try {
      const { companyId } = req.user;
      const { category, status, search } = req.query;
      
      const where = { companyId };
      
      if (category) where.category = category;
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      const products = await prisma.product.findMany({
        where,
        orderBy: { name: 'asc' }
      });
      
      return res.status(200).json(products);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Criar novo produto
  createProduct: async (req, res) => {
    try {
      const { name, category, stock, minimum, price, description, sku } = req.body;
      const { companyId, userId } = req.user;
      
      // Determinar status com base no estoque
      let status = 'normal';
      if (stock <= minimum * 0.5) {
        status = 'critical';
      } else if (stock <= minimum + 5) {
        status = 'low';
      }
      
      // Criar produto
      const newProduct = await prisma.product.create({
        data: {
          name,
          category,
          stock,
          minimum,
          price,
          description,
          sku,
          status,
          companyId
        }
      });
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'create_product',
          description: `Produto ${newProduct.name} foi adicionado ao estoque`,
          icon: 'package-plus',
          color: 'green',
          userId,
          companyId
        }
      });
      
      // Criar notificação se estoque baixo
      if (status !== 'normal') {
        // Buscar usuários da empresa
        const users = await prisma.user.findMany({
          where: { 
            companyId,
            OR: [
              { role: 'admin' },
              { role: 'manager' }
            ]
          }
        });
        
        // Criar notificações para administradores e gerentes
        const notificationType = status === 'critical' ? 'error' : 'warning';
        const notificationTitle = status === 'critical' ? 'Estoque crítico' : 'Estoque baixo';
        
        for (const user of users) {
          await prisma.notification.create({
            data: {
              title: notificationTitle,
              message: `O produto ${newProduct.name} foi cadastrado com estoque ${status === 'critical' ? 'crítico' : 'baixo'}.`,
              type: notificationType,
              userId: user.id
            }
          });
        }
      }
      
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Obter detalhes de um produto
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const { companyId } = req.user;
      
      const product = await prisma.product.findUnique({
        where: { id }
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      // Verificar se o produto pertence à empresa do usuário
      if (product.companyId !== companyId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Atualizar produto
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, stock, minimum, price, description, sku } = req.body;
      const { companyId, userId } = req.user;
      
      // Verificar se o produto existe
      const product = await prisma.product.findUnique({
        where: { id }
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      // Verificar se o produto pertence à empresa do usuário
      if (product.companyId !== companyId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Determinar status com base no estoque
      let status = 'normal';
      const newStock = stock !== undefined ? stock : product.stock;
      const newMinimum = minimum !== undefined ? minimum : product.minimum;

      if (newStock <= newMinimum * 0.5) {
        status = 'critical';
      } else if (newStock <= newMinimum + 5) {
        status = 'low';
      }
      
      // Atualizar produto
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name: name !== undefined ? name : product.name,
          category: category !== undefined ? category : product.category,
          stock: newStock,
          minimum: newMinimum,
          price: price !== undefined ? price : product.price,
          description: description !== undefined ? description : product.description,
          sku: sku !== undefined ? sku : product.sku,
          status
        }
      });
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'update_product',
          description: `Produto ${product.name} foi atualizado`,
          icon: 'package-edit',
          color: 'blue',
          userId,
          companyId
        }
      });
      
      // Criar notificação se estoque mudou para baixo ou crítico
      if (status !== 'normal' && product.status === 'normal') {
        // Buscar usuários da empresa
        const users = await prisma.user.findMany({
          where: { 
            companyId,
            OR: [
              { role: 'admin' },
              { role: 'manager' }
            ]
          }
        });
        
        // Criar notificações para administradores e gerentes
        const notificationType = status === 'critical' ? 'error' : 'warning';
        const notificationTitle = status === 'critical' ? 'Estoque crítico' : 'Estoque baixo';
        
        for (const user of users) {
          await prisma.notification.create({
            data: {
              title: notificationTitle,
              message: `O produto ${updatedProduct.name} está com estoque ${status === 'critical' ? 'crítico' : 'baixo'}.`,
              type: notificationType,
              userId: user.id
            }
          });
        }
      }
      
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Excluir produto
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { companyId, userId, role } = req.user;
      
      // Verificar se é admin ou gerente
      if (role !== 'admin' && role !== 'manager') {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Verificar se o produto existe
      const product = await prisma.product.findUnique({
        where: { id }
      });
      
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      // Verificar se o produto pertence à empresa do usuário
      if (product.companyId !== companyId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Excluir produto
      await prisma.product.delete({
        where: { id }
      });
      
      // Registrar atividade
      await prisma.activity.create({
        data: {
          action: 'delete_product',
          description: `Produto ${product.name} foi excluído`,
          icon: 'package-minus',
          color: 'red',
          userId,
          companyId
        }
      });
      
      return res.status(200).json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  // Resumo do estoque
  getStockSummary: async (req, res) => {
    try {
      const { companyId } = req.user;
      
      // Contar produtos por status
      const totalProducts = await prisma.product.count({
        where: { companyId }
      });
      
      const lowStockProducts = await prisma.product.count({
        where: { 
          companyId,
          status: 'low'
        }
      });
      
      const criticalStockProducts = await prisma.product.count({
        where: { 
          companyId,
          status: 'critical'
        }
      });
      
      // Calcular valor total do estoque
      const products = await prisma.product.findMany({
        where: { companyId },
        select: {
          stock: true,
          price: true
        }
      });
      
      const totalValue = products.reduce((sum, product) => {
        return sum + (product.stock * Number(product.price));
      }, 0);
      
      return res.status(200).json({
        totalProducts,
        lowStockProducts,
        criticalStockProducts,
        totalValue
      });
    } catch (error) {
      console.error('Erro ao obter resumo do estoque:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
};

module.exports = productController;
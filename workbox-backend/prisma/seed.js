const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Verificar se já existe uma empresa
  const existingCompany = await prisma.company.findFirst();

  let company;
  if (!existingCompany) {
    // Criar empresa padrão
    company = await prisma.company.create({
      data: {
        name: 'Minha Empresa',
        cnpj: '12345678901234',
        address: 'Rua Teste, 123',
        phone: '11987654321',
        email: 'contato@empresa.com',
        logo: null
      }
    });
  } else {
    // Atualizar empresa existente para garantir nome correto
    company = await prisma.company.update({
      where: { id: existingCompany.id },
      data: {
        name: 'Minha Empresa'
      }
    });
  }

  // Verificar se usuários já existem
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@empresa.com' }
  });

  const existingUser = await prisma.user.findUnique({
    where: { email: 'user@empresa.com' }
  });

  let admin, user;

  if (!existingAdmin) {
    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@empresa.com',
        password: hashedPassword,
        role: 'admin',
        department: 'Administração',
        status: 'active',
        companyId: company.id,
        avatar: null
      }
    });
  } else {
    admin = existingAdmin;
  }

  if (!existingUser) {
    // Criar usuário comum
    const userPassword = await bcrypt.hash('user123', 10);
    user = await prisma.user.create({
      data: {
        name: 'Usuário Padrão',
        email: 'user@empresa.com',
        password: userPassword,
        role: 'user',
        department: 'Operacional',
        status: 'active',
        companyId: company.id,
        avatar: null
      }
    });
  } else {
    user = existingUser;
  }

  // Criar produtos de exemplo
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Notebook Dell XPS',
        category: 'Eletrônicos',
        description: 'Notebook Dell XPS 13 com Intel Core i7',
        sku: 'DELL-XPS-001',
        price: 8999.99,
        stock: 15,
        minimum: 5,
        status: 'normal',
        companyId: company.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Monitor LG 27"',
        category: 'Eletrônicos',
        description: 'Monitor LG UltraGear 27" 144Hz',
        sku: 'LG-MON-002',
        price: 1799.99,
        stock: 8,
        minimum: 3,
        status: 'normal',
        companyId: company.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Teclado Mecânico',
        category: 'Periféricos',
        description: 'Teclado Mecânico RGB Switch Blue',
        sku: 'KB-MECH-003',
        price: 349.99,
        stock: 3,
        minimum: 5,
        status: 'low',
        companyId: company.id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Mouse Gamer',
        category: 'Periféricos',
        description: 'Mouse Gamer 16000 DPI RGB',
        sku: 'MOUSE-G-004',
        price: 199.99,
        stock: 1,
        minimum: 3,
        status: 'critical',
        companyId: company.id
      }
    })
  ]);

  // Criar atividades
  await prisma.activity.create({
    data: {
      action: 'create_user',
      description: 'Adicionou 4 produtos ao estoque',
      icon: 'package',
      color: 'green',
      userId: admin.id,
      companyId: company.id
    }
  });

  // Criar notificação
  await prisma.notification.create({
    data: {
      title: 'Bem-vindo ao WorkBox',
      message: 'Bem-vindo ao sistema de gerenciamento WorkBox. Comece adicionando seus produtos e notas fiscais.',
      type: 'info',
      read: false,
      userId: admin.id
    }
  });

  await prisma.notification.create({
    data: {
      title: 'Alerta de estoque',
      message: 'Alguns produtos estão com estoque baixo ou crítico. Verifique o dashboard para mais informações.',
      type: 'warning',
      read: false,
      userId: admin.id
    }
  });

  console.log('Banco de dados inicializado com dados de exemplo!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
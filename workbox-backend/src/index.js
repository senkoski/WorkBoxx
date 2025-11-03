require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./services/prisma.service');
const path = require('path');
const fs = require('fs');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const companyRoutes = require('./routes/company.routes');
const productRoutes = require('./routes/product.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const notificationRoutes = require('./routes/notification.routes');
const activityRoutes = require('./routes/activity.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Inicializar aplicação Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criar diretório de uploads se não existir
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(uploadsDir));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota de teste
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.status(200).json({ 
    status: 'ok', 
    message: 'API WorkBox está funcionando!',
    database: dbConnected ? 'conectado' : 'desconectado'
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);

  // Testar conexão com o banco de dados
  await testConnection();
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('Erro não tratado:', error);
});

module.exports = app;
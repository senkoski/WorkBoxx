const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garantir que o diretório de uploads existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Criar pasta para a empresa se não existir
    const companyDir = path.join(uploadDir, req.user.companyId);
    if (!fs.existsSync(companyDir)) {
      fs.mkdirSync(companyDir, { recursive: true });
    }
    cb(null, companyDir);
  },
  filename: function (req, file, cb) {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro para aceitar apenas arquivos XML
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/xml' || file.originalname.endsWith('.xml')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos XML são permitidos'), false);
  }
};

// Configuração do upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;
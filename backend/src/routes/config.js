const express = require('express');
const router = express.Router();
const ConfigController = require('../controllers/configController');
const authMiddleware = require('../middleware/auth');
const validators = require('../utils/validators');

// Todas as rotas de configuração são protegidas
router.get('/', authMiddleware, ConfigController.getAll);
router.get('/:chave', authMiddleware, ConfigController.get);
router.put('/', authMiddleware, validators.configuracao, ConfigController.update);

module.exports = router;

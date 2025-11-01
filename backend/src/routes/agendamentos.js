const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/agendamentoController');
const authMiddleware = require('../middleware/auth');
const validators = require('../utils/validators');

// Rotas públicas
router.post('/', validators.agendamento, AgendamentoController.create);
router.get('/protocolo/:protocolo', AgendamentoController.getByProtocolo);

// Rotas protegidas (apenas admin)
router.get('/', authMiddleware, AgendamentoController.getAll);
router.get('/stats', authMiddleware, AgendamentoController.getStats);
router.get('/:id', authMiddleware, AgendamentoController.getById);
router.patch('/:id/status', authMiddleware, validators.updateStatus, AgendamentoController.updateStatus);
router.put('/:id', authMiddleware, AgendamentoController.update);
router.delete('/:id', authMiddleware, AgendamentoController.delete);

module.exports = router;

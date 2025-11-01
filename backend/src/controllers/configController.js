const Configuracao = require('../models/Configuracao');
const { validationResult } = require('express-validator');

class ConfigController {
  static async getAll(req, res) {
    try {
      const configs = Configuracao.getAll();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  }

  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const configs = Configuracao.setMultiple(req.body);
      res.json(configs);
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      res.status(500).json({ error: 'Erro ao atualizar configurações' });
    }
  }

  static async get(req, res) {
    try {
      const { chave } = req.params;
      const valor = Configuracao.get(chave);

      if (valor === null) {
        return res.status(404).json({ error: 'Configuração não encontrada' });
      }

      res.json({ chave, valor });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar configuração' });
    }
  }
}

module.exports = ConfigController;

const db = require('../config/database');

class Configuracao {
  static get(chave) {
    const result = db.prepare('SELECT valor FROM configuracoes WHERE chave = ?').get(chave);
    return result ? result.valor : null;
  }

  static getAll() {
    const configs = db.prepare('SELECT chave, valor, descricao FROM configuracoes').all();
    return configs.reduce((acc, config) => {
      acc[config.chave] = config.valor;
      return acc;
    }, {});
  }

  static set(chave, valor) {
    db.prepare(`
      INSERT INTO configuracoes (chave, valor, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(chave) DO UPDATE SET valor = ?, updated_at = CURRENT_TIMESTAMP
    `).run(chave, valor, valor);
    return this.get(chave);
  }

  static setMultiple(configs) {
    const stmt = db.prepare(`
      INSERT INTO configuracoes (chave, valor, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(chave) DO UPDATE SET valor = ?, updated_at = CURRENT_TIMESTAMP
    `);

    const transaction = db.transaction((configsArray) => {
      configsArray.forEach(([chave, valor]) => {
        stmt.run(chave, valor, valor);
      });
    });

    transaction(Object.entries(configs));
    return this.getAll();
  }

  static getPrices() {
    return {
      cautelar: parseInt(this.get('preco_cautelar') || '35000'),
      transferencia: parseInt(this.get('preco_transferencia') || '22000'),
      outros: parseInt(this.get('preco_outros') || '10000')
    };
  }

  static getWorkingHours() {
    return {
      inicio: this.get('horario_inicio') || '08:00',
      fim: this.get('horario_fim') || '18:00',
      duracao_slot: parseInt(this.get('duracao_slot') || '60'),
      dias_trabalho: (this.get('dias_trabalho') || '1,2,3,4,5,6').split(',').map(Number)
    };
  }
}

module.exports = Configuracao;

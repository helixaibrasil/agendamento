const db = require('../config/database');

class Veiculo {
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO veiculos (placa, marca, modelo, ano, chassi, cliente_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.placa,
      data.marca,
      data.modelo,
      data.ano,
      data.chassi,
      data.cliente_id
    );
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    return db.prepare(`
      SELECT v.*, c.nome as cliente_nome, c.telefone as cliente_telefone
      FROM veiculos v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      WHERE v.id = ?
    `).get(id);
  }

  static findByPlaca(placa) {
    return db.prepare('SELECT * FROM veiculos WHERE placa = ?').get(placa);
  }

  static findByClienteId(clienteId) {
    return db.prepare('SELECT * FROM veiculos WHERE cliente_id = ?').all(clienteId);
  }

  static findAll(limit = 100, offset = 0) {
    return db.prepare(`
      SELECT v.*, c.nome as cliente_nome
      FROM veiculos v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);
  }

  static update(id, data) {
    const stmt = db.prepare(`
      UPDATE veiculos
      SET placa = ?, marca = ?, modelo = ?, ano = ?, chassi = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(data.placa, data.marca, data.modelo, data.ano, data.chassi, id);
    return this.findById(id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM veiculos WHERE id = ?').run(id);
  }
}

module.exports = Veiculo;

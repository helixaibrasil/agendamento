const db = require('../config/database');

class Cliente {
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO clientes (nome, telefone, email, cpf)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(data.nome, data.telefone, data.email, data.cpf);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    return db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
  }

  static findByCPF(cpf) {
    return db.prepare('SELECT * FROM clientes WHERE cpf = ?').get(cpf);
  }

  static findByEmail(email) {
    return db.prepare('SELECT * FROM clientes WHERE email = ?').get(email);
  }

  static findAll(limit = 100, offset = 0) {
    return db.prepare('SELECT * FROM clientes ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(limit, offset);
  }

  static update(id, data) {
    const stmt = db.prepare(`
      UPDATE clientes
      SET nome = ?, telefone = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(data.nome, data.telefone, data.email, id);
    return this.findById(id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM clientes WHERE id = ?').run(id);
  }

  static count() {
    return db.prepare('SELECT COUNT(*) as total FROM clientes').get().total;
  }
}

module.exports = Cliente;

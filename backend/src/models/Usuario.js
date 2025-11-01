const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.senha, 10);
    const stmt = db.prepare(`
      INSERT INTO usuarios_admin (nome, email, senha_hash)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(data.nome, data.email, hashedPassword);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    return db.prepare('SELECT id, nome, email, ativo, created_at FROM usuarios_admin WHERE id = ?').get(id);
  }

  static findByEmail(email) {
    return db.prepare('SELECT * FROM usuarios_admin WHERE email = ?').get(email);
  }

  static findAll() {
    return db.prepare('SELECT id, nome, email, ativo, created_at FROM usuarios_admin').all();
  }

  static async verifyPassword(senha, hash) {
    return await bcrypt.compare(senha, hash);
  }

  static async updatePassword(id, novaSenha) {
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    db.prepare('UPDATE usuarios_admin SET senha_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(hashedPassword, id);
    return this.findById(id);
  }

  static update(id, data) {
    db.prepare('UPDATE usuarios_admin SET nome = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(data.nome, data.email, id);
    return this.findById(id);
  }

  static toggleStatus(id) {
    db.prepare('UPDATE usuarios_admin SET ativo = NOT ativo, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(id);
    return this.findById(id);
  }
}

module.exports = Usuario;

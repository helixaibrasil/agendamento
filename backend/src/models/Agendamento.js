const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Agendamento {
  static create(data) {
    const protocolo = this.generateProtocolo();
    const stmt = db.prepare(`
      INSERT INTO agendamentos (
        protocolo, cliente_id, veiculo_id, tipo_vistoria,
        data, horario, endereco_vistoria, preco, status, observacoes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      protocolo,
      data.cliente_id,
      data.veiculo_id,
      data.tipo_vistoria,
      data.data,
      data.horario,
      data.endereco_vistoria || null,
      data.preco,
      data.status || 'pendente',
      data.observacoes || null
    );

    return this.findById(result.lastInsertRowid);
  }

  static generateProtocolo() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `VST-${timestamp}-${random}`;
  }

  static findById(id) {
    return db.prepare(`
      SELECT
        a.*,
        c.nome as cliente_nome,
        c.telefone as cliente_telefone,
        c.email as cliente_email,
        c.cpf as cliente_cpf,
        v.placa as veiculo_placa,
        v.marca as veiculo_marca,
        v.modelo as veiculo_modelo,
        v.ano as veiculo_ano,
        p.status as pagamento_status,
        p.tipo_pagamento as pagamento_tipo,
        p.data_pagamento as pagamento_data
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN veiculos v ON a.veiculo_id = v.id
      LEFT JOIN pagamentos p ON a.id = p.agendamento_id
      WHERE a.id = ?
    `).get(id);
  }

  static findByProtocolo(protocolo) {
    return db.prepare(`
      SELECT
        a.*,
        c.nome as cliente_nome,
        c.telefone as cliente_telefone,
        c.email as cliente_email,
        v.placa as veiculo_placa,
        v.marca as veiculo_marca,
        v.modelo as veiculo_modelo,
        v.ano as veiculo_ano
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN veiculos v ON a.veiculo_id = v.id
      WHERE a.protocolo = ?
    `).get(protocolo);
  }

  static findAll(filters = {}) {
    let query = `
      SELECT
        a.*,
        c.nome as cliente_nome,
        c.telefone as cliente_telefone,
        v.placa as veiculo_placa,
        v.marca as veiculo_marca,
        v.modelo as veiculo_modelo,
        p.status as pagamento_status,
        p.tipo_pagamento as pagamento_tipo
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN veiculos v ON a.veiculo_id = v.id
      LEFT JOIN pagamentos p ON a.id = p.agendamento_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.data) {
      query += ' AND a.data = ?';
      params.push(filters.data);
    }

    if (filters.status) {
      query += ' AND a.status = ?';
      params.push(filters.status);
    }

    if (filters.tipo_vistoria) {
      query += ' AND a.tipo_vistoria = ?';
      params.push(filters.tipo_vistoria);
    }

    if (filters.data_inicio && filters.data_fim) {
      query += ' AND a.data BETWEEN ? AND ?';
      params.push(filters.data_inicio, filters.data_fim);
    }

    query += ' ORDER BY a.data DESC, a.horario DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    return db.prepare(query).all(...params);
  }

  static findByDate(data) {
    return db.prepare(`
      SELECT * FROM agendamentos
      WHERE data = ? AND status != 'cancelado'
      ORDER BY horario
    `).all(data);
  }

  static findByDateAndTime(data, horario) {
    return db.prepare(`
      SELECT COUNT(*) as count FROM agendamentos
      WHERE data = ? AND horario = ? AND status != 'cancelado'
    `).get(data, horario);
  }

  static update(id, data) {
    const fields = [];
    const params = [];

    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'protocolo' && key !== 'created_at') {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    });

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE agendamentos SET ${fields.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);
    return this.findById(id);
  }

  static updateStatus(id, status) {
    db.prepare(`
      UPDATE agendamentos
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, id);
    return this.findById(id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM agendamentos WHERE id = ?').run(id);
  }

  static count(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM agendamentos WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.data_inicio && filters.data_fim) {
      query += ' AND data BETWEEN ? AND ?';
      params.push(filters.data_inicio, filters.data_fim);
    }

    return db.prepare(query).get(...params).total;
  }

  static getStats(dataInicio, dataFim) {
    return db.prepare(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pendentes,
        COUNT(CASE WHEN status = 'confirmado' THEN 1 END) as confirmados,
        COUNT(CASE WHEN status = 'realizado' THEN 1 END) as realizados,
        COUNT(CASE WHEN status = 'cancelado' THEN 1 END) as cancelados,
        SUM(preco) as receita_total,
        SUM(CASE WHEN status = 'realizado' THEN preco ELSE 0 END) as receita_realizada
      FROM agendamentos
      WHERE data BETWEEN ? AND ?
    `).get(dataInicio, dataFim);
  }
}

module.exports = Agendamento;

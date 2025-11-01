const db = require('../config/database');

class Pagamento {
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO pagamentos (
        agendamento_id, mp_payment_id, tipo_pagamento, valor, status,
        qr_code, qr_code_base64, payment_method_id, installments,
        dados_pagamento, data_pagamento
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.agendamento_id,
      data.mp_payment_id || null,
      data.tipo_pagamento,
      data.valor,
      data.status || 'pending',
      data.qr_code || null,
      data.qr_code_base64 || null,
      data.payment_method_id || null,
      data.installments || 1,
      data.dados_pagamento ? JSON.stringify(data.dados_pagamento) : null,
      data.data_pagamento || null
    );

    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const payment = db.prepare('SELECT * FROM pagamentos WHERE id = ?').get(id);
    if (payment && payment.dados_pagamento) {
      payment.dados_pagamento = JSON.parse(payment.dados_pagamento);
    }
    return payment;
  }

  static findByAgendamentoId(agendamentoId) {
    const payments = db.prepare('SELECT * FROM pagamentos WHERE agendamento_id = ?').all(agendamentoId);
    return payments.map(p => {
      if (p.dados_pagamento) {
        p.dados_pagamento = JSON.parse(p.dados_pagamento);
      }
      return p;
    });
  }

  static findByMpPaymentId(mpPaymentId) {
    const payment = db.prepare('SELECT * FROM pagamentos WHERE mp_payment_id = ?').get(mpPaymentId);
    if (payment && payment.dados_pagamento) {
      payment.dados_pagamento = JSON.parse(payment.dados_pagamento);
    }
    return payment;
  }

  static update(id, data) {
    const fields = [];
    const values = [];

    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }
    if (data.dados_pagamento !== undefined) {
      fields.push('dados_pagamento = ?');
      values.push(JSON.stringify(data.dados_pagamento));
    }
    if (data.data_pagamento !== undefined) {
      fields.push('data_pagamento = ?');
      values.push(data.data_pagamento);
    }
    if (data.qr_code !== undefined) {
      fields.push('qr_code = ?');
      values.push(data.qr_code);
    }
    if (data.qr_code_base64 !== undefined) {
      fields.push('qr_code_base64 = ?');
      values.push(data.qr_code_base64);
    }

    fields.push('atualizado_em = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE pagamentos
      SET ${fields.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static updateByMpPaymentId(mpPaymentId, data) {
    const payment = this.findByMpPaymentId(mpPaymentId);
    if (!payment) return null;
    return this.update(payment.id, data);
  }
}

module.exports = Pagamento;

const db = require('../config/database');
const fs = require('fs');
const path = require('path');

console.log('🔄 Executando migrations...\n');

// Create tables
const createTables = () => {
  // Tabela de usuários admin
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios_admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha_hash TEXT NOT NULL,
      ativo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tabela usuarios_admin criada');

  // Tabela de clientes
  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      email TEXT NOT NULL,
      cpf TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tabela clientes criada');

  // Tabela de veículos
  db.exec(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      placa TEXT NOT NULL,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      ano INTEGER NOT NULL,
      chassi TEXT,
      cliente_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Tabela veiculos criada');

  // Tabela de agendamentos
  db.exec(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      protocolo TEXT UNIQUE NOT NULL,
      cliente_id INTEGER NOT NULL,
      veiculo_id INTEGER NOT NULL,
      tipo_vistoria TEXT NOT NULL,
      data DATE NOT NULL,
      horario TIME NOT NULL,
      endereco_vistoria TEXT,
      preco INTEGER NOT NULL,
      status TEXT DEFAULT 'pendente',
      observacoes TEXT,
      confirmado_email INTEGER DEFAULT 0,
      lembrete_enviado INTEGER DEFAULT 0,
      pagamento_confirmado INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
      CHECK (status IN ('pendente', 'confirmado', 'realizado', 'cancelado'))
    )
  `);
  console.log('✅ Tabela agendamentos criada');

  // Tabela de configurações
  db.exec(`
    CREATE TABLE IF NOT EXISTS configuracoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chave TEXT UNIQUE NOT NULL,
      valor TEXT NOT NULL,
      descricao TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tabela configuracoes criada');

  // Tabela de horários bloqueados
  db.exec(`
    CREATE TABLE IF NOT EXISTS horarios_bloqueados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data DATE NOT NULL,
      horario_inicio TIME,
      horario_fim TIME,
      motivo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Tabela horarios_bloqueados criada');

  // Tabela de logs de email
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agendamento_id INTEGER,
      tipo TEXT NOT NULL,
      destinatario TEXT NOT NULL,
      assunto TEXT NOT NULL,
      enviado INTEGER DEFAULT 0,
      erro TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Tabela email_logs criada');

  // Tabela de pagamentos
  db.exec(`
    CREATE TABLE IF NOT EXISTS pagamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agendamento_id INTEGER NOT NULL,
      mp_payment_id TEXT,
      tipo_pagamento TEXT NOT NULL CHECK(tipo_pagamento IN ('pix', 'credito', 'debito')),
      valor INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded')),
      qr_code TEXT,
      qr_code_base64 TEXT,
      payment_method_id TEXT,
      installments INTEGER DEFAULT 1,
      dados_pagamento TEXT,
      data_pagamento DATETIME,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Tabela pagamentos criada');

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data);
    CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
    CREATE INDEX IF NOT EXISTS idx_agendamentos_protocolo ON agendamentos(protocolo);
    CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);
    CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
    CREATE INDEX IF NOT EXISTS idx_pagamentos_agendamento ON pagamentos(agendamento_id);
    CREATE INDEX IF NOT EXISTS idx_pagamentos_mp_payment ON pagamentos(mp_payment_id);
    CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
  `);
  console.log('✅ Índices criados');
};

try {
  createTables();
  console.log('\n✅ Migrations executadas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao executar migrations:', error);
  process.exit(1);
}

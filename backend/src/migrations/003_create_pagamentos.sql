-- Criar tabela de pagamentos
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
);

-- Adicionar campos de pagamento na tabela agendamentos
ALTER TABLE agendamentos ADD COLUMN pagamento_confirmado INTEGER DEFAULT 0;
ALTER TABLE agendamentos ADD COLUMN preco INTEGER;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pagamentos_agendamento ON pagamentos(agendamento_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_mp_payment ON pagamentos(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);

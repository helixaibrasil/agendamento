const db = require('../config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log('🌱 Populando banco de dados com dados iniciais...\n');

const seed = async () => {
  try {
    // Inserir configurações padrão
    const configStmt = db.prepare(`
      INSERT OR REPLACE INTO configuracoes (chave, valor, descricao)
      VALUES (?, ?, ?)
    `);

    const configs = [
      ['horario_inicio', '08:00', 'Horário de início do expediente'],
      ['horario_fim', '18:00', 'Horário de fim do expediente'],
      ['duracao_slot', '60', 'Duração de cada slot em minutos'],
      ['dias_trabalho', '1,2,3,4,5,6', 'Dias da semana que funcionam (0=Dom, 6=Sáb)'],
      ['antecedencia_minima', '2', 'Horas mínimas de antecedência para agendamento'],
      ['antecedencia_maxima', '30', 'Dias máximos de antecedência para agendamento'],
      ['preco_cautelar', '15000', 'Preço vistoria cautelar (centavos)'],
      ['preco_transferencia', '12000', 'Preço vistoria transferência (centavos)'],
      ['preco_outros', '10000', 'Preço outros tipos de vistoria (centavos)'],
      ['vagas_por_horario', '3', 'Número máximo de agendamentos por horário'],
      ['email_confirmacao_ativo', 'true', 'Enviar email de confirmação automático'],
      ['email_lembrete_ativo', 'true', 'Enviar email de lembrete 24h antes'],
      ['notificacao_email_confirmacao', 'true', 'Enviar email de confirmação (usado pelo painel admin)'],
      ['notificacao_lembrete_24h', 'true', 'Enviar lembrete 24h antes (usado pelo painel admin)'],
    ];

    configs.forEach(([chave, valor, descricao]) => {
      configStmt.run(chave, valor, descricao);
    });
    console.log('✅ Configurações inseridas');

    // Criar usuário admin padrão
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vistoria.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
    const adminName = process.env.ADMIN_NAME || 'Administrador';

    const existingAdmin = db.prepare('SELECT id FROM usuarios_admin WHERE email = ?').get(adminEmail);

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      db.prepare(`
        INSERT INTO usuarios_admin (nome, email, senha_hash)
        VALUES (?, ?, ?)
      `).run(adminName, adminEmail, hashedPassword);
      console.log('✅ Usuário admin criado');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Senha: ${adminPassword}`);
      console.log('   ⚠️  ALTERE A SENHA APÓS O PRIMEIRO LOGIN!');
    } else {
      console.log('ℹ️  Usuário admin já existe');
    }

    // Inserir dados de teste (clientes e agendamentos exemplo)
    const clienteStmt = db.prepare(`
      INSERT OR IGNORE INTO clientes (nome, telefone, email, cpf)
      VALUES (?, ?, ?, ?)
    `);

    const clientesTeste = [
      ['João Silva', '(11) 98765-4321', 'joao@email.com', '123.456.789-00'],
      ['Maria Santos', '(11) 97654-3210', 'maria@email.com', '987.654.321-00'],
      ['Pedro Oliveira', '(11) 96543-2109', 'pedro@email.com', '456.789.123-00'],
      ['Ana Costa', '(11) 95432-1098', 'ana.costa@email.com', '234.567.890-11'],
      ['Carlos Ferreira', '(11) 94321-0987', 'carlos.f@email.com', '345.678.901-22'],
      ['Juliana Lima', '(11) 93210-9876', 'juliana.lima@email.com', '456.789.012-33'],
      ['Roberto Alves', '(11) 92109-8765', 'roberto.alves@email.com', '567.890.123-44'],
      ['Fernanda Rocha', '(11) 91098-7654', 'fernanda.r@email.com', '678.901.234-55'],
      ['Lucas Martins', '(11) 90987-6543', 'lucas.martins@email.com', '789.012.345-66'],
      ['Patricia Souza', '(11) 99876-5432', 'patricia.s@email.com', '890.123.456-77'],
    ];

    clientesTeste.forEach(cliente => {
      try {
        clienteStmt.run(...cliente);
      } catch (e) {
        // Ignora se já existe
      }
    });
    console.log('✅ Clientes de teste inseridos');

    // Inserir veículos de teste
    const clientes = db.prepare('SELECT id FROM clientes').all();

    if (clientes.length > 0) {
      const veiculoStmt = db.prepare(`
        INSERT OR IGNORE INTO veiculos (placa, marca, modelo, ano, chassi, cliente_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const veiculosTeste = [
        ['ABC-1234', 'Toyota', 'Corolla', 2020, '9BWZZZ377VT004251', clientes[0].id],
        ['DEF-5678', 'Honda', 'Civic', 2019, '2HGFG12828H501234', clientes[1]?.id || clientes[0].id],
        ['GHI-9012', 'Volkswagen', 'Gol', 2021, '9BWAA05U6BP000001', clientes[2]?.id || clientes[0].id],
        ['JKL-3456', 'Fiat', 'Uno', 2018, '8AP355000X123456', clientes[3]?.id || clientes[0].id],
        ['MNO-7890', 'Chevrolet', 'Onix', 2022, '9BGRD48B0MG123456', clientes[4]?.id || clientes[0].id],
        ['PQR-1122', 'Hyundai', 'HB20', 2020, 'KMHCT41FBJU123456', clientes[5]?.id || clientes[0].id],
        ['STU-3344', 'Renault', 'Kwid', 2021, '93YJSRD45MJ123456', clientes[6]?.id || clientes[0].id],
        ['VWX-5566', 'Ford', 'Ka', 2019, '9BFZF55G0K1234567', clientes[7]?.id || clientes[0].id],
        ['YZA-7788', 'Nissan', 'March', 2020, '94DBFBA20LW123456', clientes[8]?.id || clientes[0].id],
        ['BCD-9900', 'Jeep', 'Compass', 2022, '3C4NJDCB4MT123456', clientes[9]?.id || clientes[0].id],
      ];

      veiculosTeste.forEach(veiculo => {
        try {
          veiculoStmt.run(...veiculo);
        } catch (e) {
          // Ignora se já existe
        }
      });
      console.log('✅ Veículos de teste inseridos');

      // Inserir agendamentos de teste
      const veiculos = db.prepare('SELECT id, cliente_id FROM veiculos').all();

      if (veiculos.length > 0) {
        const agendamentoStmt = db.prepare(`
          INSERT OR IGNORE INTO agendamentos (
            protocolo, cliente_id, veiculo_id, tipo_vistoria,
            data, horario, preco, status, observacoes, pagamento_confirmado
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const hoje = new Date();

        const formatDate = (date) => {
          return date.toISOString().split('T')[0];
        };

        const getDateOffset = (days) => {
          const date = new Date(hoje);
          date.setDate(hoje.getDate() + days);
          return formatDate(date);
        };

        const tipos = ['cautelar', 'transferencia', 'outros'];
        const status = ['pendente', 'confirmado', 'realizado', 'cancelado'];
        const horarios = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

        const agendamentosTeste = [
          // Agendamentos passados (realizados)
          ['VST-2024-001', veiculos[0].cliente_id, veiculos[0].id, 'cautelar', getDateOffset(-30), '09:00', 15000, 'realizado', 'Vistoria cautelar realizada', 1],
          ['VST-2024-002', veiculos[1]?.cliente_id || veiculos[0].cliente_id, veiculos[1]?.id || veiculos[0].id, 'transferencia', getDateOffset(-25), '10:00', 12000, 'realizado', 'Transferência concluída', 1],
          ['VST-2024-003', veiculos[2]?.cliente_id || veiculos[0].cliente_id, veiculos[2]?.id || veiculos[0].id, 'cautelar', getDateOffset(-20), '14:00', 15000, 'realizado', 'Cliente pontual', 1],
          ['VST-2024-004', veiculos[3]?.cliente_id || veiculos[0].cliente_id, veiculos[3]?.id || veiculos[0].id, 'outros', getDateOffset(-15), '11:00', 10000, 'realizado', 'Vistoria para seguro', 1],
          ['VST-2024-005', veiculos[4]?.cliente_id || veiculos[0].cliente_id, veiculos[4]?.id || veiculos[0].id, 'transferencia', getDateOffset(-10), '13:00', 12000, 'realizado', 'Documentação ok', 1],

          // Agendamentos cancelados
          ['VST-2024-006', veiculos[5]?.cliente_id || veiculos[0].cliente_id, veiculos[5]?.id || veiculos[0].id, 'cautelar', getDateOffset(-5), '15:00', 15000, 'cancelado', 'Cliente cancelou', 0],
          ['VST-2024-007', veiculos[6]?.cliente_id || veiculos[0].cliente_id, veiculos[6]?.id || veiculos[0].id, 'outros', getDateOffset(-3), '16:00', 10000, 'cancelado', 'Reagendado', 0],

          // Agendamentos de hoje
          ['VST-2024-008', veiculos[7]?.cliente_id || veiculos[0].cliente_id, veiculos[7]?.id || veiculos[0].id, 'cautelar', getDateOffset(0), '09:00', 15000, 'confirmado', 'Agendamento do dia', 1],
          ['VST-2024-009', veiculos[8]?.cliente_id || veiculos[0].cliente_id, veiculos[8]?.id || veiculos[0].id, 'transferencia', getDateOffset(0), '14:00', 12000, 'pendente', 'Aguardando confirmação', 0],

          // Agendamentos futuros
          ['VST-2024-010', veiculos[9]?.cliente_id || veiculos[0].cliente_id, veiculos[9]?.id || veiculos[0].id, 'cautelar', getDateOffset(1), '10:00', 15000, 'confirmado', 'Agendado para amanhã', 1],
          ['VST-2024-011', veiculos[0].cliente_id, veiculos[0].id, 'outros', getDateOffset(2), '11:00', 10000, 'pendente', 'Segunda vistoria', 0],
          ['VST-2024-012', veiculos[1]?.cliente_id || veiculos[0].cliente_id, veiculos[1]?.id || veiculos[0].id, 'transferencia', getDateOffset(3), '13:00', 12000, 'confirmado', 'Venda de veículo', 1],
          ['VST-2024-013', veiculos[2]?.cliente_id || veiculos[0].cliente_id, veiculos[2]?.id || veiculos[0].id, 'cautelar', getDateOffset(5), '15:00', 15000, 'pendente', 'Renovação anual', 0],
          ['VST-2024-014', veiculos[3]?.cliente_id || veiculos[0].cliente_id, veiculos[3]?.id || veiculos[0].id, 'outros', getDateOffset(7), '09:00', 10000, 'confirmado', 'Vistoria pré-compra', 1],
          ['VST-2024-015', veiculos[4]?.cliente_id || veiculos[0].cliente_id, veiculos[4]?.id || veiculos[0].id, 'transferencia', getDateOffset(10), '16:00', 12000, 'pendente', 'Aguardando documentos', 0],
          ['VST-2024-016', veiculos[5]?.cliente_id || veiculos[0].cliente_id, veiculos[5]?.id || veiculos[0].id, 'cautelar', getDateOffset(12), '10:00', 15000, 'confirmado', 'Cliente indicado', 1],
          ['VST-2024-017', veiculos[6]?.cliente_id || veiculos[0].cliente_id, veiculos[6]?.id || veiculos[0].id, 'outros', getDateOffset(15), '14:00', 10000, 'pendente', 'Vistoria especial', 0],
        ];

        agendamentosTeste.forEach(agendamento => {
          try {
            agendamentoStmt.run(...agendamento);
          } catch (e) {
            // Ignora se já existe
          }
        });
        console.log('✅ Agendamentos de teste inseridos');
      }
    }

    console.log('\n✅ Seed executado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

seed();

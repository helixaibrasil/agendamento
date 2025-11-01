const Agendamento = require('../models/Agendamento');
const Configuracao = require('../models/Configuracao');
const db = require('../config/database');
const { addDays, format, parse, isAfter, isBefore, addHours } = require('date-fns');

class AvailabilityService {
  static getAvailableSlots(data) {
    const config = Configuracao.getWorkingHours();
    const vagasPorHorario = parseInt(Configuracao.get('vagas_por_horario') || '3');
    const agendamentosNaData = Agendamento.findByDate(data);

    const slots = [];
    const [horaInicio, minutoInicio] = config.inicio.split(':').map(Number);
    const [horaFim, minutoFim] = config.fim.split(':').map(Number);

    let currentTime = new Date();
    currentTime.setHours(horaInicio, minutoInicio, 0, 0);

    const endTime = new Date();
    endTime.setHours(horaFim, minutoFim, 0, 0);

    while (currentTime < endTime) {
      const horario = format(currentTime, 'HH:mm');

      // Verificar horários bloqueados
      const bloqueado = db.prepare(`
        SELECT * FROM horarios_bloqueados
        WHERE data = ? AND (
          (horario_inicio IS NULL AND horario_fim IS NULL) OR
          (? >= horario_inicio AND ? < horario_fim)
        )
      `).get(data, horario, horario);

      if (!bloqueado) {
        const agendamentosNoHorario = agendamentosNaData.filter(a => a.horario === horario);
        const vagasDisponiveis = vagasPorHorario - agendamentosNoHorario.length;

        slots.push({
          horario,
          disponivel: vagasDisponiveis > 0,
          vagasDisponiveis,
          vagasTotal: vagasPorHorario
        });
      }

      currentTime = new Date(currentTime.getTime() + config.duracao_slot * 60000);
    }

    return slots;
  }

  static isSlotAvailable(data, horario) {
    const slots = this.getAvailableSlots(data);
    const slot = slots.find(s => s.horario === horario);
    return slot ? slot.disponivel : false;
  }

  static canSchedule(data, horario) {
    const antecedenciaMinima = parseInt(Configuracao.get('antecedencia_minima') || '2');
    const antecedenciaMaxima = parseInt(Configuracao.get('antecedencia_maxima') || '30');

    const agora = new Date();
    const dataAgendamento = parse(`${data} ${horario}`, 'yyyy-MM-dd HH:mm', new Date());

    // Verificar antecedência mínima
    const minimoPermitido = addHours(agora, antecedenciaMinima);
    if (isBefore(dataAgendamento, minimoPermitido)) {
      return {
        allowed: false,
        reason: `É necessário agendar com pelo menos ${antecedenciaMinima} horas de antecedência`
      };
    }

    // Verificar antecedência máxima
    const maximoPermitido = addDays(agora, antecedenciaMaxima);
    if (isAfter(dataAgendamento, maximoPermitido)) {
      return {
        allowed: false,
        reason: `Não é possível agendar com mais de ${antecedenciaMaxima} dias de antecedência`
      };
    }

    // Verificar dia da semana
    const diaSemana = dataAgendamento.getDay();
    const config = Configuracao.getWorkingHours();
    if (!config.dias_trabalho.includes(diaSemana)) {
      return {
        allowed: false,
        reason: 'Não trabalhamos neste dia da semana'
      };
    }

    // Verificar disponibilidade
    if (!this.isSlotAvailable(data, horario)) {
      return {
        allowed: false,
        reason: 'Horário não disponível'
      };
    }

    return { allowed: true };
  }

  static getAvailableDates(days = 30) {
    const config = Configuracao.getWorkingHours();
    const dates = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = addDays(today, i);
      const diaSemana = date.getDay();

      if (config.dias_trabalho.includes(diaSemana)) {
        const dataFormatada = format(date, 'yyyy-MM-dd');

        // Verificar se o dia inteiro está bloqueado
        const diaBloqueado = db.prepare(`
          SELECT * FROM horarios_bloqueados
          WHERE data = ? AND horario_inicio IS NULL AND horario_fim IS NULL
        `).get(dataFormatada);

        if (!diaBloqueado) {
          const slots = this.getAvailableSlots(dataFormatada);
          const slotsDisponiveis = slots.filter(s => s.disponivel).length;

          dates.push({
            data: dataFormatada,
            diaSemana,
            slotsDisponiveis,
            slotsTotal: slots.length
          });
        }
      }
    }

    return dates;
  }
}

module.exports = AvailabilityService;

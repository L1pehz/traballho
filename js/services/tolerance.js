// Módulo de Validação das Janelas de Horário e Regras de Negócio de Batida de Ponto

/**
 * Converte string no formato "HH:MM:SS" ou "HH:MM" para minutos desde o início do dia
 * @param {string} timeStr
 * @returns {number}
 */
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  return hours * 60 + minutes;
}

/**
 * Avalia se o horário atual está dentro das janelas de entrada ou saída permitidas
 *
 * @param {Date} dateObj - Objeto Date com o horário atual da tentativa
 * @param {Object} janelas - Objeto contendo janela_entrada_inicio, janela_entrada_fim, janela_saida_inicio, janela_saida_fim
 * @returns {Object} Resultado da validação: { valido: boolean, tipoRegistro: 'ENTRADA'|'SAIDA'|null, motivoBloqueio: string|null }
 */
export function validarJanelaHorario(dateObj, janelas) {
  if (!janelas) {
    // Se não houver configuração de janela específica, por padrão não é permitido
    return {
      valido: false,
      tipoRegistro: null,
      motivoBloqueio: 'TENTATIVA_FORA_JANELA_ENTRADA'
    };
  }

  const horaAtualMinutos = dateObj.getHours() * 60 + dateObj.getMinutes();

  const entradaInicio = timeStringToMinutes(janelas.janela_entrada_inicio);
  const entradaFim = timeStringToMinutes(janelas.janela_entrada_fim);

  const saidaInicio = timeStringToMinutes(janelas.janela_saida_inicio);
  const saidaFim = timeStringToMinutes(janelas.janela_saida_fim);

  // Validação Janela de Entrada
  if (horaAtualMinutos >= entradaInicio && horaAtualMinutos <= entradaFim) {
    return {
      valido: true,
      tipoRegistro: 'ENTRADA',
      motivoBloqueio: null
    };
  }

  // Validação Janela de Saída
  if (horaAtualMinutos >= saidaInicio && horaAtualMinutos <= saidaFim) {
    return {
      valido: true,
      tipoRegistro: 'SAIDA',
      motivoBloqueio: null
    };
  }

  // Se estiver fora da janela de entrada ou saída:
  // Determina se a tentativa foi mais próxima do horário de entrada ou de saída para classificar o tipo de ocorrência
  const centroEntrada = (entradaInicio + entradaFim) / 2;
  const centroSaida = (saidaInicio + saidaFim) / 2;

  const distEntrada = Math.abs(horaAtualMinutos - centroEntrada);
  const distSaida = Math.abs(horaAtualMinutos - centroSaida);

  const motivoBloqueio = distEntrada <= distSaida
    ? 'TENTATIVA_FORA_JANELA_ENTRADA'
    : 'TENTATIVA_FORA_JANELA_SAIDA';

  return {
    valido: false,
    tipoRegistro: null,
    motivoBloqueio: motivoBloqueio
  };
}

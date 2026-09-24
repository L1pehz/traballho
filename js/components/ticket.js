// Componente de Formatação e Renderização de Comprovante de Ponto

/**
 * Gera o HTML formatado para o ticket de comprovante de ponto
 * @param {Object} dados
 * @param {string} dados.nome
 * @param {string} dados.matricula
 * @param {string} dados.tipoRegistro 'ENTRADA' | 'SAIDA'
 * @param {string|Date} dados.dataHora
 * @param {string} dados.hashComprovante
 * @returns {string} HTML do comprovante
 */
export function renderTicketHTML({ nome, matricula, tipoRegistro, dataHora, hashComprovante }) {
  const dt = new Date(dataHora);
  const dataFormatada = dt.toLocaleDateString('pt-BR');
  const horaFormatada = dt.toLocaleTimeString('pt-BR');

  return `
    <div id="printable-ticket" class="ticket-preview">
      <div class="ticket-header">
        <strong>COMPROVANTE DE REGISTRO DE PONTO</strong><br>
        <small>Sistema de Controle Frequência</small>
      </div>
      <div class="ticket-body">
        <div class="ticket-row">
          <span>Funcionário:</span>
          <strong>${nome}</strong>
        </div>
        <div class="ticket-row">
          <span>Matrícula:</span>
          <span>${matricula}</span>
        </div>
        <div class="ticket-row">
          <span>Operação:</span>
          <strong>${tipoRegistro}</strong>
        </div>
        <div class="ticket-row">
          <span>Data:</span>
          <span>${dataFormatada}</span>
        </div>
        <div class="ticket-row">
          <span>Hora:</span>
          <span>${horaFormatada}</span>
        </div>
      </div>
      <div class="ticket-footer">
        <div>Autenticação Digital:</div>
        <strong style="word-break: break-all; font-size: 0.7rem;">${hashComprovante}</strong>
      </div>
    </div>
  `;
}

/**
 * Aciona a caixa de diálogo de impressão para o comprovante
 */
export function imprimirTicket() {
  window.print();
}

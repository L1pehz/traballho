// Controlador Principal da Aplicação Terminal de Ponto (Kiosk)

import { CameraService } from './services/camera.js';
import { decodeQRCodeFromImageData } from './services/qrcode.js';
import { validarJanelaHorario } from './services/tolerance.js';
import {
  buscarFuncionarioPorQRCode,
  buscarJanelasHorario,
  registrarPonto,
  registrarOcorrencia
} from './services/supabase.js';
import { renderTicketHTML, imprimirTicket } from './components/ticket.js';
import { renderIcons } from './components/icons.js';

class KioskApp {
  constructor() {
    this.videoElement = document.getElementById('camera-video');
    this.canvasElement = document.getElementById('camera-canvas');
    this.statusContainer = document.getElementById('status-container');
    this.feedbackArea = document.getElementById('feedback-area');
    this.ticketActions = document.getElementById('ticket-actions');
    this.btnPrint = document.getElementById('btn-print');
    this.currentTimeDisplay = document.getElementById('current-time');

    this.cameraService = new CameraService(this.videoElement, this.canvasElement);
    this.isProcessing = false;
    this.scanInterval = null;
    this.lastScannedCode = null;
    this.lastScanTime = 0;
  }

  async init() {
    renderIcons();
    this.startClock();
    this.setupEventListeners();

    try {
      await this.cameraService.startCamera();
      this.startScanning();
    } catch (error) {
      this.showStatus('danger', 'camera-off', 'Erro de Câmera: ' + error.message);
    }
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      this.currentTimeDisplay.textContent = now.toLocaleTimeString('pt-BR');
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  setupEventListeners() {
    if (this.btnPrint) {
      this.btnPrint.addEventListener('click', () => {
        imprimirTicket();
      });
    }
  }

  startScanning() {
    this.scanInterval = setInterval(() => {
      if (this.isProcessing) return;

      const imageData = this.cameraService.getFrameImageData();
      if (!imageData) return;

      const qrcodeData = decodeQRCodeFromImageData(imageData);
      if (qrcodeData) {
        const now = Date.now();
        // Evita leituras duplicadas seguidas em menos de 4 segundos
        if (this.lastScannedCode === qrcodeData && (now - this.lastScanTime) < 4000) {
          return;
        }

        this.lastScannedCode = qrcodeData;
        this.lastScanTime = now;
        this.handleQRCodeRead(qrcodeData);
      }
    }, 300); // 300ms
  }

  async handleQRCodeRead(qrcodeHash) {
    this.isProcessing = true;
    this.showStatus('warning', 'loader', 'Processando leitura de QR Code...');

    // Captura o snapshot atual para auditoria/comprovante
    const photoBase64 = this.cameraService.captureSnapshot() || '';

    try {
      // 1. Buscar Funcionário
      const funcionario = await buscarFuncionarioPorQRCode(qrcodeHash);

      if (!funcionario) {
        // QR Code Inválido ou Funcionário Inativo
        await registrarOcorrencia({
          funcionarioId: null,
          qrcodeLido: qrcodeHash,
          tipoOcorrencia: 'QRCODE_INVALIDO',
          fotoUrl: photoBase64
        });

        this.showStatus('danger', 'x-circle', 'Acesso Negado: QR Code inválido ou não cadastrado.');
        this.clearFeedbackArea('QR Code Desconhecido');
        this.resetProcessingAfter(3500);
        return;
      }

      // 2. Buscar Janelas de Horário
      const janelas = await buscarJanelasHorario(funcionario.id);
      const dataHoraAtual = new Date();

      // 3. Validação de Janela de Horário
      const validacao = validarJanelaHorario(dataHoraAtual, janelas);

      if (!validacao.valido) {
        // Tentativa fora da janela de horário -> Bloquear e Registrar Ocorrência
        await registrarOcorrencia({
          funcionarioId: funcionario.id,
          qrcodeLido: qrcodeHash,
          tipoOcorrencia: validacao.motivoBloqueio,
          fotoUrl: photoBase64
        });

        const msg = validacao.motivoBloqueio === 'TENTATIVA_FORA_JANELA_ENTRADA'
          ? `Horário não permitido para entrada. Fora da janela de tolerância.`
          : `Horário não permitido para saída. Fora da janela de tolerância.`;

        this.showStatus('danger', 'clock-alert', `PONTO BLOQUEADO (${funcionario.nome}): ${msg}`);
        this.clearFeedbackArea('Batida fora da Janela Permitida');
        this.resetProcessingAfter(4000);
        return;
      }

      // 4. Batida Aprovada -> Gerar Hash Comprovante e Registrar Ponto
      const hashComprovante = this.generateHashComprovante(funcionario.id, dataHoraAtual);

      const registro = await registrarPonto({
        funcionarioId: funcionario.id,
        tipoRegistro: validacao.tipoRegistro,
        fotoUrl: photoBase64,
        hashComprovante: hashComprovante
      });

      // 5. Sucesso -> Exibir Feedback e Imprimir Ticket
      this.showStatus('success', 'check-circle', `Ponto Registrado com Sucesso! Operação: ${validacao.tipoRegistro}`);

      const ticketHtml = renderTicketHTML({
        nome: funcionario.nome,
        matricula: funcionario.matricula,
        tipoRegistro: validacao.tipoRegistro,
        dataHora: registro.data_hora || dataHoraAtual,
        hashComprovante: hashComprovante
      });

      this.feedbackArea.innerHTML = ticketHtml;
      this.ticketActions.style.display = 'flex';
      renderIcons();

      // Auto impressao (conforme SPEC: "um ticket seja impresso")
      setTimeout(() => {
        imprimirTicket();
      }, 500);

      this.resetProcessingAfter(6000);

    } catch (error) {
      console.error('Erro no fluxo de ponto:', error);
      this.showStatus('danger', 'alert-triangle', 'Erro no processamento. Tente novamente.');
      this.resetProcessingAfter(3000);
    }
  }

  generateHashComprovante(funcionarioId, dateObj) {
    const str = `${funcionarioId}-${dateObj.getTime()}-${Math.random()}`;
    // Hash simples para representação do comprovante
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'AUTH-' + Math.abs(hash).toString(16).toUpperCase() + '-' + dateObj.getTime();
  }

  showStatus(type, iconName, text) {
    this.statusContainer.className = `alert alert-${type}`;
    this.statusContainer.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${text}</span>
    `;
    renderIcons();
  }

  clearFeedbackArea(motivo) {
    this.ticketActions.style.display = 'none';
    this.feedbackArea.innerHTML = `
      <div class="ticket-preview" style="text-align: center; color: var(--danger);">
        <i data-lucide="shield-alert" style="width: 48px; height: 48px; margin: 0 auto 1rem;"></i>
        <p><strong>REGISTRO BLOQUEADO</strong></p>
        <p><small>${motivo}</small></p>
      </div>
    `;
    renderIcons();
  }

  resetProcessingAfter(ms) {
    setTimeout(() => {
      this.isProcessing = false;
      this.showStatus('warning', 'info', 'Aproxime o QR Code do seu crachá em frente à câmera...');
    }, ms);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new KioskApp();
  app.init();
});

// Módulo para gerenciamento do acesso à Câmera via Web MediaDevices API e captura de imagem

export class CameraService {
  constructor(videoElement, canvasElement) {
    this.video = videoElement;
    this.canvas = canvasElement || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.stream = null;
  }

  /**
   * Inicializa o fluxo da câmera no elemento de vídeo
   */
  async startCamera() {
    if (this.stream) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Câmera frontal do tablet/kiosk
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      this.video.srcObject = this.stream;
      await this.video.play();
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      throw new Error('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  }

  /**
   * Interrompe a captura da câmera
   */
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.video.srcObject = null;
    }
  }

  /**
   * Captura o frame atual do vídeo no formato de uma imagem Base64 JPEG
   * @returns {string} Data URL da imagem capturada (image/jpeg)
   */
  captureSnapshot() {
    if (!this.video || !this.video.videoWidth) {
      return null;
    }

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    return this.canvas.toDataURL('image/jpeg', 0.85);
  }

  /**
   * Obtém os dados da imagem em ImageData do canvas atual (útil para jsQR)
   * @returns {ImageData|null}
   */
  getFrameImageData() {
    if (!this.video || !this.video.videoWidth || this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
      return null;
    }

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
}

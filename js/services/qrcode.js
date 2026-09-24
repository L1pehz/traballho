// Módulo de Leitura e Decodificação de QR Code utilizando a biblioteca jsQR

import jsQR from 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/+esm';

/**
 * Tenta decodificar um QR Code a partir de um objeto ImageData
 * @param {ImageData} imageData
 * @returns {string|null} O conteúdo texto/hash do QR Code ou null se não detectado
 */
export function decodeQRCodeFromImageData(imageData) {
  if (!imageData || !imageData.data) {
    return null;
  }

  const code = jsQR(
    imageData.data,
    imageData.width,
    imageData.height,
    {
      inversionAttempts: 'dontInvert'
    }
  );

  if (code && code.data) {
    return code.data.trim();
  }

  return null;
}

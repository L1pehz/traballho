// App.js - Controlador do Simulador do Assistente de Segurança Pessoal

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização do Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Relógio do Cabeçalho
  const updateClock = () => {
    const clockEl = document.getElementById('current-time');
    if (clockEl) {
      clockEl.textContent = new Date().toLocaleTimeString('pt-BR');
    }
  };
  setInterval(updateClock, 1000);
  updateClock();

  // Histórico de Eventos em Memória da Sessão
  const eventHistory = [];

  const addHistoryEvent = (eventType) => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const newEntry = { id: Date.now(), timestamp, type: eventType };
    eventHistory.unshift(newEntry);
    renderHistory();
  };

  const renderHistory = () => {
    const historyList = document.getElementById('history-list-items');
    const counterEl = document.getElementById('history-counter');

    if (counterEl) {
      counterEl.textContent = eventHistory.length;
    }

    if (!historyList) return;

    if (eventHistory.length === 0) {
      historyList.innerHTML = `<li class="empty-history">Nenhum evento registrado até o momento.</li>`;
      return;
    }

    historyList.innerHTML = eventHistory.map(item => `
      <li class="history-item">
        <span><strong>${item.type}</strong></span>
        <span class="text-muted"><small>${item.timestamp}</small></span>
      </li>
    `).join('');
  };

  // 1. Controle de Navegação entre Telas
  const navButtons = document.querySelectorAll('.nav-btn, .nav-quick');
  const screens = document.querySelectorAll('.app-screen');

  const switchScreen = (targetScreenId) => {
    screens.forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.screen === targetScreenId);
    });

    const activeScreen = document.getElementById(targetScreenId);
    if (activeScreen) {
      activeScreen.classList.add('active');
    }
  };

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen || btn.dataset.target;
      if (target) switchScreen(target);
    });
  });

  // 2. Funcionalidade 1: Botão SOS com Contagem Regressiva de 5s
  const btnSosMain = document.getElementById('btn-sos-main');
  const btnCancelSos = document.getElementById('btn-cancel-sos');
  const countdownBox = document.getElementById('sos-countdown-container');
  const countdownNum = document.getElementById('countdown-number');
  const sosBadge = document.getElementById('sos-status-badge');

  let sosTimer = null;
  let countdownSeconds = 5;

  if (btnSosMain) {
    btnSosMain.addEventListener('click', () => {
      if (sosTimer) return; // Já em contagem

      countdownSeconds = 5;
      if (countdownNum) countdownNum.textContent = countdownSeconds;
      if (countdownBox) countdownBox.classList.remove('hidden');

      if (sosBadge) {
        sosBadge.className = 'badge badge-alert';
        sosBadge.textContent = 'Status: Contagem de Confirmação SOS...';
      }

      sosTimer = setInterval(() => {
        countdownSeconds--;
        if (countdownNum) countdownNum.textContent = countdownSeconds;

        if (countdownSeconds <= 0) {
          clearInterval(sosTimer);
          sosTimer = null;
          if (countdownBox) countdownBox.classList.add('hidden');

          if (sosBadge) {
            sosBadge.className = 'badge badge-alert';
            sosBadge.textContent = '🚨 Status: EMERGÊNCIA DISPARADA!';
          }

          addHistoryEvent('Acionamento de Emergência SOS');
          alert('🚨 ALERTA SOS REGISTRADO E DISPARADO COM SUCESSO!');
        }
      }, 1000);
    });
  }

  if (btnCancelSos) {
    btnCancelSos.addEventListener('click', () => {
      if (sosTimer) {
        clearInterval(sosTimer);
        sosTimer = null;
      }
      if (countdownBox) countdownBox.classList.add('hidden');

      if (sosBadge) {
        sosBadge.className = 'badge badge-safe';
        sosBadge.textContent = 'Status: Monitoramento Ativo (SOS Cancelado)';
      }

      addHistoryEvent('Cancelamento de SOS pelo usuário');
    });
  }

  // 3. Funcionalidade 2: Localização GPS
  const btnUpdateGps = document.getElementById('btn-update-gps');
  const btnOpenMaps = document.getElementById('btn-open-maps');
  const btnToggleGpsError = document.getElementById('btn-toggle-gps-error');
  const labelLat = document.getElementById('label-latitude');
  const labelLng = document.getElementById('label-longitude');
  const labelGpsStatus = document.getElementById('label-gps-status');

  let simulatedLat = -23.550520;
  let simulatedLng = -46.633308;
  let isGpsError = false;

  if (btnUpdateGps) {
    btnUpdateGps.addEventListener('click', () => {
      if (isGpsError) {
        alert('Erro: GPS Indisponível ou Desativado!');
        return;
      }
      simulatedLat += (Math.random() - 0.5) * 0.001;
      simulatedLng += (Math.random() - 0.5) * 0.001;

      if (labelLat) labelLat.textContent = simulatedLat.toFixed(6);
      if (labelLng) labelLng.textContent = simulatedLng.toFixed(6);

      addHistoryEvent(`Coordenadas Atualizadas (${simulatedLat.toFixed(4)}, ${simulatedLng.toFixed(4)})`);
    });
  }

  if (btnOpenMaps) {
    btnOpenMaps.addEventListener('click', () => {
      if (isGpsError) {
        alert('Não é possível abrir o mapa sem coordenadas válidas de GPS.');
        return;
      }
      const url = `https://www.google.com/maps/search/?api=1&query=${simulatedLat},${simulatedLng}`;
      window.open(url, '_blank');
      addHistoryEvent('Abertura da localização no Google Maps');
    });
  }

  if (btnToggleGpsError) {
    btnToggleGpsError.addEventListener('click', () => {
      isGpsError = !isGpsError;
      if (isGpsError) {
        if (labelLat) labelLat.textContent = 'Indisponível';
        if (labelLng) labelLng.textContent = 'Indisponível';
        if (labelGpsStatus) {
          labelGpsStatus.className = 'text-muted';
          labelGpsStatus.textContent = 'GPS Desativado / Sinal Perdido';
        }
        addHistoryEvent('Alerta: GPS Desativado/Indisponível');
      } else {
        if (labelLat) labelLat.textContent = simulatedLat.toFixed(6);
        if (labelLng) labelLng.textContent = simulatedLng.toFixed(6);
        if (labelGpsStatus) {
          labelGpsStatus.className = 'text-success';
          labelGpsStatus.textContent = 'GPS Ativo / Sinal Excelente';
        }
        addHistoryEvent('GPS Reativado com sucesso');
      }
    });
  }

  // 4. Funcionalidade 3: Sirene e Sinalização
  const audioSiren = document.getElementById('audio-siren');
  const btnPlaySiren = document.getElementById('btn-play-siren');
  const btnTriggerVibration = document.getElementById('btn-trigger-vibration');
  const btnToggleFlashlight = document.getElementById('btn-toggle-flashlight');
  const btnStopAllAlerts = document.getElementById('btn-stop-all-alerts');
  const sirenStatusCard = document.getElementById('siren-status-card');
  const sirenStatusText = document.getElementById('siren-status-text');

  let isSirenActive = false;
  let isFlashlightActive = false;

  if (btnPlaySiren) {
    btnPlaySiren.addEventListener('click', () => {
      isSirenActive = true;
      if (audioSiren) {
        audioSiren.play().catch(() => {
          console.log('Autoplay restrito.');
        });
      }
      if (sirenStatusCard) sirenStatusCard.classList.add('active-siren');
      if (sirenStatusText) sirenStatusText.textContent = '🔊 Sirene de Alerta Reproduzindo!';
      addHistoryEvent('Acionamento da Sirene Sonora');
    });
  }

  if (btnTriggerVibration) {
    btnTriggerVibration.addEventListener('click', () => {
      if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
      alert('📳 Vibração ativada no dispositivo!');
      addHistoryEvent('Acionamento da Vibração do Dispositivo');
    });
  }

  if (btnToggleFlashlight) {
    btnToggleFlashlight.addEventListener('click', () => {
      isFlashlightActive = !isFlashlightActive;
      alert(isFlashlightActive ? '🔦 Lanterna Ligada!' : '🔦 Lanterna Desligada!');
      addHistoryEvent(isFlashlightActive ? 'Lanterna Ativada' : 'Lanterna Desativada');
    });
  }

  if (btnStopAllAlerts) {
    btnStopAllAlerts.addEventListener('click', () => {
      isSirenActive = false;
      isFlashlightActive = false;
      if (audioSiren) {
        audioSiren.pause();
        audioSiren.currentTime = 0;
      }
      if (sirenStatusCard) sirenStatusCard.classList.remove('active-siren');
      if (sirenStatusText) sirenStatusText.textContent = 'Nenhum alerta ativo';
      addHistoryEvent('Interrupção de Todos os Alertas');
    });
  }

  // 5. Funcionalidade 4: Checklist de Segurança
  const checkboxes = document.querySelectorAll('.chk-procedure');
  const progressFill = document.getElementById('progress-fill');
  const progressPercentage = document.getElementById('progress-percentage');
  const btnResetChecklist = document.getElementById('btn-reset-checklist');

  const updateProgress = () => {
    const total = checkboxes.length;
    let checkedCount = 0;
    checkboxes.forEach(chk => {
      if (chk.checked) checkedCount++;
    });

    const percent = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPercentage) progressPercentage.textContent = `${percent}% (${checkedCount}/${total})`;
  };

  checkboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      updateProgress();
      addHistoryEvent(`Checklist item ${chk.dataset.id}: ${chk.checked ? 'Marcado' : 'Desmarcado'}`);
    });
  });

  if (btnResetChecklist) {
    btnResetChecklist.addEventListener('click', () => {
      checkboxes.forEach(chk => (chk.checked = false));
      updateProgress();
      addHistoryEvent('Checklist de Segurança Reiniciado');
    });
  }

  // 6. Funcionalidade 5: Histórico em Memória
  const btnClearHistory = document.getElementById('btn-clear-history');
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      eventHistory.length = 0;
      renderHistory();
    });
  }

  addHistoryEvent('Sessão do Assistente de Segurança Iniciada');
});

// Controlador do Painel do RH (Admin)

import { listarRegistrosPonto, listarOcorrenciasPonto } from './services/supabase.js';
import { renderIcons } from './components/icons.js';

class AdminApp {
  constructor() {
    this.tabRegistros = document.getElementById('tab-registros');
    this.tabOcorrencias = document.getElementById('tab-ocorrencias');
    this.sectionRegistros = document.getElementById('section-registros');
    this.sectionOcorrencias = document.getElementById('section-ocorrencias');
    this.tblRegistrosBody = document.getElementById('tbl-registros-body');
    this.tblOcorrenciasBody = document.getElementById('tbl-ocorrencias-body');
    this.photoModal = document.getElementById('photo-modal');
    this.modalPhotoImg = document.getElementById('modal-photo-img');
    this.btnCloseModal = document.getElementById('btn-close-modal');

    this.ocorrenciasCache = [];
  }

  async init() {
    renderIcons();
    this.setupEventListeners();
    await this.carregarRegistros();
  }

  setupEventListeners() {
    this.tabRegistros.addEventListener('click', () => {
      this.tabRegistros.className = 'btn btn-primary';
      this.tabOcorrencias.className = 'btn btn-outline';
      this.sectionRegistros.style.display = 'block';
      this.sectionOcorrencias.style.display = 'none';
      this.carregarRegistros();
    });

    this.tabOcorrencias.addEventListener('click', () => {
      this.tabOcorrencias.className = 'btn btn-primary';
      this.tabRegistros.className = 'btn btn-outline';
      this.sectionOcorrencias.style.display = 'block';
      this.sectionRegistros.style.display = 'none';
      this.carregarOcorrencias();
    });

    this.btnCloseModal.addEventListener('click', () => {
      this.photoModal.classList.remove('active');
    });

    this.photoModal.addEventListener('click', (e) => {
      if (e.target === this.photoModal) {
        this.photoModal.classList.remove('active');
      }
    });
  }

  async carregarRegistros() {
    try {
      this.tblRegistrosBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Carregando registros...</td></tr>`;
      const registros = await listarRegistrosPonto();

      if (registros.length === 0) {
        this.tblRegistrosBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Nenhum registro de ponto encontrado.</td></tr>`;
        return;
      }

      this.tblRegistrosBody.innerHTML = registros.map(reg => {
        const dataHora = new Date(reg.data_hora).toLocaleString('pt-BR');
        const funcNome = reg.funcionarios ? reg.funcionarios.nome : 'Desconhecido';
        const funcMatricula = reg.funcionarios ? reg.funcionarios.matricula : '-';
        const badgeColor = reg.tipo_registro === 'ENTRADA' ? 'var(--success)' : 'var(--primary)';

        return `
          <tr>
            <td>${dataHora}</td>
            <td>${funcMatricula}</td>
            <td><strong>${funcNome}</strong></td>
            <td><span style="color: ${badgeColor}; font-weight: 600;">${reg.tipo_registro}</span></td>
            <td><small style="font-family: monospace;">${reg.hash_comprovante || '-'}</small></td>
          </tr>
        `;
      }).join('');

    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      this.tblRegistrosBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--danger);">Erro ao carregar dados.</td></tr>`;
    }
  }

  async carregarOcorrencias() {
    try {
      this.tblOcorrenciasBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">Carregando ocorrências...</td></tr>`;
      const ocorrencias = await listarOcorrenciasPonto();
      this.ocorrenciasCache = ocorrencias;

      if (ocorrencias.length === 0) {
        this.tblOcorrenciasBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Nenhuma ocorrência registrada.</td></tr>`;
        return;
      }

      this.tblOcorrenciasBody.innerHTML = ocorrencias.map((oc, index) => {
        const dataHora = new Date(oc.data_hora).toLocaleString('pt-BR');
        const funcNome = oc.funcionarios ? oc.funcionarios.nome : 'Não identificado';

        return `
          <tr>
            <td>${dataHora}</td>
            <td><strong>${funcNome}</strong></td>
            <td><span style="color: var(--danger); font-weight: 600;">${oc.tipo_ocorrencia}</span></td>
            <td><small style="font-family: monospace;">${oc.qrcode_lido || '-'}</small></td>
            <td>
              ${oc.foto_tentativa_url ? `
                <button class="btn btn-outline btn-ver-foto" data-index="${index}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">
                  <i data-lucide="image"></i> Ver Foto
                </button>
              ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Sem Foto</span>'}
            </td>
          </tr>
        `;
      }).join('');

      renderIcons();

      // Bind botões de ver foto
      document.querySelectorAll('.btn-ver-foto').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = e.currentTarget.getAttribute('data-index');
          const oc = this.ocorrenciasCache[idx];
          if (oc && oc.foto_tentativa_url) {
            this.modalPhotoImg.src = oc.foto_tentativa_url;
            this.photoModal.classList.add('active');
          }
        });
      });

    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
      this.tblOcorrenciasBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--danger);">Erro ao carregar ocorrências.</td></tr>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const admin = new AdminApp();
  admin.init();
});

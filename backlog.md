# BACKLOG DO PROJETO - SISTEMA DE CONTROLE DE PONTO E OCORRÊNCIAS VIA QR CODE

## Visão Geral
Este documento registra continuamente as tarefas, funcionalidades, correções e refatorações realizadas no projeto.

---

## Tarefas Granulares (Backlog)

### 1. Configuração Inicial e Infraestrutura
- [x] **[INFRA-01]** Estrutura de diretórios criada (`css/`, `js/`, `js/services/`, `js/components/`).
- [x] **[INFRA-02]** Criação e inicialização do arquivo `backlog.md`.
- [x] **[INFRA-03]** Configuração da conexão com Supabase (`js/config.js`) com credenciais e inicialização SDK via CDN ESM.
- [x] **[INFRA-04]** Camada de serviço do Supabase (`js/services/supabase.js`) para interagir com as tabelas `funcionarios`, `janelas_horario`, `registros_ponto` e `ocorrencias_ponto`.

### 2. Módulos Core / Serviços
- [x] **[SRV-01]** Módulo de Câmera (`js/services/camera.js`): gerenciamento de `getUserMedia`, inicialização de stream, captura de snapshot em canvas.
- [x] **[SRV-02]** Módulo de Leitura de QR Code (`js/services/qrcode.js`): decodificação via biblioteca `jsQR`.
- [x] **[SRV-03]** Módulo de Validação de Tolerância (`js/services/tolerance.js`): validação de horários atuais contra janelas de entrada e saída.

### 3. Design e Interface de Usuário (UI/UX)
- [x] **[UI-01]** Estilos Base (`css/main.css`): variáveis de design (fundo `#ffffff`, bordas `#e2e8f0`), suporte responsivo otimizado para Tablet (Landscape) e Desktop.
- [x] **[UI-02]** Estilos Componentes (`css/components.css`): cards, botões, modais, badges de status, tabela e alertas.
- [x] **[UI-03]** Inicializador de Ícones (`js/components/icons.js`): integração com Lucide Icons (sem emojis).

### 4. Terminal de Ponto (Kiosk)
- [x] **[KIOSK-01]** Estrutura HTML do Kiosk (`index.html`): layout semântico com leitor de câmera, status e área de ticket.
- [x] **[KIOSK-02]** Componente de Ticket / Comprovante (`js/components/ticket.js`): formatação e acionamento de impressão do comprovante.
- [x] **[KIOSK-03]** Controlador Principal (`js/app.js`): orquestração do fluxo do Kiosk (leitura de QR -> validação -> registro de ponto/ocorrência -> feedback/impressão).

### 5. Painel do RH (Admin)
- [x] **[ADMIN-01]** Estrutura HTML do Admin (`admin.html`): listagem de registros aprovados e ocorrências auditadas.
- [x] **[ADMIN-02]** Lógica do Admin (`js/admin-app.js` ou integrado): busca de registros, modais com fotos de ocorrências e filtros.

### 6. Testes e Validação
- [x] **[TEST-01]** Teste e verificação dos fluxos de sucesso e bloqueios (fora da janela / QR code inválido).

---

## Histórico de Alterações

| Data | Tarefa | Descrição | Status |
| :--- | :--- | :--- | :--- |
| 2023-10-24 | INFRA-01 | Criada estrutura de diretórios (`css/`, `js/`, `js/services/`, `js/components/`) | Concluído |
| 2023-10-24 | INFRA-02 | Criado arquivo `backlog.md` inicial | Concluído |
| 2023-10-24 | INFRA-03/04 | Configuração do Supabase (`js/config.js`) e serviço de banco (`js/services/supabase.js`) | Concluído |
| 2023-10-24 | SRV-01/02 | Implementados módulos de câmera (`camera.js`) e leitura de QR Code (`qrcode.js`) | Concluído |
| 2023-10-24 | SRV-03 | Implementado módulo de tolerância e validação de janelas (`tolerance.js`) | Concluído |
| 2023-10-24 | UI-01/02/03 | Desenvolvidos estilos CSS base e de componentes e inicializador de ícones Lucide | Concluído |
| 2023-10-24 | KIOSK-01/02/03 | Desenvolvido o Terminal Kiosk (`index.html`), Ticket (`ticket.js`) e controlador (`app.js`) | Concluído |
| 2023-10-24 | ADMIN-01/02 | Criado Painel do RH (`admin.html`) e controlador de auditoria (`admin-app.js`) | Concluído |
| 2023-10-24 | TEST-01 | Testes unitários do módulo de janelas e verificação dos fluxos da aplicação | Concluído |
| 2023-10-24 | DOC-01 | Adicionado guia passo a passo de conexão do SQL do Supabase ao repositório no `README.md` | Concluído |

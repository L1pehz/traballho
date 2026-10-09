# BACKLOG DO PROJETO - ASSISTENTE DE SEGURANÇA PESSOAL (MIT APP INVENTOR)

## Visão Geral
Este documento registra continuamente as tarefas, funcionalidades, componentes do App Inventor, blocos e simulação web do aplicativo Assistente de Segurança Pessoal.

---

## Tarefas Granulares (Backlog)

### 1. Estrutura e Ferramentas do Projeto App Inventor
- [x] **[INFRA-01]** Atualização do Backlog e documentação das especificações do App Inventor.
- [ ] **[TOOL-01]** Criação da ferramenta utilitária Python (`/home/jules/self_created_tools/aia_builder.py`) para empacotamento do projeto no formato `.aia`.
- [ ] **[AIA-01]** Geração do arquivo `AssistenteSeguranca.aia` contendo `project.properties`, telas `.scm` e blocos `.bky` para importação direta no MIT App Inventor.

### 2. Telas e Funcionalidades (App Inventor & Web Preview)
- [ ] **[SCR-01] Screen1 (SOS / Emergência & Menu)**
  - Botão SOS com popup/modal de confirmação.
  - Contagem regressiva de 5 segundos para cancelamento.
  - Mudança de cores (Verde/Neutro -> Amarelo -> Vermelho Emergência) e mensagens de estado.
  - Menu de navegação para as outras telas.
  - Registro automático no histórico de eventos.

- [ ] **[SCR-02] ScreenLocation (GPS & Localização)**
  - Captura de latitude e longitude via `LocationSensor`.
  - Exibição de coordenadas e status de precisão/disponibilidade.
  - Botão para abrir localização no Google Maps via `ActivityStarter`.
  - Tratamento e avisos para GPS desativado/indisponível.

- [ ] **[SCR-03] ScreenSiren (Sirene & Alertas)**
  - Leitor/reprodutor de som de alerta em loop (`Sound` / `Player`).
  - Acionamento de vibração do dispositivo.
  - Controle de lanterna (`Flashlight` / componentes de câmera).
  - Botão de pânico/desativação para interromper todos os alertas ativados.

- [ ] **[SCR-04] ScreenChecklist (Checklist de Segurança Pré-Saída)**
  - Lista de verificação de itens de segurança.
  - Checkboxes interativos com recálculo programático da barra e porcentagem de progresso.
  - Botão de reinício ("Resetar Lista").

- [ ] **[SCR-05] ScreenHistory (Histórico em Memória)**
  - Armazenamento em listas com Data, Hora e Tipo de Evento.
  - Contador de acionamentos totais.
  - Botão para limpar histórico.

### 3. Interface e Guias
- [ ] **[UI-01] Interface Web Otimizada**
  - Layout limpo (#ffffff, bordas #e2e8f0, ícones Lucide, responsivo para tablet/desktop) simulando as 5 telas ativas/inativas via CSS.
- [ ] **[DOC-01] Guia do App Inventor (`APP_INVENTOR_GUIDE.md`)**
  - Manual explicativo passo a passo para importar o `.aia` ou construir os blocos visualmente no MIT App Inventor.

---

## Histórico de Alterações

| Data | Tarefa | Descrição | Status |
| :--- | :--- | :--- | :--- |
| 2023-10-24 | INFRA-01 | Criado backlog para o Assistente de Segurança Pessoal | Concluído |

# GUIA DE IMPORTAÇÃO E CONSTRUÇÃO - MIT APP INVENTOR
## Assistente de Segurança Pessoal

Este guia apresenta todas as instruções para importar o arquivo de projeto `.aia` gerado (`AssistenteSeguranca.aia`) ou recriar manualmente as 5 telas funcionais com seus componentes visuais e blocos de programação no **MIT App Inventor** (https://ai2.appinventor.mit.edu/).

---

## 1. Importação Direta do Arquivo `.aia`
1. Acesse o site oficial do [MIT App Inventor](https://ai2.appinventor.mit.edu/).
2. Faça login com sua conta Google.
3. No menu superior, clique em **Projects** (Projetos) -> **Import project (.aia) from my computer...** (Importar projeto (.aia) do meu computador...).
4. Selecione o arquivo `AssistenteSeguranca.aia` localizado na raiz deste repositório.
5. O MIT App Inventor carregará automaticamente o projeto completo com todas as 5 telas, componentes visuais e blocos de código em blocos XML.

---

## 2. Estrutura das 5 Telas e Componentes do Aplicativo

### **Tela 1: Screen1 (Emergência SOS & Menu Principal)**
- **Propósito**: Central de alarme com botão de pânico SOS com confirmação de 5 segundos para evitar acionamentos acidentais e navegação central para as demais telas.
- **Componentes Visuais**:
  - `LabelTitle`: Título do aplicativo ("Central de Segurança Pessoal").
  - `LabelStatus`: Exibição do status atual do sistema ("Monitoramento Ativo - Seguro").
  - `ButtonSOS`: Botão grande de emergência (Vermelho `#DC2626`).
  - `LabelCountdown`: Rótulo de contagem regressiva de 5 segundos.
  - `ButtonCancelSOS`: Botão de cancelamento durante a contagem (Amarelo `#EAB308`).
  - `BtnNavLocation`, `BtnNavSiren`, `BtnNavChecklist`, `BtnNavHistory`: Botões de menu para navegação.
- **Componentes Não-Visuais**:
  - `TimerSOS` (`Clock`): Temporizador com intervalo de 1000ms para a contagem de 5 segundos.
  - `Notifier1` (`Notifier`): Exibição de alertas pop-up no celular.
  - `TinyDB1` (`TinyDB`): Armazenamento permanente/em memória.

---

### **Tela 2: ScreenLocation (GPS & Localização)**
- **Propósito**: Capturar coordenadas geográficas em tempo real, exibir latitude e longitude e permitir abertura no aplicativo de mapas (Google Maps), com tratamento para GPS indisponível.
- **Componentes Visuais**:
  - `LabelLatitude`: Exibe a latitude atual capturada pelo sensor.
  - `LabelLongitude`: Exibe a longitude atual capturada pelo sensor.
  - `LabelGPSStatus`: Mensagem sobre o status do sinal GPS.
  - `BtnUpdateLocation`: Botão para solicitar nova atualização.
  - `BtnOpenMaps`: Botão para abrir as coordenadas no Google Maps.
  - `BtnBack`: Botão para retornar à Screen1.
- **Componentes Não-Visuais**:
  - `LocationSensor1` (`LocationSensor`): Captura do sinal GPS do aparelho.
  - `ActivityStarter1` (`ActivityStarter`): Dispara a intenção Android para abrir URL do Google Maps.

---

### **Tela 3: ScreenSiren (Sirene e Alertas)**
- **Propósito**: Acionar alarme sonoro em loop, vibração do celular e opções de iluminação para sinalização de perigo.
- **Componentes Visuais**:
  - `BtnStartSiren`: Botão para reproduzir a sirene de alerta.
  - `BtnVibrate`: Botão para acionar o motor de vibração do smartphone.
  - `BtnStopAlerts`: Botão para interromper todos os alertas sonoros.
  - `BtnBack`: Botão de retorno ao menu principal.
- **Componentes Não-Visuais**:
  - `Sound1` (`Sound`): Componente responsável pela vibração.
  - `Player1` (`Player`): Reprodutor do áudio da sirene em loop.

---

### **Tela 4: ScreenChecklist (Checklist de Segurança Pré-Saída)**
- **Propósito**: Lista interativa de procedimentos de segurança antes de sair de casa com cálculo de progresso percentual via programação.
- **Componentes Visuais**:
  - `LabelProgress`: Exibe a porcentagem de procedimentos concluídos.
  - `CheckBox1` a `CheckBox5`: Caixas de seleção para os itens do checklist.
  - `BtnResetChecklist`: Botão para desmarcar todos os itens e zerar o progresso.
  - `BtnBack`: Botão para voltar à tela inicial.

---

### **Tela 5: ScreenHistory (Histórico de Eventos)**
- **Propósito**: Registrar e exibir os eventos e acionamentos ocorridos durante a sessão do aplicativo.
- **Componentes Visuais**:
  - `LabelCount`: Exibe o contador de total de acionamentos.
  - `ListViewHistory`: Lista gráfica para visualização das ocorrências gravadas.
  - `BtnClearHistory`: Botão para limpar a lista de histórico.
  - `BtnBack`: Botão de retorno.

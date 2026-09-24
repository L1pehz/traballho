# Sistema de Controle de Ponto com Leitura de QR Code

Este repositório contém a implementação do **Sistema de Controle de Ponto e Auditoria de Ocorrências via Crachá (QR Code)** integrado ao Supabase.

---

## 🛠️ Stack Tecnológica

- **Frontend:** HTML5 Semântico, CSS3 Moderno, JavaScript Vanilla (ES6 Modules)
- **Bibliotecas CDN ESM (sem Node.js / npm):**
  - `@supabase/supabase-js` (Conexão e SDK do Supabase)
  - `jsQR` (Leitura de QR Code via Canvas/Câmera)
  - `Lucide Icons` (Sinalização e Ícones da UI)
- **Backend / Banco de Dados:** Supabase (PostgreSQL)

---

## 🚀 Como Conectar o SQL do Supabase ao Repositório GitHub

Para conectar e provisionar a estrutura de banco de dados do seu projeto Supabase com as definições deste repositório, siga o passo a passo abaixo:

### Passo 1: Executar o Esquema de Banco de Dados (`Schema.sql`)
1. Acesse o seu projeto no **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Clique em **New Query** (Nova Consulta).
4. Abra o arquivo `SPEC/Schema.sql` presente neste repositório e copie todo o seu conteúdo.
5. Cole o código no painel do SQL Editor e clique em **Run** (ou pressione `Ctrl + Enter` / `Cmd + Enter`).

> ℹ️ **O que este script cria:**
> - Enums: `tipo_registro_enum` (`ENTRADA`, `SAIDA`) e `tipo_ocorrencia_enum` (`TENTATIVA_FORA_JANELA_ENTRADA`, `TENTATIVA_FORA_JANELA_SAIDA`, `QRCODE_INVALIDO`).
> - Tabela `funcionarios` (com busca otimizada por `qrcode_hash` e `matricula`).
> - Tabela `janelas_horario` (configuração de janelas de entrada/saída).
> - Tabela `registros_ponto` (com Trigger `bloquear_alteracao_ponto` que garante imutabilidade).
> - Tabela `ocorrencias_ponto` (para registro de auditoria e foto da ocorrência).
> - Políticas RLS (Row Level Security) para acesso seguro via API REST.

---

### Passo 2: Configurar as Credenciais no Repositório
As credenciais de conexão do Supabase são configuradas no arquivo `js/config.js`:

```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://sua-instancia.supabase.co';
export const SUPABASE_KEY = 'sua-chave-publica-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

Para obter suas credenciais:
1. No Supabase Dashboard, vá em **Project Settings** > **API**.
2. Copie a **URL do projeto** (`Project URL`) e a **Chave Pública** (`anon` / `publishable`).
3. Atualize o arquivo `js/config.js` com seus dados.

---

### Passo 3: Cadastrar Dados Iniciais para Teste

Você pode inserir funcionários e janelas de horário diretamente no SQL Editor do Supabase executando o seguinte exemplo:

```sql
-- 1. Inserir um Funcionário Exemplo
INSERT INTO funcionarios (id, matricula, nome, qrcode_hash, ativo)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'FUNC001',
  'João da Silva',
  'HASH_CRACHA_JOAO_123',
  true
);

-- 2. Configurar Janela de Horário para o Funcionário
INSERT INTO janelas_horario (funcionario_id, janela_entrada_inicio, janela_entrada_fim, janela_saida_inicio, janela_saida_fim)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '07:45:00',
  '08:00:00',
  '17:45:00',
  '18:00:00'
);
```

---

## 🖥️ Telas da Aplicação

1. **Terminal de Ponto Kiosk (`index.html`):**
   - Leitura de QR Code via câmera.
   - Validação em tempo real das janelas de horário.
   - Apresentação visual clara e emissão do comprovante impresso.
2. **Painel do RH (`admin.html`):**
   - Listagem em tempo real de batidas aprovadas.
   - Auditoria de tentativas bloqueadas com visualização da foto capturada.

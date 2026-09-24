// Serviço de Integração com Banco de Dados Supabase

import { supabase } from '../config.js';

/**
 * Busca funcionário ativo pelo hash do QR Code
 * @param {string} qrcodeHash
 * @returns {Promise<Object|null>}
 */
export async function buscarFuncionarioPorQRCode(qrcodeHash) {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('qrcode_hash', qrcodeHash)
    .eq('ativo', true)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar funcionário:', error);
    throw error;
  }
  return data;
}

/**
 * Busca janelas de horário configuradas para o funcionário
 * @param {string} funcionarioId
 * @returns {Promise<Object|null>}
 */
export async function buscarJanelasHorario(funcionarioId) {
  const { data, error } = await supabase
    .from('janelas_horario')
    .select('*')
    .eq('funcionario_id', funcionarioId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar janelas de horário:', error);
    throw error;
  }
  return data;
}

/**
 * Registra uma batida de ponto aprovada
 * @param {Object} registro
 * @param {string} registro.funcionarioId
 * @param {string} registro.tipoRegistro 'ENTRADA' | 'SAIDA'
 * @param {string} registro.fotoUrl
 * @param {string} registro.hashComprovante
 * @returns {Promise<Object>}
 */
export async function registrarPonto({ funcionarioId, tipoRegistro, fotoUrl, hashComprovante }) {
  const { data, error } = await supabase
    .from('registros_ponto')
    .insert([
      {
        funcionario_id: funcionarioId,
        tipo_registro: tipoRegistro,
        foto_registro_url: fotoUrl,
        hash_comprovante: hashComprovante
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao registrar ponto:', error);
    throw error;
  }
  return data;
}

/**
 * Registra uma ocorrência / tentativa bloqueada
 * @param {Object} ocorrencia
 * @param {string|null} ocorrencia.funcionarioId
 * @param {string} ocorrencia.qrcodeLido
 * @param {string} ocorrencia.tipoOcorrencia 'TENTATIVA_FORA_JANELA_ENTRADA' | 'TENTATIVA_FORA_JANELA_SAIDA' | 'QRCODE_INVALIDO'
 * @param {string|null} ocorrencia.fotoUrl
 * @returns {Promise<Object>}
 */
export async function registrarOcorrencia({ funcionarioId = null, qrcodeLido, tipoOcorrencia, fotoUrl = null }) {
  const { data, error } = await supabase
    .from('ocorrencias_ponto')
    .insert([
      {
        funcionario_id: funcionarioId,
        qrcode_lido: qrcodeLido,
        tipo_ocorrencia: tipoOcorrencia,
        foto_tentativa_url: fotoUrl
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao registrar ocorrência:', error);
    throw error;
  }
  return data;
}

/**
 * Lista todos os registros de ponto com dados do funcionário para o Painel RH
 * @returns {Promise<Array>}
 */
export async function listarRegistrosPonto() {
  const { data, error } = await supabase
    .from('registros_ponto')
    .select(`
      *,
      funcionarios (
        matricula,
        nome
      )
    `)
    .order('data_hora', { ascending: false });

  if (error) {
    console.error('Erro ao listar registros de ponto:', error);
    throw error;
  }
  return data || [];
}

/**
 * Lista todas as ocorrências gravadas para o Painel RH
 * @returns {Promise<Array>}
 */
export async function listarOcorrenciasPonto() {
  const { data, error } = await supabase
    .from('ocorrencias_ponto')
    .select(`
      *,
      funcionarios (
        matricula,
        nome
      )
    `)
    .order('data_hora', { ascending: false });

  if (error) {
    console.error('Erro ao listar ocorrências de ponto:', error);
    throw error;
  }
  return data || [];
}

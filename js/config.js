// Configuração e Inicialização do Cliente Supabase via CDN ESM

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://gxxedjkyibqvpdxamzro.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_zmHp_d3A62mznAS1NwHw9A_LaXJSHR1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

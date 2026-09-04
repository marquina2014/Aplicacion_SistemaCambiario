import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co'
);

/**
 * Instancia del cliente de Supabase
 * Si no están definidas las credenciales en el archivo .env,
 * se crea un cliente simulado para permitir desarrollo y pruebas sin interrupciones.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Consulta el historial de tasas desde Supabase (tabla exchange_rates)
 * con fallback a datos locales si Supabase no está configurado.
 */
export async function getHistoricalRatesFromSupabase(limit = 30) {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Error consultando Supabase:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Excepción al conectar con Supabase:', err);
    return null;
  }
}

/**
 * Guarda o actualiza una tasa cambiaria en Supabase
 */
export async function saveRateToSupabase(rateData) {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('exchange_rates')
      .insert([rateData]);

    if (error) {
      console.warn('No se pudo guardar la tasa en Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Excepción al guardar en Supabase:', err);
    return false;
  }
}

export default supabase;

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseReady = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co'
);

export const supabase = isSupabaseReady
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Guarda un registro de tasas en la tabla exchange_rates de Supabase
 */
export async function persistRatesToSupabase(ratesData) {
  if (!supabase) {
    return { success: false, reason: 'Supabase no está configurado con credenciales válidas en .env' };
  }

  try {
    const record = {
      bcv_usd: ratesData.bcvUsd?.price || null,
      bcv_eur: ratesData.bcvEur?.price || null,
      usdt: ratesData.usdt?.price || null,
      paralelo: ratesData.paralelo?.price || null,
      source: 'AlCambio-Backend',
      recorded_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('exchange_rates')
      .insert([record])
      .select();

    if (error) {
      console.warn('Error al insertar en Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.warn('Excepción al persistir en Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Consulta el historial de tasas en Supabase
 */
export async function getHistoricalRates(limit = 30) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

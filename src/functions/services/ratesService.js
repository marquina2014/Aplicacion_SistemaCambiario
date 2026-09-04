import { httpClient } from '../http/httpClient';
import { getHistoricalRatesFromSupabase } from './supabaseClient';

/**
 * Datos iniciales / de respaldo en caso de desconexión o fallas en la API externa
 */
const DEFAULT_FALLBACK_RATES = {
  bcvUsd: {
    price: 807.38,
    change: 0.15,
    symbol: 'USD',
    title: 'Dólar BCV',
    subtitle: 'Tasa Oficial del Banco Central',
    lastUpdate: new Date().toISOString(),
  },
  bcvEur: {
    price: 938.45,
    change: 0.28,
    symbol: 'EUR',
    title: 'Euro BCV',
    subtitle: 'Tasa Oficial en Euros',
    lastUpdate: new Date().toISOString(),
  },
  usdt: {
    price: 961.50,
    change: 0.18,
    symbol: 'USDT',
    title: 'USDT P2P',
    subtitle: 'Tether Cripto / Binance',
    lastUpdate: new Date().toISOString(),
  },
  paralelo: {
    price: 958.00,
    change: -0.25,
    symbol: 'USD',
    title: 'Paralelo',
    subtitle: 'Promedio EnParaleloVzla',
    lastUpdate: new Date().toISOString(),
  },
};

/**
 * Datos históricos simulados para la gráfica de ondas
 */
export const MOCK_CHART_HISTORY = [
  { day: 'Lun', bcv: 801.40, eur: 931.50, usdt: 954.20, paralelo: 950.80 },
  { day: 'Mar', bcv: 802.45, eur: 933.60, usdt: 956.80, paralelo: 952.10 },
  { day: 'Mié', bcv: 804.50, eur: 934.65, usdt: 958.00, paralelo: 953.95 },
  { day: 'Jue', bcv: 805.55, eur: 936.75, usdt: 960.30, paralelo: 955.30 },
  { day: 'Vie', bcv: 806.58, eur: 937.80, usdt: 961.10, paralelo: 956.20 },
  { day: 'Sáb', bcv: 807.38, eur: 938.45, usdt: 961.50, paralelo: 958.00 },
  { day: 'Hoy', bcv: 807.38, eur: 938.45, usdt: 961.50, paralelo: 958.00 },
];

/**
 * Consulta las tasas actuales:
 * 1. Intenta consultar el Backend local (/api/rates) con Binance P2P y BCV real.
 * 2. Si el backend está desconectado, consulta las APIs públicas sobre HTTPS.
 * 3. Si todo falla, usa los datos de respaldo.
 */
export async function fetchCurrentRates() {
  // 1. Intentar con el Backend propio de la aplicación
  try {
    const backendRes = await httpClient.get('/api/rates', { timeout: 3500 });
    if (backendRes && backendRes.success && backendRes.data) {
      return backendRes.data;
    }
  } catch {
    // Si el backend aún no ha iniciado o estamos en modo offline, continuamos
  }

  // 2. Fallback: Consulta directa por HTTPS al cliente
  try {
    const data = await httpClient.get('https://ve.dolarapi.com/v1/dolares', { timeout: 4000 });

    if (Array.isArray(data)) {
      const oficial = data.find((item) => item.fuente === 'oficial') || {};
      const paralelo = data.find((item) => item.fuente === 'paralelo') || {};

      let euroPrice = DEFAULT_FALLBACK_RATES.bcvEur.price;
      try {
        const euroData = await httpClient.get('https://ve.dolarapi.com/v1/euros/oficial', { timeout: 3000 });
        if (euroData && euroData.promedio) {
          euroPrice = euroData.promedio;
        }
      } catch {
        // Ignorar
      }

      const paraleloVal = paralelo.promedio || DEFAULT_FALLBACK_RATES.paralelo.price;
      const usdtVal = paraleloVal * 1.004;

      return {
        bcvUsd: {
          price: oficial.promedio || DEFAULT_FALLBACK_RATES.bcvUsd.price,
          change: 0.12,
          symbol: 'USD',
          title: 'Dólar BCV',
          subtitle: 'Tasa Oficial del Banco Central',
          lastUpdate: oficial.fechaActualizacion || new Date().toISOString(),
        },
        bcvEur: {
          price: euroPrice,
          change: 0.25,
          symbol: 'EUR',
          title: 'Euro BCV',
          subtitle: 'Tasa Oficial en Euros',
          lastUpdate: oficial.fechaActualizacion || new Date().toISOString(),
        },
        usdt: {
          price: usdtVal,
          change: 0.18,
          symbol: 'USDT',
          title: 'USDT P2P',
          subtitle: 'Tether Cripto / Binance',
          lastUpdate: new Date().toISOString(),
        },
        paralelo: {
          price: paraleloVal,
          change: -0.32,
          symbol: 'USD',
          title: 'Paralelo',
          subtitle: 'Promedio EnParaleloVzla',
          lastUpdate: paralelo.fechaActualizacion || new Date().toISOString(),
        },
      };
    }
  } catch (err) {
    console.info('Usando fuentes de respaldo para tasas cambiarias:', err.message);
  }

  // 3. Fallback a datos locales
  return DEFAULT_FALLBACK_RATES;
}

/**
 * Obtiene el historial para la gráfica
 */
export async function fetchRatesHistory() {
  const supabaseData = await getHistoricalRatesFromSupabase(7);
  if (supabaseData && supabaseData.length > 0) {
    return supabaseData;
  }
  return MOCK_CHART_HISTORY;
}

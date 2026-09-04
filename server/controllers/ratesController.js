import { getBcvUnifiedRates } from '../services/bcvService.js';
import { getBinanceUsdtRate } from '../services/binanceService.js';
import { getParaleloRate } from '../services/paraleloService.js';
import { persistRatesToSupabase, isSupabaseReady } from '../services/supabaseService.js';

// Memoria caché en servidor para respuesta ultra rápida (30 segundos)
let cachedRates = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000;

/**
 * Consulta todas las cotizaciones en tiempo real
 */
export async function getAllRates(req, res) {
  try {
    const now = Date.now();
    if (cachedRates && now - lastCacheTime < CACHE_TTL_MS) {
      return res.json({
        success: true,
        data: cachedRates,
        cached: true,
      });
    }

    // Consultar en paralelo sobre HTTPS usando fetch nativo
    const [bcvData, usdtData, paraleloData] = await Promise.all([
      getBcvUnifiedRates(),
      getBinanceUsdtRate('BUY'),
      getParaleloRate(),
    ]);

    const result = {
      bcvUsd: bcvData.bcvUsd,
      bcvEur: bcvData.bcvEur,
      usdt: usdtData,
      paralelo: paraleloData,
      updatedAt: new Date().toISOString(),
      supabaseConnected: isSupabaseReady,
    };

    cachedRates = result;
    lastCacheTime = now;

    res.json({
      success: true,
      data: result,
      cached: false,
    });
  } catch (error) {
    console.error('Error en getAllRates controller:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar tasas cambiarias',
      message: error.message,
    });
  }
}

/**
 * Consulta exclusiva de tasas oficiales del BCV (Dólar y Euro)
 */
export async function getBcvRates(req, res) {
  try {
    const bcvData = await getBcvUnifiedRates();
    res.json({ success: true, data: bcvData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Consulta exclusiva de cotización en vivo de Binance P2P USDT
 */
export async function getBinanceRates(req, res) {
  try {
    const tradeType = req.query.type === 'SELL' ? 'SELL' : 'BUY';
    const binanceData = await getBinanceUsdtRate(tradeType);
    res.json({ success: true, data: binanceData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Endpoint manual para forzar sincronización y guardado en Supabase
 */
export async function syncRates(req, res) {
  try {
    const [bcvData, usdtData, paraleloData] = await Promise.all([
      getBcvUnifiedRates(),
      getBinanceUsdtRate('BUY'),
      getParaleloRate(),
    ]);

    const unified = {
      bcvUsd: bcvData.bcvUsd,
      bcvEur: bcvData.bcvEur,
      usdt: usdtData,
      paralelo: paraleloData,
    };

    const persistResult = await persistRatesToSupabase(unified);

    res.json({
      success: persistResult.success,
      rates: unified,
      supabase: persistResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

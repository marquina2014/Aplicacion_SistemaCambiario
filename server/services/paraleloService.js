/**
 * Servicio para consultar el promedio de mercado paralelo (EnParaleloVzla)
 */

const PARALELO_URL = 'https://ve.dolarapi.com/v1/dolares/paralelo';
const DEFAULT_TIMEOUT_MS = 6000;

export async function getParaleloRate() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    const res = await fetch(PARALELO_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AlCambio-API/1.0',
      },
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      return {
        price: Number(data.promedio) || 958.00,
        symbol: 'USD',
        title: 'Paralelo',
        subtitle: 'Promedio EnParaleloVzla',
        change: -0.25,
        lastUpdate: data.fechaActualizacion || new Date().toISOString(),
        source: 'EnParaleloVzla',
      };
    }
  } catch (error) {
    console.warn('Advertencia al consultar Paralelo:', error.message);
  }

  return {
    price: 958.00,
    symbol: 'USD',
    title: 'Paralelo',
    subtitle: 'Promedio Mercado (Caché)',
    change: -0.25,
    lastUpdate: new Date().toISOString(),
    source: 'Caché / Fallback',
  };
}

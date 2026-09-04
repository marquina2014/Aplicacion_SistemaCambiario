/**
 * Fórmulas y cálculos cambiarios para el monitor y conversor
 * Soporta conversiones universales entre VES, Dólar BCV, Euro BCV, USDT Cripto y Dólar Paralelo.
 */

/**
 * Retorna el valor en Bolívares (VES) de 1 unidad de la divisa solicitada
 */
export function getAssetRateInVes(assetCode, rates = {}) {
  const bcvUsd = rates.bcvUsd || 36.62;
  const bcvEur = rates.bcvEur || 39.84;
  const usdt = rates.usdt || 40.50;
  const paralelo = rates.paralelo || 40.25;

  switch (assetCode) {
    case 'VES':
      return 1;
    case 'USD_BCV':
    case 'USD':
      return bcvUsd;
    case 'EUR_BCV':
    case 'EUR':
      return bcvEur;
    case 'USDT':
      return usdt;
    case 'USD_PAR':
    case 'PARALELO':
      return paralelo;
    default:
      return 1;
  }
}

/**
 * Convierte un monto entre cualquier par de activos
 * (ej: EUR a USDT, USDT a Dólar BCV, Dólar BCV a USDT, Dólar BCV a Euro, etc.)
 *
 * @param {number} amount Monto de origen
 * @param {string} from Código de origen ('VES', 'USD_BCV', 'EUR_BCV', 'USDT', 'USD_PAR')
 * @param {string} to Código de destino ('VES', 'USD_BCV', 'EUR_BCV', 'USDT', 'USD_PAR')
 * @param {Object} rates Tasas disponibles { bcvUsd, bcvEur, usdt, paralelo }
 * @returns {{ result: number, crossRate: number }}
 */
export function convertCurrency(amount, from, to, rates = {}) {
  const numAmount = Number(amount);
  if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
    return { result: 0, crossRate: 1 };
  }

  const rateFromInVes = getAssetRateInVes(from, rates);
  const rateToInVes = getAssetRateInVes(to, rates);

  if (rateToInVes <= 0) {
    return { result: 0, crossRate: 1 };
  }

  // Monto convertido a Bolívares internamente
  const amountInVes = numAmount * rateFromInVes;

  // Resultado en la divisa destino
  const result = amountInVes / rateToInVes;

  // Tasa cruzada: ¿cuántas unidades de 'to' equivalen a 1 unidad de 'from'?
  const crossRate = rateFromInVes / rateToInVes;

  return { result, crossRate };
}

/**
 * Calcula la brecha cambiaria en porcentaje entre dos tasas
 * Fórmula: ((Mayor - Menor) / Menor) * 100
 */
export function calculateSpread(baseRate, compareRate) {
  if (!baseRate || !compareRate || baseRate <= 0) return 0;
  return ((compareRate - baseRate) / baseRate) * 100;
}

/**
 * Calcula el IGTF (Impuesto a las Grandes Transacciones Financieras - 3%)
 */
export function calculateIGTF(amount, percentage = 3) {
  const safeAmount = Number(amount) || 0;
  const tax = safeAmount * (percentage / 100);
  return {
    tax,
    total: safeAmount + tax,
  };
}

/**
 * Utilidades de formato para divisas, porcentajes y fechas
 */

/**
 * Formatea un número como moneda según la divisa
 * @param {number} amount
 * @param {'VES' | 'USD' | 'EUR'} currency
 * @param {number} decimals
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'VES', decimals = 2) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0,00';
  }

  const num = Number(amount);

  // Formato estilo venezolano / europeo (puntos para miles, comas para decimales)
  const formatted = num.toLocaleString('es-VE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  switch (currency) {
    case 'VES':
      return `${formatted} Bs.`;
    case 'USD':
    case 'USD_BCV':
      return `$ ${formatted} USD`;
    case 'USD_PAR':
      return `$ ${formatted} Par`;
    case 'EUR':
    case 'EUR_BCV':
      return `€ ${formatted} EUR`;
    case 'USDT':
      return `₮ ${formatted} USDT`;
    default:
      return `${formatted} ${currency}`;
  }
}

/**
 * Formatea un número simple con separadores de miles y decimales
 */
export function formatNumber(val, decimals = 2) {
  if (val === undefined || val === null || isNaN(val)) return '0,00';
  return Number(val).toLocaleString('es-VE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formatea un porcentaje con signo explícito (+/-)
 * @param {number} percentage
 * @returns {string} Ej: "+1,45%" o "-0,82%"
 */
export function formatPercentage(percentage) {
  if (percentage === undefined || percentage === null || isNaN(percentage)) {
    return '0,00%';
  }
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${Number(percentage).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

/**
 * Formatea una fecha en texto legible
 * @param {Date | string} dateInput
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

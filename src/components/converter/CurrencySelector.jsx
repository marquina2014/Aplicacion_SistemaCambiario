import React from 'react';

export const CURRENCY_OPTIONS = [
  { code: 'USD_BCV', name: 'Dólar BCV (Oficial)', symbol: '$ USD', icon: 'bi-currency-dollar' },
  { code: 'EUR_BCV', name: 'Euro BCV (Oficial)', symbol: '€ EUR', icon: 'bi-currency-euro' },
  { code: 'USDT', name: 'Tether USDT (P2P Cripto)', symbol: '₮ USDT', icon: 'bi-coin' },
  { code: 'USD_PAR', name: 'Dólar Paralelo (Mercado)', symbol: '$ Par', icon: 'bi-graph-up' },
  { code: 'VES', name: 'Bolívares (VES)', symbol: 'Bs.', icon: 'bi-cash-coin' },
];

/**
 * Selector neumórfico de divisas con soporte para BCV, Euro, USDT y Paralelo
 */
export function CurrencySelector({
  value = 'USD_BCV',
  onChange,
  label,
  disabled = false,
  className = '',
}) {
  // Normalizar valor si viene como 'USD' o 'EUR'
  const normalizedValue =
    value === 'USD' ? 'USD_BCV' : value === 'EUR' ? 'EUR_BCV' : value;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="form-label mb-2 fw-semibold text-secondary small">
          {label}
        </label>
      )}
      <div className="position-relative">
        <select
          value={normalizedValue}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="neu-input neu-select fw-semibold"
          style={{ cursor: 'pointer' }}
        >
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} • {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default CurrencySelector;

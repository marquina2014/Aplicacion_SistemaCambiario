import React from 'react';

/**
 * Accesos rápidos a denominaciones comunes (estilo botones de la referencia)
 */
export function QuickChips({
  values = [5, 10, 20, 50, 100, 500],
  currentAmount,
  onSelect,
  currency = 'USD_BCV',
  className = '',
}) {
  const getLabel = (val) => {
    if (currency === 'USDT') return `₮${val}`;
    if (currency.includes('EUR')) return `€${val}`;
    if (currency.includes('USD')) return `$${val}`;
    return `${val} Bs.`;
  };

  return (
    <div className={`d-flex flex-wrap gap-2 ${className}`}>
      {values.map((val) => {
        const isActive = Number(currentAmount) === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onSelect && onSelect(val)}
            className={`neu-chip ${isActive ? 'active' : ''}`}
          >
            {getLabel(val)}
          </button>
        );
      })}
    </div>
  );
}

export default QuickChips;

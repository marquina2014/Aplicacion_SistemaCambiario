import React, { useState } from 'react';
import NeumorphicCard from '../common/NeumorphicCard';
import TrendBadge from '../common/TrendBadge';
import { formatCurrency, formatDate } from '../../functions/utils/formatters';

/**
 * Tarjeta individual para mostrar una tasa cambiaria (BCV Euro, BCV USD, Paralelo)
 */
export function RateCard({
  title = 'Dólar BCV',
  subtitle = 'Tasa Oficial',
  price = 36.62,
  change = 0.15,
  symbol = 'USD',
  icon = 'bi-currency-dollar',
  lastUpdate,
  onSelectForConvert,
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(price.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NeumorphicCard className={`position-relative ${className}`}>
      {/* Cabecera de la tarjeta */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '42px',
              height: '42px',
              background: 'var(--neu-bg-card)',
              boxShadow: 'var(--neu-flat-xs)',
              color: 'var(--neu-accent-blue)',
              fontSize: '1.2rem',
            }}
          >
            <i className={`bi ${icon}`}></i>
          </div>
          <div>
            <h6 className="mb-0 fw-bold">{title}</h6>
            <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>
              {subtitle}
            </span>
          </div>
        </div>

        <TrendBadge value={change} />
      </div>

      {/* Precio prominente */}
      <div className="my-3">
        <div className="fs-2 fw-bold text-dark tracking-tight">
          {formatCurrency(price, 'VES')}
        </div>
        <div className="text-secondary small fw-medium">
          1 {symbol} = {price.toFixed(2)} Bs.
        </div>
      </div>

      {/* Pie con fecha y botón de acción rápida */}
      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
          <i className="bi bi-clock me-1"></i>
          {formatDate(lastUpdate) || 'Hoy'}
        </span>

        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            title="Copiar valor"
            className="btn btn-sm text-secondary p-1"
            style={{ fontSize: '0.85rem' }}
          >
            <i className={`bi ${copied ? 'bi-check-lg text-success' : 'bi-clipboard'}`}></i>
          </button>

          {onSelectForConvert && (
            <button
              type="button"
              onClick={() => onSelectForConvert(symbol, price)}
              className="neu-btn py-1 px-2 small"
              style={{ fontSize: '0.75rem' }}
            >
              Convertir
            </button>
          )}
        </div>
      </div>
    </NeumorphicCard>
  );
}

export default RateCard;

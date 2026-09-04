import React, { useState } from 'react';
import NeumorphicCard from '../common/NeumorphicCard';
import { formatCurrency } from '../../functions/utils/formatters';

/**
 * Tarjeta de resultado de conversión con desglose cruzado y botón para copiar
 */
export function ConversionResult({
  sourceAmount = 100,
  sourceCurrency = 'USD_BCV',
  resultAmount = 3662,
  targetCurrency = 'VES',
  crossRate = 36.62,
  rateLabel = 'Tasa Cruzada',
  igtfApplied = false,
  igtfData = { tax: 0, total: 0 },
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${formatCurrency(resultAmount, targetCurrency)}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCleanCode = (code) => {
    if (code === 'USD_BCV') return 'USD BCV';
    if (code === 'EUR_BCV') return 'EUR BCV';
    if (code === 'USD_PAR') return 'Paralelo';
    return code;
  };

  return (
    <NeumorphicCard variant="flat" className={`p-4 ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>
          RESULTADO DE CONVERSIÓN
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="neu-chip small d-flex align-items-center gap-1"
          style={{ fontSize: '0.78rem' }}
        >
          <i className={`bi ${copied ? 'bi-check-circle-fill text-success' : 'bi-clipboard'}`}></i>
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      {/* Monto de origen */}
      <div className="text-muted small">
        {formatCurrency(sourceAmount, sourceCurrency)} equivalen a:
      </div>

      {/* Monto principal convertido */}
      <div
        className="display-5 fw-bold my-2"
        style={{
          color: 'var(--neu-accent-blue)',
          wordBreak: 'break-word',
        }}
      >
        {formatCurrency(resultAmount, targetCurrency)}
      </div>

      {/* Referencia de tasa cruzada utilizada */}
      <div className="d-flex flex-wrap align-items-center justify-content-between pt-2 border-top border-light-subtle small">
        <span className="text-secondary">
          Equivalencia: <span className="fw-semibold text-dark">1 {getCleanCode(sourceCurrency)} = {crossRate < 0.01 ? crossRate.toFixed(6) : crossRate.toFixed(4)} {getCleanCode(targetCurrency)}</span>
        </span>
        <span className="badge rounded-pill bg-primary-subtle text-primary fw-semibold px-2 py-1">
          {rateLabel}
        </span>
      </div>

      {/* Desglose de IGTF (si está activo) */}
      {igtfApplied && targetCurrency === 'VES' && (
        <div
          className="mt-3 p-3 rounded-4"
          style={{
            backgroundColor: 'var(--neu-surface-active)',
            boxShadow: 'var(--neu-pressed)',
          }}
        >
          <div className="d-flex justify-content-between small text-secondary mb-1">
            <span>Impuesto IGTF (3%):</span>
            <span className="fw-semibold text-dark">{formatCurrency(igtfData.tax, 'VES')}</span>
          </div>
          <div className="d-flex justify-content-between small fw-bold text-dark border-top pt-1">
            <span>Total a pagar con IGTF:</span>
            <span className="text-primary">{formatCurrency(igtfData.total, 'VES')}</span>
          </div>
        </div>
      )}
    </NeumorphicCard>
  );
}

export default ConversionResult;

import React from 'react';
import NeumorphicCard from '../common/NeumorphicCard';
import CircularGauge from '../common/CircularGauge';
import NeumorphicButton from '../common/NeumorphicButton';
import { calculateSpread } from '../../functions/utils/calculations';
import { formatCurrency } from '../../functions/utils/formatters';

/**
 * Resumen central con medidor de brecha cambiaria y botones de acción
 * Inspirado directamente en el bloque central de la imagen de referencia.
 */
export function RateSummary({
  rates = {},
  onShare,
  onDownload,
  className = '',
}) {
  const bcvPrice = rates?.bcvUsd?.price || 36.62;
  const paraleloPrice = rates?.paralelo?.price || 40.25;
  const spread = calculateSpread(bcvPrice, paraleloPrice);
  const diffInBs = paraleloPrice - bcvPrice;

  return (
    <NeumorphicCard className={`p-4 ${className}`}>
      <div className="row align-items-center g-4">
        {/* Columna Izquierda: Información de Brecha y Botones */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-between">
          <div>
            <span
              className="text-secondary fw-bold text-uppercase small"
              style={{ letterSpacing: '1px' }}
            >
              MONITOR DE MERCADO CAMBIARIO
            </span>

            <div className="mt-2">
              <div className="display-6 fw-bold text-dark">
                +{diffInBs > 0 ? diffInBs.toFixed(2) : '0.00'} Bs.
              </div>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="badge rounded-pill bg-danger-subtle text-danger fw-bold px-2 py-1">
                  ▲ {spread.toFixed(2)}%
                </span>
                <span className="small text-secondary fw-medium">
                  Brecha sobre tasa BCV
                </span>
              </div>
            </div>

            <p className="text-muted small mt-3 mb-4">
              Diferencia de costo por divisa entre la cotización bancaria oficial del BCV ({formatCurrency(bcvPrice, 'VES')}) y el promedio de mercado paralelo ({formatCurrency(paraleloPrice, 'VES')}).
            </p>
          </div>

          {/* Botones de acción estilo píldora como en la imagen de referencia */}
          <div className="d-flex flex-wrap gap-2">
            <NeumorphicButton
              variant="default"
              icon="bi-share"
              onClick={onShare}
              className="px-3 py-2 small"
            >
              Compartir
            </NeumorphicButton>

            <NeumorphicButton
              variant="default"
              icon="bi-download"
              onClick={onDownload}
              className="px-3 py-2 small"
            >
              Guardar Reporte
            </NeumorphicButton>
          </div>
        </div>

        {/* Columna Derecha: Medidor Circular Neumórfico */}
        <div className="col-12 col-md-6 d-flex justify-content-center">
          <CircularGauge
            percentage={Math.min(spread * 3, 100)} // Escala visual proporcional
            value={`${spread.toFixed(1)}%`}
            title="BRECHA CAMBIARIA"
            subtitle={`Paralelo vs Oficial (${formatCurrency(paraleloPrice, 'VES')})`}
            size={190}
          />
        </div>
      </div>
    </NeumorphicCard>
  );
}

export default RateSummary;

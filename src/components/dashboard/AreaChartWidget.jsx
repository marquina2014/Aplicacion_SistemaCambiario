import React from 'react';
import NeumorphicCard from '../common/NeumorphicCard';

/**
 * Gráfico de Área Neumórfico con Montañas Superpuestas
 * Fiel al widget lateral derecho de la imagen de referencia.
 */
export function AreaChartWidget({
  mainValue = '36.62',
  title = 'TASA OFICIAL BCV',
  subtitle = 'Variación mensual acumulada',
  className = '',
}) {
  return (
    <NeumorphicCard className={`p-4 ${className}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <div className="display-6 fw-bold mb-0" style={{ color: 'var(--neu-text-main)' }}>
            {mainValue}
          </div>
          <div className="small text-secondary fw-semibold">
            {title}
          </div>
          <div className="small text-muted" style={{ fontSize: '0.72rem' }}>
            {subtitle}
          </div>
        </div>

        {/* Indicador de estado */}
        <div
          className="rounded-circle"
          style={{
            width: '10px',
            height: '10px',
            background: 'var(--neu-accent-blue)',
            boxShadow: '0 0 8px rgba(43, 89, 255, 0.8)',
          }}
        />
      </div>

      {/* Gráfico de Ondas / Montañas */}
      <div className="position-relative w-100 mt-3" style={{ height: '150px' }}>
        <svg
          viewBox="0 0 300 150"
          className="w-100 h-100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Gradiente azul vibrante */}
            <linearGradient id="areaBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2b59ff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#4175fc" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2b59ff" stopOpacity="0.05" />
            </linearGradient>

            {/* Gradiente gris / secundario */}
            <linearGradient id="areaGrayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Montaña de fondo gris (Paralelo) */}
          <path
            d="M 0 150 
               L 0 110 
               Q 45 60, 80 100 
               T 160 85 
               T 230 45 
               T 300 100 
               L 300 150 Z"
            fill="url(#areaGrayGradient)"
          />

          {/* Montaña frontal azul brillante (BCV) */}
          <path
            d="M 0 150 
               L 0 130 
               Q 50 110, 95 80 
               T 180 100 
               T 245 15 
               T 300 60 
               L 300 150 Z"
            fill="url(#areaBlueGradient)"
          />

          {/* Línea de contorno azul */}
          <path
            d="M 0 130 
               Q 50 110, 95 80 
               T 180 100 
               T 245 15 
               T 300 60"
            fill="none"
            stroke="#2b59ff"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Punto álgido con halo */}
          <circle cx="245" cy="15" r="5" fill="#2b59ff" stroke="#ffffff" strokeWidth="2" />
          <circle cx="245" cy="15" r="9" fill="none" stroke="#2b59ff" strokeOpacity="0.3" strokeWidth="2" />
        </svg>
      </div>

      {/* Slider decorativo inferior integrado idéntico al del diseño */}
      <div className="mt-3">
        <div
          className="position-relative w-100"
          style={{
            height: '6px',
            backgroundColor: 'var(--neu-bg-card)',
            boxShadow: 'var(--neu-pressed)',
            borderRadius: '999px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '78%',
              background: 'var(--neu-primary-gradient)',
              borderRadius: '999px',
            }}
          />
          <div
            className="rounded-circle"
            style={{
              position: 'absolute',
              top: '50%',
              left: '78%',
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '14px',
              background: '#ffffff',
              boxShadow: 'var(--neu-flat-xs)',
              border: '3px solid var(--neu-accent-blue)',
            }}
          />
        </div>
      </div>
    </NeumorphicCard>
  );
}

export default AreaChartWidget;

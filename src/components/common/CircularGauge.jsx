import React from 'react';

/**
 * Medidor Circular Neumórfico (Circular Progress Gauge)
 * Inspirado en el componente central de la imagen de referencia.
 * @param {Object} props
 * @param {number} props.percentage Porcentaje a mostrar (0 a 100)
 * @param {string} props.title Título superior
 * @param {string} props.value Texto o valor principal (ej: '+9.91%')
 * @param {string} props.subtitle Subtítulo descriptivo
 * @param {number} [props.size=170] Diámetro del componente en píxeles
 */
export function CircularGauge({
  percentage = 75,
  title = 'BRECHA CAMBIARIA',
  value = '9.91%',
  subtitle = 'Diferencia Paralelo vs BCV',
  size = 180,
}) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  // Ángulo de apertura (arco de 270 grados estilo medidor)
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center">
      {title && (
        <span className="text-secondary fw-bold text-uppercase small mb-2" style={{ letterSpacing: '1px' }}>
          {title}
        </span>
      )}

      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{ width: size, height: size }}
      >
        {/* SVG para el arco exterior */}
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track de fondo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#d5dce6"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
          {/* Arco activo azul eléctrico */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#blueGaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out',
            }}
          />
          <defs>
            <linearGradient id="blueGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2b59ff" />
              <stop offset="100%" stopColor="#00d2ff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Disco interior neumórfico con relieve */}
        <div
          className="position-absolute rounded-circle d-flex flex-column align-items-center justify-content-center"
          style={{
            width: size - 46,
            height: size - 46,
            background: 'var(--neu-bg-card)',
            boxShadow: 'var(--neu-flat-sm)',
            border: '2px solid rgba(255, 255, 255, 0.9)',
          }}
        >
          <span className="fw-bold fs-4" style={{ color: 'var(--neu-accent-blue)' }}>
            {safePercentage.toFixed(1)}%
          </span>
          <span className="small text-muted" style={{ fontSize: '0.68rem' }}>
            {value}
          </span>
        </div>
      </div>

      {subtitle && (
        <span className="text-secondary small mt-2 fw-medium">
          {subtitle}
        </span>
      )}
    </div>
  );
}

export default CircularGauge;

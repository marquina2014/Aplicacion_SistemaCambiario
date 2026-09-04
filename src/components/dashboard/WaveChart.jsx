import React from 'react';
import NeumorphicCard from '../common/NeumorphicCard';

/**
 * Mini gráfica de ondas (Wave Chart / Sparkline)
 * Inspirada en el widget "Last 7 days" de la imagen de referencia.
 */
export function WaveChart({
  title = 'Últimos 7 días',
  change = '+0.85%',
  points = [36.4, 36.45, 36.5, 36.55, 36.58, 36.62, 36.62],
  className = '',
}) {
  // Normalizar los puntos a un viewBox de SVG (ancho: 240, alto: 60)
  const minVal = Math.min(...points) * 0.999;
  const maxVal = Math.max(...points) * 1.001;
  const width = 240;
  const height = 50;

  const getCoordinates = () => {
    return points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * (width - 20) + 10;
      const normalized = (val - minVal) / (maxVal - minVal || 1);
      const y = height - normalized * (height - 20) - 10;
      return { x, y };
    });
  };

  const coords = getCoordinates();

  // Crear curva SVG suave (Catmull-Rom o Bezier simple)
  const pathD = coords.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (curr.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (curr.x - prev.x) / 2;
    const cy2 = curr.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
  }, '');

  const lastPoint = coords[coords.length - 1];

  return (
    <NeumorphicCard className={`p-3 ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <div className="small text-secondary fw-semibold">{title}</div>
          <div className="fw-bold small d-flex align-items-center gap-1 text-success">
            <i className="bi bi-caret-up-fill" style={{ fontSize: '0.7rem' }}></i>
            {change}
          </div>
        </div>
      </div>

      <div className="w-100 overflow-hidden d-flex justify-content-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '55px', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="waveLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2b59ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2b59ff" stopOpacity="1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#2b59ff" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Línea de onda curva */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#waveLineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Punto activo al final con relieve */}
          {lastPoint && (
            <g>
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="6"
                fill="#2b59ff"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="10"
                fill="none"
                stroke="#2b59ff"
                strokeOpacity="0.3"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>
    </NeumorphicCard>
  );
}

export default WaveChart;

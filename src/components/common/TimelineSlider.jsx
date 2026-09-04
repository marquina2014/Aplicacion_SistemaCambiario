import React from 'react';

/**
 * Componente Timeline / Barra de Selección Temporal Neumórfica
 * Inspirado en la barra inferior de la imagen de referencia.
 */
export function TimelineSlider({
  items = ['2021', '2022', '2023', '2024', '2025', '2026'],
  selectedIndex = 5,
  onSelect,
  className = '',
}) {
  return (
    <div className={`p-3 p-md-4 neu-card ${className}`}>
      <div className="position-relative py-3">
        {/* Track de fondo */}
        <div
          className="position-relative"
          style={{
            height: '8px',
            backgroundColor: 'var(--neu-bg-card)',
            boxShadow: 'var(--neu-pressed)',
            borderRadius: '999px',
          }}
        >
          {/* Barra de progreso azul */}
          <div
            style={{
              height: '100%',
              width: `${(selectedIndex / (items.length - 1)) * 100}%`,
              background: 'var(--neu-primary-gradient)',
              borderRadius: '999px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Nodos de la línea de tiempo */}
        <div className="position-absolute top-50 start-0 w-100 translate-middle-y d-flex justify-content-between px-1">
          {items.map((item, index) => {
            const isActive = index === selectedIndex;
            return (
              <div
                key={item}
                className="d-flex flex-column align-items-center"
                style={{ cursor: 'pointer', transform: 'translateY(12px)' }}
                onClick={() => onSelect && onSelect(index)}
              >
                {/* Botón circular / Nodo */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center transition"
                  style={{
                    width: '22px',
                    height: '22px',
                    background: isActive ? 'var(--neu-accent-blue)' : 'var(--neu-bg-card)',
                    boxShadow: isActive
                      ? '0 0 12px rgba(43, 89, 255, 0.7)'
                      : 'var(--neu-flat-xs)',
                    border: '2px solid #ffffff',
                    transform: 'translateY(-23px)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isActive && (
                    <div
                      className="rounded-circle bg-white"
                      style={{ width: '6px', height: '6px' }}
                    />
                  )}
                </div>

                {/* Etiqueta / Año */}
                <span
                  className={`small transition px-2 py-1 rounded-pill ${
                    isActive
                      ? 'fw-bold text-white bg-primary shadow-sm'
                      : 'text-secondary fw-semibold'
                  }`}
                  style={{
                    fontSize: '0.75rem',
                    background: isActive ? 'var(--neu-accent-blue)' : 'transparent',
                    marginTop: '-16px',
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimelineSlider;

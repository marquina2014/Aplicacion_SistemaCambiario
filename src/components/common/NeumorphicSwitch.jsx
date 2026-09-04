import React from 'react';

/**
 * Switch Toggle Neumórfico ON / OFF (Fiel al diseño de la imagen)
 */
export function NeumorphicSwitch({
  checked = false,
  onChange,
  labelLeft,
  labelRight,
  className = '',
}) {
  const handleToggle = () => {
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      {labelLeft && (
        <span className="small fw-semibold text-secondary user-select-none">
          {labelLeft}
        </span>
      )}
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={`neu-switch-container ${checked ? 'active' : ''}`}
        title={checked ? 'Activado (ON)' : 'Desactivado (OFF)'}
      >
        <div className="neu-switch-knob">
          {checked ? 'ON' : 'OFF'}
        </div>
      </div>
      {labelRight && (
        <span className="small fw-semibold text-secondary user-select-none">
          {labelRight}
        </span>
      )}
    </div>
  );
}

export default NeumorphicSwitch;

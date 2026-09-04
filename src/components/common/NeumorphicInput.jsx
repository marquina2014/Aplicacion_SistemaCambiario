import React from 'react';

/**
 * Componente de Entrada de Texto / Numérica Neumórfica (Hundida / Inset)
 */
export function NeumorphicInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  iconRight,
  iconLeft,
  prefix,
  className = '',
  wrapperClassName = '',
  error,
  disabled = false,
  ...rest
}) {
  return (
    <div className={`mb-3 ${wrapperClassName}`}>
      {label && (
        <label className="form-label mb-2 fw-semibold text-secondary small">
          {label}
        </label>
      )}
      <div className="position-relative d-flex align-items-center">
        {prefix && (
          <span
            className="position-absolute start-0 ps-3 text-secondary fw-bold user-select-none"
            style={{ zIndex: 2 }}
          >
            {prefix}
          </span>
        )}
        {iconLeft && (
          <span
            className="position-absolute start-0 ps-3 text-secondary user-select-none"
            style={{ zIndex: 2 }}
          >
            <i className={`bi ${iconLeft}`}></i>
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`neu-input ${className}`}
          style={{
            paddingLeft: prefix ? '54px' : iconLeft ? '44px' : '18px',
            paddingRight: iconRight ? '44px' : '18px',
          }}
          {...rest}
        />
        {iconRight && (
          <span
            className="position-absolute end-0 pe-3 text-secondary user-select-none"
            style={{ zIndex: 2 }}
          >
            <i className={`bi ${iconRight}`}></i>
          </span>
        )}
      </div>
      {error && <div className="text-danger small mt-1 ps-2">{error}</div>}
    </div>
  );
}

export default NeumorphicInput;

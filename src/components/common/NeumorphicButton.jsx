import React from 'react';

/**
 * Componente Botón Neumórfico
 * @param {Object} props
 * @param {'default' | 'primary' | 'icon' | 'chip'} [props.variant='default']
 * @param {boolean} [props.active=false]
 * @param {string} [props.icon] Nombre de clase de Bootstrap Icon (ej: 'bi-house-door')
 * @param {string} [props.label] Texto secundario (para botones de icono)
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export function NeumorphicButton({
  children,
  variant = 'default',
  active = false,
  icon,
  label,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  style = {},
  ...rest
}) {
  let buttonClass = 'neu-btn';

  if (variant === 'primary') {
    buttonClass = 'neu-btn neu-btn-primary';
  } else if (variant === 'icon') {
    buttonClass = `neu-icon-btn ${active ? 'active' : ''}`;
  } else if (variant === 'chip') {
    buttonClass = `neu-chip ${active ? 'active' : ''}`;
  } else if (active) {
    buttonClass += ' active';
  }

  if (variant === 'icon') {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`${buttonClass} ${className}`}
        style={style}
        {...rest}
      >
        {icon && <i className={`bi ${icon}`}></i>}
        {label && <span>{label}</span>}
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${buttonClass} ${className}`}
      style={style}
      {...rest}
    >
      {icon && <i className={`bi ${icon}`}></i>}
      {children}
    </button>
  );
}

export default NeumorphicButton;

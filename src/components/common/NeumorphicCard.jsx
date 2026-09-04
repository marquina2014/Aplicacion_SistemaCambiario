import React from 'react';

/**
 * Componente Tarjeta Neumórfica (Soft UI)
 * @param {Object} props
 * @param {'flat' | 'pressed' | 'sm'} [props.variant='flat']
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 * @param {Object} [props.style={}]
 */
export function NeumorphicCard({
  children,
  variant = 'flat',
  className = '',
  style = {},
  ...rest
}) {
  let variantClass = 'neu-card';
  if (variant === 'pressed') variantClass = 'neu-card-pressed';
  if (variant === 'sm') variantClass = 'neu-card-sm';

  return (
    <div
      className={`${variantClass} p-3 p-md-4 ${className}`}
      style={{ ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default NeumorphicCard;

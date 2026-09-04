import React from 'react';
import { formatPercentage } from '../../functions/utils/formatters';

/**
 * Badge neumórfico de variación porcentual
 */
export function TrendBadge({ value = 0, className = '' }) {
  const num = Number(value) || 0;

  if (num > 0) {
    return (
      <span className={`neu-badge-up ${className}`}>
        <i className="bi bi-caret-up-fill"></i>
        {formatPercentage(num)}
      </span>
    );
  }

  if (num < 0) {
    return (
      <span className={`neu-badge-down ${className}`}>
        <i className="bi bi-caret-down-fill"></i>
        {formatPercentage(num)}
      </span>
    );
  }

  return (
    <span className={`neu-badge-neutral ${className}`}>
      <i className="bi bi-dash"></i>
      {formatPercentage(num)}
    </span>
  );
}

export default TrendBadge;

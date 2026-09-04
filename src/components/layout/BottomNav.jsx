import React from 'react';

/**
 * Barra de Navegación Flotante Inferior para Dispositivos Móviles (Celulares)
 */
export function BottomNav({
  activeTab = 'dashboard',
  onTabChange,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Monitor', icon: 'bi-speedometer2' },
    { id: 'converter', label: 'Conversor', icon: 'bi-calculator-fill' },
    { id: 'history', label: 'Historial', icon: 'bi-graph-up' },
    { id: 'settings', label: 'Ajustes', icon: 'bi-gear-fill' },
  ];

  return (
    <nav className="d-flex d-md-none neu-bottom-nav">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange && onTabChange(item.id)}
            className={`neu-bottom-nav-item border-0 bg-transparent ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;

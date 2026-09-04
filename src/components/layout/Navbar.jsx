import React from 'react';
import NeumorphicButton from '../common/NeumorphicButton';
import { isSupabaseConfigured } from '../../functions/services/supabaseClient';

/**
 * Barra superior de navegación responsiva (PC y Tablets)
 * Incluye los botones icónicos cuadrados inspirados en la imagen y selector de tema claro/oscuro.
 */
export function Navbar({
  activeTab = 'dashboard',
  onTabChange,
  onRefresh,
  loading = false,
  theme = 'light',
  onToggleTheme,
}) {
  return (
    <header className="py-3 px-3 px-md-4 mb-4">
      <div className="container-fluid max-width-xl d-flex justify-content-between align-items-center">
        {/* Logo y Marca */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '46px',
              height: '46px',
              background: 'var(--neu-primary-gradient)',
              boxShadow: 'var(--neu-primary-shadow)',
              color: '#ffffff',
              fontSize: '1.3rem',
            }}
          >
            <i className="bi bi-arrow-repeat"></i>
          </div>

          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0 fw-bold tracking-tight text-dark">Al Cambio</h5>
              <span className="badge rounded-pill bg-primary px-2 py-1" style={{ fontSize: '0.65rem' }}>
                PRO
              </span>
            </div>
            <div className="d-flex align-items-center gap-2 small text-muted" style={{ fontSize: '0.72rem' }}>
              <span className="d-inline-block rounded-circle bg-success" style={{ width: '6px', height: '6px' }}></span>
              <span>BCV, Euro & USDT</span>
              <span className="text-secondary">•</span>
              <i className="bi bi-shield-check text-primary" title="Conexión Segura HTTPS"></i>
              <span>HTTPS</span>
              {isSupabaseConfigured && (
                <>
                  <span className="text-secondary">•</span>
                  <span className="text-success fw-semibold">Supabase ON</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controles de Navegación y Botón de Tema */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Navegación Desktop */}
          <div className="d-none d-md-flex align-items-center gap-3">
            <NeumorphicButton
              variant="icon"
              icon="bi-house-door-fill"
              label="Inicio"
              active={activeTab === 'dashboard'}
              onClick={() => onTabChange && onTabChange('dashboard')}
            />

            <NeumorphicButton
              variant="icon"
              icon="bi-calculator-fill"
              label="Conversor"
              active={activeTab === 'converter'}
              onClick={() => onTabChange && onTabChange('converter')}
            />

            <NeumorphicButton
              variant="icon"
              icon="bi-graph-up-arrow"
              label="Historial"
              active={activeTab === 'history'}
              onClick={() => onTabChange && onTabChange('history')}
            />

            <NeumorphicButton
              variant="icon"
              icon="bi-gear-fill"
              label="Ajustes"
              active={activeTab === 'settings'}
              onClick={() => onTabChange && onTabChange('settings')}
            />
          </div>

          {/* Botón de Modo Oscuro / Modo Claro (visible en PC y Móvil) */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            className="neu-icon-btn"
            style={{ width: '46px', height: '46px' }}
          >
            <i
              className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'}`}
              style={{ fontSize: '1.2rem' }}
            ></i>
          </button>

          {/* Botón de recarga suave */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            title="Actualizar tasas"
            className="neu-icon-btn"
            style={{ width: '46px', height: '46px' }}
          >
            <i className={`bi bi-arrow-clockwise ${loading ? 'spin-animation text-primary' : ''}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

import React, { useState, useRef, useEffect } from 'react';
import NeumorphicButton from '../common/NeumorphicButton';
import { isSupabaseConfigured } from '../../functions/services/supabaseClient';
import { useAuth } from '../../context/AuthContext';

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
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Usuario';

  const userInitial = displayName.charAt(0).toUpperCase();

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

          {/* Menú de Usuario Autenticado / Botón de Iniciar Sesión */}
          {user ? (
            <div className="position-relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="neu-btn px-2 px-md-3 py-2 d-flex align-items-center gap-2"
                style={{ height: '46px', borderRadius: 'var(--neu-radius-md)' }}
                title={`Sesión activa: ${displayName}`}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: '28px',
                    height: '28px',
                    background: 'var(--neu-primary-gradient)',
                    fontSize: '0.8rem',
                  }}
                >
                  {userInitial}
                </div>
                <span className="d-none d-lg-inline small fw-bold text-truncate" style={{ maxWidth: '110px' }}>
                  {displayName}
                </span>
                <i className="bi bi-chevron-down small text-muted"></i>
              </button>

              {/* Menú Desplegable Neumórfico */}
              {userMenuOpen && (
                <div
                  className="position-absolute end-0 mt-2 p-2 neu-card shadow-lg"
                  style={{
                    minWidth: '220px',
                    zIndex: 1050,
                    background: 'var(--neu-bg-card)',
                  }}
                >
                  <div className="px-3 py-2 border-bottom border-light-subtle mb-1">
                    <div className="fw-bold small text-dark text-truncate">{displayName}</div>
                    <div className="text-muted small text-truncate" style={{ fontSize: '0.72rem' }}>
                      {user.email}
                    </div>
                    <span className="badge bg-success-subtle text-success mt-1" style={{ fontSize: '0.65rem' }}>
                      Sesión Activa
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-100 btn btn-link text-decoration-none text-dark text-start px-3 py-2 small d-flex align-items-center gap-2 rounded-2"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onTabChange?.('settings');
                    }}
                  >
                    <i className="bi bi-gear text-primary"></i>
                    <span>Mi Cuenta y Ajustes</span>
                  </button>

                  <button
                    type="button"
                    className="w-100 btn btn-link text-decoration-none text-danger text-start px-3 py-2 small d-flex align-items-center gap-2 rounded-2"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NeumorphicButton
              variant="default"
              className="px-3 py-2"
              style={{ height: '46px' }}
              active={activeTab === 'auth'}
              onClick={() => onTabChange && onTabChange('auth')}
              title="Iniciar Sesión o Crear Cuenta"
            >
              <i className="bi bi-person-fill text-primary"></i>
              <span className="d-none d-sm-inline small">Ingresar</span>
            </NeumorphicButton>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

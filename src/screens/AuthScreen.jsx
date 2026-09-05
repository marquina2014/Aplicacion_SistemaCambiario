import React, { useState } from 'react';
import NeumorphicCard from '../components/common/NeumorphicCard';
import NeumorphicButton from '../components/common/NeumorphicButton';
import NeumorphicInput from '../components/common/NeumorphicInput';
import NeumorphicSwitch from '../components/common/NeumorphicSwitch';
import { useAuth } from '../context/AuthContext';

/**
 * Pantalla de Autenticación: Login y Registro
 * Integrada con diseño Neumórfico, soporte para Supabase Auth y modo local/invitado.
 */
export function AuthScreen({
  initialMode = 'login',
  onSuccess,
  onNavigateHome,
}) {
  const { login, register, continueAsGuest, isSupabaseConfigured } = useAuth();

  // Modo: 'login' | 'register'
  const [mode, setMode] = useState(initialMode);

  // Estados del Formulario de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Estados del Formulario de Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Estados de UI y Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  // Cálculo de fuerza de contraseña
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Introduce contraseña', color: 'bg-secondary' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass) || /[A-Z]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: 'Débil (mínimo 6 caracteres)', color: 'bg-danger' };
    if (score === 2) return { score: 2, text: 'Aceptable', color: 'bg-warning' };
    if (score === 3) return { score: 3, text: 'Buena', color: 'bg-primary' };
    return { score: 4, text: 'Excelente y Segura', color: 'bg-success' };
  };

  const passwordStrength = calculatePasswordStrength(regPassword);

  // Manejar Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(loginEmail, loginPassword, rememberMe);
      const displayName = loggedUser.user_metadata?.full_name || loggedUser.email;
      setSuccessMessage(`¡Bienvenido de nuevo, ${displayName}!`);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(loggedUser);
        } else if (onNavigateHome) {
          onNavigateHome();
        }
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar Registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Por favor completa todos los campos requeridos.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Debes aceptar los términos y condiciones para crear tu cuenta.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register(regName, regEmail, regPassword);
      setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo...');

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(newUser);
        } else if (onNavigateHome) {
          onNavigateHome();
        }
      }, 900);
    } catch (err) {
      setErrorMessage(err.message || 'Error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  // Continuar como Invitado
  const handleGuest = () => {
    continueAsGuest();
    if (onNavigateHome) onNavigateHome();
  };

  return (
    <div className="container-fluid max-width-lg pb-5 pt-2 pt-md-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          {/* Tarjeta Principal Neumórfica */}
          <NeumorphicCard className="p-4 p-md-5">
            {/* Cabecera / Identidad */}
            <div className="text-center mb-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--neu-primary-gradient)',
                  boxShadow: 'var(--neu-primary-shadow)',
                  color: '#ffffff',
                  fontSize: '1.8rem',
                }}
              >
                <i className="bi bi-arrow-repeat"></i>
              </div>

              <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <h3 className="fw-bold mb-0 text-dark">Al Cambio</h3>
                <span className="badge rounded-pill bg-primary px-2 py-1" style={{ fontSize: '0.7rem' }}>
                  PRO
                </span>
              </div>

              <p className="text-secondary small mb-0">
                {mode === 'login'
                  ? 'Accede a tu cuenta para sincronizar alertas y favoritos'
                  : 'Regístrate para disfrutar de la experiencia cambiaria completa'}
              </p>
            </div>

            {/* Selector Neumórfico de Pestañas (Tabs) */}
            <div
              className="d-flex p-1 mb-4 rounded-pill neu-card-pressed"
              style={{ background: 'var(--neu-surface)' }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-fill border-0 rounded-pill py-2 px-3 fw-semibold small transition-all ${
                  mode === 'login'
                    ? 'neu-btn-primary shadow-sm'
                    : 'bg-transparent text-secondary'
                }`}
                style={{ transition: 'all 0.25s ease' }}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-fill border-0 rounded-pill py-2 px-3 fw-semibold small transition-all ${
                  mode === 'register'
                    ? 'neu-btn-primary shadow-sm'
                    : 'bg-transparent text-secondary'
                }`}
                style={{ transition: 'all 0.25s ease' }}
              >
                <i className="bi bi-person-plus me-2"></i>
                Crear Cuenta
              </button>
            </div>

            {/* Mensajes de Alerta */}
            {errorMessage && (
              <div
                className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4 rounded-3 small border-0"
                role="alert"
                style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#e11d48' }}
              >
                <i className="bi bi-exclamation-triangle-fill fs-6"></i>
                <div>{errorMessage}</div>
              </div>
            )}

            {successMessage && (
              <div
                className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-4 rounded-3 small border-0"
                role="alert"
                style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}
              >
                <i className="bi bi-check-circle-fill fs-6"></i>
                <div>{successMessage}</div>
              </div>
            )}

            {/* AVISO OLVIDÓ CONTRASEÑA */}
            {forgotPasswordNotice && (
              <div
                className="alert alert-info py-2 px-3 mb-4 rounded-3 small border-0"
                style={{ background: 'rgba(43, 89, 255, 0.12)', color: 'var(--neu-accent-blue)' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold">
                    <i className="bi bi-info-circle-fill me-1"></i> Recuperación de contraseña
                  </span>
                  <button
                    type="button"
                    className="btn-close btn-close-sm"
                    onClick={() => setForgotPasswordNotice(false)}
                    aria-label="Cerrar"
                    style={{ fontSize: '0.65rem' }}
                  ></button>
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  {isSupabaseConfigured
                    ? 'Introduce tu correo en el campo y contáctanos para enviarte un enlace de recuperación.'
                    : 'En el modo de prueba local, puedes registrar un nuevo usuario o restablecer el almacenamiento borrando los datos del navegador.'}
                </div>
              </div>
            )}

            {/* ================= FORMULARIO DE LOGIN ================= */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} noValidate>
                <NeumorphicInput
                  label="Correo Electrónico"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  iconLeft="bi-envelope-at"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={loading}
                  required
                />

                <NeumorphicInput
                  label="Contraseña"
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña secreta"
                  iconLeft="bi-shield-lock"
                  iconRight={showLoginPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}
                  onIconRightClick={() => setShowLoginPassword(!showLoginPassword)}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loading}
                  required
                />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <NeumorphicSwitch
                      checked={rememberMe}
                      onChange={setRememberMe}
                      labelRight="Recordarme"
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none small text-primary fw-semibold"
                    style={{ fontSize: '0.82rem' }}
                    onClick={() => setForgotPasswordNotice(true)}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="d-grid mb-3">
                  <NeumorphicButton
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 py-3"
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </NeumorphicButton>
                </div>

                <div className="text-center my-3 text-secondary position-relative">
                  <hr className="my-3 opacity-25" />
                  <span
                    className="position-absolute top-50 start-50 translate-middle px-3 small fw-semibold text-muted"
                    style={{ background: 'var(--neu-bg-card)' }}
                  >
                    o también
                  </span>
                </div>

                <div className="d-grid mb-4">
                  <NeumorphicButton
                    variant="default"
                    type="button"
                    onClick={handleGuest}
                    className="w-100 py-2"
                  >
                    <i className="bi bi-person me-2"></i>
                    Continuar como Invitado
                  </NeumorphicButton>
                </div>

                <div className="text-center small text-secondary">
                  ¿No tienes una cuenta aún?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-primary fw-bold text-decoration-none small"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                    }}
                  >
                    Regístrate aquí
                  </button>
                </div>
              </form>
            )}

            {/* ================= FORMULARIO DE REGISTRO ================= */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} noValidate>
                <NeumorphicInput
                  label="Nombre Completo"
                  type="text"
                  placeholder="Tu Nombre y Apellido"
                  iconLeft="bi-person"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  disabled={loading}
                  required
                />

                <NeumorphicInput
                  label="Correo Electrónico"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  iconLeft="bi-envelope-at"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  disabled={loading}
                  required
                />

                <NeumorphicInput
                  label="Contraseña"
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  iconLeft="bi-shield-lock"
                  iconRight={showRegPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}
                  onIconRightClick={() => setShowRegPassword(!showRegPassword)}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  disabled={loading}
                  required
                />

                {/* Indicador de Fuerza de Contraseña */}
                {regPassword && (
                  <div className="mb-3 px-1">
                    <div className="d-flex justify-content-between align-items-center small mb-1">
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Seguridad de la contraseña:
                      </span>
                      <span
                        className="fw-bold"
                        style={{ fontSize: '0.75rem', color: 'var(--neu-text-main)' }}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div
                      className="progress"
                      style={{ height: '5px', background: 'rgba(0,0,0,0.06)' }}
                    >
                      <div
                        className={`progress-bar ${passwordStrength.color}`}
                        role="progressbar"
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        aria-valuenow={passwordStrength.score}
                        aria-valuemin="0"
                        aria-valuemax="4"
                      ></div>
                    </div>
                  </div>
                )}

                <NeumorphicInput
                  label="Confirmar Contraseña"
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  iconLeft="bi-check2-shield"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />

                {/* Términos y Condiciones */}
                <div className="form-check mb-4 ps-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="termsCheck"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={loading}
                    style={{ cursor: 'pointer' }}
                  />
                  <label
                    className="form-check-label small text-secondary user-select-none"
                    htmlFor="termsCheck"
                    style={{ cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    Acepto los Términos de Servicio y la Política de Privacidad de Al Cambio.
                  </label>
                </div>

                <div className="d-grid mb-3">
                  <NeumorphicButton
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100 py-3"
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus-fill me-2"></i>
                        Crear Cuenta
                      </>
                    )}
                  </NeumorphicButton>
                </div>

                <div className="text-center small text-secondary mt-3">
                  ¿Ya tienes una cuenta registrada?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-primary fw-bold text-decoration-none small"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                  >
                    Inicia sesión aquí
                  </button>
                </div>
              </form>
            )}

            {/* Badge de Estado del Backend al pie de la tarjeta */}
            <div className="pt-4 mt-4 border-top border-light-subtle d-flex flex-wrap justify-content-between align-items-center gap-2 small text-muted">
              <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.73rem' }}>
                <span
                  className={`d-inline-block rounded-circle ${
                    isSupabaseConfigured ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ width: '8px', height: '8px' }}
                ></span>
                <span>
                  {isSupabaseConfigured
                    ? 'Autenticación con Supabase Cloud'
                    : 'Modo Local / Simulación segura en navegador'}
                </span>
              </div>

              {onNavigateHome && (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="btn btn-link p-0 text-secondary text-decoration-none small d-flex align-items-center gap-1"
                  style={{ fontSize: '0.73rem' }}
                >
                  <i className="bi bi-arrow-left"></i>
                  <span>Volver al Monitor</span>
                </button>
              )}
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;

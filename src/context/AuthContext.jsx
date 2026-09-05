import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../functions/services/supabaseClient';

const AuthContext = createContext(null);

const LOCAL_USERS_KEY = 'al_cambio_local_users';
const LOCAL_SESSION_KEY = 'al_cambio_local_session';

/**
 * Proveedor de Autenticación Híbrido
 * Soporta Supabase Auth de forma nativa cuando las credenciales están en .env,
 * y cuenta con un fallback transparente a localStorage para desarrollo y pruebas inmediatas.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar estado de sesión
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          // 1. Obtener sesión de Supabase
          const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          if (mounted) {
            setSession(initialSession);
            setUser(initialSession?.user || null);
          }

          // Escuchar cambios de estado en Supabase
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (mounted) {
              setSession(currentSession);
              setUser(currentSession?.user || null);
            }
          });

          return () => {
            subscription?.unsubscribe();
          };
        } else {
          // 2. Modo Local (localStorage)
          const storedSession = localStorage.getItem(LOCAL_SESSION_KEY);
          if (storedSession) {
            try {
              const parsedUser = JSON.parse(storedSession);
              if (mounted) {
                setUser(parsedUser);
                setSession({ user: parsedUser, local: true });
              }
            } catch {
              localStorage.removeItem(LOCAL_SESSION_KEY);
            }
          }
        }
      } catch (err) {
        console.error('Error inicializando autenticación:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Registro de un nuevo usuario
   */
  const register = useCallback(async (fullName, email, password) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanEmail || !password || !cleanName) {
      const err = new Error('Todos los campos son obligatorios');
      setError(err.message);
      throw err;
    }

    if (password.length < 6) {
      const err = new Error('La contraseña debe tener al menos 6 caracteres');
      setError(err.message);
      throw err;
    }

    if (isSupabaseConfigured && supabase) {
      // Registro en Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            name: cleanName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        throw signUpError;
      }

      setUser(data.user);
      setSession(data.session);
      return data.user;
    } else {
      // Registro Local (Simulado)
      const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
      const users = rawUsers ? JSON.parse(rawUsers) : [];

      const existing = users.find((u) => u.email === cleanEmail);
      if (existing) {
        const err = new Error('Este correo electrónico ya está registrado');
        setError(err.message);
        throw err;
      }

      const newUser = {
        id: 'local_' + Date.now(),
        email: cleanEmail,
        user_metadata: {
          full_name: cleanName,
          name: cleanName,
        },
        password, // Almacenado localmente para simulación
        createdAt: new Date().toISOString(),
        isLocal: true,
      };

      users.push(newUser);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

      // Guardar sesión activa
      const sessionUser = {
        id: newUser.id,
        email: newUser.email,
        user_metadata: newUser.user_metadata,
        createdAt: newUser.createdAt,
        isLocal: true,
      };

      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      setSession({ user: sessionUser, local: true });
      return sessionUser;
    }
  }, []);

  /**
   * Inicio de Sesión
   */
  const login = useCallback(async (email, password, rememberMe = true) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      const err = new Error('Por favor ingresa tu correo y contraseña');
      setError(err.message);
      throw err;
    }

    if (isSupabaseConfigured && supabase) {
      // Login en Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        throw signInError;
      }

      setUser(data.user);
      setSession(data.session);
      return data.user;
    } else {
      // Login Local
      const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
      const users = rawUsers ? JSON.parse(rawUsers) : [];

      const found = users.find(
        (u) => u.email === cleanEmail && u.password === password
      );

      if (!found) {
        const err = new Error('Credenciales inválidas. Verifica tu correo y contraseña');
        setError(err.message);
        throw err;
      }

      const sessionUser = {
        id: found.id,
        email: found.email,
        user_metadata: found.user_metadata,
        createdAt: found.createdAt,
        isLocal: true,
      };

      if (rememberMe) {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
      } else {
        sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
      }

      setUser(sessionUser);
      setSession({ user: sessionUser, local: true });
      return sessionUser;
    }
  }, []);

  /**
   * Cerrar Sesión
   */
  const logout = useCallback(async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Error al cerrar sesión en Supabase:', e);
    } finally {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      sessionStorage.removeItem(LOCAL_SESSION_KEY);
      setUser(null);
      setSession(null);
      setError(null);
    }
  }, []);

  /**
   * Continuar como Invitado
   */
  const continueAsGuest = useCallback(() => {
    setUser(null);
    setSession(null);
    setError(null);
  }, []);

  const value = {
    user,
    session,
    loading,
    error,
    isAuthenticated: Boolean(user),
    isSupabaseConfigured,
    login,
    register,
    logout,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personalizado para acceder al contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;

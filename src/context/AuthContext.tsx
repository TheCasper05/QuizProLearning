import React, { createContext, useState, useEffect, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { User } from '../models/User';
import { AuthService } from '../services/firebase/auth.service';
import { UserService } from '../services/api/user.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (displayName?: string, photoURL?: string | null) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔵 AuthContext: Iniciando suscripción a cambios de autenticación');

    // Timeout de seguridad: si después de 10 segundos no hay respuesta, continuar
    const timeoutId = setTimeout(() => {
      console.log('⚠️ AuthContext: Timeout alcanzado, continuando sin autenticación');
      setLoading(false);
    }, 10000);

    // Escuchar cambios de autenticación
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      try {
        clearTimeout(timeoutId); // Cancelar timeout si recibimos respuesta

        console.log('🔵 AuthContext: Estado de autenticación cambiado', {
          isAuthenticated: !!firebaseUser,
          uid: firebaseUser?.uid,
        });

        if (firebaseUser) {
          console.log('🔵 AuthContext: Usuario autenticado, obteniendo datos de Firestore...');
          // Obtener datos completos del usuario de Firestore
          const userData = await UserService.getUser(firebaseUser.uid);
          console.log('✅ AuthContext: Datos de usuario obtenidos correctamente');
          setUser(userData);
        } else {
          console.log('🔵 AuthContext: No hay usuario autenticado');
          setUser(null);
        }
      } catch (err: any) {
        console.error('❌ AuthContext: Error al obtener usuario:', err);
        console.error('❌ Stack trace:', err.stack);
        setError(err.message);
        // Si hay error obteniendo datos de Firestore, aún así permitir continuar
        setUser(null);
      } finally {
        console.log('🔵 AuthContext: Finalizando carga');
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await AuthService.loginWithEmail(email, password);
      setUser(userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await AuthService.loginWithGoogle();
      setUser(userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await AuthService.registerWithEmail(
        email,
        password,
        displayName
      );
      setUser(userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.resetPassword(email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (displayName?: string, photoURL?: string | null) => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.updateProfile(displayName, photoURL);

      // Actualizar usuario local
      if (user) {
        const updatedUser = await UserService.getUser(user.id);
        setUser(updatedUser);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

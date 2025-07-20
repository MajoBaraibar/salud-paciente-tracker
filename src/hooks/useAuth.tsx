import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, AuthUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticación al cargar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('user'); // Limpiar datos locales
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    const user = await authService.signIn(email, password);
    setUser(user);
    return user;
  };

  const signOut = async (): Promise<void> => {
    await authService.signOut();
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateUser = async (userData: Partial<AuthUser>): Promise<void> => {
    if (!user) throw new Error('No hay usuario autenticado');
    
    // Actualizar en Supabase
    const { error } = await supabase
      .from('user_profiles')
      .update(userData)
      .eq('supabase_user_id', user.supabaseId);
    
    if (error) throw error;
    
    // Actualizar estado local
    setUser({ ...user, ...userData });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Hook para proteger rutas
export const useRequireAuth = (redirectTo = '/login') => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo]);

  return { user, loading };
};
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
        // Si no hay Supabase configurado, usar localStorage como fallback
        if (!supabase) {
          const userString = localStorage.getItem("user");
          if (userString) {
            const userData = JSON.parse(userString);
            setUser({ ...userData, supabaseId: "temp" });
          }
          setLoading(false);
          return;
        }

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

    // Solo escuchar cambios si Supabase está disponible
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem('user');
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    const user = await authService.signIn(email, password);
    setUser(user);
    // Guardar en localStorage como respaldo
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  const signOut = async (): Promise<void> => {
    if (supabase) {
      await authService.signOut();
    }
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateUser = async (userData: Partial<AuthUser>): Promise<void> => {
    if (!user) throw new Error('No hay usuario autenticado');
    
    // Solo actualizar en Supabase si está disponible
    if (supabase) {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.supabaseId);
      
      if (error) throw error;
    }
    
    // Actualizar estado local
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
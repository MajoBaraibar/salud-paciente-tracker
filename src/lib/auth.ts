import { supabase } from './supabase';
import { UserType } from '@/types';

export interface AuthUser extends UserType {
  supabaseId: string;
}

export const authService = {
  // Iniciar sesión
  async signIn(email: string, password: string) {
    // Intentar autenticación real de Supabase primero
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Obtener el perfil del usuario desde la base de datos
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          // Si no hay perfil, intentar usuarios temporales
          return this.signInTemporary(email, password);
        }
        
        return {
          ...profile,
          supabaseId: data.user.id
        } as AuthUser;
      }
    } catch (error) {
      // Si falla Supabase, intentar usuarios temporales
      return this.signInTemporary(email, password);
    }
    
    throw new Error('No se pudo obtener el usuario');
  },

  // Método para usuarios temporales
  async signInTemporary(email: string, password: string) {
    const usuariosTemporales = [
      { 
        id: "admin-temp", 
        email: "admin@ensuma.com", 
        role: "admin", 
        nombre: "Admin", 
        apellido: "Sistema",
        especialidad: null,
        pacienteId: null
      },
      { 
        id: "medico-temp", 
        email: "doctor@ensuma.com", 
        role: "medico", 
        nombre: "Dr. Carlos", 
        apellido: "Martínez",
        especialidad: "Geriatría",
        pacienteId: null
      },
      { 
        id: "enfermera-temp", 
        email: "enfermera@ensuma.com", 
        role: "enfermera", 
        nombre: "María", 
        apellido: "González",
        especialidad: null,
        pacienteId: null
      },
      { 
        id: "familiar-temp", 
        email: "familiar@ensuma.com", 
        role: "familiar", 
        nombre: "Ana", 
        apellido: "Rodríguez",
        especialidad: null,
        pacienteId: "paciente-1"
      }
    ];
    
    const usuario = usuariosTemporales.find(u => u.email === email);
    const passwordsValidas = ["admin123", "doctor123", "enfermera123", "familiar123", "123456"];
    
    if (usuario && passwordsValidas.includes(password)) {
      return { ...usuario, supabaseId: usuario.id } as AuthUser;
    }
    
    throw new Error('Credenciales incorrectas');
  },

  // Registrar usuario (ya existe)

  async signOut() {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error al cerrar sesión en Supabase:', error);
    }
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Verificar usuario temporal en localStorage
        const userString = localStorage.getItem("user");
        if (userString) {
          return JSON.parse(userString) as AuthUser;
        }
        return null;
      }
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        // Si no hay perfil en Supabase, verificar localStorage
        const userString = localStorage.getItem("user");
        if (userString) {
          return JSON.parse(userString) as AuthUser;
        }
        return null;
      }
      
      return {
        ...profile,
        supabaseId: user.id
      } as AuthUser;
    } catch (error) {
      // Fallback a localStorage
      const userString = localStorage.getItem("user");
      if (userString) {
        return JSON.parse(userString) as AuthUser;
      }
      return null;
    }
  },

  // Verificar sesión
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      // Fallback para sistema temporal
      const userString = localStorage.getItem("user");
      return userString ? { user: JSON.parse(userString) } : null;
    }
  },

  // Restablecer contraseña
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  }
};
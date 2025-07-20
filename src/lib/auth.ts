import { supabase } from './supabase';
import { UserType } from '@/types';

export interface AuthUser extends UserType {
  supabaseId: string;
}

export const authService = {
  // Iniciar sesión
  async signIn(email: string, password: string) {
    // Sistema temporal de usuarios para desarrollo
    const usuariosTemporales = [
      { 
        id: "admin-temp", 
        email: "admin@healthcenter.com", 
        role: "admin", 
        nombre: "Admin", 
        apellido: "Sistema",
        especialidad: null,
        pacienteId: null
      },
      { 
        id: "medico-temp", 
        email: "medico@healthcenter.com", 
        role: "medico", 
        nombre: "Dr. Carlos", 
        apellido: "Martínez",
        especialidad: "Geriatría",
        pacienteId: null
      },
      { 
        id: "enfermera-temp", 
        email: "enfermera@healthcenter.com", 
        role: "enfermera", 
        nombre: "María", 
        apellido: "González",
        especialidad: null,
        pacienteId: null
      },
      { 
        id: "familiar-temp", 
        email: "familiar@healthcenter.com", 
        role: "familiar", 
        nombre: "Ana", 
        apellido: "Rodríguez",
        especialidad: null,
        pacienteId: "paciente-1"
      }
    ];
    
    const usuario = usuariosTemporales.find(u => u.email === email);
    if (usuario && password === "123456") {
      return { ...usuario, supabaseId: usuario.id } as AuthUser;
    }
    
    throw new Error('Credenciales incorrectas. Use password: 123456');
  },

  // Registrar usuario
  async signUp(email: string, password: string, userData: Partial<UserType>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    
    // Crear perfil del usuario
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          role: userData.role || 'familiar',
          especialidad: userData.especialidad,
          paciente_id: userData.pacienteId
        });
      
      if (profileError) throw profileError;
    }
    
    return data;
  },

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<AuthUser | null> {
    // Verificar usuario temporal en localStorage
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        return JSON.parse(userString) as AuthUser;
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    
    return null;
  },

  // Verificar sesión
  async getSession() {
    // Para el sistema temporal, verificar localStorage
    const userString = localStorage.getItem("user");
    return userString ? { user: JSON.parse(userString) } : null;
  },

  // Restablecer contraseña
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  }
};
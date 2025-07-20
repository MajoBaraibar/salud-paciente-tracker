import { supabase } from './supabase';
import { UserType } from '@/types';

export interface AuthUser extends UserType {
  supabaseId: string;
}

export const authService = {
  // Iniciar sesión
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Obtener el perfil del usuario desde la base de datos
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('supabase_user_id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      return {
        ...profile,
        supabaseId: data.user.id
      } as AuthUser;
    }
    
    throw new Error('No se pudo obtener el usuario');
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
        .from('user_profiles')
        .insert({
          supabase_user_id: data.user.id,
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('supabase_user_id', user.id)
      .single();
    
    if (error) return null;
    
    return {
      ...profile,
      supabaseId: user.id
    } as AuthUser;
  },

  // Verificar sesión
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Restablecer contraseña
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  }
};
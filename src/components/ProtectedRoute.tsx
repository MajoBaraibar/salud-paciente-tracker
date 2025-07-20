import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission, canAccessPatient } from '@/lib/security';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[]; // Permitir rol único o array de roles
  patientId?: string; // Para verificar acceso a paciente específico
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole = 'familiar',
  patientId 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-health-600"></div>
          <p className="text-health-700">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    toast.error('Debe iniciar sesión para acceder');
    navigate('/login');
    return null;
  }

  // Verificar permisos de rol
  const hasRequiredRole = () => {
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => hasPermission(user.role, role));
    }
    return hasPermission(user.role, requiredRole);
  };

  if (!hasRequiredRole()) {
    toast.error('No tiene permisos para acceder a esta página');
    navigate('/dashboard');
    return null;
  }

  // Verificar acceso a paciente específico (para familiares)
  if (patientId && !canAccessPatient(user.role, user.id, patientId, user.pacienteId)) {
    toast.error('No tiene permisos para acceder a este paciente');
    navigate('/dashboard');
    return null;
  }

  return <>{children}</>;
};
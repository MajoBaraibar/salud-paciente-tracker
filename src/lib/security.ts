import DOMPurify from 'dompurify';
import { z } from 'zod';

// Sanitizar HTML para prevenir XSS
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

// Sanitizar texto plano
export const sanitizeText = (text: string): string => {
  return text.replace(/[<>]/g, '');
};

// Esquemas de validación con Zod
export const userValidationSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  nombre: z.string().min(1, 'Nombre requerido').max(50, 'Nombre muy largo'),
  apellido: z.string().min(1, 'Apellido requerido').max(50, 'Apellido muy largo'),
  role: z.enum(['admin', 'medico', 'enfermera', 'familiar'])
});

export const pacienteValidationSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').max(50, 'Nombre muy largo'),
  apellido: z.string().min(1, 'Apellido requerido').max(50, 'Apellido muy largo'),
  fechaNacimiento: z.string().min(1, 'Fecha de nacimiento requerida'),
  genero: z.string().min(1, 'Género requerido'),
  numeroIdentificacion: z.string().min(1, 'Número de identificación requerido'),
  telefono: z.string().regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido'),
  direccion: z.string().min(1, 'Dirección requerida').max(200, 'Dirección muy larga')
});

export const historialValidationSchema = z.object({
  motivoConsulta: z.string().min(1, 'Motivo de consulta requerido').max(500, 'Motivo muy largo'),
  diagnostico: z.string().min(1, 'Diagnóstico requerido').max(500, 'Diagnóstico muy largo'),
  tratamiento: z.string().min(1, 'Tratamiento requerido').max(1000, 'Tratamiento muy largo'),
  notas: z.string().max(1000, 'Notas muy largas').optional()
});

// Validar entrada y sanitizar
export const validateAndSanitize = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const validated = schema.parse(data);
  
  // Sanitizar strings recursivamente
  const sanitized = JSON.parse(JSON.stringify(validated), (key, value) => {
    if (typeof value === 'string') {
      return sanitizeText(value);
    }
    return value;
  });
  
  return sanitized;
};

// Verificar permisos basados en roles
export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    'admin': 4,
    'medico': 3,
    'enfermera': 2,
    'familiar': 1
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userLevel >= requiredLevel;
};

// Verificar acceso a paciente (para familiares)
export const canAccessPatient = (userRole: string, userId: string, pacienteId: string, userPacienteId?: string): boolean => {
  // Admin y personal médico pueden acceder a todos los pacientes
  if (['admin', 'medico', 'enfermera'].includes(userRole)) {
    return true;
  }
  
  // Familiares solo pueden acceder a su paciente asignado
  if (userRole === 'familiar') {
    return userPacienteId === pacienteId;
  }
  
  return false;
};

// Configuración de CSP (Content Security Policy)
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Solo para desarrollo, en producción remover unsafe-inline
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'font-src': ["'self'"],
  'connect-src': ["'self'", "https://*.supabase.co"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};
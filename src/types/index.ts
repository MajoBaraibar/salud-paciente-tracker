
export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: string;
  numeroIdentificacion: string;
  telefono: string;
  direccion: string;
  imagenUrl?: string;
}

export interface EntradaHistorial {
  id: string;
  pacienteId: string;
  fecha: string;
  doctorNombre: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
  tipo: "interno" | "externo"; // Interno para personal médico, externo para familiar
}

// Type alias for Paciente to use in components
export type PacienteType = Paciente;

export interface EmergencyContactType {
  id: string;
  pacienteId: string;
  nombre: string;
  relacion: string;
  telefono: string;
  email?: string;
}

export interface RequisitionItemType {
  id: string;
  nombre: string;
  cantidad: number;
  categoria_id: string;
  prioridad: "alta" | "media" | "baja";
  estado: "pendiente" | "aprobada" | "rechazada" | "completada";
  notas?: string;
  solicitado_por: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentType {
  id: string;
  pacienteId: string;
  amount: number;
  dueDate: string;
  status: "pagado" | "pendiente" | "atrasado";
  paymentDate?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface UserType {
  id: string;
  email: string;
  role: "admin" | "medico" | "enfermera" | "familiar";
  nombre?: string;
  apellido?: string;
  especialidad?: string;
  imagenUrl?: string;
  centro_id?: string; // ID del centro de salud
  // Solo para tipo "familiar"
  pacienteId?: string;
}

export interface FamiliarType {
  id: string;
  userId: string;
  pacienteId: string;
  nombre: string;
  apellido: string;
  relacion: string;
  telefono: string;
  email: string;
}

export interface ResultadoExamen {
  id: string;
  paciente_id: string;
  medico_id: string;
  nombre_examen: string;
  descripcion: string | null;
  archivo_url: string | null;
  archivo_nombre: string | null;
  fecha_examen: string;
  fecha_subida: string;
  tipo_examen: 'laboratorio' | 'imagen' | 'especializado';
  estado: 'normal' | 'anormal' | 'critico';
  observaciones: string | null;
  centro_id: string | null;
  created_at: string;
  updated_at: string;
}

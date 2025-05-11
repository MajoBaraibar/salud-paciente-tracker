
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
  name: string;
  quantity: number;
  priority: "baja" | "media" | "alta";
  notes?: string;
  categoryId: string;
  requestedBy: string;
  status: "pendiente" | "aprobado" | "rechazado" | "completado";
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
  role: "admin" | "medico" | "enfermera";
  nombre?: string;
  apellido?: string;
  especialidad?: string;
  imagenUrl?: string;
}

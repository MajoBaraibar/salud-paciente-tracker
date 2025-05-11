
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

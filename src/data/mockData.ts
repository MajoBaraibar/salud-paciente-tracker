
import { Paciente, EntradaHistorial } from "../types";

export const pacientesMock: Paciente[] = [
  {
    id: "1",
    nombre: "María",
    apellido: "González",
    fechaNacimiento: "1985-05-12",
    genero: "Femenino",
    numeroIdentificacion: "12345678",
    telefono: "555-123-4567",
    direccion: "Av. Principal 123, Ciudad",
    imagenUrl: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: "2",
    nombre: "Carlos",
    apellido: "Rodríguez",
    fechaNacimiento: "1978-09-23",
    genero: "Masculino",
    numeroIdentificacion: "87654321",
    telefono: "555-765-4321",
    direccion: "Calle 45 #28-15, Ciudad",
    imagenUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "3",
    nombre: "Ana",
    apellido: "Martínez",
    fechaNacimiento: "1990-12-03",
    genero: "Femenino",
    numeroIdentificacion: "23456789",
    telefono: "555-987-6543",
    direccion: "Carrera 78 #15-42, Ciudad",
    imagenUrl: "https://randomuser.me/api/portraits/women/22.jpg"
  },
  {
    id: "4",
    nombre: "Juan",
    apellido: "Pérez",
    fechaNacimiento: "1965-03-18",
    genero: "Masculino",
    numeroIdentificacion: "34567890",
    telefono: "555-234-5678",
    direccion: "Av. Central 456, Ciudad",
    imagenUrl: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: "5",
    nombre: "Laura",
    apellido: "Díaz",
    fechaNacimiento: "1995-07-30",
    genero: "Femenino",
    numeroIdentificacion: "45678901",
    telefono: "555-345-6789",
    direccion: "Calle 12 #34-56, Ciudad",
    imagenUrl: "https://randomuser.me/api/portraits/women/17.jpg"
  }
];

export const historialMock: EntradaHistorial[] = [
  {
    id: "h1",
    pacienteId: "1",
    fecha: "2023-05-10",
    doctorNombre: "Dr. López",
    motivoConsulta: "Dolor de cabeza persistente",
    diagnostico: "Migraña",
    tratamiento: "Sumatriptán 50mg, una tableta cada 8 horas según necesidad",
    notas: "Paciente refiere síntomas que comenzaron hace aproximadamente 2 semanas"
  },
  {
    id: "h2",
    pacienteId: "1",
    fecha: "2023-06-15",
    doctorNombre: "Dra. Ramírez",
    motivoConsulta: "Seguimiento de migraña",
    diagnostico: "Migraña en remisión parcial",
    tratamiento: "Continuar con Sumatriptán según necesidad, agregar amitriptilina 25mg por la noche",
    notas: "Mejora notable pero persisten episodios ocasionales"
  },
  {
    id: "h3",
    pacienteId: "2",
    fecha: "2023-04-20",
    doctorNombre: "Dr. Fernández",
    motivoConsulta: "Dolor en rodilla derecha",
    diagnostico: "Osteoartritis temprana",
    tratamiento: "Ibuprofeno 400mg cada 8 horas, fisioterapia 2 veces por semana",
    notas: "Se recomienda bajar de peso para disminuir la carga articular"
  },
  {
    id: "h4",
    pacienteId: "3",
    fecha: "2023-07-05",
    doctorNombre: "Dra. Gómez",
    motivoConsulta: "Revisión anual",
    diagnostico: "Salud general buena",
    tratamiento: "Mantener estilo de vida saludable, suplemento de vitamina D",
    notas: "Se recomiendan análisis de sangre en 6 meses"
  },
  {
    id: "h5",
    pacienteId: "4",
    fecha: "2023-03-12",
    doctorNombre: "Dr. Sánchez",
    motivoConsulta: "Presión arterial elevada",
    diagnostico: "Hipertensión estadio 1",
    tratamiento: "Enalapril 10mg diarios, dieta baja en sodio",
    notas: "Control en un mes, monitoreo diario de presión"
  }
];

export const getHistorialPaciente = (pacienteId: string): EntradaHistorial[] => {
  return historialMock.filter(entrada => entrada.pacienteId === pacienteId);
};

export const getPacienteById = (id: string): Paciente | undefined => {
  return pacientesMock.find(paciente => paciente.id === id);
};

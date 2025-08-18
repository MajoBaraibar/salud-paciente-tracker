
import { Paciente, EntradaHistorial } from "../types";
import mariaGonzalezImg from "@/assets/patients/maria-gonzalez-elderly.jpg";
import carlosRodriguezImg from "@/assets/patients/carlos-rodriguez-elderly.jpg";
import anaMartinezImg from "@/assets/patients/ana-martinez-elderly.jpg";
import robertoLopezImg from "@/assets/patients/roberto-lopez-elderly.jpg";
import luciaTorresImg from "@/assets/patients/lucia-torres-final.jpg";

export const pacientesMock: Paciente[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    nombre: "María",
    apellido: "González Ruiz",
    fechaNacimiento: "1941-03-15",
    genero: "Femenino",
    numeroIdentificacion: "52123456",
    telefono: "301-234-5678",
    direccion: "Carrera 15 #45-67, Medellín",
    imagenUrl: mariaGonzalezImg
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    nombre: "Carlos",
    apellido: "Rodríguez López",
    fechaNacimiento: "1945-07-22",
    genero: "Masculino",
    numeroIdentificacion: "43876543",
    telefono: "304-567-8901",
    direccion: "Calle 30 #20-15, Bogotá",
    imagenUrl: carlosRodriguezImg
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    nombre: "Ana",
    apellido: "Martínez Sánchez",
    fechaNacimiento: "1938-11-08",
    genero: "Femenino",
    numeroIdentificacion: "65432109",
    telefono: "312-345-6789",
    direccion: "Avenida 68 #15-30, Cali",
    imagenUrl: anaMartinezImg
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    nombre: "Roberto",
    apellido: "López Torres",
    fechaNacimiento: "1944-01-30",
    genero: "Masculino",
    numeroIdentificacion: "78901234",
    telefono: "315-678-9012",
    direccion: "Transversal 45 #78-90, Barranquilla",
    imagenUrl: robertoLopezImg
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    nombre: "Lucía",
    apellido: "Torres Vargas",
    fechaNacimiento: "1944-09-12",
    genero: "Femenino",
    numeroIdentificacion: "87654321",
    telefono: "318-901-2345",
    direccion: "Calle 25 #12-34, Cartagena",
    imagenUrl: luciaTorresImg
  }
];

export const historialMock: EntradaHistorial[] = [
  {
    id: "h1",
    pacienteId: "550e8400-e29b-41d4-a716-446655440002",
    fecha: "2023-05-10",
    doctorNombre: "Dr. López",
    motivoConsulta: "Dolor de cabeza persistente",
    diagnostico: "Migraña",
    tratamiento: "Sumatriptán 50mg, una tableta cada 8 horas según necesidad",
    notas: "Paciente refiere síntomas que comenzaron hace aproximadamente 2 semanas",
    tipo: "interno"
  },
  {
    id: "h2",
    pacienteId: "550e8400-e29b-41d4-a716-446655440002",
    fecha: "2023-06-15",
    doctorNombre: "Dra. Ramírez",
    motivoConsulta: "Seguimiento de migraña",
    diagnostico: "Migraña en remisión parcial",
    tratamiento: "Continuar con Sumatriptán según necesidad, agregar amitriptilina 25mg por la noche",
    notas: "Mejora notable pero persisten episodios ocasionales",
    tipo: "interno"
  },
  {
    id: "h3",
    pacienteId: "550e8400-e29b-41d4-a716-446655440004",
    fecha: "2023-04-20",
    doctorNombre: "Dr. Fernández",
    motivoConsulta: "Dolor en rodilla derecha",
    diagnostico: "Osteoartritis temprana",
    tratamiento: "Ibuprofeno 400mg cada 8 horas, fisioterapia 2 veces por semana",
    notas: "Se recomienda bajar de peso para disminuir la carga articular",
    tipo: "interno"
  },
  {
    id: "h4",
    pacienteId: "550e8400-e29b-41d4-a716-446655440006",
    fecha: "2023-07-05",
    doctorNombre: "Dra. Gómez",
    motivoConsulta: "Revisión anual",
    diagnostico: "Salud general buena",
    tratamiento: "Mantener estilo de vida saludable, suplemento de vitamina D",
    notas: "Se recomiendan análisis de sangre en 6 meses",
    tipo: "externo"
  },
  {
    id: "h5",
    pacienteId: "550e8400-e29b-41d4-a716-446655440003",
    fecha: "2023-03-12",
    doctorNombre: "Dr. Sánchez",
    motivoConsulta: "Presión arterial elevada",
    diagnostico: "Hipertensión estadio 1",
    tratamiento: "Enalapril 10mg diarios, dieta baja en sodio",
    notas: "Control en un mes, monitoreo diario de presión",
    tipo: "externo"
  },
  {
    id: "h6",
    pacienteId: "550e8400-e29b-41d4-a716-446655440005",
    fecha: "2023-08-18",
    doctorNombre: "Dr. Martínez",
    motivoConsulta: "Control rutinario geriátrico",
    diagnostico: "Estado de salud estable",
    tratamiento: "Continuar con vitaminas y ejercicios suaves",
    notas: "Paciente muestra buen estado de ánimo y movilidad adecuada para su edad",
    tipo: "interno"
  }
];

export const getHistorialPaciente = (pacienteId: string): EntradaHistorial[] => {
  return historialMock.filter(entrada => entrada.pacienteId === pacienteId);
};

export const getPacienteById = (id: string): Paciente | undefined => {
  return pacientesMock.find(paciente => paciente.id === id);
};

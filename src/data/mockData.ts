
import { Paciente, EntradaHistorial } from "../types";
import mariaGonzalezImg from "@/assets/patients/maria-gonzalez.jpg";
import carlosRodriguezImg from "@/assets/patients/carlos-rodriguez.jpg";
import anaMartinezImg from "@/assets/patients/ana-martinez.jpg";
import robertoLopezImg from "@/assets/patients/roberto-lopez.jpg";

export const pacientesMock: Paciente[] = [
  {
    id: "1",
    nombre: "María del Carmen",
    apellido: "González",
    fechaNacimiento: "1948-03-15",
    genero: "Femenino",
    numeroIdentificacion: "52123456",
    telefono: "301-234-5678",
    direccion: "Carrera 15 #45-67, Medellín",
    imagenUrl: mariaGonzalezImg
  },
  {
    id: "2",
    nombre: "Carlos Alberto",
    apellido: "Rodríguez",
    fechaNacimiento: "1943-07-22",
    genero: "Masculino",
    numeroIdentificacion: "43876543",
    telefono: "304-567-8901",
    direccion: "Calle 30 #20-15, Bogotá",
    imagenUrl: carlosRodriguezImg
  },
  {
    id: "3",
    nombre: "Ana Isabel",
    apellido: "Martínez",
    fechaNacimiento: "1945-11-08",
    genero: "Femenino",
    numeroIdentificacion: "65432109",
    telefono: "312-345-6789",
    direccion: "Avenida 68 #15-30, Cali",
    imagenUrl: anaMartinezImg
  },
  {
    id: "4",
    nombre: "Roberto",
    apellido: "López Silva",
    fechaNacimiento: "1941-01-30",
    genero: "Masculino",
    numeroIdentificacion: "78901234",
    telefono: "315-678-9012",
    direccion: "Transversal 45 #78-90, Barranquilla",
    imagenUrl: robertoLopezImg
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
    notas: "Paciente refiere síntomas que comenzaron hace aproximadamente 2 semanas",
    tipo: "interno"
  },
  {
    id: "h2",
    pacienteId: "1",
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
    pacienteId: "2",
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
    pacienteId: "3",
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
    pacienteId: "4",
    fecha: "2023-03-12",
    doctorNombre: "Dr. Sánchez",
    motivoConsulta: "Presión arterial elevada",
    diagnostico: "Hipertensión estadio 1",
    tratamiento: "Enalapril 10mg diarios, dieta baja en sodio",
    notas: "Control en un mes, monitoreo diario de presión",
    tipo: "externo"
  }
];

export const getHistorialPaciente = (pacienteId: string): EntradaHistorial[] => {
  return historialMock.filter(entrada => entrada.pacienteId === pacienteId);
};

export const getPacienteById = (id: string): Paciente | undefined => {
  return pacientesMock.find(paciente => paciente.id === id);
};

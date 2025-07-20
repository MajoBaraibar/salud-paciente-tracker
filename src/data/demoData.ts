// Datos de demostración realistas para presentaciones de ventas
export const pacientesDemoData = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    nombre: "María Elena",
    apellido: "García Rodríguez",
    fechaNacimiento: "1938-03-15",
    genero: "femenino",
    numeroIdentificacion: "12345678",
    telefono: "+57 300 123 4567",
    direccion: "Carrera 15 #45-67, Bogotá",
    imagenUrl: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002", 
    nombre: "José Antonio",
    apellido: "Martínez López",
    fechaNacimiento: "1942-07-22",
    genero: "masculino",
    numeroIdentificacion: "87654321",
    telefono: "+57 310 987 6543",
    direccion: "Calle 32 #18-45, Medellín",
    imagenUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    nombre: "Ana Lucía",
    apellido: "López Hernández",
    fechaNacimiento: "1945-11-08",
    genero: "femenino", 
    numeroIdentificacion: "11223344",
    telefono: "+57 320 555 7890",
    direccion: "Avenida 68 #25-34, Cali",
    imagenUrl: "https://randomuser.me/api/portraits/women/22.jpg"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    nombre: "Roberto Carlos",
    apellido: "Pérez Gómez",
    fechaNacimiento: "1940-05-18",
    genero: "masculino",
    numeroIdentificacion: "34567890",
    telefono: "+57 315 234 5678",
    direccion: "Transversal 45 #67-89, Barranquilla",
    imagenUrl: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    nombre: "Carmen Rosa",
    apellido: "Díaz Morales",
    fechaNacimiento: "1943-09-30",
    genero: "femenino",
    numeroIdentificacion: "45678901",
    telefono: "+57 301 345 6789",
    direccion: "Diagonal 34 #12-56, Bucaramanga",
    imagenUrl: "https://randomuser.me/api/portraits/women/17.jpg"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    nombre: "Luis Fernando",
    apellido: "González Silva",
    fechaNacimiento: "1941-12-03",
    genero: "masculino",
    numeroIdentificacion: "56789012",
    telefono: "+57 305 456 7890",
    direccion: "Carrera 7 #89-23, Pereira",
    imagenUrl: "https://randomuser.me/api/portraits/men/54.jpg"
  }
];

export const historialesDemoData = [
  {
    id: "650e8400-e29b-41d4-a716-446655440001",
    pacienteId: "550e8400-e29b-41d4-a716-446655440001",
    fecha: "2024-01-15T09:30:00Z",
    doctorNombre: "Dr. Carlos Mendoza",
    motivoConsulta: "Control rutinario mensual",
    diagnostico: "Hipertensión arterial controlada",
    tratamiento: "Continuar con Enalapril 10mg cada 12 horas. Dieta baja en sodio.",
    notas: "Paciente estable, presión arterial dentro de rangos normales. Próxima cita en 30 días.",
    tipo: "interno" as const
  },
  {
    id: "650e8400-e29b-41d4-a716-446655440002", 
    pacienteId: "550e8400-e29b-41d4-a716-446655440001",
    fecha: "2024-01-28T14:15:00Z",
    doctorNombre: "Dra. María González",
    motivoConsulta: "Dolor en articulaciones",
    diagnostico: "Artritis leve en rodillas",
    tratamiento: "Ibuprofeno 400mg cuando sea necesario. Fisioterapia 2 veces por semana.",
    notas: "Se recomienda ejercicio de bajo impacto. Evitar sobreesfuerzo.",
    tipo: "interno" as const
  },
  {
    id: "650e8400-e29b-41d4-a716-446655440003",
    pacienteId: "550e8400-e29b-41d4-a716-446655440002", 
    fecha: "2024-01-20T11:00:00Z",
    doctorNombre: "Dr. Luis Ramírez",
    motivoConsulta: "Revisión de diabetes",
    diagnostico: "Diabetes tipo 2 bien controlada", 
    tratamiento: "Metformina 850mg dos veces al día. Control de glucosa diario.",
    notas: "Paciente cumple bien el tratamiento. Niveles de glucosa estables.",
    tipo: "interno" as const
  },
  {
    id: "650e8400-e29b-41d4-a716-446655440004",
    pacienteId: "550e8400-e29b-41d4-a716-446655440003",
    fecha: "2024-01-25T10:30:00Z", 
    doctorNombre: "Dra. Ana Patricia",
    motivoConsulta: "Examen médico general",
    diagnostico: "Estado de salud general bueno",
    tratamiento: "Mantener rutina de ejercicios. Suplemento de calcio y vitamina D.",
    notas: "Excelente estado físico para su edad. Continuar con actividades normales.",
    tipo: "interno" as const
  }
];

export const notasEnfermeriaDemoData = [
  {
    id: "750e8400-e29b-41d4-a716-446655440001",
    pacienteId: "550e8400-e29b-41d4-a716-446655440001",
    enfermeraId: "850e8400-e29b-41d4-a716-446655440001",
    nota: "Paciente presenta buen apetito en el desayuno. Tomó todos sus medicamentos sin dificultad.",
    fecha: "2024-01-15T08:00:00Z"
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440002",
    pacienteId: "550e8400-e29b-41d4-a716-446655440001", 
    enfermeraId: "850e8400-e29b-41d4-a716-446655440002",
    nota: "Signos vitales normales. Presión arterial 120/80. Se queja de leve dolor de cabeza.",
    fecha: "2024-01-15T14:30:00Z"
  },
  {
    id: "750e8400-e29b-41d4-a716-446655440003",
    pacienteId: "550e8400-e29b-41d4-a716-446655440002",
    enfermeraId: "850e8400-e29b-41d4-a716-446655440001",
    nota: "Control de glucosa en ayunas: 95 mg/dl. Excelente control diabético.",
    fecha: "2024-01-20T07:00:00Z"
  }
];

export const contactosEmergenciaDemoData = [
  {
    id: "950e8400-e29b-41d4-a716-446655440001",
    pacienteId: "550e8400-e29b-41d4-a716-446655440001",
    nombre: "Carmen García",
    relacion: "Hija",
    telefono: "+57 300 111 2222",
    email: "carmen.garcia@email.com"
  },
  {
    id: "950e8400-e29b-41d4-a716-446655440002",
    pacienteId: "550e8400-e29b-41d4-a716-446655440001",
    nombre: "Miguel García",
    relacion: "Hijo", 
    telefono: "+57 310 333 4444",
    email: "miguel.garcia@email.com"
  },
  {
    id: "950e8400-e29b-41d4-a716-446655440003",
    pacienteId: "550e8400-e29b-41d4-a716-446655440002",
    nombre: "Sandra Martínez",
    relacion: "Esposa",
    telefono: "+57 320 555 6666", 
    email: "sandra.martinez@email.com"
  }
];

export const pagosDemoData = [
  {
    id: "a50e8400-e29b-41d4-a716-446655440001",
    pacienteId: "550e8400-e29b-41d4-a716-446655440001",
    amount: 850000,
    dueDate: "2024-02-01",
    status: "pagado" as const,
    paymentDate: "2024-01-28",
    paymentMethod: "Transferencia bancaria",
    notes: "Pago mensual de servicios de cuidado integral"
  },
  {
    id: "a50e8400-e29b-41d4-a716-446655440002", 
    pacienteId: "550e8400-e29b-41d4-a716-446655440002",
    amount: 950000,
    dueDate: "2024-02-05",
    status: "pendiente" as const,
    paymentMethod: undefined,
    notes: "Mensualidad febrero - incluye terapias especializadas"
  },
  {
    id: "a50e8400-e29b-41d4-a716-446655440003",
    pacienteId: "550e8400-e29b-41d4-a716-446655440003", 
    amount: 750000,
    dueDate: "2024-01-15",
    status: "atrasado" as const,
    paymentMethod: undefined,
    notes: "Pago pendiente desde enero"
  }
];

export const requisionesDemoData = [
  {
    id: "b50e8400-e29b-41d4-a716-446655440001",
    name: "Glucómetro digital",
    quantity: 2,
    priority: "alta" as const,
    notes: "Para control diabético de pacientes", 
    categoryId: "c50e8400-e29b-41d4-a716-446655440001",
    requestedBy: "Dra. María González",
    status: "pendiente" as const
  },
  {
    id: "b50e8400-e29b-41d4-a716-446655440002",
    name: "Sillas de ruedas",
    quantity: 1,
    priority: "media" as const,
    notes: "Para movilidad de pacientes con dificultades",
    categoryId: "c50e8400-e29b-41d4-a716-446655440002",
    requestedBy: "Fisioterapeuta Luis",
    status: "aprobado" as const
  }
];
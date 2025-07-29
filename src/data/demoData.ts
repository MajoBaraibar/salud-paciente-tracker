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
    nombre: "Tensiómetro digital",
    cantidad: 3,
    categoria_id: "c50e8400-e29b-41d4-a716-446655440001",
    prioridad: "alta" as const,
    estado: "pendiente" as const,
    notas: "Necesarios para control de presión arterial en consultas diarias",
    solicitado_por: "Dra. María González",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z"
  },
  {
    id: "b50e8400-e29b-41d4-a716-446655440002",
    nombre: "Glucómetros y tiras reactivas",
    cantidad: 5,
    categoria_id: "c50e8400-e29b-41d4-a716-446655440001",
    prioridad: "alta" as const,
    estado: "pendiente" as const,
    notas: "Para control diabético de pacientes, incluir 200 tiras reactivas",
    solicitado_por: "Enfermera Carmen López",
    created_at: "2024-01-21T09:30:00Z",
    updated_at: "2024-01-21T09:30:00Z"
  },
  {
    id: "b50e8400-e29b-41d4-a716-446655440003",
    nombre: "Silla de ruedas plegable",
    cantidad: 2,
    categoria_id: "c50e8400-e29b-41d4-a716-446655440002",
    prioridad: "media" as const,
    estado: "aprobada" as const,
    notas: "Para movilidad de pacientes con dificultades de desplazamiento",
    solicitado_por: "Fisioterapeuta Luis Ramírez",
    created_at: "2024-01-18T14:15:00Z",
    updated_at: "2024-01-19T08:45:00Z"
  },
  {
    id: "b50e8400-e29b-41d4-a716-446655440004",
    nombre: "Medicamentos antihipertensivos",
    cantidad: 50,
    categoria_id: "c50e8400-e29b-41d4-a716-446655440003",
    prioridad: "alta" as const,
    estado: "pendiente" as const,
    notas: "Enalapril 10mg y Amlodipino 5mg - stock bajo",
    solicitado_por: "Dr. Carlos Mendoza",
    created_at: "2024-01-22T11:20:00Z",
    updated_at: "2024-01-22T11:20:00Z"
  },
  {
    id: "b50e8400-e29b-41d4-a716-446655440005",
    nombre: "Material de curación",
    cantidad: 20,
    categoria_id: "c50e8400-e29b-41d4-a716-446655440004",
    prioridad: "media" as const,
    estado: "completada" as const,
    notas: "Gasas, vendas, alcohol, betadine",
    solicitado_por: "Enfermera Patricia Silva",
    created_at: "2024-01-15T16:00:00Z",
    updated_at: "2024-01-17T10:30:00Z"
  },
  {
    id: "b50e8400-e29b-41d4-a716-446655440006",
    nombre: "Papel higiénico y toallas",
    cantidad: 30,
    categoria_id: "c50e8400-e29b-41d4-a716-446655440005",
    prioridad: "baja" as const,
    estado: "rechazada" as const,
    notas: "Productos de aseo personal para pacientes",
    solicitado_por: "Personal de limpieza",
    created_at: "2024-01-19T13:45:00Z",
    updated_at: "2024-01-20T09:15:00Z"
  }
];

export const categoriasDemoData = [
  {
    id: "c50e8400-e29b-41d4-a716-446655440001",
    nombre: "Equipos Médicos",
    descripcion: "Dispositivos y equipos para diagnóstico y monitoreo"
  },
  {
    id: "c50e8400-e29b-41d4-a716-446655440002", 
    nombre: "Mobiliario",
    descripcion: "Mobiliario médico y de apoyo para pacientes"
  },
  {
    id: "c50e8400-e29b-41d4-a716-446655440003",
    nombre: "Medicamentos",
    descripcion: "Medicamentos y suplementos médicos"
  },
  {
    id: "c50e8400-e29b-41d4-a716-446655440004",
    nombre: "Material Médico",
    descripcion: "Insumos médicos y material de curación"
  },
  {
    id: "c50e8400-e29b-41d4-a716-446655440005",
    nombre: "Limpieza y Aseo",
    descripcion: "Productos de limpieza e higiene"
  }
];

// Eventos demo para calendario
export const eventosDemoData = [
  {
    id: "1",
    titulo: "Consulta María González",
    fecha: new Date(),
    horaInicio: "10:00",
    horaFin: "10:30",
    tipo: "consulta" as const,
    pacienteId: "550e8400-e29b-41d4-a716-446655440001",
    pacienteNombre: "María Elena García Rodríguez",
    descripcion: "Control mensual de diabetes",
    participantes: ["Dr. Martínez"]
  },
  {
    id: "2",
    titulo: "Consulta José Martínez",
    fecha: new Date(),
    horaInicio: "11:00",
    horaFin: "11:30",
    tipo: "consulta" as const,
    pacienteId: "550e8400-e29b-41d4-a716-446655440002",
    pacienteNombre: "José Antonio Martínez López",
    descripcion: "Revisión de presión arterial",
    participantes: ["Dr. Martínez"]
  },
  {
    id: "3",
    titulo: "Consulta Ana López",
    fecha: new Date(),
    horaInicio: "14:00",
    horaFin: "14:30",
    tipo: "consulta" as const,
    pacienteId: "550e8400-e29b-41d4-a716-446655440003",
    pacienteNombre: "Ana Lucía López Hernández",
    descripcion: "Control post-operatorio",
    participantes: ["Dr. Martínez"]
  },
  {
    id: "4",
    titulo: "Visita familiar - Roberto Pérez",
    fecha: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Mañana
    horaInicio: "08:00",
    horaFin: "09:00",
    tipo: "visita" as const,
    pacienteId: "550e8400-e29b-41d4-a716-446655440004",
    pacienteNombre: "Roberto Carlos Pérez Gómez",
    descripcion: "Visita de hija",
    participantes: ["Familiar: Ana Rodríguez"]
  },
  {
    id: "5",
    titulo: "Reunión de personal",
    fecha: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Ayer
    horaInicio: "14:00",
    horaFin: "15:00",
    tipo: "reunion" as const,
    descripcion: "Revisión de protocolos de atención",
    participantes: ["Todo el personal"]
  },
  // Eventos administrativos
  {
    id: "6",
    titulo: "Reunión con familia interesada",
    fecha: new Date(),
    horaInicio: "09:00",
    horaFin: "10:00",
    tipo: "reunion" as const,
    descripcion: "Entrevista inicial con familia Rodríguez para posible ingreso",
    participantes: ["Admin Sistema", "Familia Rodríguez"]
  },
  {
    id: "7",
    titulo: "Auditoría de calidad",
    fecha: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // Pasado mañana
    horaInicio: "11:00",
    horaFin: "15:00",
    tipo: "reunion" as const,
    descripcion: "Inspección del Ministerio de Salud",
    participantes: ["Inspector ministerial", "Admin Sistema"]
  },
  {
    id: "8",
    titulo: "Capacitación personal",
    fecha: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    horaInicio: "16:00",
    horaFin: "18:00",
    tipo: "otro" as const,
    descripcion: "Capacitación en nuevos protocolos de emergencia",
    participantes: ["Todo el personal", "Capacitador externo"]
  },
  {
    id: "9",
    titulo: "Revisión presupuestal",
    fecha: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    horaInicio: "10:00",
    horaFin: "12:00",
    tipo: "reunion" as const,
    descripcion: "Análisis mensual de gastos e ingresos",
    participantes: ["Admin Sistema", "Contador"]
  },
  {
    id: "10",
    titulo: "Reunión con proveedores",
    fecha: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    horaInicio: "13:00",
    horaFin: "14:30",
    tipo: "reunion" as const,
    descripcion: "Negociación de contratos de suministros médicos",
    participantes: ["Admin Sistema", "Proveedor MedSupply"]
  }
];
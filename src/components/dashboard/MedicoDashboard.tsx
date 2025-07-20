
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, AlertTriangle, FileText, Activity } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { StatCard } from "./StatCard";
import { ActivityTable } from "./ActivityTable";
import { CriticalPatientsTab } from "./CriticalPatientsTab";
import { useNotificationStore } from "@/stores/notificationStore";
import { usePacientes } from "@/hooks/usePacientes";

interface MedicoDashboardProps {
  currentUser: { email: string; role: string };
  isMedico: boolean;
  isEnfermera: boolean;
}

// Eventos compartidos que se usan en el calendario
export const eventosMock = [
  {
    id: "1",
    titulo: "Consulta María González",
    fecha: new Date(),
    horaInicio: "10:00",
    horaFin: "10:30",
    tipo: "consulta" as const,
    pacienteId: "1",
    pacienteNombre: "María González",
    descripcion: "Control mensual de diabetes",
    participantes: ["Dr. Martínez"]
  },
  {
    id: "2",
    titulo: "Consulta Juan Pérez",
    fecha: new Date(),
    horaInicio: "11:00",
    horaFin: "11:30",
    tipo: "consulta" as const,
    pacienteId: "2",
    pacienteNombre: "Juan Pérez",
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
    pacienteId: "3",
    pacienteNombre: "Ana López",
    descripcion: "Control post-operatorio",
    participantes: ["Dr. Martínez"]
  },
  {
    id: "4",
    titulo: "Visita familiar - Carlos Rodríguez",
    fecha: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Mañana
    horaInicio: "08:00",
    horaFin: "09:00",
    tipo: "visita" as const,
    pacienteId: "4",
    pacienteNombre: "Carlos Rodríguez",
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
  }
];

export const MedicoDashboard = ({ currentUser, isMedico, isEnfermera }: MedicoDashboardProps) => {
  const navigate = useNavigate();
  const { totalUnread } = useNotificationStore();
  const { pacientes, loading } = usePacientes();

  // Calcular consultas del día de hoy
  const today = new Date();
  const consultasHoy = eventosMock.filter(evento => {
    const eventoFecha = new Date(evento.fecha);
    return eventoFecha.toDateString() === today.toDateString() && 
           evento.tipo === "consulta";
  }).length;

  // Alertas clínicas usando datos reales
  const alertasClinicas = pacientes.length > 0 ? [
    {
      id: "1",
      pacienteId: pacientes[0]?.id || "1",
      pacienteNombre: pacientes[0] ? `${pacientes[0].nombre} ${pacientes[0].apellido}` : "Paciente",
      tipo: "alergia" as const,
      descripcion: "Alergia severa a penicilina",
      prioridad: "alta" as const,
      condicion: "Insuficiencia renal"
    },
    {
      id: "2",
      pacienteId: pacientes[1]?.id || "2",
      pacienteNombre: pacientes[1] ? `${pacientes[1].nombre} ${pacientes[1].apellido}` : "Paciente",
      tipo: "estudio" as const,
      descripcion: "Resultados críticos en hemograma",
      prioridad: "alta" as const,
      condicion: "Diabetes no controlada"
    },
    {
      id: "3",
      pacienteId: pacientes[2]?.id || "3",
      pacienteNombre: pacientes[2] ? `${pacientes[2].nombre} ${pacientes[2].apellido}` : "Paciente",
      tipo: "medicacion" as const,
      descripcion: "Medicamento pendiente de administrar",
      prioridad: "media" as const,
      condicion: "Hipertensión arterial"
    },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardHeader
        title="Panel Principal"
        subtitle={`Bienvenido ${currentUser.role}, aquí está el resumen del día`}
        userEmail={currentUser.email}
        userRole={currentUser.role}
        avatarFallback={isMedico ? "MD" : isEnfermera ? "EF" : "AD"}
      />
      
      {/* Resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Pacientes activos"
          value={loading ? "..." : pacientes.length}
          icon={Users}
          iconColor="bg-blue-100 text-blue-600"
        />
        
        <StatCard
          title="Consultas hoy"
          value={consultasHoy}
          icon={Calendar}
          iconColor="bg-green-100 text-green-600"
          onClick={() => navigate("/calendario")}
        />
        
        <StatCard
          title="Pacientes críticos"
          value={alertasClinicas.length}
          icon={AlertTriangle}
          iconColor="bg-red-100 text-red-600"
          onClick={() => document.getElementById('pacientes-criticos-tab')?.click()}
        />
        
        <StatCard
          title="Anuncios nuevos"
          value={totalUnread}
          icon={FileText}
          iconColor="bg-purple-100 text-purple-600"
          onClick={() => navigate("/anuncios")}
        />
      </div>
      
      {/* Pestañas principales */}
      <Tabs defaultValue="pacientes-criticos">
        <TabsList className="mb-6 bg-white border">
          <TabsTrigger id="pacientes-criticos-tab" value="pacientes-criticos" className="data-[state=active]:bg-health-50">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Pacientes críticos
          </TabsTrigger>
          <TabsTrigger value="actividad" className="data-[state=active]:bg-health-50">
            <Activity className="h-4 w-4 mr-2" />
            Actividad reciente
          </TabsTrigger>
        </TabsList>
        
        {/* Contenido de pacientes críticos */}
        <TabsContent value="pacientes-criticos" className="mt-0">
          <CriticalPatientsTab alertasClinicas={alertasClinicas} />
        </TabsContent>
        
        {/* Contenido de actividad reciente */}
        <TabsContent value="actividad" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Actividad reciente</CardTitle>
              <CardDescription>
                Últimas acciones realizadas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


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
import { useDemoStore } from "@/stores/demoStore";

interface MedicoDashboardProps {
  currentUser: { email: string; role: string };
  isMedico: boolean;
  isEnfermera: boolean;
}


export const MedicoDashboard = ({ currentUser, isMedico, isEnfermera }: MedicoDashboardProps) => {
  const navigate = useNavigate();
  const { totalUnread } = useNotificationStore();
  const { pacientes, loading } = usePacientes();
  const { eventos } = useDemoStore();

  // Calcular consultas del día de hoy
  const today = new Date();
  const consultasHoy = eventos.filter(evento => {
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
    <div className="max-w-7xl mx-auto space-y-8 animated-bg min-h-screen p-8 -m-8">
      <DashboardHeader
        title="Panel Principal"
        subtitle={`Bienvenido ${currentUser.role}, aquí está el resumen del día`}
        userEmail={currentUser.email}
        userRole={currentUser.role}
        avatarFallback={isMedico ? "MD" : isEnfermera ? "EF" : "AD"}
      />
      
      {/* Resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pacientes activos"
          value={loading ? "..." : pacientes.length}
          icon={Users}
          iconColor="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/50 dark:to-blue-800/50 dark:text-blue-300"
        />
        
        <StatCard
          title="Consultas hoy"
          value={consultasHoy}
          icon={Calendar}
          iconColor="bg-gradient-to-br from-green-100 to-green-200 text-green-700 dark:from-green-900/50 dark:to-green-800/50 dark:text-green-300"
          onClick={() => navigate("/calendario")}
        />
        
        <StatCard
          title="Pacientes críticos"
          value={alertasClinicas.length}
          icon={AlertTriangle}
          iconColor="bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-300"
          onClick={() => document.getElementById('pacientes-criticos-tab')?.click()}
        />
        
        <StatCard
          title="Anuncios nuevos"
          value={totalUnread}
          icon={FileText}
          iconColor="bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 dark:from-purple-900/50 dark:to-purple-800/50 dark:text-purple-300"
          onClick={() => navigate("/anuncios")}
        />
      </div>
      
      {/* Pestañas principales */}
      <div className="premium-card p-6 fade-in">
        <Tabs defaultValue="pacientes-criticos" className="w-full">
          <TabsList className="mb-6 glass-effect p-2 h-auto">
            <TabsTrigger 
              id="pacientes-criticos-tab" 
              value="pacientes-criticos" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 rounded-lg transition-all duration-300"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Pacientes críticos
            </TabsTrigger>
            <TabsTrigger 
              value="actividad" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 rounded-lg transition-all duration-300"
            >
              <Activity className="h-5 w-5 mr-2" />
              Actividad reciente
            </TabsTrigger>
          </TabsList>
          
          {/* Contenido de pacientes críticos */}
          <TabsContent value="pacientes-criticos" className="mt-0 space-y-6">
            <div className="slide-in-up">
              <CriticalPatientsTab alertasClinicas={alertasClinicas} />
            </div>
          </TabsContent>
          
          {/* Contenido de actividad reciente */}
          <TabsContent value="actividad" className="mt-0 space-y-6">
            <Card className="premium-card slide-in-up">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl gradient-text flex items-center gap-3">
                  <Activity className="h-6 w-6" />
                  Actividad reciente
                </CardTitle>
                <CardDescription className="text-base">
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
    </div>
  );
};

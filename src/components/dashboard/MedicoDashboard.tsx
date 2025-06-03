
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, AlertTriangle, FileText, Activity } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { StatCard } from "./StatCard";
import { ActivityTable } from "./ActivityTable";
import { CriticalPatientsTab } from "./CriticalPatientsTab";
import { useNotificationStore } from "@/stores/notificationStore";
import { pacientesMock } from "@/data/mockData";

interface MedicoDashboardProps {
  currentUser: { email: string; role: string };
  isMedico: boolean;
  isEnfermera: boolean;
}

export const MedicoDashboard = ({ currentUser, isMedico, isEnfermera }: MedicoDashboardProps) => {
  const navigate = useNavigate();
  const { totalUnread } = useNotificationStore();

  // Alertas clínicas mock
  const alertasClinicas = [
    {
      id: "1",
      pacienteId: pacientesMock[0].id,
      pacienteNombre: `${pacientesMock[0].nombre} ${pacientesMock[0].apellido}`,
      tipo: "alergia" as const,
      descripcion: "Alergia severa a penicilina",
      prioridad: "alta" as const,
      condicion: "Insuficiencia renal"
    },
    {
      id: "2",
      pacienteId: pacientesMock[1].id,
      pacienteNombre: `${pacientesMock[1].nombre} ${pacientesMock[1].apellido}`,
      tipo: "estudio" as const,
      descripcion: "Resultados críticos en hemograma",
      prioridad: "alta" as const,
      condicion: "Diabetes no controlada"
    },
    {
      id: "3",
      pacienteId: pacientesMock[2].id,
      pacienteNombre: `${pacientesMock[2].nombre} ${pacientesMock[2].apellido}`,
      tipo: "medicacion" as const,
      descripcion: "Medicamento pendiente de administrar",
      prioridad: "media" as const,
      condicion: "Hipertensión arterial"
    },
  ];

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
          value={pacientesMock.length}
          icon={Users}
          iconColor="bg-blue-100 text-blue-600"
        />
        
        <StatCard
          title="Consultas hoy"
          value={12}
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

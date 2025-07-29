
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, AlertTriangle, FileText, Activity, TrendingUp } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { StatCard } from "./StatCard";
import { ActivityTable } from "./ActivityTable";
import { DashboardAvanzado } from "./DashboardAvanzado";
import { useNotificationStore } from "@/stores/notificationStore";
import { useDemoStore } from "@/stores/demoStore";

interface AdminDashboardProps {
  currentUser: { email: string; role: string };
}

export const AdminDashboard = ({ currentUser }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const { totalUnread } = useNotificationStore();
  const { pacientes, pagos, requisiciones } = useDemoStore();

  console.log('AdminDashboard - currentUser:', currentUser);
  console.log('AdminDashboard - pacientes:', pacientes.length);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardHeader
        title="Panel Administrativo"
        subtitle={`Bienvenido ${currentUser.role}, aquí está el resumen del día`}
        userEmail={currentUser.email}
        userRole={currentUser.role}
        avatarFallback="AD"
      />
      
      {/* Resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Pacientes activos"
          value={pacientes.length}
          icon={Users}
          iconColor="bg-blue-100 text-blue-600"
        />
        
        <StatCard
          title="Pagos pendientes"
          value={pagos.filter(p => p.status === 'pendiente' || p.status === 'atrasado').length}
          icon={CreditCard}
          iconColor="bg-green-100 text-green-600"
          onClick={() => navigate("/admin")}
        />
        
        <StatCard
          title="Requisiciones"
          value={requisiciones.length}
          icon={AlertTriangle}
          iconColor="bg-red-100 text-red-600"
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
      <Tabs defaultValue="metricas">
        <TabsList className="mb-6 bg-white border">
          <TabsTrigger value="metricas" className="data-[state=active]:bg-health-50">
            <TrendingUp className="h-4 w-4 mr-2" />
            Métricas Avanzadas
          </TabsTrigger>
          <TabsTrigger value="actividad" className="data-[state=active]:bg-health-50">
            <Activity className="h-4 w-4 mr-2" />
            Actividad reciente
          </TabsTrigger>
        </TabsList>
        
        {/* Contenido de métricas avanzadas */}
        <TabsContent value="metricas" className="mt-0">
          <DashboardAvanzado />
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


import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FamiliarDashboard } from "@/components/dashboard/FamiliarDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { MedicoDashboard } from "@/components/dashboard/MedicoDashboard";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-health-600"></div>
          <p className="text-health-700">Cargando información...</p>
        </div>
      </div>
    );
  }
  
  const currentUserRole = user?.role || "";

  const isMedico = currentUserRole === "medico";
  const isEnfermera = currentUserRole === "enfermera";
  const isAdmin = currentUserRole === "admin";
  const isFamiliar = currentUserRole === "familiar";
  
  // Dashboard para familiares
  if (isFamiliar) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-6">
            <FamiliarDashboard currentUser={user} />
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  // Dashboard para administradores
  if (isAdmin) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-6">
            <AdminDashboard currentUser={user} />
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  // Dashboard para médicos y enfermeras
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <MedicoDashboard 
            currentUser={user} 
            isMedico={isMedico}
            isEnfermera={isEnfermera}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

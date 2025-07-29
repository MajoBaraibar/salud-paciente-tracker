
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PaymentTracker } from "@/components/admin/PaymentTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffSchedule } from "@/components/admin/StaffSchedule";
import { UserManagement } from "@/components/admin/UserManagement";

const Admin = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="payments">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-health-700">Gestión de Pagos</h1>
                  <p className="text-muted-foreground">
                    Administración de pagos y facturación del centro médico
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="payments">Pagos</TabsTrigger>
                  <TabsTrigger value="requisitions">Requisiciones</TabsTrigger>
                  <TabsTrigger value="schedule">Horarios</TabsTrigger>
                  <TabsTrigger value="users">Usuarios</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="payments">
                <PaymentTracker />
              </TabsContent>
              
              <TabsContent value="requisitions">
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    Lista de requisiciones pendientes de aprobación
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule">
                <StaffSchedule />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;

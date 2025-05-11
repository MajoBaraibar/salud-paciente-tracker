
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PaymentTracker } from "@/components/admin/PaymentTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
                  <h1 className="text-3xl font-bold text-health-700">Administración</h1>
                  <p className="text-muted-foreground">
                    Panel de administración del centro médico
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="payments">Pagos</TabsTrigger>
                  <TabsTrigger value="requisitions">Requisiciones</TabsTrigger>
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
              
              <TabsContent value="users">
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    Gestión de usuarios del sistema
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;


import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RequisitionForm } from "@/components/requisitions/RequisitionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Requisiciones = () => {
  const [currentUser] = useState<{role: string}>(() => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return { role: "medico" };
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="new-requisition">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-health-700">Requisiciones</h1>
                  <p className="text-muted-foreground">
                    Solicitud de insumos y materiales para el centro médico
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="new-requisition">Nueva solicitud</TabsTrigger>
                  <TabsTrigger value="my-requisitions">Mis solicitudes</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="new-requisition">
                <RequisitionForm userRole={currentUser.role} />
              </TabsContent>
              
              <TabsContent value="my-requisitions">
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    No tienes solicitudes activas en este momento
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

export default Requisiciones;


import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentTracker } from "@/components/admin/PaymentTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pacientesMock } from "../data/mockData";
import { PaymentType } from "@/types";

// Datos de ejemplo para pagos
const pagosMock: PaymentType[] = [
  {
    id: "1",
    pacienteId: "1",
    amount: 450,
    dueDate: "2025-05-15",
    status: "pendiente",
    notes: "Mensualidad mayo 2025"
  },
  {
    id: "2",
    pacienteId: "2",
    amount: 450,
    dueDate: "2025-05-10",
    status: "pagado",
    paymentDate: "2025-05-08",
    paymentMethod: "Transferencia bancaria",
    notes: "Mensualidad mayo 2025"
  },
  {
    id: "3",
    pacienteId: "3",
    amount: 500,
    dueDate: "2025-04-30",
    status: "atrasado",
    notes: "Mensualidad abril 2025 + cargo por atraso"
  },
];

const Pagos = () => {
  const [currentUser] = useState<{role: string}>(() => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return { role: "admin" };
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-health-700">Pagos</h1>
              <p className="text-muted-foreground">
                Gestión de mensualidades de los pacientes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pagos pendientes</p>
                      <p className="text-3xl font-bold">
                        {pagosMock.filter(p => p.status === "pendiente").length}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <span className="text-blue-700 font-bold text-lg">$</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pagos atrasados</p>
                      <p className="text-3xl font-bold text-red-600">
                        {pagosMock.filter(p => p.status === "atrasado").length}
                      </p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full">
                      <span className="text-red-700 font-bold text-lg">!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pagos completados (mes)</p>
                      <p className="text-3xl font-bold text-green-600">
                        {pagosMock.filter(p => p.status === "pagado").length}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <span className="text-green-700 font-bold text-lg">✓</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="payments">
              <TabsList className="mb-6">
                <TabsTrigger value="payments">Mensualidades</TabsTrigger>
                <TabsTrigger value="history">Historial de pagos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="payments">
                <PaymentTracker />
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de pagos</CardTitle>
                    <CardDescription>Registro de pagos realizados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">
                        Historial de pagos no disponible actualmente
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Pagos;

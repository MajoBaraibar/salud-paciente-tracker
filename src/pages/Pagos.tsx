
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
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Pagos pendientes</p>
                      <p className="text-3xl font-bold text-blue-800">
                        {pagosMock.filter(p => p.status === "pendiente").length}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Por cobrar este mes
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <span className="text-blue-700 font-bold text-xl">💰</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm text-blue-600">
                      Total: ${pagosMock.filter(p => p.status === "pendiente").reduce((sum, p) => sum + p.amount, 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-1">Pagos atrasados</p>
                      <p className="text-3xl font-bold text-red-800">
                        {pagosMock.filter(p => p.status === "atrasado").length}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Requieren atención urgente
                      </p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <span className="text-red-700 font-bold text-xl">⚠️</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <p className="text-sm text-red-600">
                      Total: ${pagosMock.filter(p => p.status === "atrasado").reduce((sum, p) => sum + p.amount, 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Pagos al día</p>
                      <p className="text-3xl font-bold text-green-800">
                        {pagosMock.filter(p => p.status === "pagado").length}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Completados este mes
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <span className="text-green-700 font-bold text-xl">✅</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-green-600">
                      Total recaudado: ${pagosMock.filter(p => p.status === "pagado").reduce((sum, p) => sum + p.amount, 0)}
                    </p>
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


import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentTracker } from "@/components/admin/PaymentTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { pacientesMock } from "../data/mockData";
import { PaymentType } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";

// Datos de ejemplo para pagos familiares
const pagosFamiliaresMock = [
  {
    id: "1",
    mes: "Junio",
    vencimiento: new Date(2025, 5, 5), // 5 de junio
    aPagar: 50000,
    status: "atrasado" as const
  },
  {
    id: "2",
    mes: "Julio",
    vencimiento: new Date(2025, 6, 5), // 5 de julio
    aPagar: 50000,
    status: "pendiente" as const
  },
  {
    id: "3",
    mes: "Mayo",
    vencimiento: new Date(2025, 4, 5), // 5 de mayo
    aPagar: 50000,
    status: "pagado" as const
  },
  {
    id: "4",
    mes: "Abril",
    vencimiento: new Date(2025, 3, 5), // 5 de abril
    aPagar: 50000,
    status: "pagado" as const
  }
];

// Datos de ejemplo para pagos admin
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

  const getStatusBadge = (status: "pagado" | "pendiente" | "atrasado") => {
    switch (status) {
      case "pagado":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">Completado</Badge>;
      case "pendiente":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300">Por cobrar</Badge>;
      case "atrasado":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300">Atrasado</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CL')}`;
  };

  const hasOverduePayments = pagosFamiliaresMock.some(pago => pago.status === "atrasado");

  // Vista para usuarios familiares
  if (currentUser.role === "familiar") {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-health-700">Pagos</h1>
                <p className="text-muted-foreground">
                  Estado de mensualidades
                </p>
              </div>

              {/* Alerta de pagos atrasados */}
              {hasOverduePayments && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Atención:</strong> Tienes pagos atrasados que requieren tu inmediata atención.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Estado de pagos</CardTitle>
                  <CardDescription>Información sobre tus mensualidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mes</TableHead>
                          <TableHead>Vencimiento</TableHead>
                          <TableHead>A pagar</TableHead>
                          <TableHead>Pago</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagosFamiliaresMock.map((pago) => (
                          <TableRow key={pago.id}>
                            <TableCell className="font-medium">{pago.mes}</TableCell>
                            <TableCell>{format(pago.vencimiento, 'd/M/yy')}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(pago.aPagar)}</TableCell>
                            <TableCell>{getStatusBadge(pago.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Vista para administradores
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

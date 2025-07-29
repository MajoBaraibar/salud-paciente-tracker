
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Search, Clock, X, CreditCard, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type PaymentStatus = "pagado" | "pendiente" | "atrasado";

type PatientPayment = {
  id: string;
  patientId: string;
  patientName: string;
  patientImageUrl?: string;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  paymentDate?: Date;
  paymentMethod?: string;
  notes?: string;
};

export const PaymentTracker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  
  // Mock data for demonstration
  const mockPayments: PatientPayment[] = [
    {
      id: "1",
      patientId: "p1",
      patientName: "Ana García Martínez",
      patientImageUrl: "",
      amount: 150,
      dueDate: new Date(2025, 4, 5),
      status: "pagado",
      paymentDate: new Date(2025, 4, 2),
      paymentMethod: "Tarjeta de crédito",
      notes: "Pago mensualidad mayo",
    },
    {
      id: "2",
      patientId: "p2",
      patientName: "Miguel Rodríguez López",
      patientImageUrl: "",
      amount: 150,
      dueDate: new Date(2025, 4, 5),
      status: "pendiente",
    },
    {
      id: "3",
      patientId: "p3",
      patientName: "Carmen Sánchez Pérez",
      patientImageUrl: "",
      amount: 150,
      dueDate: new Date(2025, 3, 5), // Previous month - overdue
      status: "atrasado",
    },
    {
      id: "4",
      patientId: "p4",
      patientName: "Javier Fernández Díaz",
      patientImageUrl: "",
      amount: 200,
      dueDate: new Date(2025, 4, 5),
      status: "pagado",
      paymentDate: new Date(2025, 4, 3),
      paymentMethod: "Transferencia bancaria",
    },
    {
      id: "5",
      patientId: "p5",
      patientName: "María López Torres",
      patientImageUrl: "",
      amount: 150,
      dueDate: new Date(2025, 5, 5), // Next month
      status: "pendiente",
    },
    {
      id: "6",
      patientId: "p6",
      patientName: "Pedro Martínez García",
      patientImageUrl: "",
      amount: 175,
      dueDate: new Date(2025, 4, 5),
      status: "pagado",
      paymentDate: new Date(2025, 4, 4),
      paymentMethod: "Efectivo",
    },
    {
      id: "7",
      patientId: "p7",
      patientName: "Rosa Jiménez Ruiz",
      patientImageUrl: "",
      amount: 150,
      dueDate: new Date(2025, 4, 5),
      status: "pendiente",
    },
    {
      id: "8",
      patientId: "p8",
      patientName: "Antonio Vargas Moreno",
      patientImageUrl: "",
      amount: 200,
      dueDate: new Date(2025, 3, 5), // Previous month - overdue
      status: "atrasado",
    },
    {
      id: "9",
      patientId: "p9",
      patientName: "Isabel Herrera Castro",
      patientImageUrl: "",
      amount: 150,
      dueDate: new Date(2025, 4, 5),
      status: "pagado",
      paymentDate: new Date(2025, 4, 1),
      paymentMethod: "Tarjeta de débito",
    },
    {
      id: "10",
      patientId: "p10",
      patientName: "Francisco Delgado Ramos",
      patientImageUrl: "",
      amount: 175,
      dueDate: new Date(2025, 4, 5),
      status: "pendiente",
    },
    {
      id: "11",
      patientId: "p11",
      patientName: "Lucía Ortega Silva",
      patientImageUrl: "",
      amount: 150,
      dueDate: new Date(2025, 2, 5), // Two months ago - overdue
      status: "atrasado",
    },
    {
      id: "12",
      patientId: "p12",
      patientName: "Carlos Mendoza Vega",
      patientImageUrl: "",
      amount: 200,
      dueDate: new Date(2025, 4, 5),
      status: "pagado",
      paymentDate: new Date(2025, 4, 5),
      paymentMethod: "Transferencia bancaria",
    },
  ];
  
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "pagado":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1 border-green-300">
            <Check className="h-3 w-3" />
            Pagado ✓
          </Badge>
        );
      case "pendiente":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1 border-blue-300">
            <Clock className="h-3 w-3" />
            Por cobrar
          </Badge>
        );
      case "atrasado":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1 border-red-300">
            <X className="h-3 w-3" />
            Vencido ⚠️
          </Badge>
        );
    }
  };
  
  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const paymentMonth = format(payment.dueDate, 'yyyy-MM');
    const matchesMonth = filterMonth === "" || paymentMonth === filterMonth;
    return matchesSearch && matchesMonth;
  });
  
  const handleMarkAsPaid = (paymentId: string) => {
    // Here you would update the payment status in your database
    toast.success("Pago marcado como realizado");
  };
  
  const handleSendReminder = (paymentId: string) => {
    // Here you would send a payment reminder to the patient
    toast.success("Recordatorio de pago enviado al paciente");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-health-700">Seguimiento de pagos</h2>
        <p className="text-muted-foreground">
          Gestione los pagos de pacientes y envíe recordatorios
        </p>
      </div>
      
      <Tabs defaultValue="payments">
        <TabsList className="mb-4">
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de vencimientos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Fechas de vencimiento programadas</h3>
                  <p className="text-blue-700">
                    📅 Todos los pagos vencen el <strong>día 5 de cada mes</strong>
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Los pacientes tienen hasta el día 5 para realizar su pago mensual
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pagos del mes</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre de paciente..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Label htmlFor="month-filter" className="sr-only">Filtrar por mes</Label>
                  <Input
                    id="month-filter"
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Importe</TableHead>
                      <TableHead>Fecha límite</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={payment.patientImageUrl} />
                                <AvatarFallback className="bg-health-100 text-health-600">
                                  {payment.patientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{payment.patientName}</p>
                                <p className="text-xs text-muted-foreground">ID: {payment.patientId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>{format(payment.dueDate, 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {payment.status !== "pagado" && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleMarkAsPaid(payment.id)}
                                  >
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    <span>Marcar pagado</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleSendReminder(payment.id)}
                                  >
                                    <Phone className="h-4 w-4 mr-1" />
                                    <span>Recordatorio</span>
                                  </Button>
                                </>
                              )}
                              {payment.status === "pagado" && (
                                <div className="text-xs text-green-600 font-medium">
                                  ✓ Pagado via {payment.paymentMethod}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No se encontraron pagos para los criterios seleccionados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-sm text-muted-foreground">Pagos completados</p>
                  <p className="text-2xl font-bold text-green-700">
                    {mockPayments.filter(p => p.status === "pagado").length}/{mockPayments.length}
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <p className="text-sm text-muted-foreground">Pagos pendientes</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {mockPayments.filter(p => p.status === "pendiente").length}/{mockPayments.length}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <p className="text-sm text-muted-foreground">Pagos atrasados</p>
                  <p className="text-2xl font-bold text-red-700">
                    {mockPayments.filter(p => p.status === "atrasado").length}/{mockPayments.length}
                  </p>
                </div>
              </div>
              
              <div className="text-center py-8 text-muted-foreground">
                <p>Las gráficas de estadísticas de pagos se mostrarán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

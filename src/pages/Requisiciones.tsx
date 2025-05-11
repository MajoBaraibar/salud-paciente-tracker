
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RequisitionForm } from "@/components/requisitions/RequisitionForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { RequisitionItemType } from "@/types";

// Mock requisitions data
const requisitionsMock: RequisitionItemType[] = [
  {
    id: "1",
    name: "Medicamentos para hipertensión",
    quantity: 10,
    priority: "alta",
    notes: "Urgente para paciente González",
    categoryId: "medicamentos",
    requestedBy: "Dr. Martínez",
    status: "pendiente"
  },
  {
    id: "2",
    name: "Material de limpieza",
    quantity: 5,
    priority: "media",
    notes: "Para área de cocina",
    categoryId: "limpieza",
    requestedBy: "Enf. Rodríguez",
    status: "pendiente"
  },
  {
    id: "3",
    name: "Pañales adulto talla G",
    quantity: 30,
    priority: "alta",
    notes: "Stock bajo",
    categoryId: "insumos",
    requestedBy: "Enf. Pérez",
    status: "aprobado"
  }
];

const Requisiciones = () => {
  const [currentUser, setCurrentUser] = useState<{role: string}>(() => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return { role: "medico" };
  });

  const [requisitions, setRequisitions] = useState<RequisitionItemType[]>(requisitionsMock);

  const handleApproveRequisition = (id: string) => {
    setRequisitions(prev => 
      prev.map(req => req.id === id ? {...req, status: "aprobado"} : req)
    );
    toast.success("Requisición aprobada");
  };

  const handleRejectRequisition = (id: string) => {
    setRequisitions(prev => 
      prev.map(req => req.id === id ? {...req, status: "rechazado"} : req)
    );
    toast.success("Requisición rechazada");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue={currentUser.role === "admin" ? "requisitions-list" : "new-requisition"}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-health-700">Requisiciones</h1>
                  <p className="text-muted-foreground">
                    Solicitud de insumos y materiales para el centro médico
                  </p>
                </div>
                <TabsList>
                  {currentUser.role === "admin" ? (
                    <>
                      <TabsTrigger value="requisitions-list">Solicitudes pendientes</TabsTrigger>
                      <TabsTrigger value="approved">Solicitudes aprobadas</TabsTrigger>
                    </>
                  ) : (
                    <>
                      <TabsTrigger value="new-requisition">Nueva solicitud</TabsTrigger>
                      <TabsTrigger value="my-requisitions">Mis solicitudes</TabsTrigger>
                    </>
                  )}
                </TabsList>
              </div>
              
              {currentUser.role === "admin" ? (
                <>
                  <TabsContent value="requisitions-list">
                    <Card>
                      <CardHeader>
                        <CardTitle>Solicitudes pendientes de aprobación</CardTitle>
                        <CardDescription>
                          Revise y apruebe o rechace las solicitudes del personal
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ítem</TableHead>
                              <TableHead>Cantidad</TableHead>
                              <TableHead>Prioridad</TableHead>
                              <TableHead>Solicitado por</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {requisitions.filter(r => r.status === "pendiente").map(req => (
                              <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.name}</TableCell>
                                <TableCell>{req.quantity}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    req.priority === "alta" ? "bg-red-100 text-red-700" :
                                    req.priority === "media" ? "bg-amber-100 text-amber-700" :
                                    "bg-blue-100 text-blue-700"
                                  }>
                                    {req.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>{req.requestedBy}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-green-50 border-green-200 hover:bg-green-100"
                                      onClick={() => handleApproveRequisition(req.id)}
                                    >
                                      <Check className="h-4 w-4 text-green-600 mr-1" />
                                      Aprobar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-red-50 border-red-200 hover:bg-red-100"
                                      onClick={() => handleRejectRequisition(req.id)}
                                    >
                                      <X className="h-4 w-4 text-red-600 mr-1" />
                                      Rechazar
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {requisitions.filter(r => r.status === "pendiente").length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                  No hay solicitudes pendientes de aprobación
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="approved">
                    <Card>
                      <CardHeader>
                        <CardTitle>Solicitudes aprobadas</CardTitle>
                        <CardDescription>
                          Historial de solicitudes aprobadas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ítem</TableHead>
                              <TableHead>Cantidad</TableHead>
                              <TableHead>Prioridad</TableHead>
                              <TableHead>Solicitado por</TableHead>
                              <TableHead>Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {requisitions.filter(r => r.status === "aprobado").map(req => (
                              <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.name}</TableCell>
                                <TableCell>{req.quantity}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    req.priority === "alta" ? "bg-red-100 text-red-700" :
                                    req.priority === "media" ? "bg-amber-100 text-amber-700" :
                                    "bg-blue-100 text-blue-700"
                                  }>
                                    {req.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>{req.requestedBy}</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-700">Aprobado</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                            {requisitions.filter(r => r.status === "aprobado").length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                  No hay solicitudes aprobadas
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              ) : (
                <>
                  <TabsContent value="new-requisition">
                    <RequisitionForm userRole={currentUser.role} />
                  </TabsContent>
                  
                  <TabsContent value="my-requisitions">
                    <Card>
                      <CardHeader>
                        <CardTitle>Mis solicitudes</CardTitle>
                        <CardDescription>
                          Historial de solicitudes realizadas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12 bg-muted/30 rounded-lg">
                          <p className="text-muted-foreground">
                            No tienes solicitudes activas en este momento
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Requisiciones;

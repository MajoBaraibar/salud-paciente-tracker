import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RequisitionForm } from "@/components/requisitions/RequisitionForm";
import { InventoryList } from "@/components/requisitions/InventoryList";
import { useAuth } from "@/hooks/useAuth";
import { useRequisiciones } from "@/hooks/useRequisiciones";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Requisiciones = () => {
  const { user } = useAuth();
  const { requisiciones, loading, error, refetch } = useRequisiciones();

  // Verificar autenticación
  useEffect(() => {
    if (!user) {
      // Redirect handled by auth hook
      return;
    }
  }, [user]);

  const handleApproveRequisition = async (id: string) => {
    try {
      // TODO: Implement update in Supabase
      toast.success("Requisición aprobada");
      refetch();
    } catch (err) {
      toast.error("Error al aprobar requisición");
    }
  };

  const handleRejectRequisition = async (id: string) => {
    try {
      // TODO: Implement update in Supabase
      toast.success("Requisición rechazada");
      refetch();
    } catch (err) {
      toast.error("Error al rechazar requisición");
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-health-600" />
                <span className="ml-2 text-muted-foreground">Cargando requisiciones...</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button onClick={() => refetch()}>Reintentar</Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue={user?.role === "admin" ? "requisitions-list" : "inventory-list"}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-health-700">Requisiciones</h1>
                  <p className="text-muted-foreground">
                    Solicitud de insumos y materiales para el centro médico
                  </p>
                </div>
                <TabsList>
                  {user?.role === "admin" ? (
                    <>
                      <TabsTrigger value="requisitions-list">Solicitudes pendientes</TabsTrigger>
                      <TabsTrigger value="approved">Solicitudes aprobadas</TabsTrigger>
                    </>
                  ) : (
                    <>
                      <TabsTrigger value="inventory-list">Lista existente</TabsTrigger>
                      <TabsTrigger value="new-requisition">Nueva solicitud</TabsTrigger>
                      <TabsTrigger value="my-requisitions">Mis solicitudes</TabsTrigger>
                    </>
                  )}
                </TabsList>
              </div>
              
              {/* New inventory list tab */}
              {user?.role !== "admin" && (
                <TabsContent value="inventory-list">
                  <InventoryList />
                </TabsContent>
              )}
              
              {user?.role === "admin" ? (
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
                            {requisiciones.filter(r => r.estado === "pendiente").map(req => (
                              <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.nombre}</TableCell>
                                <TableCell>{req.cantidad}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    req.prioridad === "alta" ? "bg-red-100 text-red-700" :
                                    req.prioridad === "media" ? "bg-amber-100 text-amber-700" :
                                    "bg-blue-100 text-blue-700"
                                  }>
                                    {req.prioridad}
                                  </Badge>
                                </TableCell>
                                <TableCell>{req.solicitado_por}</TableCell>
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
                            {requisiciones.filter(r => r.estado === "pendiente").length === 0 && (
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
                            {requisiciones.filter(r => r.estado === "aprobada").map(req => (
                              <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.nombre}</TableCell>
                                <TableCell>{req.cantidad}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    req.prioridad === "alta" ? "bg-red-100 text-red-700" :
                                    req.prioridad === "media" ? "bg-amber-100 text-amber-700" :
                                    "bg-blue-100 text-blue-700"
                                  }>
                                    {req.prioridad}
                                  </Badge>
                                </TableCell>
                                <TableCell>{req.solicitado_por}</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-700">Aprobado</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                            {requisiciones.filter(r => r.estado === "aprobada").length === 0 && (
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
                    <RequisitionForm userRole={user?.role || "medico"} />
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

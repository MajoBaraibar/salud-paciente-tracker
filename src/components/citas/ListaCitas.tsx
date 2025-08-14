import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, Clock, User, Stethoscope, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface ListaCitasProps {
  filtros: {
    estado: string;
    busqueda: string;
  };
}

interface Cita {
  id: string;
  paciente: { 
    nombre: string; 
    apellido: string;
    telefono: string;
    numeroIdentificacion: string;
  };
  medico: { 
    nombre: string; 
    especialidad: string;
  };
  fechaHora: string;
  duracionMinutos: number;
  estado: "programada" | "confirmada" | "en_curso" | "completada" | "cancelada" | "no_asistio";
  tipoCita: string;
  motivoConsulta: string;
  precio?: number;
}

export function ListaCitas({ filtros }: ListaCitasProps) {
  const { toast } = useToast();
  const [citaAEliminar, setCitaAEliminar] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const citasPorPagina = 10;

  // Datos simulados de citas
  const citasSimuladas: Cita[] = [
    {
      id: "1",
      paciente: { 
        nombre: "Juan", 
        apellido: "Pérez",
        telefono: "555-0101",
        numeroIdentificacion: "12345678"
      },
      medico: { nombre: "Dr. Roberto Silva", especialidad: "Medicina General" },
      fechaHora: new Date().toISOString(),
      duracionMinutos: 30,
      estado: "confirmada",
      tipoCita: "consulta",
      motivoConsulta: "Control rutinario",
      precio: 50000
    },
    {
      id: "2",
      paciente: { 
        nombre: "María", 
        apellido: "García",
        telefono: "555-0102",
        numeroIdentificacion: "87654321"
      },
      medico: { nombre: "Dra. Ana Martínez", especialidad: "Cardiología" },
      fechaHora: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      duracionMinutos: 45,
      estado: "programada",
      tipoCita: "consulta",
      motivoConsulta: "Dolor en el pecho",
      precio: 75000
    },
    {
      id: "3",
      paciente: { 
        nombre: "Carlos", 
        apellido: "López",
        telefono: "555-0103",
        numeroIdentificacion: "11223344"
      },
      medico: { nombre: "Dr. Luis Rodríguez", especialidad: "Pediatría" },
      fechaHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duracionMinutos: 30,
      estado: "completada",
      tipoCita: "control",
      motivoConsulta: "Vacunación",
      precio: 45000
    },
    {
      id: "4",
      paciente: { 
        nombre: "Ana", 
        apellido: "Rodríguez",
        telefono: "555-0104",
        numeroIdentificacion: "99887766"
      },
      medico: { nombre: "Dra. Carmen Villareal", especialidad: "Ginecología" },
      fechaHora: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      duracionMinutos: 30,
      estado: "no_asistio",
      tipoCita: "consulta",
      motivoConsulta: "Control ginecológico",
      precio: 60000
    }
  ];

  const obtenerColorEstado = (estado: string) => {
    const colores = {
      programada: "bg-blue-100 text-blue-800 border-blue-200",
      confirmada: "bg-green-100 text-green-800 border-green-200",
      en_curso: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completada: "bg-gray-100 text-gray-800 border-gray-200",
      cancelada: "bg-red-100 text-red-800 border-red-200",
      no_asistio: "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colores[estado as keyof typeof colores] || colores.programada;
  };

  const obtenerTextoEstado = (estado: string) => {
    const textos = {
      programada: "Programada",
      confirmada: "Confirmada",
      en_curso: "En Curso",
      completada: "Completada",
      cancelada: "Cancelada",
      no_asistio: "No Asistió"
    };
    return textos[estado as keyof typeof textos] || estado;
  };

  const filtrarCitas = (citas: Cita[]) => {
    return citas.filter(cita => {
      const cumpleFiltroEstado = filtros.estado === "todas" || cita.estado === filtros.estado;
      const cumpleBusqueda = !filtros.busqueda || 
        `${cita.paciente.nombre} ${cita.paciente.apellido}`.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        cita.medico.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        cita.paciente.numeroIdentificacion.includes(filtros.busqueda);
      
      return cumpleFiltroEstado && cumpleBusqueda;
    });
  };

  const citasFiltradas = filtrarCitas(citasSimuladas);
  const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);
  const citasPaginadas = citasFiltradas.slice(
    (paginaActual - 1) * citasPorPagina,
    paginaActual * citasPorPagina
  );

  const cambiarEstadoCita = async (citaId: string, nuevoEstado: string) => {
    try {
      console.log(`Cambiando estado de cita ${citaId} a ${nuevoEstado}`);
      // Aquí iría la lógica para actualizar en Supabase
      toast({
        title: "Estado actualizado",
        description: `La cita ha sido ${obtenerTextoEstado(nuevoEstado).toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el estado de la cita.",
        variant: "destructive",
      });
    }
  };

  const eliminarCita = async (citaId: string) => {
    try {
      console.log(`Eliminando cita ${citaId}`);
      // Aquí iría la lógica para eliminar de Supabase
      toast({
        title: "Cita eliminada",
        description: "La cita ha sido eliminada exitosamente.",
      });
      setCitaAEliminar(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la cita.",
        variant: "destructive",
      });
    }
  };

  const formatearPrecio = (precio?: number) => {
    if (!precio) return "-";
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Lista de Citas
            <Badge variant="secondary">{citasFiltradas.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {citasPaginadas.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha y Hora</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {citasPaginadas.map((cita) => (
                      <TableRow key={cita.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">
                            {format(new Date(cita.fechaHora), "dd/MM/yyyy")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(cita.fechaHora), "HH:mm")} ({cita.duracionMinutos}min)
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {cita.paciente.nombre} {cita.paciente.apellido}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {cita.paciente.numeroIdentificacion}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{cita.medico.nombre}</div>
                              <div className="text-sm text-muted-foreground">
                                {cita.medico.especialidad}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {cita.tipoCita.charAt(0).toUpperCase() + cita.tipoCita.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={obtenerColorEstado(cita.estado)}>
                            {obtenerTextoEstado(cita.estado)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatearPrecio(cita.precio)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar cita
                              </DropdownMenuItem>
                              
                              {cita.estado === "programada" && (
                                <DropdownMenuItem onClick={() => cambiarEstadoCita(cita.id, "confirmada")}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Confirmar
                                </DropdownMenuItem>
                              )}
                              
                              {(cita.estado === "confirmada" || cita.estado === "en_curso") && (
                                <DropdownMenuItem onClick={() => cambiarEstadoCita(cita.id, "completada")}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Marcar completada
                                </DropdownMenuItem>
                              )}
                              
                              {!["completada", "cancelada", "no_asistio"].includes(cita.estado) && (
                                <DropdownMenuItem onClick={() => cambiarEstadoCita(cita.id, "cancelada")}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancelar
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Llamar paciente
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                onClick={() => setCitaAEliminar(cita.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {((paginaActual - 1) * citasPorPagina) + 1} a {Math.min(paginaActual * citasPorPagina, citasFiltradas.length)} de {citasFiltradas.length} citas
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                      disabled={paginaActual === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                      disabled={paginaActual === totalPaginas}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron citas que coincidan con los filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!citaAEliminar} onOpenChange={() => setCitaAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La cita será eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => citaAEliminar && eliminarCita(citaAEliminar)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Plus, User, Users, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useNotificationStore } from "@/stores/notificationStore";
import { useDemoStore } from "@/stores/demoStore";

type Evento = {
  id: string;
  titulo: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  tipo: "consulta" | "visita" | "reunion" | "otro" | "administrativo";
  pacienteId?: string;
  pacienteNombre?: string;
  descripcion: string;
  participantes?: string[];
  estado?: "programado" | "cancelado" | "completado";
}

// Current user role for conditional rendering
const currentUser = JSON.parse(localStorage.getItem("user") || '{"role":"medico"}');
const userRole = currentUser.role;

// Debug: verificar qué rol está detectando
console.log("Rol del usuario en calendario:", userRole, "Usuario completo:", currentUser);

export default function Calendario() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { eventos, addEvento, updateEvento, deleteEvento } = useDemoStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [detalleModalAbierto, setDetalleModalAbierto] = useState(false);
  const [editModalAbierto, setEditModalAbierto] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState<Partial<Evento>>({
    fecha: date,
    tipo: "consulta",
    estado: "programado",
  });
  const [eventoEditando, setEventoEditando] = useState<Partial<Evento>>({});
  const [vista, setVista] = useState<"dia" | "semana">("dia");
  const { markAllAsRead } = useNotificationStore();

  // Marcar notificaciones de calendario como leídas al entrar a la página
  useEffect(() => {
    markAllAsRead('calendar');
  }, [markAllAsRead]);

  // Obtener días con eventos para marcar en el calendario
  const diasConEventos = eventos.map(evento => evento.fecha);
  
  // Filtrar eventos para el día seleccionado o semana
  const eventosFiltrados = eventos.filter(evento => {
    // Primero filtrar por fecha
    let cumpleFecha = false;
    if (vista === "dia" && date) {
      cumpleFecha = evento.fecha.toDateString() === date.toDateString();
    } else if (vista === "semana" && date) {
      // Para la vista semanal, mostrar los eventos de la semana actual
      const inicioSemana = new Date(date);
      inicioSemana.setDate(date.getDate() - date.getDay());
      
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      
      cumpleFecha = evento.fecha >= inicioSemana && evento.fecha <= finSemana;
    }
    
    if (!cumpleFecha) return false;
    
    // Filtrar por rol del usuario
    if (userRole === "admin") {
      // Los administradores solo ven eventos administrativos (reuniones, capacitaciones, auditorías)
      // NO ven consultas médicas ya que no son personal médico
      const tiposAdministrativos = ["reunion", "otro", "visita"];
      return tiposAdministrativos.includes(evento.tipo);
    }
    
    if (userRole === "familiar") {
      // Los familiares solo ven eventos de su paciente asignado (Roberto Pérez)
      // Para demo, asumimos que el familiar está asociado al paciente Roberto Pérez
      const deberaVer = evento.pacienteId === "550e8400-e29b-41d4-a716-446655440004" || 
                       evento.pacienteNombre?.includes("Roberto") ||
                       evento.tipo === "visita";
      
      console.log("Evento familiar filtrado:", {
        titulo: evento.titulo,
        pacienteId: evento.pacienteId,
        pacienteNombre: evento.pacienteNombre,
        tipo: evento.tipo,
        deberaVer
      });
      
      return deberaVer;
    }
    
    return true; // Médico y enfermera ven todos los eventos
  });

  const handleCrearEvento = () => {
    if (!nuevoEvento.titulo || !nuevoEvento.fecha || !nuevoEvento.horaInicio || !nuevoEvento.horaFin) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    const eventoCompleto: Evento = {
      id: Date.now().toString(),
      titulo: nuevoEvento.titulo!,
      fecha: nuevoEvento.fecha!,
      horaInicio: nuevoEvento.horaInicio!,
      horaFin: nuevoEvento.horaFin!,
      tipo: nuevoEvento.tipo as "consulta" | "visita" | "reunion" | "otro",
      descripcion: nuevoEvento.descripcion || "",
      pacienteId: nuevoEvento.pacienteId,
      pacienteNombre: nuevoEvento.pacienteNombre,
      participantes: nuevoEvento.participantes,
      estado: "programado",
    };

    addEvento(eventoCompleto);
    setModalAbierto(false);
    setNuevoEvento({ fecha: date, tipo: "consulta", estado: "programado" });

    toast.success("Evento creado correctamente");
  };

  const obtenerColorEvento = (tipo: string, estado?: string) => {
    const baseColors = {
      consulta: "bg-blue-100 text-blue-800 border-blue-300",
      visita: "bg-green-100 text-green-800 border-green-300",
      reunion: "bg-purple-100 text-purple-800 border-purple-300",
      otro: "bg-gray-100 text-gray-800 border-gray-300"
    };
    
    if (estado === "cancelado") {
      return "bg-red-100 text-red-800 border-red-300 opacity-60";
    }
    
    return baseColors[tipo as keyof typeof baseColors] || baseColors.otro;
  };

  const formatearHora = (hora: string) => {
    return hora;
  };

  const abrirDetalleEvento = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setDetalleModalAbierto(true);
  };

  const abrirEditarEvento = (evento: Evento) => {
    setEventoEditando({
      ...evento,
      fecha: evento.fecha,
    });
    setEditModalAbierto(true);
    setDetalleModalAbierto(false);
  };

  const handleEditarEvento = () => {
    if (!eventoEditando.titulo || !eventoEditando.fecha || !eventoEditando.horaInicio || !eventoEditando.horaFin) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    updateEvento(eventoEditando.id!, eventoEditando);
    setEditModalAbierto(false);
    setEventoEditando({});
    toast.success("Evento actualizado correctamente");
  };

  const handleCancelarEvento = (evento: Evento) => {
    updateEvento(evento.id, { estado: "cancelado" });
    setDetalleModalAbierto(false);
    toast.success("Evento cancelado");
  };

  const handleEliminarEvento = (evento: Evento) => {
    deleteEvento(evento.id);
    setDetalleModalAbierto(false);
    toast.success("Evento eliminado");
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Calendario</h1>
          <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
            <DialogTrigger asChild>
              <Button className="bg-health-600 hover:bg-health-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar nuevo evento</DialogTitle>
                <DialogDescription>
                  Complete los detalles para agregar un nuevo evento al calendario
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    placeholder="Título del evento"
                    value={nuevoEvento.titulo || ""}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, titulo: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hora-inicio">Hora de inicio</Label>
                    <Input
                      id="hora-inicio"
                      type="time"
                      value={nuevoEvento.horaInicio || ""}
                      onChange={(e) => setNuevoEvento({...nuevoEvento, horaInicio: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hora-fin">Hora de fin</Label>
                    <Input
                      id="hora-fin"
                      type="time"
                      value={nuevoEvento.horaFin || ""}
                      onChange={(e) => setNuevoEvento({...nuevoEvento, horaFin: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de evento</Label>
                  <Select
                    value={nuevoEvento.tipo}
                    onValueChange={(value) => setNuevoEvento({...nuevoEvento, tipo: value as any})}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Seleccione el tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRole === "admin" && (
                        <>
                          <SelectItem value="visita">Visita familiar</SelectItem>
                          <SelectItem value="reunion">Reunión administrativa</SelectItem>
                          <SelectItem value="otro">Capacitación/Auditoría</SelectItem>
                        </>
                      )}
                      {(userRole === "medico" || userRole === "enfermera") && (
                        <>
                          <SelectItem value="consulta">Consulta</SelectItem>
                          <SelectItem value="reunion">Reunión</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </>
                      )}
                      {userRole === "familiar" && (
                        <>
                          <SelectItem value="visita">Visita familiar</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="paciente">
                    {userRole === "admin" ? "Participantes (opcional)" : "Paciente (opcional)"}
                  </Label>
                  <Input
                    id="paciente"
                    placeholder={userRole === "admin" ? "Participantes de la reunión" : "Nombre del paciente"}
                    value={nuevoEvento.pacienteNombre || ""}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, pacienteNombre: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Detalles adicionales del evento"
                    value={nuevoEvento.descripcion || ""}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, descripcion: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCrearEvento}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Seleccionar fecha</CardTitle>
                <Tabs value={vista} onValueChange={(v) => setVista(v as "dia" | "semana")}>
                  <TabsList>
                    <TabsTrigger value="dia">Día</TabsTrigger>
                    <TabsTrigger value="semana">Semana</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="pointer-events-auto"
                locale={es}
                modifiers={{
                  conEventos: diasConEventos
                }}
                modifiersClassNames={{
                  conEventos: "bg-blue-100 text-blue-800 font-semibold border border-blue-300"
                }}
              />
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Tipos de eventos:</h4>
                <div className="flex flex-wrap gap-2">
                  {userRole === "admin" ? (
                    <>
                      <Badge className="bg-green-100 text-green-800 border-green-300">Visitas familiares</Badge>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300">Reuniones</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Capacitaciones</Badge>
                    </>
                  ) : (
                    <>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">Consulta</Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-300">Visita</Badge>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300">Reunión</Badge>
                      <Badge className="bg-gray-100 text-gray-800 border-gray-300">Otro</Badge>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Columna para eventos */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {vista === "dia" ? "Eventos del día" : "Eventos de la semana"}
              </CardTitle>
              <CardDescription>
                {vista === "dia" 
                  ? (date ? format(date, "d 'de' MMMM", { locale: es }) : "Selecciona una fecha")
                  : "Eventos programados para esta semana"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventosFiltrados.length > 0 ? (
                <div className="space-y-2">
                  {eventosFiltrados
                    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                    .map((evento) => (
                       <div
                         key={evento.id}
                         className={`p-3 border rounded-lg cursor-pointer transition-colors hover:shadow-md ${obtenerColorEvento(evento.tipo, evento.estado)}`}
                         onClick={() => abrirDetalleEvento(evento)}
                       >
                         <div className="flex justify-between items-start">
                           <div className="flex-1">
                             <div className="flex items-center gap-2">
                               <h3 className="font-medium">{evento.titulo}</h3>
                               {evento.estado === "cancelado" && (
                                 <Badge variant="destructive" className="text-xs">Cancelado</Badge>
                               )}
                             </div>
                             <div className="flex items-center text-sm mt-1 space-x-3">
                               <span className="flex items-center">
                                 <Clock className="w-3 h-3 mr-1" />
                                 {formatearHora(evento.horaInicio)} - {formatearHora(evento.horaFin)}
                               </span>
                               {evento.pacienteNombre && (
                                 <span className="flex items-center">
                                   <User className="w-3 h-3 mr-1" />
                                   {evento.pacienteNombre}
                                 </span>
                               )}
                             </div>
                           </div>
                           {vista === "semana" && (
                             <div>
                               <span className="text-xs text-gray-500">
                                 {format(evento.fecha, "EEE d", { locale: es })}
                               </span>
                             </div>
                           )}
                         </div>
                         {evento.descripcion && (
                           <p className="text-sm mt-2">{evento.descripcion}</p>
                         )}
                         {evento.participantes && evento.participantes.length > 0 && (
                           <div className="flex items-center mt-2 text-xs text-gray-600">
                             <Users className="w-3 h-3 mr-1" />
                             {evento.participantes.join(", ")}
                           </div>
                         )}
                       </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p>{vista === "dia" ? "No hay eventos para esta fecha" : "No hay eventos programados para esta semana"}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modal de detalles del evento */}
        <Dialog open={detalleModalAbierto} onOpenChange={setDetalleModalAbierto}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                {eventoSeleccionado?.titulo}
              </DialogTitle>
              <DialogDescription>
                Detalles completos del evento
              </DialogDescription>
            </DialogHeader>
            {eventoSeleccionado && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Fecha</Label>
                    <p className="text-sm">{format(eventoSeleccionado.fecha, "d 'de' MMMM 'de' yyyy", { locale: es })}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Horario</Label>
                    <p className="text-sm">{eventoSeleccionado.horaInicio} - {eventoSeleccionado.horaFin}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label className="text-sm font-medium text-gray-500">Tipo</Label>
                     <div className="flex items-center gap-2 mt-1">
                       <Badge className={obtenerColorEvento(eventoSeleccionado.tipo, eventoSeleccionado.estado)}>
                         {eventoSeleccionado.tipo.charAt(0).toUpperCase() + eventoSeleccionado.tipo.slice(1)}
                       </Badge>
                       {eventoSeleccionado.estado === "cancelado" && (
                         <Badge variant="destructive">Cancelado</Badge>
                       )}
                     </div>
                   </div>
                  {eventoSeleccionado.pacienteNombre && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Paciente</Label>
                      <p className="text-sm flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {eventoSeleccionado.pacienteNombre}
                      </p>
                    </div>
                  )}
                </div>

                {eventoSeleccionado.descripcion && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Descripción</Label>
                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">
                      {eventoSeleccionado.descripcion}
                    </p>
                  </div>
                )}

                {eventoSeleccionado.participantes && eventoSeleccionado.participantes.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Participantes</Label>
                    <div className="flex items-center mt-1">
                      <Users className="w-3 h-3 mr-1" />
                      <p className="text-sm">{eventoSeleccionado.participantes.join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>
             )}
             <DialogFooter className="flex-col sm:flex-row gap-2">
               <div className="flex gap-2">
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => abrirEditarEvento(eventoSeleccionado!)}
                   disabled={eventoSeleccionado?.estado === "cancelado"}
                 >
                   <Edit className="w-3 h-3 mr-1" />
                   Editar
                 </Button>
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => handleCancelarEvento(eventoSeleccionado!)}
                   disabled={eventoSeleccionado?.estado === "cancelado"}
                   className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                 >
                   <X className="w-3 h-3 mr-1" />
                   Cancelar
                 </Button>
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => handleEliminarEvento(eventoSeleccionado!)}
                   className="text-red-600 hover:text-red-700 hover:bg-red-50"
                 >
                   <Trash2 className="w-3 h-3 mr-1" />
                   Eliminar
                 </Button>
               </div>
               <Button variant="outline" onClick={() => setDetalleModalAbierto(false)}>
                 Cerrar
               </Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de edición del evento */}
        <Dialog open={editModalAbierto} onOpenChange={setEditModalAbierto}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar evento</DialogTitle>
              <DialogDescription>
                Modifica los detalles del evento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-titulo">Título</Label>
                <Input
                  id="edit-titulo"
                  placeholder="Título del evento"
                  value={eventoEditando.titulo || ""}
                  onChange={(e) => setEventoEditando({...eventoEditando, titulo: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-hora-inicio">Hora de inicio</Label>
                  <Input
                    id="edit-hora-inicio"
                    type="time"
                    value={eventoEditando.horaInicio || ""}
                    onChange={(e) => setEventoEditando({...eventoEditando, horaInicio: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-hora-fin">Hora de fin</Label>
                  <Input
                    id="edit-hora-fin"
                    type="time"
                    value={eventoEditando.horaFin || ""}
                    onChange={(e) => setEventoEditando({...eventoEditando, horaFin: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tipo">Tipo de evento</Label>
                <Select
                  value={eventoEditando.tipo}
                  onValueChange={(value) => setEventoEditando({...eventoEditando, tipo: value as any})}
                >
                  <SelectTrigger id="edit-tipo">
                    <SelectValue placeholder="Seleccione el tipo de evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRole === "admin" && (
                      <>
                        <SelectItem value="visita">Visita familiar</SelectItem>
                        <SelectItem value="reunion">Reunión</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </>
                    )}
                    {(userRole === "medico" || userRole === "enfermera") && (
                      <>
                        <SelectItem value="consulta">Consulta</SelectItem>
                        <SelectItem value="reunion">Reunión</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </>
                    )}
                    {userRole === "familiar" && (
                      <>
                        <SelectItem value="visita">Visita familiar</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-paciente">Paciente (opcional)</Label>
                <Input
                  id="edit-paciente"
                  placeholder="Nombre del paciente"
                  value={eventoEditando.pacienteNombre || ""}
                  onChange={(e) => setEventoEditando({...eventoEditando, pacienteNombre: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  placeholder="Detalles adicionales del evento"
                  value={eventoEditando.descripcion || ""}
                  onChange={(e) => setEventoEditando({...eventoEditando, descripcion: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalAbierto(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditarEvento}>Guardar cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

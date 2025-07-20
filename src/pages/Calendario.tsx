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
import { Calendar as CalendarIcon, Clock, Plus, User, Users } from "lucide-react";
import { toast } from "sonner";
import { useNotificationStore } from "@/stores/notificationStore";
import { useDemoStore } from "@/stores/demoStore";

type Evento = {
  id: string;
  titulo: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  tipo: "consulta" | "visita" | "reunion" | "otro";
  pacienteId?: string;
  pacienteNombre?: string;
  descripcion: string;
  participantes?: string[];
}

// Current user role for conditional rendering
const currentUser = JSON.parse(localStorage.getItem("user") || '{"role":"medico"}');
const userRole = currentUser.role;

export default function Calendario() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { eventos, addEvento } = useDemoStore();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [detalleModalAbierto, setDetalleModalAbierto] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState<Partial<Evento>>({
    fecha: date,
    tipo: "consulta",
  });
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
    if (vista === "dia" && date) {
      return evento.fecha.toDateString() === date.toDateString();
    } else if (vista === "semana" && date) {
      // Para la vista semanal, mostrar los eventos de la semana actual
      const inicioSemana = new Date(date);
      inicioSemana.setDate(date.getDate() - date.getDay());
      
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      
      return evento.fecha >= inicioSemana && evento.fecha <= finSemana;
    }
    return false;
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
    };

    addEvento(eventoCompleto);
    setModalAbierto(false);
    setNuevoEvento({ fecha: date, tipo: "consulta" });

    toast.success("Evento creado correctamente");
  };

  const obtenerColorEvento = (tipo: string) => {
    switch (tipo) {
      case "consulta":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "visita":
        return "bg-green-100 text-green-800 border-green-300";
      case "reunion":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatearHora = (hora: string) => {
    return hora;
  };

  const abrirDetalleEvento = (evento: Evento) => {
    setEventoSeleccionado(evento);
    setDetalleModalAbierto(true);
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
                  <Label htmlFor="paciente">Paciente (opcional)</Label>
                  <Input
                    id="paciente"
                    placeholder="Nombre del paciente"
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
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">Consulta</Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-300">Visita</Badge>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300">Reunión</Badge>
                  <Badge className="bg-gray-100 text-gray-800 border-gray-300">Otro</Badge>
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
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:shadow-md ${obtenerColorEvento(evento.tipo)}`}
                        onClick={() => abrirDetalleEvento(evento)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{evento.titulo}</h3>
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
                    <Badge className={obtenerColorEvento(eventoSeleccionado.tipo)}>
                      {eventoSeleccionado.tipo.charAt(0).toUpperCase() + eventoSeleccionado.tipo.slice(1)}
                    </Badge>
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetalleModalAbierto(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

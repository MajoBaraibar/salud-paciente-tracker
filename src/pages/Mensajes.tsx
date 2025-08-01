import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, MessageSquareText, Search, Send, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/stores/notificationStore";

// Tipos para el sistema de mensajes
interface Mensaje {
  id: string;
  remitente: string;
  destinatario: string;
  asunto: string;
  contenido: string;
  fecha: string;
  leido: boolean;
  conversacionId?: string;
}

interface Conversacion {
  id: string;
  participantes: string[];
  ultimoMensaje: string;
  fechaUltimoMensaje: string;
  noLeidos: number;
}

interface Usuario {
  id: string;
  nombre: string;
  rol: "medico" | "enfermero" | "administrativo";
}

const Mensajes = () => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [destinatarioSeleccionado, setDestinatarioSeleccionado] = useState("");
  const [asunto, setAsunto] = useState("");
  const [contenido, setContenido] = useState("");
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const { toast } = useToast();
  const { markAsRead } = useNotificationStore();

  // Obtener el usuario actual del localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || '{"role":"admin", "id":"1"}');
  const userRole = currentUser.role;
  const usuarioActualId = "1"; // Siempre usar ID 1 para el usuario actual
  
  // Encontrar nombre de usuario por ID - MOVIDO AQUÍ ANTES DE SU USO
  const encontrarNombreUsuario = (id: string): string => {
    const usuario = usuarios.find(user => user.id === id);
    return usuario ? usuario.nombre : "Usuario desconocido";
  };

  // Simular carga de mensajes, usuarios y conversaciones
  useEffect(() => {
    // Datos de ejemplo para usuarios según el rol
    let usuariosMock: Usuario[] = [];
    
    if (userRole === "admin" || userRole === "administrativo") {
      usuariosMock = [
        { id: "1", nombre: "Admin Sistema", rol: "administrativo" },
        { id: "2", nombre: "Contador Principal", rol: "administrativo" },
        { id: "3", nombre: "Gerente Operaciones", rol: "administrativo" },
        { id: "4", nombre: "Coordinador RRHH", rol: "administrativo" },
        { id: "5", nombre: "Supervisor Logística", rol: "administrativo" },
      ];
    } else if (userRole === "medico" || userRole === "enfermera") {
      usuariosMock = [
        { id: "1", nombre: "Dr. Juan Pérez", rol: "medico" },
        { id: "2", nombre: "Lic. María Rodríguez", rol: "enfermero" },
        { id: "3", nombre: "Adm. Carlos Gómez", rol: "administrativo" },
        { id: "4", nombre: "Dra. Ana Martínez", rol: "medico" },
      ];
    } else {
      usuariosMock = [
        { id: "2", nombre: "Lic. María Rodríguez", rol: "enfermero" },
        { id: "3", nombre: "Adm. Carlos Gómez", rol: "administrativo" },
        { id: "5", nombre: "Ana Rodríguez", rol: "administrativo" }, // Usuario familiar
      ];
    }

    // Datos de ejemplo para mensajes según el rol del usuario
    let todosMensajes: Mensaje[] = [];
    
    if (userRole === "admin" || userRole === "administrativo") {
      // Mensajes para administradores
      todosMensajes = [
        {
          id: "1",
          remitente: "2",
          destinatario: "1",
          asunto: "Reporte mensual de pagos",
          contenido: "El reporte de pagos de enero está listo para su revisión. El 85% de los pagos fueron realizados a tiempo.",
          fecha: "2025-01-25T09:30:00",
          leido: false,
          conversacionId: "conv1",
        },
        {
          id: "2",
          remitente: "3",
          destinatario: "1",
          asunto: "Solicitud de reunión",
          contenido: "Necesitamos reunirnos para revisar las nuevas políticas de contratación y los presupuestos del próximo trimestre.",
          fecha: "2025-01-25T14:15:00",
          leido: false,
          conversacionId: "conv2",
        },
        {
          id: "3",
          remitente: "4",
          destinatario: "1",
          asunto: "Informe de recursos humanos",
          contenido: "Le envío el informe semanal de asistencia del personal. Hay algunas ausencias que requieren su atención.",
          fecha: "2025-01-24T16:45:00",
          leido: false,
          conversacionId: "conv3",
        },
        {
          id: "4",
          remitente: "2",
          destinatario: "1",
          asunto: "Actualización sistemas",
          contenido: "Los sistemas de facturación han sido actualizados exitosamente. Todo está funcionando correctamente.",
          fecha: "2025-01-24T11:20:00",
          leido: true,
          conversacionId: "conv1",
        },
        {
          id: "5",
          remitente: "5",
          destinatario: "1",
          asunto: "Requisiciones pendientes",
          contenido: "Hay 5 requisiciones pendientes de aprobación. Dos de ellas son de prioridad alta para equipos médicos.",
          fecha: "2025-01-23T10:30:00",
          leido: false,
          conversacionId: "conv4",
        },
      ];
    } else if (userRole === "medico" || userRole === "enfermera") {
      // Mensajes para personal médico
      todosMensajes = [
        {
          id: "1",
          remitente: "2",
          destinatario: "1",
          asunto: "Paciente en sala 3",
          contenido: "El paciente de la sala 3 presenta fiebre alta. Por favor revisar cuando esté disponible.",
          fecha: "2025-01-25T15:30:00",
          leido: false,
          conversacionId: "conv1",
        },
        {
          id: "2",
          remitente: "3",
          destinatario: "1",
          asunto: "Actualización de historial",
          contenido: "Se ha subido el nuevo informe de laboratorio del paciente García. Ya está disponible en su historial.",
          fecha: "2025-01-25T09:15:00",
          leido: false,
          conversacionId: "conv2",
        },
        {
          id: "3",
          remitente: "4",
          destinatario: "1",
          asunto: "Consulta sobre medicación",
          contenido: "¿Podemos revisar juntos la medicación del paciente de la habitación 205? Hay algunas interacciones que me preocupan.",
          fecha: "2025-01-24T10:20:00",
          leido: false,
          conversacionId: "conv3",
        },
      ];
    } else {
      // Mensajes para familiares
      todosMensajes = [
        {
          id: "6",
          remitente: "3",
          destinatario: "5",
          asunto: "Informe médico de Roberto Pérez",
          contenido: "Estimada Ana, le informamos que Roberto ha completado sus exámenes de rutina. Los resultados son satisfactorios. Puede visitarlo mañana en horario de 14:00 a 16:00.",
          fecha: "2025-01-15T10:00:00",
          leido: false,
          conversacionId: "conv4",
        },
        {
          id: "7",
          remitente: "2",
          destinatario: "5",
          asunto: "Cambio de horario de visita",
          contenido: "Hola Ana, debido a un procedimiento médico programado, las visitas para Roberto se trasladarán al martes de 15:00 a 17:00. Disculpe las molestias.",
          fecha: "2025-01-16T08:30:00",
          leido: false,
          conversacionId: "conv5",
        },
      ];
    }

    // Los mensajes ya están filtrados por rol
    const mensajesMock = todosMensajes;

    // Generar conversaciones basadas en el rol
    let todasConversaciones: Conversacion[] = [];
    
    if (userRole === "admin" || userRole === "administrativo") {
      // Conversaciones para administradores
      todasConversaciones = [
        {
          id: "conv1",
          participantes: ["1", "2"],
          ultimoMensaje: "Los sistemas de facturación han sido actualizados exitosamente. Todo está funcionando correctamente.",
          fechaUltimoMensaje: "2025-01-24T11:20:00",
          noLeidos: 1,
        },
        {
          id: "conv2",
          participantes: ["1", "3"],
          ultimoMensaje: "Necesitamos reunirnos para revisar las nuevas políticas de contratación y los presupuestos del próximo trimestre.",
          fechaUltimoMensaje: "2025-01-25T14:15:00",
          noLeidos: 1,
        },
        {
          id: "conv3",
          participantes: ["1", "4"],
          ultimoMensaje: "Le envío el informe semanal de asistencia del personal. Hay algunas ausencias que requieren su atención.",
          fechaUltimoMensaje: "2025-01-24T16:45:00",
          noLeidos: 1,
        },
        {
          id: "conv4",
          participantes: ["1", "5"],
          ultimoMensaje: "Hay 5 requisiciones pendientes de aprobación. Dos de ellas son de prioridad alta para equipos médicos.",
          fechaUltimoMensaje: "2025-01-23T10:30:00",
          noLeidos: 1,
        },
      ];
    } else if (userRole === "medico" || userRole === "enfermera") {
      // Conversaciones para personal médico
      todasConversaciones = [
        {
          id: "conv1",
          participantes: ["1", "2"],
          ultimoMensaje: "El paciente de la sala 3 presenta fiebre alta. Por favor revisar cuando esté disponible.",
          fechaUltimoMensaje: "2025-01-25T15:30:00",
          noLeidos: 1,
        },
        {
          id: "conv2",
          participantes: ["1", "3"],
          ultimoMensaje: "Se ha subido el nuevo informe de laboratorio del paciente García. Ya está disponible en su historial.",
          fechaUltimoMensaje: "2025-01-25T09:15:00",
          noLeidos: 1,
        },
        {
          id: "conv3",
          participantes: ["1", "4"],
          ultimoMensaje: "¿Podemos revisar juntos la medicación del paciente de la habitación 205? Hay algunas interacciones que me preocupan.",
          fechaUltimoMensaje: "2025-01-24T10:20:00",
          noLeidos: 1,
        },
      ];
    } else {
      // Conversaciones para familiares
      todasConversaciones = [
        {
          id: "conv4",
          participantes: ["3", "5"],
          ultimoMensaje: "Estimada Ana, le informamos que Roberto ha completado sus exámenes de rutina. Los resultados son satisfactorios. Puede visitarlo mañana en horario de 14:00 a 16:00.",
          fechaUltimoMensaje: "2025-01-15T10:00:00",
          noLeidos: 1,
        },
        {
          id: "conv5",
          participantes: ["2", "5"],
          ultimoMensaje: "Hola Ana, debido a un procedimiento médico programado, las visitas para Roberto se trasladarán al martes de 15:00 a 17:00. Disculpe las molestias.",
          fechaUltimoMensaje: "2025-01-16T08:30:00",
          noLeidos: 1,
        },
      ];
    }

    // Las conversaciones ya están filtradas por rol
    const conversacionesMock = todasConversaciones;

    setUsuarios(usuariosMock);
    setMensajes(mensajesMock);
    setConversaciones(conversacionesMock);
  }, []);

  // Filtrar mensajes de la conversación activa
  const mensajesConversacion = conversacionActiva
    ? mensajes.filter(m => m.conversacionId === conversacionActiva)
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    : [];

  // Filtrar conversaciones según búsqueda
  const conversacionesFiltradas = conversaciones.filter(conv => {
    const otroParticipante = conv.participantes.find(p => p !== usuarioActualId) || "";
    const nombreParticipante = encontrarNombreUsuario(otroParticipante).toLowerCase();
    return nombreParticipante.includes(busqueda.toLowerCase()) || 
           conv.ultimoMensaje.toLowerCase().includes(busqueda.toLowerCase());
  });

  // Función para enviar un mensaje nuevo en una conversación existente
  const enviarMensajeConversacion = () => {
    if (!conversacionActiva || !nuevoMensaje.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe un mensaje",
        variant: "destructive",
      });
      return;
    }

    const conversacion = conversaciones.find(c => c.id === conversacionActiva);
    if (!conversacion) return;

    const destinatarioId = conversacion.participantes.find(p => p !== usuarioActualId) || "";

    const nuevoMsg: Mensaje = {
      id: `${mensajes.length + 1}`,
      remitente: usuarioActualId,
      destinatario: destinatarioId,
      asunto: `Conversación ${conversacionActiva}`,
      contenido: nuevoMensaje,
      fecha: new Date().toISOString(),
      leido: false,
      conversacionId: conversacionActiva,
    };

    // Actualizar la lista de mensajes
    setMensajes([...mensajes, nuevoMsg]);

    // Actualizar la conversación
    setConversaciones(conversaciones.map(c => 
      c.id === conversacionActiva 
        ? { 
            ...c, 
            ultimoMensaje: nuevoMensaje, 
            fechaUltimoMensaje: new Date().toISOString() 
          } 
        : c
    ));

    // Limpiar el campo de mensaje
    setNuevoMensaje("");

    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido enviado correctamente",
    });
  };

  // Función para enviar un mensaje nuevo (para diálogo de nuevo mensaje)
  const enviarMensaje = () => {
    if (!destinatarioSeleccionado || !asunto || !contenido) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    // Verificar si ya existe una conversación con este destinatario
    let conversacionId = conversaciones.find(c => 
      c.participantes.includes(destinatarioSeleccionado) && 
      c.participantes.includes(usuarioActualId)
    )?.id;

    // Si no existe la conversación, crear una nueva
    if (!conversacionId) {
      conversacionId = `conv${conversaciones.length + 1}`;
      const nuevaConversacion: Conversacion = {
        id: conversacionId,
        participantes: [usuarioActualId, destinatarioSeleccionado],
        ultimoMensaje: contenido,
        fechaUltimoMensaje: new Date().toISOString(),
        noLeidos: 0,
      };
      setConversaciones([...conversaciones, nuevaConversacion]);
    } else {
      // Actualizar conversación existente
      setConversaciones(conversaciones.map(c => 
        c.id === conversacionId 
          ? { 
              ...c, 
              ultimoMensaje: contenido, 
              fechaUltimoMensaje: new Date().toISOString() 
            } 
          : c
      ));
    }

    const nuevoMensaje: Mensaje = {
      id: `${mensajes.length + 1}`,
      remitente: usuarioActualId,
      destinatario: destinatarioSeleccionado,
      asunto,
      contenido,
      fecha: new Date().toISOString(),
      leido: false,
      conversacionId,
    };

    setMensajes([...mensajes, nuevoMensaje]);
    setDestinatarioSeleccionado("");
    setAsunto("");
    setContenido("");
    setConversacionActiva(conversacionId);

    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido enviado correctamente",
    });
  };

  // Función para marcar todos los mensajes de una conversación como leídos
  const marcarConversacionComoLeida = (conversacionId: string) => {
    setMensajes(mensajes.map(mensaje => 
      mensaje.conversacionId === conversacionId && mensaje.destinatario === usuarioActualId
        ? { ...mensaje, leido: true }
        : mensaje
    ));

    // Actualizar el número de mensajes no leídos en la conversación
    setConversaciones(conversaciones.map(conv => 
      conv.id === conversacionId ? { ...conv, noLeidos: 0 } : conv
    ));

    // Mark notifications as read in the notification store
    // This is the crucial part that was missing before
    markAsRead('1'); // Marking the message notification as read
  };

  // Función para seleccionar una conversación
  const seleccionarConversacion = (conversacionId: string) => {
    setConversacionActiva(conversacionId);
    marcarConversacionComoLeida(conversacionId);
  };

  // Formatear fecha
  const formatearFecha = (fecha: string): string => {
    const hoy = new Date();
    const fechaMensaje = new Date(fecha);
    
    // Si es hoy, mostrar solo la hora
    if (fechaMensaje.toDateString() === hoy.toDateString()) {
      return fechaMensaje.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Si es esta semana pero no hoy, mostrar el día de la semana
    const diffDias = Math.floor((hoy.getTime() - fechaMensaje.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias < 7) {
      return fechaMensaje.toLocaleDateString('es-ES', { weekday: 'short' });
    }
    
    // Si es más antiguo, mostrar fecha completa
    return fechaMensaje.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtener la primera letra del nombre para el avatar
  const obtenerIniciales = (nombre: string): string => {
    return nombre.charAt(0);
  };

  // Mark message notifications as read when opening the Messages page
  useEffect(() => {
    // Mark message notifications as read when the component mounts
    markAsRead('1');
  }, [markAsRead]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b p-4">
            <h1 className="text-2xl font-bold">Mensajería</h1>
          </div>
          <div className="flex-1 flex">
            {/* Panel lateral de conversaciones */}
            <div className="w-80 border-r flex flex-col">
              {/* Barra de búsqueda y botón nuevo mensaje */}
              <div className="p-3 border-b flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conversaciones"
                    className="pl-8"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Mensaje</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label htmlFor="destinatario" className="block text-sm font-medium mb-1">
                          Destinatario
                        </label>
                        <select 
                          id="destinatario"
                          className="w-full px-3 py-2 border rounded-md"
                          value={destinatarioSeleccionado}
                          onChange={(e) => setDestinatarioSeleccionado(e.target.value)}
                        >
                          <option value="">Seleccionar destinatario</option>
                          {usuarios
                            .filter(usuario => {
                              if (usuario.id === usuarioActualId) return false;
                              // Familiares solo pueden escribir a personal administrativo y enfermeras
                              if (userRole === "familiar") {
                                return usuario.rol === "administrativo" || usuario.rol === "enfermero";
                              }
                              return true;
                            })
                            .map(usuario => (
                              <option key={usuario.id} value={usuario.id}>
                                {usuario.nombre} - {usuario.rol === 'medico' ? 'Médico' : 
                                 usuario.rol === 'enfermero' ? 'Enfermero' : 'Administrativo'}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="asunto" className="block text-sm font-medium mb-1">
                          Asunto
                        </label>
                        <Input 
                          id="asunto"
                          value={asunto}
                          onChange={(e) => setAsunto(e.target.value)}
                          placeholder="Ingrese el asunto"
                        />
                      </div>
                      <div>
                        <label htmlFor="contenido" className="block text-sm font-medium mb-1">
                          Mensaje
                        </label>
                        <Textarea 
                          id="contenido"
                          value={contenido}
                          onChange={(e) => setContenido(e.target.value)}
                          placeholder="Escriba su mensaje aquí"
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit" onClick={enviarMensaje}>
                        Enviar Mensaje
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Lista de conversaciones */}
              <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                  {conversacionesFiltradas.length > 0 ? (
                    conversacionesFiltradas.map((conv) => {
                      const otroParticipante = conv.participantes.find(p => p !== usuarioActualId) || "";
                      const nombreParticipante = encontrarNombreUsuario(otroParticipante);
                      
                      return (
                        <div 
                          key={conv.id}
                          onClick={() => seleccionarConversacion(conv.id)}
                          className={`p-2 rounded-md cursor-pointer hover:bg-muted flex items-start gap-3 ${
                            conversacionActiva === conv.id ? "bg-muted" : ""
                          }`}
                        >
                          <Avatar>
                            <AvatarFallback>
                              {obtenerIniciales(nombreParticipante)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">
                                {nombreParticipante}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatearFecha(conv.fechaUltimoMensaje)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.ultimoMensaje}
                            </p>
                          </div>
                          {conv.noLeidos > 0 && (
                            <Badge className="bg-blue-500 px-2 ml-auto self-center">
                              {conv.noLeidos}
                            </Badge>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center p-4 text-muted-foreground">
                      No hay conversaciones
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            {/* Panel de mensajes */}
            <div className="flex-1 flex flex-col">
              {conversacionActiva ? (
                <>
                  {/* Cabecera de la conversación */}
                  <div className="p-4 border-b flex items-center gap-3">
                    {(() => {
                      const conv = conversaciones.find(c => c.id === conversacionActiva);
                      if (!conv) return null;
                      const otroParticipante = conv.participantes.find(p => p !== usuarioActualId) || "";
                      const nombreParticipante = encontrarNombreUsuario(otroParticipante);
                      
                      return (
                        <>
                          <Avatar>
                            <AvatarFallback>
                              {obtenerIniciales(nombreParticipante)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="font-medium">{nombreParticipante}</h2>
                            <p className="text-sm text-muted-foreground">
                              {usuarios.find(u => u.id === otroParticipante)?.rol === 'medico' ? 'Médico' : 
                               usuarios.find(u => u.id === otroParticipante)?.rol === 'enfermero' ? 'Enfermero' : 'Administrativo'}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Mensajes */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4 max-w-3xl mx-auto">
                      {mensajesConversacion.map((mensaje) => {
                        const esRemitente = mensaje.remitente === usuarioActualId;
                        
                        return (
                          <div 
                            key={mensaje.id} 
                            className={`flex ${esRemitente ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[70%] ${esRemitente ? "" : "flex items-start gap-2"}`}>
                              {!esRemitente && (
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {obtenerIniciales(encontrarNombreUsuario(mensaje.remitente))}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div>
                                <div 
                                  className={`p-3 rounded-lg ${
                                    esRemitente 
                                      ? "bg-primary text-primary-foreground" 
                                      : "bg-muted"
                                  }`}
                                >
                                  <p>{mensaje.contenido}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(mensaje.fecha).toLocaleTimeString('es-ES', { 
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  
                  {/* Campo para enviar mensaje */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Escribe un mensaje..."
                        className="min-h-[60px] resize-none"
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            enviarMensajeConversacion();
                          }
                        }}
                      />
                      <Button 
                        className="self-end" 
                        onClick={enviarMensajeConversacion}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Tu bandeja de mensajes</h2>
                  <p className="text-muted-foreground mb-4">
                    Selecciona una conversación para ver los mensajes o inicia una nueva.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <MessageSquareText className="mr-2 h-4 w-4" />
                        Nuevo Mensaje
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nuevo Mensaje</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label htmlFor="destinatario" className="block text-sm font-medium mb-1">
                            Destinatario
                          </label>
                          <select 
                            id="destinatario"
                            className="w-full px-3 py-2 border rounded-md"
                            value={destinatarioSeleccionado}
                            onChange={(e) => setDestinatarioSeleccionado(e.target.value)}
                          >
                            <option value="">Seleccionar destinatario</option>
                            {usuarios
                              .filter(usuario => {
                                if (usuario.id === usuarioActualId) return false;
                                // Familiares solo pueden escribir a personal administrativo y enfermeras
                                if (userRole === "familiar") {
                                  return usuario.rol === "administrativo" || usuario.rol === "enfermero";
                                }
                                return true;
                              })
                              .map(usuario => (
                                <option key={usuario.id} value={usuario.id}>
                                  {usuario.nombre} - {usuario.rol === 'medico' ? 'Médico' : 
                                   usuario.rol === 'enfermero' ? 'Enfermero' : 'Administrativo'}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="asunto" className="block text-sm font-medium mb-1">
                            Asunto
                          </label>
                          <Input 
                            id="asunto"
                            value={asunto}
                            onChange={(e) => setAsunto(e.target.value)}
                            placeholder="Ingrese el asunto"
                          />
                        </div>
                        <div>
                          <label htmlFor="contenido" className="block text-sm font-medium mb-1">
                            Mensaje
                          </label>
                          <Textarea 
                            id="contenido"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            placeholder="Escriba su mensaje aquí"
                            className="min-h-[150px]"
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button type="submit" onClick={enviarMensaje}>
                          Enviar Mensaje
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Mensajes;

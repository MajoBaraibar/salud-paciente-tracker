
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, MessageSquareText, Send, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Tipos para el sistema de mensajes
interface Mensaje {
  id: string;
  remitente: string;
  destinatario: string;
  asunto: string;
  contenido: string;
  fecha: string;
  leido: boolean;
}

interface Usuario {
  id: string;
  nombre: string;
  rol: "medico" | "enfermero" | "administrativo";
}

const Mensajes = () => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [destinatarioSeleccionado, setDestinatarioSeleccionado] = useState("");
  const [asunto, setAsunto] = useState("");
  const [contenido, setContenido] = useState("");
  const [filtro, setFiltro] = useState("recibidos");
  const { toast } = useToast();

  // Simular carga de mensajes y usuarios
  useEffect(() => {
    // Datos de ejemplo para usuarios
    const usuariosMock: Usuario[] = [
      { id: "1", nombre: "Dr. Juan Pérez", rol: "medico" },
      { id: "2", nombre: "Lic. María Rodríguez", rol: "enfermero" },
      { id: "3", nombre: "Adm. Carlos Gómez", rol: "administrativo" },
      { id: "4", nombre: "Dra. Ana Martínez", rol: "medico" },
    ];

    // Datos de ejemplo para mensajes
    const mensajesMock: Mensaje[] = [
      {
        id: "1",
        remitente: "2",
        destinatario: "1",
        asunto: "Paciente en sala 3",
        contenido: "El paciente de la sala 3 presenta fiebre alta. Por favor revisar cuando esté disponible.",
        fecha: "2025-05-10T15:30:00",
        leido: false,
      },
      {
        id: "2",
        remitente: "1",
        destinatario: "2",
        asunto: "Re: Paciente en sala 3",
        contenido: "Gracias por avisar. Iré en 10 minutos a revisar al paciente.",
        fecha: "2025-05-10T15:45:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "3",
        destinatario: "1",
        asunto: "Actualización de historial",
        contenido: "Se ha subido el nuevo informe de laboratorio del paciente García. Ya está disponible en su historial.",
        fecha: "2025-05-11T09:15:00",
        leido: false,
      },
      {
        id: "4",
        remitente: "4",
        destinatario: "1",
        asunto: "Consulta sobre medicación",
        contenido: "¿Podemos revisar juntos la medicación del paciente de la habitación 205? Hay algunas interacciones que me preocupan.",
        fecha: "2025-05-11T10:20:00",
        leido: false,
      },
    ];

    setUsuarios(usuariosMock);
    setMensajes(mensajesMock);
  }, []);

  // Obtener el usuario actual del localStorage (simulado)
  const usuarioActualId = "1"; // Simulando que el usuario actual es el Dr. Juan Pérez

  // Filtrar mensajes según la pestaña seleccionada
  const mensajesFiltrados = mensajes.filter(mensaje => {
    if (filtro === "recibidos") {
      return mensaje.destinatario === usuarioActualId;
    } else {
      return mensaje.remitente === usuarioActualId;
    }
  });

  // Función para enviar un mensaje nuevo
  const enviarMensaje = () => {
    if (!destinatarioSeleccionado || !asunto || !contenido) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const nuevoMensaje: Mensaje = {
      id: `${mensajes.length + 1}`,
      remitente: usuarioActualId,
      destinatario: destinatarioSeleccionado,
      asunto,
      contenido,
      fecha: new Date().toISOString(),
      leido: false,
    };

    setMensajes([...mensajes, nuevoMensaje]);
    setDestinatarioSeleccionado("");
    setAsunto("");
    setContenido("");

    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido enviado correctamente",
    });
  };

  // Función para marcar un mensaje como leído
  const marcarComoLeido = (id: string) => {
    setMensajes(mensajes.map(mensaje => 
      mensaje.id === id ? { ...mensaje, leido: true } : mensaje
    ));
  };

  // Encontrar nombre de usuario por ID
  const encontrarNombreUsuario = (id: string): string => {
    const usuario = usuarios.find(user => user.id === id);
    return usuario ? usuario.nombre : "Usuario desconocido";
  };

  // Formatear fecha
  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Sistema de Mensajería Interna</h1>

            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <Button 
                  variant={filtro === "recibidos" ? "default" : "outline"}
                  onClick={() => setFiltro("recibidos")}
                  className="flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Recibidos
                  {mensajes.filter(m => m.destinatario === usuarioActualId && !m.leido).length > 0 && (
                    <Badge className="ml-2 bg-red-500">
                      {mensajes.filter(m => m.destinatario === usuarioActualId && !m.leido).length}
                    </Badge>
                  )}
                </Button>
                <Button 
                  variant={filtro === "enviados" ? "default" : "outline"}
                  onClick={() => setFiltro("enviados")}
                  className="flex items-center"
                >
                  <MessageSquareText className="w-4 h-4 mr-2" />
                  Enviados
                </Button>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center">
                    <Send className="w-4 h-4 mr-2" />
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
                        {usuarios.map(usuario => (
                          usuario.id !== usuarioActualId && (
                            <option key={usuario.id} value={usuario.id}>
                              {usuario.nombre} - {usuario.rol === 'medico' ? 'Médico' : 
                               usuario.rol === 'enfermero' ? 'Enfermero' : 'Administrativo'}
                            </option>
                          )
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

            <div className="space-y-4">
              {mensajesFiltrados.length > 0 ? (
                mensajesFiltrados.map((mensaje) => {
                  const esRemitente = mensaje.remitente === usuarioActualId;
                  
                  return (
                    <Card 
                      key={mensaje.id} 
                      className={`p-4 hover:bg-muted/20 transition-colors ${!mensaje.leido && !esRemitente ? 'border-l-4 border-l-blue-500' : ''}`}
                      onClick={() => !esRemitente && !mensaje.leido && marcarComoLeido(mensaje.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-muted rounded-full">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-base">
                                {esRemitente 
                                  ? `Para: ${encontrarNombreUsuario(mensaje.destinatario)}`
                                  : `De: ${encontrarNombreUsuario(mensaje.remitente)}`
                                }
                              </h3>
                              {!mensaje.leido && !esRemitente && (
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                  No leído
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium">{mensaje.asunto}</p>
                            <p className="text-sm text-muted-foreground mt-1">{mensaje.contenido}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatearFecha(mensaje.fecha)}
                            </p>
                          </div>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Responder
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Responder Mensaje</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Para
                                </label>
                                <Input 
                                  readOnly 
                                  value={esRemitente 
                                    ? encontrarNombreUsuario(mensaje.destinatario)
                                    : encontrarNombreUsuario(mensaje.remitente)
                                  } 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Asunto
                                </label>
                                <Input 
                                  defaultValue={`Re: ${mensaje.asunto}`}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Mensaje
                                </label>
                                <Textarea 
                                  className="min-h-[150px]"
                                  defaultValue={`\n\n\n-------- Mensaje original --------\n${mensaje.contenido}`}
                                />
                              </div>
                            </div>
                            <DialogFooter className="mt-4">
                              <Button>
                                Enviar Respuesta
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    {filtro === "recibidos" 
                      ? "No tienes mensajes recibidos"
                      : "No tienes mensajes enviados"}
                  </p>
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

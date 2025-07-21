
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { EntradaHistorial } from "@/components/EntradaHistorial";
import { NuevaEntradaForm } from "@/components/NuevaEntradaForm";
import { NuevaNotaEnfermeria } from "@/components/patient/NuevaNotaEnfermeria";
import { EmergencyContact } from "@/components/patient/EmergencyContact";
import { ResultadosExamenes } from "@/components/patient/ResultadosExamenes";
import { ResumenMedico } from "@/components/patient/ResumenMedico";
import { usePacienteById } from "@/hooks/usePacientes";
import { useHistorialPaciente } from "@/hooks/useHistorial";
import { useAuth } from "@/hooks/useAuth";
import { calcularEdad } from "@/lib/utils";
import { 
  FileText, Plus, User, Edit, Trash2, CalendarDays, 
  Upload, Phone, Heart, Thermometer, Activity, 
  Droplets, UserCheck, Clipboard, AlertTriangle,
  FilePen, Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const DetallesPaciente = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { paciente: pacienteOriginal, loading: pacienteLoading, error: pacienteError } = usePacienteById(id || '');
  const { entradas: historial, loading: historialLoading, error: historialError } = useHistorialPaciente(id || '');
  
  const [activeTab, setActiveTab] = useState("perfil");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pacienteEditado, setPacienteEditado] = useState(pacienteOriginal);
  
  // Update edited patient when original data loads
  useEffect(() => {
    if (pacienteOriginal) {
      setPacienteEditado(pacienteOriginal);
    }
  }, [pacienteOriginal]);

  // Verificar autenticación
  useEffect(() => {
    if (!user) {
      // Redirect handled by auth hook
      return;
    }
  }, [user]);
  
  // Notas de enfermería (ejemplo)
  const [notasEnfermeria, setNotasEnfermeria] = useState<{
    id: string;
    tipo: 'evolucion' | 'conducta';
    fecha: string;
    contenido: string;
    enfermera: string;
  }[]>([
    {
      id: '1',
      tipo: 'evolucion',
      fecha: new Date().toISOString(),
      contenido: 'Paciente estable, signos vitales dentro de los parámetros normales.',
      enfermera: 'Enf. Ana Rodríguez'
    },
    {
      id: '2',
      tipo: 'conducta',
      fecha: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
      contenido: 'Paciente colaborador con el personal de enfermería. No presenta problemas conductuales.',
      enfermera: 'Enf. Carlos López'
    }
  ]);
  
  // Mock emergency contact data
  const mockEmergencyContact = {
    name: "María López García",
    relationship: "familiar",
    phone: "+34 612 345 678",
    email: "maria.lopez@ejemplo.com"
  };

  // Mock últimos signos vitales
  const signosVitales = {
    presion: "120/80",
    temperatura: "36.5",
    frecuenciaCardiaca: "72",
    saturacion: "98%",
    ultimaActualizacion: "2025-05-12T08:30:00"
  };
  
  if (pacienteLoading || historialLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-health-600" />
                <span className="ml-2 text-muted-foreground">Cargando información del paciente...</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (pacienteError || historialError || !pacienteOriginal) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 mb-4">Error: {pacienteError || historialError || 'Paciente no encontrado'}</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                >
                  Volver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagenPerfil(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarCambios = () => {
    if (imagenPerfil) {
      setPacienteEditado(prev => ({
        ...prev,
        imagenUrl: imagenPerfil
      }));
    }
    
    setIsEditing(false);
    toast.success("Información del paciente actualizada correctamente");
    setEditDialogOpen(false);
  };

  const handleNuevaNotaEnfermeria = () => {
    // Esta función sería implementada para actualizar las notas de enfermería
    // cuando se agregue una nueva desde el componente NuevaNotaEnfermeria
    console.log("Nueva nota de enfermería agregada");
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8 bg-slate-50/50">
          <div className="max-w-5xl mx-auto">
            {/* Cabecera del perfil */}
            <Card className="mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-health-50 to-slate-50 py-6 px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 relative group cursor-pointer">
                    <div 
                      className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <img 
                        src={pacienteEditado?.imagenUrl || "/placeholder.svg"} 
                        alt={`${pacienteEditado?.nombre} ${pacienteEditado?.apellido}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImagenChange}
                        ref={fileInputRef}
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-health-700 flex items-center">
                      {pacienteEditado?.nombre} {pacienteEditado?.apellido}
                      {pacienteEditado?.genero === "Masculino" ? 
                        <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">♂</Badge> : 
                        <Badge variant="outline" className="ml-3 bg-pink-50 text-pink-600 border-pink-200">♀</Badge>
                      }
                    </h1>
                    <div className="flex items-center mt-1 text-muted-foreground">
                      <span className="inline-flex items-center mr-3">
                        <UserCheck className="h-4 w-4 mr-1" />
                        ID: {pacienteEditado?.numeroIdentificacion}
                      </span>
                      <span className="inline-flex items-center mr-3">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {calcularEdad(pacienteEditado?.fechaNacimiento || "")} años
                      </span>
                    </div>
                  </div>
                </div>
                {user?.role === "admin" && (
                  <div>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1 bg-white"
                      onClick={() => setEditDialogOpen(true)}
                    >
                      <Edit className="h-4 w-4" />
                      Editar perfil
                    </Button>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Resumen Médico - Nuevo componente */}
            <ResumenMedico pacienteId={id || ""} />
            
            {/* Signos vitales recientes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-red-50 mb-2">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Presión arterial</p>
                    <p className="text-2xl font-bold text-red-600">{signosVitales.presion}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-amber-50 mb-2">
                      <Thermometer className="h-6 w-6 text-amber-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Temperatura</p>
                    <p className="text-2xl font-bold text-amber-600">{signosVitales.temperatura}°C</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-purple-50 mb-2">
                      <Activity className="h-6 w-6 text-purple-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Frec. cardíaca</p>
                    <p className="text-2xl font-bold text-purple-600">{signosVitales.frecuenciaCardiaca} bpm</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-blue-50 mb-2">
                      <Droplets className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Saturación O₂</p>
                    <p className="text-2xl font-bold text-blue-600">{signosVitales.saturacion}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Alerta para condiciones críticas */}
            {pacienteEditado?.id === "1" && (
              <Alert className="mb-6 border-red-300 bg-red-50 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-red-800">Atención: Condición crítica</AlertTitle>
                <AlertDescription className="text-red-700">
                  Este paciente tiene alergias documentadas a penicilina y sulfonamidas. Paciente con insuficiencia renal crónica.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Pestañas */}
            <Tabs defaultValue="perfil" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full mb-6">
                <TabsTrigger value="perfil" className="flex gap-2 items-center">
                  <User size={16} />
                  <span>Información personal</span>
                </TabsTrigger>
                <TabsTrigger value="historial" className="flex gap-2 items-center">
                  <FileText size={16} />
                  <span>Historial médico</span>
                </TabsTrigger>
                <TabsTrigger value="examenes" className="flex gap-2 items-center">
                  <Clipboard size={16} />
                  <span>Exámenes</span>
                </TabsTrigger>
                <TabsTrigger value="enfermeria" className="flex gap-2 items-center">
                  <FilePen size={16} />
                  <span>Notas de enfermería</span>
                </TabsTrigger>
                <TabsTrigger value="contacto" className="flex gap-2 items-center">
                  <Phone size={16} />
                  <span>Contacto de emergencia</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Contenido de Información Personal */}
              <TabsContent value="perfil">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Clipboard className="mr-2 h-5 w-5 text-health-600" />
                      Información del paciente
                    </CardTitle>
                    <CardDescription>Datos personales y de contacto</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Nombre completo</h3>
                        <p className="font-medium">{pacienteEditado?.nombre} {pacienteEditado?.apellido}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Fecha de nacimiento</h3>
                        <p className="font-medium">{pacienteEditado?.fechaNacimiento ? new Date(pacienteEditado.fechaNacimiento).toLocaleDateString('es-ES') : ""}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Edad</h3>
                        <p className="font-medium">{calcularEdad(pacienteEditado?.fechaNacimiento || "")} años</p>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Género</h3>
                        <p className="font-medium">{pacienteEditado?.genero}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Teléfono</h3>
                        <p className="font-medium">{pacienteEditado?.telefono || "No registrado"}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Dirección</h3>
                        <p className="font-medium">{pacienteEditado?.direccion || "No registrada"}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <FileText className="mr-2 h-4 w-4" />
                              Generar informe completo
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Genera un PDF con todos los datos del paciente</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contenido de Historial Médico */}
              <TabsContent value="historial">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-health-600" />
                    Historial Médico
                  </h2>
                  {user?.role === "medico" && (
                    <Button 
                      onClick={() => setMostrarFormulario(!mostrarFormulario)} 
                      className="bg-health-600 hover:bg-health-700"
                    >
                      <Plus size={16} className="mr-2" />
                      Nueva entrada
                    </Button>
                  )}
                </div>
                
                {mostrarFormulario && (
                  <NuevaEntradaForm 
                    pacienteId={pacienteOriginal.id} 
                    onSuccess={() => setMostrarFormulario(false)}
                    userRole={user?.role || "medico"} 
                  />
                )}
                
                {historial.length > 0 ? (
                  <div className="space-y-4">
                    {historial.map(entrada => (
                      <EntradaHistorial 
                        key={entrada.id} 
                        entrada={entrada}
                        userRole={user?.role || "medico"}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      No hay entradas en el historial médico de este paciente
                    </p>
                    {user?.role === "medico" && (
                      <Button 
                        onClick={() => setMostrarFormulario(true)}
                        variant="outline"
                      >
                        <Plus size={16} className="mr-2" />
                        Agregar primera entrada
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              {/* Nueva pestaña: Resultados de Exámenes */}
              <TabsContent value="examenes">
                <ResultadosExamenes pacienteId={pacienteOriginal.id} />
              </TabsContent>
              
              {/* Nueva pestaña: Notas de enfermería */}
              <TabsContent value="enfermeria">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FilePen className="mr-2 h-5 w-5 text-health-600" />
                    Notas de Enfermería
                  </h2>
                </div>
                
                {/* Solo enfermeras pueden agregar notas */}
                {user?.role === "enfermera" && (
                  <NuevaNotaEnfermeria 
                    pacienteId={pacienteOriginal.id} 
                    onSuccess={handleNuevaNotaEnfermeria}
                  />
                )}
                
                {notasEnfermeria.length > 0 ? (
                  <div className="space-y-4">
                    {notasEnfermeria.map(nota => (
                      <Card key={nota.id} className={`border-l-4 ${
                        nota.tipo === 'evolucion' ? 'border-l-blue-500' : 'border-l-purple-500'
                      }`}>
                        <CardHeader className={`bg-gradient-to-r ${
                          nota.tipo === 'evolucion' ? 'from-blue-50' : 'from-purple-50'
                        } to-transparent pb-2 flex flex-row items-center justify-between`}>
                          <div>
                            <CardTitle className="text-base font-medium flex items-center">
                              {nota.tipo === 'evolucion' ? 
                                'Evolución' : 
                                'Conducta'
                              }
                              <Badge className={`ml-2 ${
                                nota.tipo === 'evolucion' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {nota.tipo.toUpperCase()}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {format(new Date(nota.fecha), "d 'de' MMMM, yyyy")} - {nota.enfermera}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-gray-700">{nota.contenido}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      No hay notas de enfermería para este paciente
                    </p>
                    {user?.role === "enfermera" && (
                      <Button 
                        onClick={() => {}} // Se manejará desde el componente NuevaNotaEnfermeria
                        variant="outline"
                      >
                        <Plus size={16} className="mr-2" />
                        Agregar primera nota
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              {/* Contenido del Contacto de Emergencia */}
              <TabsContent value="contacto">
                {pacienteOriginal && (
                  <EmergencyContact 
                    patientId={pacienteOriginal.id} 
                    initialContact={mockEmergencyContact} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Modal de edición de paciente */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar información del paciente</DialogTitle>
            <DialogDescription>
              Actualiza la información de {pacienteOriginal?.nombre} {pacienteOriginal?.apellido}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input 
                  id="nombre" 
                  value={pacienteEditado?.nombre || ""} 
                  onChange={(e) => setPacienteEditado(prev => ({...prev!, nombre: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input 
                  id="apellido" 
                  value={pacienteEditado?.apellido || ""} 
                  onChange={(e) => setPacienteEditado(prev => ({...prev!, apellido: e.target.value}))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                <Input 
                  id="fechaNacimiento" 
                  type="date" 
                  value={pacienteEditado?.fechaNacimiento ? format(new Date(pacienteEditado.fechaNacimiento), "yyyy-MM-dd") : ""}
                  onChange={(e) => setPacienteEditado(prev => ({...prev!, fechaNacimiento: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <Select 
                  value={pacienteEditado?.genero || ""} 
                  onValueChange={(value) => setPacienteEditado(prev => ({...prev!, genero: value}))}
                >
                  <SelectTrigger id="genero">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroIdentificacion">Número de identificación</Label>
                <Input 
                  id="numeroIdentificacion" 
                  value={pacienteEditado?.numeroIdentificacion || ""} 
                  onChange={(e) => setPacienteEditado(prev => ({...prev!, numeroIdentificacion: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono" 
                  value={pacienteEditado?.telefono || ""} 
                  onChange={(e) => setPacienteEditado(prev => ({...prev!, telefono: e.target.value}))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input 
                id="direccion" 
                value={pacienteEditado?.direccion || ""} 
                onChange={(e) => setPacienteEditado(prev => ({...prev!, direccion: e.target.value}))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fotoPerfil">Foto de perfil</Label>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-100">
                  <img 
                    src={imagenPerfil || pacienteEditado?.imagenUrl || "/placeholder.svg"} 
                    alt="Foto de perfil" 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <Input 
                  id="fotoPerfil" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImagenChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGuardarCambios}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default DetallesPaciente;

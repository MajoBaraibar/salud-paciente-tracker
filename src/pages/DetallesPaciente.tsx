
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { EntradaHistorial } from "@/components/EntradaHistorial";
import { NuevaEntradaForm } from "@/components/NuevaEntradaForm";
import { EmergencyContact } from "@/components/patient/EmergencyContact";
import { getPacienteById, getHistorialPaciente } from "../data/mockData";
import { calcularEdad } from "@/lib/utils";
import { 
  FileText, Plus, User, Edit, Trash2, CalendarDays, 
  Upload, Phone, Heart, Thermometer, Activity, 
  Droplets, UserCheck, Clipboard, AlertTriangle
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
  const [activeTab, setActiveTab] = useState("perfil");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Obtener el paciente inicial
  const pacienteOriginal = getPacienteById(id || "");
  const [pacienteEditado, setPacienteEditado] = useState(pacienteOriginal);
  
  const historial = getHistorialPaciente(id || "");
  const [currentUser, setCurrentUser] = useState<{role: string}>(() => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return { role: "medico" };
  });
  
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
  
  if (!pacienteOriginal) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Paciente no encontrado</h1>
              <p className="text-muted-foreground">
                El paciente que estás buscando no existe o ha sido eliminado.
              </p>
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
              </div>
            </Card>
            
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
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="perfil" className="flex gap-2 items-center">
                  <User size={16} />
                  <span>Información personal</span>
                </TabsTrigger>
                <TabsTrigger value="historial" className="flex gap-2 items-center">
                  <FileText size={16} />
                  <span>Historial médico</span>
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
                  {currentUser.role === "medico" && (
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
                    userRole={currentUser.role} 
                  />
                )}
                
                {historial.length > 0 ? (
                  <div className="space-y-4">
                    {historial.map(entrada => (
                      <EntradaHistorial 
                        key={entrada.id} 
                        entrada={entrada}
                        userRole={currentUser.role} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      No hay entradas en el historial médico de este paciente
                    </p>
                    <Button 
                      onClick={() => setMostrarFormulario(true)}
                      variant="outline"
                      disabled={currentUser.role !== "medico"}
                    >
                      <Plus size={16} className="mr-2" />
                      Agregar primera entrada
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Contenido del Contacto de Emergencia */}
              <TabsContent value="contacto">
                <EmergencyContact 
                  patientId={pacienteOriginal.id} 
                  initialContact={mockEmergencyContact} 
                />
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


import { useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntradaHistorial } from "@/components/EntradaHistorial";
import { NuevaEntradaForm } from "@/components/NuevaEntradaForm";
import { EmergencyContact } from "@/components/patient/EmergencyContact";
import { getPacienteById, getHistorialPaciente } from "../data/mockData";
import { calcularEdad } from "@/lib/utils";
import { FileText, Plus, User, Edit, Trash2, CalendarDays, FileUpload, Phone } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const DetallesPaciente = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("perfil");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [imagenPerfil, setImagenPerfil] = useState<string | null>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null);
  
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
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Cabecera del perfil */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 relative group cursor-pointer">
                    <div 
                      className="w-20 h-20 rounded-full overflow-hidden"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <img 
                        src={pacienteEditado?.imagenUrl || "/placeholder.svg"} 
                        alt={`${pacienteEditado?.nombre} ${pacienteEditado?.apellido}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                        <FileUpload className="h-6 w-6 text-white" />
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImagenChange}
                        ref={(input) => fileInputRef.current = input}
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-health-700">
                      {pacienteEditado?.nombre} {pacienteEditado?.apellido}
                    </h1>
                    <p className="text-muted-foreground">
                      ID: {pacienteEditado?.numeroIdentificacion} | 
                      {calcularEdad(pacienteEditado?.fechaNacimiento || "")} años | 
                      {pacienteEditado?.genero}
                    </p>
                  </div>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                    Editar perfil
                  </Button>
                </div>
              </div>
            </div>
            
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
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Nombre completo</h3>
                        <p>{pacienteEditado?.nombre} {pacienteEditado?.apellido}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Número de identificación</h3>
                        <p>{pacienteEditado?.numeroIdentificacion}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Fecha de nacimiento</h3>
                        <p>{pacienteEditado?.fechaNacimiento ? new Date(pacienteEditado.fechaNacimiento).toLocaleDateString('es-ES') : ""}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Edad</h3>
                        <p>{calcularEdad(pacienteEditado?.fechaNacimiento || "")} años</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Género</h3>
                        <p>{pacienteEditado?.genero}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
                        <p>{pacienteEditado?.telefono}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Dirección</h3>
                        <p>{pacienteEditado?.direccion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contenido de Historial Médico */}
              <TabsContent value="historial">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Historial Médico</h2>
                  <Button 
                    onClick={() => setMostrarFormulario(!mostrarFormulario)} 
                    className="bg-health-600 hover:bg-health-700"
                  >
                    <Plus size={16} className="mr-2" />
                    Nueva entrada
                  </Button>
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

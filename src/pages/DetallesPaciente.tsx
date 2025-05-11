
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { EntradaHistorial } from "@/components/EntradaHistorial";
import { NuevaEntradaForm } from "@/components/NuevaEntradaForm";
import { getPacienteById, getHistorialPaciente } from "../data/mockData";
import { calcularEdad } from "@/lib/utils";
import { FileText, Plus, User } from "lucide-react";

const DetallesPaciente = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("perfil");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const paciente = getPacienteById(id || "");
  const historial = getHistorialPaciente(id || "");
  
  if (!paciente) {
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
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Cabecera del perfil */}
            <div className="mb-6">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img 
                      src={paciente.imagenUrl || "/placeholder.svg"} 
                      alt={`${paciente.nombre} ${paciente.apellido}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-health-700">
                    {paciente.nombre} {paciente.apellido}
                  </h1>
                  <p className="text-muted-foreground">
                    ID: {paciente.numeroIdentificacion} | 
                    {calcularEdad(paciente.fechaNacimiento)} años | 
                    {paciente.genero}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Pestañas */}
            <Tabs defaultValue="perfil" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="perfil" className="flex gap-2 items-center">
                  <User size={16} />
                  <span>Información personal</span>
                </TabsTrigger>
                <TabsTrigger value="historial" className="flex gap-2 items-center">
                  <FileText size={16} />
                  <span>Historial médico</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Contenido de Información Personal */}
              <TabsContent value="perfil">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Nombre completo</h3>
                        <p>{paciente.nombre} {paciente.apellido}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Número de identificación</h3>
                        <p>{paciente.numeroIdentificacion}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Fecha de nacimiento</h3>
                        <p>{new Date(paciente.fechaNacimiento).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Edad</h3>
                        <p>{calcularEdad(paciente.fechaNacimiento)} años</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Género</h3>
                        <p>{paciente.genero}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
                        <p>{paciente.telefono}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Dirección</h3>
                        <p>{paciente.direccion}</p>
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
                    pacienteId={paciente.id} 
                    onSuccess={() => setMostrarFormulario(false)} 
                  />
                )}
                
                {historial.length > 0 ? (
                  <div className="space-y-4">
                    {historial.map(entrada => (
                      <EntradaHistorial key={entrada.id} entrada={entrada} />
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
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DetallesPaciente;

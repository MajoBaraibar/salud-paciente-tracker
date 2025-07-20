import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useDemoStore } from '@/stores/demoStore';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ArrowLeft, Plus } from "lucide-react";

const DemoNuevoPaciente = () => {
  const navigate = useNavigate();
  const { addPaciente } = useDemoStore();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    genero: "",
    numeroIdentificacion: "",
    telefono: "",
    direccion: "",
    imagenUrl: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.fechaNacimiento) {
      toast.error("Por favor complete los campos obligatorios");
      return;
    }

    // Agregar paciente al store demo
    addPaciente({
      ...formData,
      imagenUrl: formData.imagenUrl || `https://randomuser.me/api/portraits/${formData.genero === 'femenino' ? 'women' : 'men'}/${Math.floor(Math.random() * 99)}.jpg`
    });

    toast.success(`Paciente ${formData.nombre} ${formData.apellido} registrado exitosamente`);
    navigate('/pacientes');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/pacientes')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <h1 className="text-3xl font-bold text-health-700">Nuevo Paciente</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Información del Paciente
                </CardTitle>
                <CardDescription>
                  Complete la información básica del nuevo paciente
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Ej: María Elena"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        placeholder="Ej: García Rodríguez"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genero">Género</Label>
                      <select
                        id="genero"
                        value={formData.genero}
                        onChange={(e) => handleInputChange('genero', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccionar género</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroIdentificacion">Número de Identificación</Label>
                      <Input
                        id="numeroIdentificacion"
                        value={formData.numeroIdentificacion}
                        onChange={(e) => handleInputChange('numeroIdentificacion', e.target.value)}
                        placeholder="Ej: 12345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        placeholder="Ej: +57 300 123 4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Textarea
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      placeholder="Ej: Carrera 15 #45-67, Bogotá"
                      rows={3}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/pacientes')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-health-600 hover:bg-health-700"
                  >
                    Registrar Paciente
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DemoNuevoPaciente;
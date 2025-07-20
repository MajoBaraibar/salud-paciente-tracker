
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { pacienteValidationSchema, validateAndSanitize } from "@/lib/security";

const NuevoPaciente = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(pacienteValidationSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      genero: "",
      numeroIdentificacion: "",
      telefono: "",
      direccion: ""
    }
  });
  
  const watchGenero = watch("genero");
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Validar y sanitizar datos
      const sanitizedData = validateAndSanitize(pacienteValidationSchema, data);
      
      // En una aplicación real, aquí enviaríamos los datos sanitizados a una API
      console.log("Nuevo paciente (sanitizado):", sanitizedData);
      
      // Simulamos un envío con timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Paciente registrado correctamente");
      // Redirigir a la lista de pacientes
      navigate("/pacientes");
    } catch (error) {
      console.error("Error al registrar paciente:", error);
      if (error instanceof Error) {
        toast.error(`Error de validación: ${error.message}`);
      } else {
        toast.error("Error al registrar el paciente");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-health-700">Registrar Nuevo Paciente</h1>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Información del paciente</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        placeholder="Nombre"
                        {...register("nombre", { required: "El nombre es requerido" })}
                      />
                      {errors.nombre && (
                        <span className="text-sm text-destructive">{errors.nombre.message?.toString()}</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        placeholder="Apellido"
                        {...register("apellido", { required: "El apellido es requerido" })}
                      />
                      {errors.apellido && (
                        <span className="text-sm text-destructive">{errors.apellido.message?.toString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        {...register("fechaNacimiento", { required: "La fecha de nacimiento es requerida" })}
                      />
                      {errors.fechaNacimiento && (
                        <span className="text-sm text-destructive">{errors.fechaNacimiento.message?.toString()}</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="genero">Género</Label>
                      <Select 
                        onValueChange={value => setValue("genero", value)}
                        defaultValue={watchGenero}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.genero && (
                        <span className="text-sm text-destructive">{errors.genero.message?.toString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroIdentificacion">Número de Identificación</Label>
                      <Input
                        id="numeroIdentificacion"
                        placeholder="Número de identificación"
                        {...register("numeroIdentificacion", { required: "El número de identificación es requerido" })}
                      />
                      {errors.numeroIdentificacion && (
                        <span className="text-sm text-destructive">{errors.numeroIdentificacion.message?.toString()}</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        placeholder="Teléfono"
                        {...register("telefono", { required: "El teléfono es requerido" })}
                      />
                      {errors.telefono && (
                        <span className="text-sm text-destructive">{errors.telefono.message?.toString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      placeholder="Dirección completa"
                      {...register("direccion", { required: "La dirección es requerida" })}
                    />
                    {errors.direccion && (
                      <span className="text-sm text-destructive">{errors.direccion.message?.toString()}</span>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/pacientes")}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-health-600 hover:bg-health-700"
                  >
                    {isSubmitting ? "Guardando..." : "Registrar Paciente"}
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

export default NuevoPaciente;

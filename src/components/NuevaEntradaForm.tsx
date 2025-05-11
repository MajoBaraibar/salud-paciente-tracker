
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface NuevaEntradaFormProps {
  pacienteId: string;
  onSuccess?: () => void;
}

export function NuevaEntradaForm({ pacienteId, onSuccess }: NuevaEntradaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      doctorNombre: "",
      motivoConsulta: "",
      diagnostico: "",
      tratamiento: "",
      notas: ""
    }
  });
  
  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // En una aplicación real, aquí enviaríamos los datos a una API
    // Simulamos un envío con timeout
    setTimeout(() => {
      console.log("Nueva entrada:", { pacienteId, ...data, fecha: new Date().toISOString().split('T')[0] });
      toast.success("Entrada agregada correctamente");
      reset();
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Nueva Entrada Médica</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorNombre">Médico</Label>
              <Input
                id="doctorNombre"
                placeholder="Nombre del médico"
                {...register("doctorNombre", { required: "El nombre del médico es requerido" })}
              />
              {errors.doctorNombre && (
                <span className="text-sm text-destructive">{errors.doctorNombre.message?.toString()}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                disabled
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivoConsulta">Motivo de la consulta</Label>
            <Textarea
              id="motivoConsulta"
              placeholder="Describa el motivo de la consulta"
              className="min-h-[60px]"
              {...register("motivoConsulta", { required: "El motivo de consulta es requerido" })}
            />
            {errors.motivoConsulta && (
              <span className="text-sm text-destructive">{errors.motivoConsulta.message?.toString()}</span>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="diagnostico">Diagnóstico</Label>
            <Textarea
              id="diagnostico"
              placeholder="Diagnóstico del paciente"
              className="min-h-[60px]"
              {...register("diagnostico", { required: "El diagnóstico es requerido" })}
            />
            {errors.diagnostico && (
              <span className="text-sm text-destructive">{errors.diagnostico.message?.toString()}</span>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tratamiento">Tratamiento</Label>
            <Textarea
              id="tratamiento"
              placeholder="Tratamiento indicado"
              className="min-h-[60px]"
              {...register("tratamiento", { required: "El tratamiento es requerido" })}
            />
            {errors.tratamiento && (
              <span className="text-sm text-destructive">{errors.tratamiento.message?.toString()}</span>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notas">Notas adicionales</Label>
            <Textarea
              id="notas"
              placeholder="Notas adicionales"
              className="min-h-[80px]"
              {...register("notas")}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => reset()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-health-600 hover:bg-health-700">
            {isSubmitting ? "Guardando..." : "Guardar entrada"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

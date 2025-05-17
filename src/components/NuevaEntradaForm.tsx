
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface NuevaEntradaFormProps {
  pacienteId: string;
  onSuccess: () => void;
  userRole?: string;
}

export const NuevaEntradaForm = ({ pacienteId, onSuccess, userRole = "medico" }: NuevaEntradaFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      motivoConsulta: "",
      diagnostico: "",
      tratamiento: "",
      notas: "",
    }
  });
  
  if (userRole === "enfermera") {
    return (
      <Card className="mb-6 p-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md flex items-start mb-4">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Acceso limitado</p>
            <p className="text-sm">Como enfermera, no puede crear entradas médicas completas. Para agregar observaciones, use la opción "Agregar observación" en las entradas existentes.</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onSuccess}>
            Cerrar
          </Button>
        </div>
      </Card>
    );
  }
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // En un caso real, aquí iría la llamada a la API
      console.log("Nueva entrada:", { pacienteId, ...data });
      
      // Simulamos una espera
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Entrada médica agregada correctamente");
      reset();
      onSuccess();
    } catch (error) {
      console.error("Error al guardar entrada:", error);
      toast.error("Error al guardar la entrada médica");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mb-6 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="motivoConsulta" className="mb-2 block">
            Motivo de consulta <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="motivoConsulta"
            className="min-h-[80px]"
            placeholder="Describa el motivo de la consulta"
            {...register("motivoConsulta", { 
              required: "Este campo es obligatorio" 
            })}
          />
          {errors.motivoConsulta && (
            <p className="text-sm text-red-500 mt-1">{errors.motivoConsulta.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="diagnostico" className="mb-2 block">
            Diagnóstico <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="diagnostico"
            className="min-h-[80px]"
            placeholder="Indique el diagnóstico del paciente"
            {...register("diagnostico", { 
              required: "Este campo es obligatorio" 
            })}
          />
          {errors.diagnostico && (
            <p className="text-sm text-red-500 mt-1">{errors.diagnostico.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="tratamiento" className="mb-2 block">
            Tratamiento <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="tratamiento"
            className="min-h-[80px]"
            placeholder="Describa el tratamiento indicado"
            {...register("tratamiento", { 
              required: "Este campo es obligatorio" 
            })}
          />
          {errors.tratamiento && (
            <p className="text-sm text-red-500 mt-1">{errors.tratamiento.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="notas" className="mb-2 block">
            Notas adicionales
          </Label>
          <Textarea
            id="notas"
            className="min-h-[80px]"
            placeholder="Comentarios adicionales, observaciones, etc."
            {...register("notas")}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onSuccess();
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar entrada"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Calendar, Clock, User, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  pacienteId: z.string().min(1, "Debe seleccionar un paciente"),
  medicoId: z.string().min(1, "Debe seleccionar un médico"),
  especialidadId: z.string().optional(),
  fecha: z.string().min(1, "Debe seleccionar una fecha"),
  hora: z.string().min(1, "Debe seleccionar una hora"),
  duracionMinutos: z.number().min(15).max(180),
  tipoCita: z.enum(["consulta", "control", "procedimiento", "emergencia"]),
  motivoConsulta: z.string().min(1, "Debe especificar el motivo de la consulta"),
  notasPaciente: z.string().optional(),
  precio: z.number().min(0).optional(),
});

interface NuevaCitaFormProps {
  onClose: () => void;
  onSuccess: () => void;
  citaEditar?: any; // Para edición de citas existentes
}

export function NuevaCitaForm({ onClose, onSuccess, citaEditar }: NuevaCitaFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pacienteId: citaEditar?.paciente_id || "",
      medicoId: citaEditar?.medico_id || "",
      especialidadId: citaEditar?.especialidad_id || "",
      fecha: citaEditar?.fecha_hora ? new Date(citaEditar.fecha_hora).toISOString().split('T')[0] : "",
      hora: citaEditar?.fecha_hora ? new Date(citaEditar.fecha_hora).toTimeString().slice(0, 5) : "",
      duracionMinutos: citaEditar?.duracion_minutos || 30,
      tipoCita: citaEditar?.tipo_cita || "consulta",
      motivoConsulta: citaEditar?.motivo_consulta || "",
      notasPaciente: citaEditar?.notas_paciente || "",
      precio: citaEditar?.precio || 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Combinar fecha y hora
      const fechaHora = new Date(`${values.fecha}T${values.hora}`);
      
      const citaData = {
        ...values,
        fechaHora: fechaHora.toISOString(),
      };

      console.log("Datos de la cita:", citaData);

      // Aquí iría la lógica para guardar en Supabase
      // await supabase.from('citas_medicas').insert(citaData);

      toast({
        title: citaEditar ? "Cita actualizada" : "Cita programada",
        description: citaEditar ? "La cita ha sido actualizada exitosamente." : "La cita ha sido programada exitosamente.",
      });

      onSuccess();
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la cita. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Datos simulados para los selects
  const pacientes = [
    { id: "1", nombre: "Juan Pérez", numeroIdentificacion: "12345678" },
    { id: "2", nombre: "María García", numeroIdentificacion: "87654321" },
    { id: "3", nombre: "Carlos López", numeroIdentificacion: "11223344" },
  ];

  const medicos = [
    { id: "1", nombre: "Dr. Roberto Silva", especialidad: "Medicina General" },
    { id: "2", nombre: "Dra. Ana Martínez", especialidad: "Cardiología" },
    { id: "3", nombre: "Dr. Luis Rodríguez", especialidad: "Pediatría" },
  ];

  const especialidades = [
    { id: "1", nombre: "Medicina General" },
    { id: "2", nombre: "Cardiología" },
    { id: "3", nombre: "Pediatría" },
    { id: "4", nombre: "Ginecología" },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {citaEditar ? "Editar Cita" : "Nueva Cita Médica"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Paciente */}
              <FormField
                control={form.control}
                name="pacienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Paciente
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pacientes.map((paciente) => (
                          <SelectItem key={paciente.id} value={paciente.id}>
                            {paciente.nombre} - {paciente.numeroIdentificacion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Médico */}
              <FormField
                control={form.control}
                name="medicoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médico</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar médico" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {medicos.map((medico) => (
                          <SelectItem key={medico.id} value={medico.id}>
                            {medico.nombre} - {medico.especialidad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Especialidad */}
              <FormField
                control={form.control}
                name="especialidadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar especialidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {especialidades.map((especialidad) => (
                          <SelectItem key={especialidad.id} value={especialidad.id}>
                            {especialidad.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de cita */}
              <FormField
                control={form.control}
                name="tipoCita"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cita</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="consulta">Consulta</SelectItem>
                        <SelectItem value="control">Control</SelectItem>
                        <SelectItem value="procedimiento">Procedimiento</SelectItem>
                        <SelectItem value="emergencia">Emergencia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha */}
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hora */}
              <FormField
                control={form.control}
                name="hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Hora
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duración */}
              <FormField
                control={form.control}
                name="duracionMinutos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="15" 
                        max="180" 
                        step="15"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Precio */}
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Motivo de consulta */}
            <FormField
              control={form.control}
              name="motivoConsulta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Motivo de la Consulta
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa el motivo de la consulta..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notas del paciente */}
            <FormField
              control={form.control}
              name="notasPaciente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales del paciente (opcional)..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : citaEditar ? "Actualizar" : "Programar Cita"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
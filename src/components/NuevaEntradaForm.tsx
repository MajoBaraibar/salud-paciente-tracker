
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CalendarDays, FileText, CalendarCheck, User, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  pacienteId: string;
  onSuccess: () => void;
  userRole?: string;
};

export const NuevaEntradaForm = ({ pacienteId, onSuccess, userRole = 'medico' }: Props) => {
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [notas, setNotas] = useState('');
  const [resultadoExamen, setResultadoExamen] = useState('');
  const [archivoExamen, setArchivoExamen] = useState<File | null>(null);
  const [nombreExamen, setNombreExamen] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = () => {
    // Validación básica según el rol
    if (userRole === 'medico') {
      if (!motivoConsulta || !diagnostico) {
        toast.error('Por favor complete los campos obligatorios');
        return;
      }
    } else if (userRole === 'enfermera') {
      if (!notas) {
        toast.error('Las notas son obligatorias para registrar una entrada');
        return;
      }
    }

    setLoading(true);
    
    // Simulación de envío a servidor
    setTimeout(() => {
      setLoading(false);
      toast.success('Entrada añadida al historial médico');
      
      // Limpiar formulario
      setMotivoConsulta('');
      setDiagnostico('');
      setTratamiento('');
      setNotas('');
      setResultadoExamen('');
      setArchivoExamen(null);
      setNombreExamen('');
      
      // Notificar éxito
      onSuccess();
    }, 1000);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivoExamen(e.target.files[0]);
    }
  };

  return (
    <Card className="mb-6 border-l-4 border-l-health-400">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center mb-2">
          <PlusCircle className="h-5 w-5 text-health-600 mr-2" />
          <h3 className="font-semibold text-health-600">
            {userRole === 'medico' ? 'Nueva entrada en historial médico' : 'Registrar atención de enfermería'}
          </h3>
        </div>

        {/* Campos visibles para médicos */}
        {userRole === 'medico' && (
          <>
            <div>
              <Label htmlFor="motivo-consulta" className="flex items-center mb-1">
                <FileText className="h-4 w-4 mr-1 text-health-700" />
                Motivo de consulta *
              </Label>
              <Textarea
                id="motivo-consulta"
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
                placeholder="Describa el motivo de la consulta..."
                className="min-h-[60px]"
              />
            </div>
            
            <div>
              <Label htmlFor="diagnostico" className="flex items-center mb-1">
                <User className="h-4 w-4 mr-1 text-health-700" />
                Diagnóstico *
              </Label>
              <Textarea
                id="diagnostico"
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                placeholder="Ingrese el diagnóstico del paciente..."
                className="min-h-[60px]"
              />
            </div>
            
            <div>
              <Label htmlFor="tratamiento" className="flex items-center mb-1">
                <CalendarCheck className="h-4 w-4 mr-1 text-health-700" />
                Tratamiento
              </Label>
              <Textarea
                id="tratamiento"
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
                placeholder="Describa el tratamiento recomendado..."
                className="min-h-[60px]"
              />
            </div>
            
            <div>
              <Label htmlFor="notas" className="mb-1">Notas adicionales</Label>
              <Textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Agregue cualquier nota o observación adicional..."
                className="min-h-[60px]"
              />
            </div>
            
            <div>
              <Label htmlFor="resultados-examen" className="mb-1">
                Observaciones de exámenes
              </Label>
              <Textarea
                id="resultados-examen"
                value={resultadoExamen}
                onChange={(e) => setResultadoExamen(e.target.value)}
                placeholder="Agregue observaciones sobre resultados de exámenes..."
                className="min-h-[60px]"
              />
            </div>
          </>
        )}
        
        {/* Campos visibles para enfermeras */}
        {userRole === 'enfermera' && (
          <>
            <div>
              <Label htmlFor="notas" className="mb-1">Notas de enfermería *</Label>
              <Textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Registre procedimientos realizados, administración de medicamentos, signos vitales, etc."
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nombre-examen" className="mb-1">Nombre del examen</Label>
              <Input
                id="nombre-examen"
                value={nombreExamen}
                onChange={(e) => setNombreExamen(e.target.value)}
                placeholder="Ej: Hemograma completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adjuntar-examen" className="mb-1">Adjuntar resultados de examen</Label>
              <Input
                id="adjuntar-examen"
                type="file"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Adjunte archivos de resultados de exámenes para revisión del médico
              </p>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onSuccess}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          disabled={loading}
          className="bg-health-600 hover:bg-health-700"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

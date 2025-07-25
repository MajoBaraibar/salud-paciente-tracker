
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { FilePen, Plus, X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface NuevaNotaEnfermeriaProps {
  pacienteId: string;
  onSuccess?: () => void;
}

export const NuevaNotaEnfermeria: React.FC<NuevaNotaEnfermeriaProps> = ({ 
  pacienteId, 
  onSuccess 
}) => {
  const { user } = useAuth();
  const [mostrar, setMostrar] = useState(false);
  const [tipo, setTipo] = useState<'evolucion' | 'conducta'>('evolucion');
  const [contenido, setContenido] = useState('');
  const [visibleParaFamiliar, setVisibleParaFamiliar] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contenido.trim()) {
      toast.error("Por favor escriba la nota de enfermería");
      return;
    }

    if (!user) {
      toast.error('Debe estar autenticado');
      return;
    }
    
    setEnviando(true);
    
    try {
      const { error } = await supabase
        .from('notas_enfermeria')
        .insert({
          paciente_id: pacienteId,
          enfermera_id: user.id,
          nota: `${tipo.toUpperCase()}: ${contenido.trim()}`,
          visible_para_familiar: visibleParaFamiliar
        });

      if (error) throw error;

      toast.success(`Nota de ${tipo === 'evolucion' ? 'evolución' : 'conducta'} agregada correctamente`);
      setContenido('');
      setVisibleParaFamiliar(false);
      setMostrar(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error al agregar nota:', error);
      toast.error('Error al agregar la nota: ' + error.message);
    } finally {
      setEnviando(false);
    }
  };

  // Solo mostrar el componente si el usuario es enfermera o admin
  if (user?.role !== 'enfermera' && user?.role !== 'admin') {
    return null;
  }

  if (!mostrar) {
    return (
      <div className="mb-4">
        <Button
          onClick={() => setMostrar(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Nueva nota de enfermería</span>
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500">
      <CardHeader className="flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-transparent pb-2">
        <CardTitle className="text-lg flex items-center">
          <FilePen className="h-5 w-5 mr-2 text-blue-600" />
          Nueva Nota de Enfermería
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setMostrar(false)}>
          <X size={18} />
          <span className="sr-only">Cerrar</span>
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de nota</Label>
            <RadioGroup 
              value={tipo} 
              onValueChange={(value) => setTipo(value as 'evolucion' | 'conducta')}
              className="flex flex-row space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="evolucion" id="evolucion" />
                <Label htmlFor="evolucion" className="cursor-pointer">Evolución</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="conducta" id="conducta" />
                <Label htmlFor="conducta" className="cursor-pointer">Conducta</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contenido">Contenido</Label>
            <Textarea 
              id="contenido"
              placeholder={tipo === 'evolucion' 
                ? "Describa la evolución del paciente..." 
                : "Describa la conducta del paciente..."}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="visibleFamiliar"
              checked={visibleParaFamiliar}
              onCheckedChange={(checked) => setVisibleParaFamiliar(checked === true)}
            />
            <Label htmlFor="visibleFamiliar" className="cursor-pointer text-sm">
              Permitir que el familiar vea esta nota
            </Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button" 
              variant="outline" 
              onClick={() => setMostrar(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={enviando || !contenido.trim()}
            >
              Guardar nota
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

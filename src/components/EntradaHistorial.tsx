
import { useState } from 'react';
import { EntradaHistorial as EntradaHistorialType } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Edit, Trash2, FileText, CalendarCheck, User, FilePlus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Props = {
  entrada: EntradaHistorialType;
  userRole?: string;
};

export const EntradaHistorial = ({ entrada, userRole = 'medico' }: Props) => {
  const { id, fecha, doctorNombre, motivoConsulta, diagnostico, tratamiento, notas } = entrada;

  const [isEditing, setIsEditing] = useState(false);
  const [entradaEditada, setEntradaEditada] = useState(entrada);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adjuntoDialogOpen, setAdjuntoDialogOpen] = useState(false);
  const [nombreAdjunto, setNombreAdjunto] = useState("");
  const [descripcionAdjunto, setDescripcionAdjunto] = useState("");
  const [archivoAdjunto, setArchivoAdjunto] = useState<File | null>(null);
  const [adjuntos, setAdjuntos] = useState<{nombre: string, descripcion: string}[]>([]);

  const handleGuardarEdicion = () => {
    toast.success('Entrada de historial actualizada correctamente');
    setIsEditing(false);
    // Aquí iría la lógica para guardar los cambios en la API
  };

  const handleEliminar = () => {
    toast.success('Entrada de historial eliminada correctamente');
    setDeleteDialogOpen(false);
    // Aquí iría la lógica para eliminar la entrada en la API
  };

  const handleAdjuntarArchivo = () => {
    if (!nombreAdjunto || !archivoAdjunto) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    setAdjuntos([...adjuntos, {
      nombre: nombreAdjunto,
      descripcion: descripcionAdjunto
    }]);

    setNombreAdjunto("");
    setDescripcionAdjunto("");
    setArchivoAdjunto(null);
    setAdjuntoDialogOpen(false);
    toast.success('Archivo adjuntado correctamente');
  };

  const formatearFecha = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      return format(fecha, "d 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      return fechaStr;
    }
  };

  return (
    <Card className="border-l-4 border-l-health-600">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5 text-health-700" />
          <div>
            <p className="text-sm font-medium">
              {formatearFecha(fecha)}
            </p>
            <p className="text-xs text-muted-foreground">Dr. {doctorNombre}</p>
          </div>
        </div>
        
        {/* Opciones según el rol */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {userRole === 'medico' && (
              <>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" /> Editar entrada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar entrada
                </DropdownMenuItem>
              </>
            )}
            {userRole === 'enfermera' && (
              <DropdownMenuItem onClick={() => setAdjuntoDialogOpen(true)}>
                <FilePlus className="h-4 w-4 mr-2" /> Adjuntar examen
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-1 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-health-700" />
                Motivo de consulta
              </h3>
              <p className="text-sm">{motivoConsulta}</p>
            </div>
            
            {diagnostico && (
              <div>
                <h3 className="font-medium text-sm mb-1 flex items-center">
                  <User className="h-4 w-4 mr-2 text-health-700" />
                  Diagnóstico
                </h3>
                <p className="text-sm">{diagnostico}</p>
              </div>
            )}
            
            {tratamiento && (
              <div>
                <h3 className="font-medium text-sm mb-1 flex items-center">
                  <CalendarCheck className="h-4 w-4 mr-2 text-health-700" />
                  Tratamiento
                </h3>
                <p className="text-sm">{tratamiento}</p>
              </div>
            )}
            
            {notas && (
              <div>
                <h3 className="font-medium text-sm mb-1">Notas adicionales</h3>
                <p className="text-sm">{notas}</p>
              </div>
            )}

            {/* Sección para adjuntos */}
            {adjuntos.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium text-sm mb-2">Exámenes adjuntos</h3>
                <div className="space-y-2">
                  {adjuntos.map((adjunto, index) => (
                    <div key={index} className="text-sm p-2 bg-secondary/20 rounded flex justify-between items-center">
                      <div>
                        <p className="font-medium">{adjunto.nombre}</p>
                        {adjunto.descripcion && <p className="text-xs text-muted-foreground">{adjunto.descripcion}</p>}
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor={`motivo-${id}`} className="mb-1">Motivo de consulta</Label>
              <Textarea 
                id={`motivo-${id}`}
                value={entradaEditada.motivoConsulta}
                onChange={(e) => setEntradaEditada({...entradaEditada, motivoConsulta: e.target.value})}
                className="min-h-[60px]"
              />
            </div>
            
            <div>
              <Label htmlFor={`diagnostico-${id}`} className="mb-1">Diagnóstico</Label>
              <Textarea 
                id={`diagnostico-${id}`}
                value={entradaEditada.diagnostico}
                onChange={(e) => setEntradaEditada({...entradaEditada, diagnostico: e.target.value})}
                className="min-h-[60px]"
              />
            </div>
            
            <div>
              <Label htmlFor={`tratamiento-${id}`} className="mb-1">Tratamiento</Label>
              <Textarea 
                id={`tratamiento-${id}`}
                value={entradaEditada.tratamiento}
                onChange={(e) => setEntradaEditada({...entradaEditada, tratamiento: e.target.value})}
                className="min-h-[60px]"
              />
            </div>
            
            <div>
              <Label htmlFor={`notas-${id}`} className="mb-1">Notas adicionales</Label>
              <Textarea 
                id={`notas-${id}`}
                value={entradaEditada.notas}
                onChange={(e) => setEntradaEditada({...entradaEditada, notas: e.target.value})}
                className="min-h-[60px]"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardarEdicion}>
                Guardar cambios
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Dialog para confirmar eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar esta entrada del historial médico?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminar}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para adjuntar archivos (solo enfermeras) */}
      <Dialog open={adjuntoDialogOpen} onOpenChange={setAdjuntoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adjuntar resultado de examen</DialogTitle>
            <DialogDescription>
              Suba un archivo con los resultados del examen para que el médico pueda revisarlos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre-adjunto">Nombre del examen</Label>
              <Input
                id="nombre-adjunto"
                placeholder="Ej: Hemograma completo"
                value={nombreAdjunto}
                onChange={(e) => setNombreAdjunto(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descripcion-adjunto">Descripción (opcional)</Label>
              <Textarea
                id="descripcion-adjunto"
                placeholder="Agregue detalles adicionales sobre el examen"
                value={descripcionAdjunto}
                onChange={(e) => setDescripcionAdjunto(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="archivo">Archivo</Label>
              <Input
                id="archivo"
                type="file"
                onChange={(e) => e.target.files && setArchivoAdjunto(e.target.files[0])}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjuntoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdjuntarArchivo}>
              Adjuntar archivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

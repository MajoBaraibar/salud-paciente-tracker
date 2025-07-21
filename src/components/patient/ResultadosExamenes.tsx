import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Plus, 
  Upload, 
  FileText, 
  Calendar as CalendarIcon, 
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface ResultadoExamen {
  id: string;
  nombre_examen: string;
  descripcion: string | null;
  archivo_url: string | null;
  archivo_nombre: string | null;
  fecha_examen: string;
  fecha_subida: string;
  tipo_examen: string;
  estado: string;
  observaciones: string | null;
  medico_id: string;
}

interface ResultadosExamenesProps {
  pacienteId: string;
}

export const ResultadosExamenes = ({ pacienteId }: ResultadosExamenesProps) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resultados, setResultados] = useState<ResultadoExamen[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Formulario nuevo examen
  const [nombreExamen, setNombreExamen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoExamen, setTipoExamen] = useState("laboratorio");
  const [estado, setEstado] = useState("normal");
  const [observaciones, setObservaciones] = useState("");
  const [fechaExamen, setFechaExamen] = useState<Date>();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const esDoctor = user?.role === "medico" || user?.role === "admin";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
    }
  };

  const uploadFile = async (file: File, fileName: string) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${pacienteId}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('examenes')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    return filePath;
  };

  const handleSubmit = async () => {
    if (!nombreExamen || !fechaExamen) {
      toast.error("Por favor complete los campos obligatorios");
      return;
    }

    if (!user?.id) {
      toast.error("Error de autenticación");
      return;
    }

    setUploading(true);

    try {
      let archivoUrl = null;
      let archivoNombre = null;

      if (archivo) {
        archivoUrl = await uploadFile(archivo, nombreExamen);
        archivoNombre = archivo.name;
      }

      const { error } = await supabase
        .from('resultados_examenes')
        .insert({
          paciente_id: pacienteId,
          medico_id: user.id,
          nombre_examen: nombreExamen,
          descripcion: descripcion || null,
          archivo_url: archivoUrl,
          archivo_nombre: archivoNombre,
          fecha_examen: format(fechaExamen, 'yyyy-MM-dd'),
          tipo_examen: tipoExamen,
          estado: estado,
          observaciones: observaciones || null,
          centro_id: user.centro_id || null
        });

      if (error) {
        throw error;
      }

      toast.success("Resultado de examen guardado correctamente");
      
      // Reset form
      setNombreExamen("");
      setDescripcion("");
      setTipoExamen("laboratorio");
      setEstado("normal");
      setObservaciones("");
      setFechaExamen(undefined);
      setArchivo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setDialogOpen(false);

      // Refresh results
      fetchResultados();

    } catch (error) {
      console.error("Error al guardar resultado:", error);
      toast.error("Error al guardar el resultado del examen");
    } finally {
      setUploading(false);
    }
  };

  const fetchResultados = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resultados_examenes')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha_examen', { ascending: false });

      if (error) {
        throw error;
      }

      setResultados(data || []);
    } catch (error) {
      console.error("Error al cargar resultados:", error);
      toast.error("Error al cargar los resultados de exámenes");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (archivoUrl: string, archivoNombre: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('examenes')
        .download(archivoUrl);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = archivoNombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar archivo:", error);
      toast.error("Error al descargar el archivo");
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'normal':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Normal</Badge>;
      case 'anormal':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200"><AlertTriangle className="h-3 w-3 mr-1" />Anormal</Badge>;
      case 'critico':
        return <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Crítico</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getTipoExamenBadge = (tipo: string) => {
    switch (tipo) {
      case 'laboratorio':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Laboratorio</Badge>;
      case 'imagen':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Imagen</Badge>;
      case 'especializado':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Especializado</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  // Load results on component mount
  useEffect(() => {
    fetchResultados();
  }, [pacienteId]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-health-600" />
          Resultados de Exámenes
        </CardTitle>
        {esDoctor && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-health-600 hover:bg-health-700">
                <Plus className="h-4 w-4 mr-1" />
                Subir resultado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Subir Resultado de Examen</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del examen *</Label>
                    <Input
                      id="nombre"
                      value={nombreExamen}
                      onChange={(e) => setNombreExamen(e.target.value)}
                      placeholder="Ej: Hemograma completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha">Fecha del examen *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fechaExamen ? format(fechaExamen, "PPP", { locale: es }) : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fechaExamen}
                          onSelect={setFechaExamen}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo de examen</Label>
                    <Select value={tipoExamen} onValueChange={setTipoExamen}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laboratorio">Laboratorio</SelectItem>
                        <SelectItem value="imagen">Imagen</SelectItem>
                        <SelectItem value="especializado">Especializado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={estado} onValueChange={setEstado}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="anormal">Anormal</SelectItem>
                        <SelectItem value="critico">Crítico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción del examen..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="observaciones">Observaciones médicas</Label>
                  <Textarea
                    id="observaciones"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Observaciones del médico..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="archivo">Archivo del resultado</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {archivo && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Archivo seleccionado: {archivo.name}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit} disabled={uploading}>
                    {uploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Guardar resultado
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cargando resultados...</p>
          </div>
        ) : resultados.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay resultados de exámenes registrados</p>
            {esDoctor && (
              <p className="text-sm text-muted-foreground mt-2">
                Use el botón "Subir resultado" para agregar el primer examen
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {resultados.map((resultado) => (
              <Card key={resultado.id} className="border-l-4 border-l-health-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-lg">{resultado.nombre_examen}</h4>
                      <p className="text-sm text-muted-foreground">
                        Fecha: {format(new Date(resultado.fecha_examen), "PPP", { locale: es })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {getTipoExamenBadge(resultado.tipo_examen)}
                      {getEstadoBadge(resultado.estado)}
                    </div>
                  </div>

                  {resultado.descripcion && (
                    <p className="text-sm mb-2">{resultado.descripcion}</p>
                  )}

                  {resultado.observaciones && (
                    <div className="bg-muted p-3 rounded-md mb-3">
                      <p className="text-sm">
                        <strong>Observaciones médicas:</strong> {resultado.observaciones}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Subido el {format(new Date(resultado.fecha_subida), "PPP", { locale: es })}
                    </p>
                    {resultado.archivo_url && resultado.archivo_nombre && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(resultado.archivo_url!, resultado.archivo_nombre!)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
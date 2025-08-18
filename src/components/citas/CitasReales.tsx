import { useState, useEffect } from "react";
import { Calendar, Users, BookOpen, Settings, UserCheck, FileText, Stethoscope, 
         Clock, User, Phone, Edit, Trash2, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CitasRealesProps {
  filtros: {
    estado: string;
    busqueda: string;
  };
}

export function CitasReales({ filtros }: CitasRealesProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener el icono según el tipo de cita
  const getIconForTipoCita = (tipoCita: string) => {
    const iconMap: Record<string, any> = {
      consulta: User,
      control: Calendar,
      procedimiento: Settings,
      emergencia: Stethoscope,
      interconsulta: Users,
      junta_medica: Users,
      seguimiento: UserCheck,
      reunion_staff: Users,
      capacitacion: BookOpen,
      supervision: UserCheck,
      procedimiento_enfermeria: Settings,
      reunion_familia: Users,
      auditoria: FileText,
      capacitacion_staff: BookOpen,
      evaluacion: UserCheck,
    };
    return iconMap[tipoCita] || Calendar;
  };

  // Función para obtener color según el tipo de cita
  const getColorForTipoCita = (tipoCita: string) => {
    const colorMap: Record<string, string> = {
      consulta: "bg-blue-50 text-blue-700 border-blue-200",
      control: "bg-green-50 text-green-700 border-green-200",
      procedimiento: "bg-purple-50 text-purple-700 border-purple-200",
      emergencia: "bg-red-50 text-red-700 border-red-200",
      interconsulta: "bg-cyan-50 text-cyan-700 border-cyan-200",
      junta_medica: "bg-indigo-50 text-indigo-700 border-indigo-200",
      seguimiento: "bg-teal-50 text-teal-700 border-teal-200",
      reunion_staff: "bg-amber-50 text-amber-700 border-amber-200",
      capacitacion: "bg-orange-50 text-orange-700 border-orange-200",
      supervision: "bg-lime-50 text-lime-700 border-lime-200",
      procedimiento_enfermeria: "bg-pink-50 text-pink-700 border-pink-200",
      reunion_familia: "bg-violet-50 text-violet-700 border-violet-200",
      auditoria: "bg-gray-50 text-gray-700 border-gray-200",
      capacitacion_staff: "bg-yellow-50 text-yellow-700 border-yellow-200",
      evaluacion: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return colorMap[tipoCita] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  // Función para obtener texto legible del tipo de cita
  const getTextForTipoCita = (tipoCita: string) => {
    const textMap: Record<string, string> = {
      consulta: "Consulta",
      control: "Control",
      procedimiento: "Procedimiento",
      emergencia: "Emergencia",
      interconsulta: "Interconsulta",
      junta_medica: "Junta Médica",
      seguimiento: "Seguimiento",
      reunion_staff: "Reunión Staff",
      capacitacion: "Capacitación",
      supervision: "Supervisión",
      procedimiento_enfermeria: "Proc. Enfermería",
      reunion_familia: "Reunión Familia",
      auditoria: "Auditoría",
      capacitacion_staff: "Capacitación Staff",
      evaluacion: "Evaluación",
    };
    return textMap[tipoCita] || tipoCita;
  };

  const obtenerColorEstado = (estado: string) => {
    const colores = {
      programada: "bg-blue-100 text-blue-800 border-blue-200",
      confirmada: "bg-green-100 text-green-800 border-green-200",
      en_curso: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completada: "bg-gray-100 text-gray-800 border-gray-200",
      cancelada: "bg-red-100 text-red-800 border-red-200",
    };
    return colores[estado as keyof typeof colores] || colores.programada;
  };

  const obtenerTextoEstado = (estado: string) => {
    const textos = {
      programada: "Programada",
      confirmada: "Confirmada",
      en_curso: "En Curso",
      completada: "Completada",
      cancelada: "Cancelada",
    };
    return textos[estado as keyof typeof textos] || estado;
  };

  // Cargar citas desde Supabase
  const cargarCitas = async () => {
    if (!supabase || !user) return;
    
    try {
      setLoading(true);
      
      let query = supabase
        .from('citas_medicas')
        .select(`
          *,
          pacientes!inner(id, nombre, apellido, numero_identificacion),
          profiles!citas_medicas_medico_id_fkey(id, nombre, apellido, especialidad)
        `);

      // Filtrar según el rol del usuario
      if (user.role === 'medico' || user.role === 'enfermera') {
        // Médicos y enfermeras ven sus propias citas
        query = query.eq('medico_id', user.id);
      } else if (user.role === 'familiar') {
        // Familiares ven citas de su paciente asignado
        if (user.pacienteId) {
          query = query.eq('paciente_id', user.pacienteId);
        }
      }
      // Los admins ven todas las citas

      const { data, error } = await query.order('fecha_hora', { ascending: true });
      
      if (error) {
        console.error('Error al cargar citas:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las citas",
          variant: "destructive",
        });
        return;
      }

      setCitas(data || []);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, [user]);

  // Filtrar citas
  const citasFiltradas = citas.filter(cita => {
    const cumpleFiltroEstado = filtros.estado === "todas" || cita.estado === filtros.estado;
    const cumpleBusqueda = !filtros.busqueda || 
      `${cita.pacientes?.nombre} ${cita.pacientes?.apellido}`.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      `${cita.profiles?.nombre} ${cita.profiles?.apellido}`.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      cita.pacientes?.numero_identificacion?.includes(filtros.busqueda);
    
    return cumpleFiltroEstado && cumpleBusqueda;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Citas Médicas {user?.role === 'medico' && '- Mis Citas'} {user?.role === 'enfermera' && '- Mis Reuniones'}
          <Badge variant="secondary">{citasFiltradas.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {citasFiltradas.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {citasFiltradas.map((cita) => (
                  <TableRow key={cita.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">
                        {format(new Date(cita.fecha_hora), "dd/MM/yyyy")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(cita.fecha_hora), "HH:mm")} ({cita.duracion_minutos}min)
                      </div>
                    </TableCell>
                    <TableCell>
                      {cita.pacientes ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {cita.pacientes.nombre} {cita.pacientes.apellido}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {cita.pacientes.numero_identificacion}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Sin paciente específico</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {cita.profiles?.nombre} {cita.profiles?.apellido}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {cita.profiles?.especialidad || 'Profesional'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getColorForTipoCita(cita.tipo_cita)}>
                        <div className="flex items-center gap-1">
                          {(() => {
                            const IconComponent = getIconForTipoCita(cita.tipo_cita);
                            return <IconComponent className="w-3 h-3" />;
                          })()}
                          {getTextForTipoCita(cita.tipo_cita)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={obtenerColorEstado(cita.estado)}>
                        {obtenerTextoEstado(cita.estado)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        {cita.motivo_consulta}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          {cita.pacientes && (
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Contactar paciente
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron citas que coincidan con los filtros aplicados</p>
            <p className="text-sm mt-2">
              {user?.role === 'medico' && 'Aquí aparecerán tus consultas, interconsultas y juntas médicas'}
              {user?.role === 'enfermera' && 'Aquí aparecerán tus reuniones de staff, capacitaciones y supervisiones'}
              {user?.role === 'admin' && 'Aquí aparecerán las reuniones familiares, auditorías y evaluaciones'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
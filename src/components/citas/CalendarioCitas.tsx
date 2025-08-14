import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarioCitasProps {
  filtros: {
    estado: string;
    busqueda: string;
  };
}

interface Cita {
  id: string;
  paciente: { nombre: string; apellido: string };
  medico: { nombre: string; especialidad: string };
  fechaHora: string;
  duracionMinutos: number;
  estado: "programada" | "confirmada" | "en_curso" | "completada" | "cancelada";
  tipoCita: string;
  motivoConsulta: string;
}

export function CalendarioCitas({ filtros }: CalendarioCitasProps) {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [vistaCalendario, setVistaCalendario] = useState<"semana" | "dia">("semana");

  // Datos simulados de citas
  const citasSimuladas: Cita[] = [
    {
      id: "1",
      paciente: { nombre: "Juan", apellido: "Pérez" },
      medico: { nombre: "Dr. Roberto Silva", especialidad: "Medicina General" },
      fechaHora: new Date().toISOString(),
      duracionMinutos: 30,
      estado: "confirmada",
      tipoCita: "consulta",
      motivoConsulta: "Control rutinario"
    },
    {
      id: "2",
      paciente: { nombre: "María", apellido: "García" },
      medico: { nombre: "Dra. Ana Martínez", especialidad: "Cardiología" },
      fechaHora: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      duracionMinutos: 45,
      estado: "programada",
      tipoCita: "consulta",
      motivoConsulta: "Dolor en el pecho"
    },
    {
      id: "3",
      paciente: { nombre: "Carlos", apellido: "López" },
      medico: { nombre: "Dr. Luis Rodríguez", especialidad: "Pediatría" },
      fechaHora: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duracionMinutos: 30,
      estado: "programada",
      tipoCita: "control",
      motivoConsulta: "Vacunación"
    }
  ];

  const obtenerColorEstado = (estado: string) => {
    const colores = {
      programada: "bg-blue-100 text-blue-800 border-blue-200",
      confirmada: "bg-green-100 text-green-800 border-green-200",
      en_curso: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completada: "bg-gray-100 text-gray-800 border-gray-200",
      cancelada: "bg-red-100 text-red-800 border-red-200"
    };
    return colores[estado as keyof typeof colores] || colores.programada;
  };

  const obtenerTextoEstado = (estado: string) => {
    const textos = {
      programada: "Programada",
      confirmada: "Confirmada",
      en_curso: "En Curso",
      completada: "Completada",
      cancelada: "Cancelada"
    };
    return textos[estado as keyof typeof textos] || estado;
  };

  const filtrarCitas = (citas: Cita[]) => {
    return citas.filter(cita => {
      const cumpleFiltroEstado = filtros.estado === "todas" || cita.estado === filtros.estado;
      const cumpleBusqueda = !filtros.busqueda || 
        `${cita.paciente.nombre} ${cita.paciente.apellido}`.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        cita.medico.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());
      
      return cumpleFiltroEstado && cumpleBusqueda;
    });
  };

  const citasFiltradas = filtrarCitas(citasSimuladas);

  const navegarSemana = (direccion: "anterior" | "siguiente") => {
    const dias = direccion === "siguiente" ? 7 : -7;
    setFechaActual(prev => addDays(prev, dias));
  };

  const navegarDia = (direccion: "anterior" | "siguiente") => {
    const dias = direccion === "siguiente" ? 1 : -1;
    setFechaActual(prev => addDays(prev, dias));
  };

  if (vistaCalendario === "dia") {
    // Vista por día
    const citasDelDia = citasFiltradas.filter(cita => 
      isSameDay(new Date(cita.fechaHora), fechaActual)
    );

    return (
      <div className="space-y-4">
        {/* Controles de navegación */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navegarDia("anterior")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {format(fechaActual, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </h3>
            <Button variant="outline" size="sm" onClick={() => navegarDia("siguiente")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setVistaCalendario("semana")}>
            Vista Semana
          </Button>
        </div>

        {/* Citas del día */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Citas del {format(fechaActual, "d 'de' MMMM", { locale: es })}
              <Badge variant="secondary">{citasDelDia.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {citasDelDia.length > 0 ? (
              <div className="space-y-3">
                {citasDelDia.map((cita) => (
                  <div key={cita.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">
                        {format(new Date(cita.fechaHora), "HH:mm")}
                      </div>
                      <div className="h-4 w-px bg-border" />
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{cita.paciente.nombre} {cita.paciente.apellido}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Stethoscope className="w-3 h-3" />
                          <span>{cita.medico.nombre}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={obtenerColorEstado(cita.estado)}>
                        {obtenerTextoEstado(cita.estado)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {cita.duracionMinutos}min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay citas programadas para este día
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista por semana
  const inicioSemana = startOfWeek(fechaActual, { weekStartsOn: 1 });
  const finSemana = endOfWeek(fechaActual, { weekStartsOn: 1 });
  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  return (
    <div className="space-y-4">
      {/* Controles de navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navegarSemana("anterior")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(inicioSemana, "d MMM", { locale: es })} - {format(finSemana, "d MMM yyyy", { locale: es })}
          </h3>
          <Button variant="outline" size="sm" onClick={() => navegarSemana("siguiente")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={() => setVistaCalendario("dia")}>
          Vista Día
        </Button>
      </div>

      {/* Calendario semanal */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {diasSemana.map((dia) => {
          const citasDelDia = citasFiltradas.filter(cita => 
            isSameDay(new Date(cita.fechaHora), dia)
          );

          return (
            <Card 
              key={dia.toISOString()} 
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                isToday(dia) ? "ring-2 ring-health-500" : ""
              }`}
              onClick={() => {
                setFechaActual(dia);
                setVistaCalendario("dia");
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground uppercase">
                      {format(dia, "EEE", { locale: es })}
                    </span>
                    <span className={`text-lg ${isToday(dia) ? "text-health-600 font-bold" : ""}`}>
                      {format(dia, "d")}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {citasDelDia.slice(0, 3).map((cita) => (
                    <div 
                      key={cita.id} 
                      className={`text-xs p-1 rounded border ${obtenerColorEstado(cita.estado)}`}
                    >
                      <div className="font-medium truncate">
                        {format(new Date(cita.fechaHora), "HH:mm")} - {cita.paciente.nombre}
                      </div>
                    </div>
                  ))}
                  {citasDelDia.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{citasDelDia.length - 3} más
                    </div>
                  )}
                  {citasDelDia.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      Sin citas
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
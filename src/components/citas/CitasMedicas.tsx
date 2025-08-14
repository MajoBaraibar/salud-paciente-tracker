import { useState } from "react";
import { Calendar, CalendarPlus, Clock, User, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NuevaCitaForm } from "./NuevaCitaForm";
import { CalendarioCitas } from "./CalendarioCitas";
import { ListaCitas } from "./ListaCitas";

export function CitasMedicas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  // Estadísticas simuladas
  const estadisticas = {
    citasHoy: 12,
    citasPendientes: 25,
    citasCompletadas: 156,
    pacientesAtendidos: 89
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-600">{estadisticas.citasHoy}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estadisticas.citasPendientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <Badge variant="outline" className="border-green-200 text-green-700">
              <span className="text-lg font-bold">{estadisticas.citasCompletadas}</span>
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Este mes</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estadisticas.pacientesAtendidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Input
            placeholder="Buscar por paciente o médico..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full sm:w-64"
          />
          
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las citas</SelectItem>
              <SelectItem value="programada">Programadas</SelectItem>
              <SelectItem value="confirmada">Confirmadas</SelectItem>
              <SelectItem value="en_curso">En curso</SelectItem>
              <SelectItem value="completada">Completadas</SelectItem>
              <SelectItem value="cancelada">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={() => setMostrarFormulario(true)}
          className="w-full sm:w-auto"
        >
          <CalendarPlus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Contenido principal */}
      <Tabs defaultValue="calendario" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendario">Vista Calendario</TabsTrigger>
          <TabsTrigger value="lista">Lista de Citas</TabsTrigger>
          <TabsTrigger value="horarios">Horarios Médicos</TabsTrigger>
        </TabsList>

        <TabsContent value="calendario" className="space-y-4">
          <CalendarioCitas filtros={{ estado: filtroEstado, busqueda }} />
        </TabsContent>

        <TabsContent value="lista" className="space-y-4">
          <ListaCitas filtros={{ estado: filtroEstado, busqueda }} />
        </TabsContent>

        <TabsContent value="horarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Horarios Médicos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configuración de horarios de atención para cada médico
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para nueva cita */}
      {mostrarFormulario && (
        <NuevaCitaForm 
          onClose={() => setMostrarFormulario(false)}
          onSuccess={() => {
            setMostrarFormulario(false);
            // Aquí iría la lógica para refrescar la lista
          }}
        />
      )}
    </div>
  );
}
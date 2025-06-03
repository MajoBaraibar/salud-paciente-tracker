import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertaClinica } from "@/components/AlertaClinica";
import { pacientesMock } from "../data/mockData";
import { calcularEdad } from "@/lib/utils";
import { 
  Calendar, Users, FileText, AlertTriangle, 
  Activity, BarChart, User, Bell, CreditCard,
  ExternalLink, Info, Clock
} from "lucide-react";

// Import the notification context
import { useNotificationStore } from "@/stores/notificationStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string, patientId?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Access notification store
  const { totalUnread } = useNotificationStore();
  
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userString = localStorage.getItem("user");
    
    if (!userString) {
      navigate("/login");
      return;
    }
    
    const user = JSON.parse(userString);
    setCurrentUser(user);
    setLoading(false);
  }, [navigate]);
  
  // Alertas clínicas mock
  const alertasClinicas = [
    {
      id: "1",
      pacienteId: pacientesMock[0].id,
      pacienteNombre: `${pacientesMock[0].nombre} ${pacientesMock[0].apellido}`,
      tipo: "alergia" as const,
      descripcion: "Alergia severa a penicilina",
      prioridad: "alta" as const,
      condicion: "Insuficiencia renal"
    },
    {
      id: "2",
      pacienteId: pacientesMock[1].id,
      pacienteNombre: `${pacientesMock[1].nombre} ${pacientesMock[1].apellido}`,
      tipo: "estudio" as const,
      descripcion: "Resultados críticos en hemograma",
      prioridad: "alta" as const,
      condicion: "Diabetes no controlada"
    },
    {
      id: "3",
      pacienteId: pacientesMock[2].id,
      pacienteNombre: `${pacientesMock[2].nombre} ${pacientesMock[2].apellido}`,
      tipo: "medicacion" as const,
      descripcion: "Medicamento pendiente de administrar",
      prioridad: "media" as const,
      condicion: "Hipertensión arterial"
    },
  ];
  
  // Datos de ejemplo para familiar
  const familiarPatientInfo = {
    nombre: "Juan López",
    edad: 78,
    habitacion: "205",
    ultimaEvolucion: "2025-05-10T15:30:00",
    ultimaRevision: "2025-05-11T09:15:00",
    estadoPago: "al día",
    proximoPago: "2025-06-01",
    monto: 1500.00,
    signos: {
      presion: "120/80",
      temperatura: "36.5",
      pulso: "72",
      oxigeno: "98%",
      ultimaActualizacion: "2025-05-12T08:30:00"
    },
    medicamentos: [
      { nombre: "Losartan", dosis: "50mg", frecuencia: "Cada 12 horas" },
      { nombre: "Aspirina", dosis: "100mg", frecuencia: "Una vez al día" },
      { nombre: "Metformina", dosis: "500mg", frecuencia: "Con el desayuno" }
    ],
    notasEnfermeria: [
      { fecha: "2025-05-12T08:30:00", nota: "Paciente estable, se tomaron signos vitales" },
      { fecha: "2025-05-11T20:45:00", nota: "Se administró medicación nocturna" },
      { fecha: "2025-05-11T14:20:00", nota: "Paciente realizó fisioterapia sin problemas" }
    ]
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-health-600"></div>
          <p className="text-health-700">Cargando información...</p>
        </div>
      </div>
    );
  }
  
  // The issue is likely in the user role comparison code, which should look like this:
  const currentUserRole = currentUser?.role || "";

  // Replace the problematic comparisons with string comparisons
  const isMedico = currentUserRole === "medico";
  const isEnfermera = currentUserRole === "enfermera";
  const isAdmin = currentUserRole === "admin";
  const isFamiliar = currentUserRole === "familiar";
  
  // Dashboard para familiares
  if (isFamiliar) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Encabezado */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-health-700">Panel Familiar</h1>
                  <p className="text-muted-foreground">
                    Bienvenido, información de su paciente en tiempo real
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-amber-200 text-amber-700">FM</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium">{currentUser?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        Familiar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Resumen del paciente */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle>Estado del Paciente</CardTitle>
                    <CardDescription>
                      Información actual de {familiarPatientInfo.nombre}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Información básica */}
                      <div className="flex-1">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-muted rounded-lg p-3">
                              <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                              <p className="font-medium">{familiarPatientInfo.nombre}</p>
                            </div>
                            <div className="bg-muted rounded-lg p-3">
                              <p className="text-sm text-muted-foreground mb-1">Edad</p>
                              <p className="font-medium">{familiarPatientInfo.edad} años</p>
                            </div>
                            <div className="bg-muted rounded-lg p-3">
                              <p className="text-sm text-muted-foreground mb-1">Habitación</p>
                              <p className="font-medium">{familiarPatientInfo.habitacion}</p>
                            </div>
                            <div className="bg-muted rounded-lg p-3">
                              <p className="text-sm text-muted-foreground mb-1">Última evolución</p>
                              <p className="font-medium">{new Date(familiarPatientInfo.ultimaEvolucion).toLocaleDateString('es-ES')}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium mb-2">Signos vitales</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <div className="bg-blue-50 rounded-lg p-3">
                                <p className="text-xs text-blue-500 mb-1">Presión</p>
                                <p className="font-medium text-blue-700">{familiarPatientInfo.signos.presion}</p>
                              </div>
                              <div className="bg-green-50 rounded-lg p-3">
                                <p className="text-xs text-green-500 mb-1">Temperatura</p>
                                <p className="font-medium text-green-700">{familiarPatientInfo.signos.temperatura}°C</p>
                              </div>
                              <div className="bg-amber-50 rounded-lg p-3">
                                <p className="text-xs text-amber-500 mb-1">Pulso</p>
                                <p className="font-medium text-amber-700">{familiarPatientInfo.signos.pulso} bpm</p>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-xs text-purple-500 mb-1">Oxígeno</p>
                                <p className="font-medium text-purple-700">{familiarPatientInfo.signos.oxigeno}</p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Última actualización: {new Date(familiarPatientInfo.signos.ultimaActualizacion).toLocaleTimeString()} hrs
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Medicamentos */}
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold mb-3">Medicamentos actuales</h3>
                        <div className="space-y-2">
                          {familiarPatientInfo.medicamentos.map((med, i) => (
                            <div key={i} className="p-3 border rounded-lg">
                              <div className="flex justify-between">
                                <p className="font-medium">{med.nombre}</p>
                                <Badge variant="outline">{med.dosis}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{med.frecuencia}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button asChild className="w-full">
                        <Link to={`/pacientes/1`}>Ver perfil completo</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Aviso Informativo */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2 text-blue-500" />
                      Información
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Acceso limitado</AlertTitle>
                        <AlertDescription>
                          Como familiar, solo tiene acceso a la información básica del paciente y la posibilidad de ver su historial clínico. Para consultas sobre pagos o trámites administrativos, por favor contacte a recepción.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-medium flex items-center text-blue-700 mb-2">
                          <Clock className="h-4 w-4 mr-2" />
                          Horario de visitas
                        </h3>
                        <p className="text-sm text-blue-600">Lunes a viernes: 10:00 - 12:00 y 16:00 - 19:00</p>
                        <p className="text-sm text-blue-600">Fines de semana: 11:00 - 20:00</p>
                      </div>
                      
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/anuncios">
                          <Bell className="h-4 w-4 mr-2" />
                          Ver anuncios importantes
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Notas de enfermería */}
              <Card>
                <CardHeader>
                  <CardTitle>Notas de enfermería recientes</CardTitle>
                  <CardDescription>
                    Actualizaciones sobre la atención de {familiarPatientInfo.nombre}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {familiarPatientInfo.notasEnfermeria.map((nota, i) => (
                      <div key={i} className="p-4 border rounded-md">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {new Date(nota.fecha).toLocaleDateString('es-ES')} - {new Date(nota.fecha).toLocaleTimeString()} hrs
                        </p>
                        <p>{nota.nota}</p>
                      </div>
                    ))}
                    
                    <div className="text-center pt-2">
                      <Button asChild variant="outline">
                        <Link to={`/pacientes/1`}>Ver historial completo</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  // Dashboard para administradores
  if (isAdmin) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Encabezado */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-health-700">Panel Administrativo</h1>
                  <p className="text-muted-foreground">
                    Bienvenido {currentUser?.role}, aquí está el resumen del día
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-health-200 text-health-700">
                        {isMedico ? "MD" : 
                         isEnfermera ? "EF" : "AD"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium">{currentUser?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {currentUser?.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Resumen estadístico */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pacientes activos</p>
                        <p className="text-3xl font-bold">{pacientesMock.length}</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className="cursor-pointer transition-all hover:shadow-md" 
                  onClick={() => navigate("/admin")}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pagos pendientes</p>
                        <p className="text-3xl font-bold">8</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-full">
                        <CreditCard className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className="cursor-pointer transition-all hover:shadow-md"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Requisiciones</p>
                        <p className="text-3xl font-bold">5</p>
                      </div>
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => navigate("/anuncios")}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Anuncios nuevos</p>
                        <p className="text-3xl font-bold">{totalUnread}</p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Pestañas principales */}
              <Tabs defaultValue="actividad">
                <TabsList className="mb-6 bg-white border">
                  <TabsTrigger value="actividad" className="data-[state=active]:bg-health-50">
                    <Activity className="h-4 w-4 mr-2" />
                    Actividad reciente
                  </TabsTrigger>
                </TabsList>
                
                {/* Contenido de actividad reciente */}
                <TabsContent value="actividad" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Actividad reciente</CardTitle>
                      <CardDescription>
                        Últimas acciones realizadas en el sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Acción</TableHead>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Fecha/Hora</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-xs bg-health-100 text-health-700">MD</AvatarFallback>
                                </Avatar>
                                <span>Dr. Martínez</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                Actualización historial
                              </Badge>
                            </TableCell>
                            <TableCell>María González</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              Hace 25 minutos
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-xs bg-health-100 text-health-700">EF</AvatarFallback>
                                </Avatar>
                                <span>Enf. Rodríguez</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                Aplicación medicación
                              </Badge>
                            </TableCell>
                            <TableCell>Carlos Sánchez</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              Hace 40 minutos
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className="text-xs bg-health-100 text-health-700">AD</AvatarFallback>
                                </Avatar>
                                <span>Admin López</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                                Nuevo paciente
                              </Badge>
                            </TableCell>
                            <TableCell>Laura Pérez</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              Hace 1 hora
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  // Dashboard para médicos y enfermeras (modificado para eliminar duplicación)
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-health-700">Panel Principal</h1>
                <p className="text-muted-foreground">
                  Bienvenido {currentUser?.role}, aquí está el resumen del día
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-health-200 text-health-700">
                      {isMedico ? "MD" : 
                       isEnfermera ? "EF" : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium">{currentUser?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {currentUser?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resumen estadístico */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pacientes activos</p>
                      <p className="text-3xl font-bold">{pacientesMock.length}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer transition-all hover:shadow-md" 
                onClick={() => navigate("/calendario")}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Consultas hoy</p>
                      <p className="text-3xl font-bold">12</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => document.getElementById('pacientes-criticos-tab')?.click()}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pacientes críticos</p>
                      <p className="text-3xl font-bold">{alertasClinicas.length}</p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => navigate("/anuncios")}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Anuncios nuevos</p>
                      <p className="text-3xl font-bold">{totalUnread}</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pestañas principales - modificadas para eliminar duplicación */}
            <Tabs defaultValue="pacientes-criticos">
              <TabsList className="mb-6 bg-white border">
                <TabsTrigger id="pacientes-criticos-tab" value="pacientes-criticos" className="data-[state=active]:bg-health-50">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Pacientes críticos
                </TabsTrigger>
                <TabsTrigger value="actividad" className="data-[state=active]:bg-health-50">
                  <Activity className="h-4 w-4 mr-2" />
                  Actividad reciente
                </TabsTrigger>
              </TabsList>
              
              {/* Contenido de pacientes críticos - mejorado con navegación directa */}
              <TabsContent value="pacientes-criticos" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Pacientes críticos</CardTitle>
                    <CardDescription>
                      Pacientes que requieren atención especial - Click en el nombre para acceder al historial médico
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alertasClinicas.map((alerta) => (
                        <div key={alerta.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/20 transition-colors">
                          <div className="flex-1">
                            <Button
                              variant="link"
                              className="p-0 h-auto font-medium text-health-700 hover:text-health-800"
                              asChild
                            >
                              <Link to={`/pacientes/${alerta.pacienteId}`} state={{ tab: "historial" }}>
                                {alerta.pacienteNombre}
                              </Link>
                            </Button>
                            <p className="text-sm text-muted-foreground mt-1">{alerta.condicion}</p>
                            <p className="text-xs text-muted-foreground">{alerta.descripcion}</p>
                          </div>
                          <Badge className={
                            alerta.prioridad === "alta" ? "bg-red-100 text-red-700" :
                            alerta.prioridad === "media" ? "bg-amber-100 text-amber-700" :
                            "bg-blue-100 text-blue-700"
                          }>
                            {alerta.prioridad === "alta" ? "Crítico" : 
                             alerta.prioridad === "media" ? "Requiere atención" : "Estable"}
                          </Badge>
                        </div>
                      ))}
                      
                      <div className="text-center pt-4">
                        <Button asChild variant="outline">
                          <Link to="/pacientes">Ver todos los pacientes</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contenido de actividad reciente */}
              <TabsContent value="actividad" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Actividad reciente</CardTitle>
                    <CardDescription>
                      Últimas acciones realizadas en el sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Acción</TableHead>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Fecha/Hora</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs bg-health-100 text-health-700">MD</AvatarFallback>
                              </Avatar>
                              <span>Dr. Martínez</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              Actualización historial
                            </Badge>
                          </TableCell>
                          <TableCell>María González</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            Hace 25 minutos
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs bg-health-100 text-health-700">EF</AvatarFallback>
                              </Avatar>
                              <span>Enf. Rodríguez</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Aplicación medicación
                            </Badge>
                          </TableCell>
                          <TableCell>Carlos Sánchez</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            Hace 40 minutos
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs bg-health-100 text-health-700">AD</AvatarFallback>
                              </Avatar>
                              <span>Admin López</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                              Nuevo paciente
                            </Badge>
                          </TableCell>
                          <TableCell>Laura Pérez</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            Hace 1 hora
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

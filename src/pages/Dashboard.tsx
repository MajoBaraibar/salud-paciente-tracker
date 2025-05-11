import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PacienteResumen } from "@/components/PacienteResumen";
import { AlertaClinica } from "@/components/AlertaClinica";
import { pacientesMock } from "../data/mockData";
import { calcularEdad } from "@/lib/utils";
import { 
  Calendar, Users, FileText, AlertTriangle, 
  Activity, BarChart, User, Bell 
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
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
  
  // Pacientes recientes (últimos 5)
  const pacientesRecientes = pacientesMock.slice(0, 5);
  
  // Alertas clínicas mock
  const alertasClinicas = [
    {
      id: "1",
      pacienteId: pacientesMock[0].id,
      pacienteNombre: `${pacientesMock[0].nombre} ${pacientesMock[0].apellido}`,
      tipo: "alergia" as const,
      descripcion: "Alergia severa a penicilina",
      prioridad: "alta" as const,
    },
    {
      id: "2",
      pacienteId: pacientesMock[1].id,
      pacienteNombre: `${pacientesMock[1].nombre} ${pacientesMock[1].apellido}`,
      tipo: "estudio" as const,
      descripcion: "Resultados críticos en hemograma",
      prioridad: "alta" as const,
    },
    {
      id: "3",
      pacienteId: pacientesMock[2].id,
      pacienteNombre: `${pacientesMock[2].nombre} ${pacientesMock[2].apellido}`,
      tipo: "medicacion" as const,
      descripcion: "Medicamento pendiente de administrar",
      prioridad: "media" as const,
    },
  ];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }
  
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
                <div className="relative">
                  <Bell className="h-6 w-6 text-muted-foreground cursor-pointer" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-health-200 text-health-700">
                      {currentUser?.role === "medico" ? "MD" : 
                       currentUser?.role === "enfermera" ? "EF" : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium">{currentUser?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {currentUser?.role}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                >
                  Salir
                </Button>
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
              
              <Card>
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
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Alertas activas</p>
                      <p className="text-3xl font-bold">{alertasClinicas.length}</p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Historias nuevas</p>
                      <p className="text-3xl font-bold">8</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pestañas principales */}
            <Tabs defaultValue="pacientes">
              <TabsList className="mb-6 bg-white border">
                <TabsTrigger value="pacientes" className="data-[state=active]:bg-health-50">
                  <Users className="h-4 w-4 mr-2" />
                  Pacientes recientes
                </TabsTrigger>
                <TabsTrigger value="alertas" className="data-[state=active]:bg-health-50">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Alertas clínicas
                </TabsTrigger>
                <TabsTrigger value="actividad" className="data-[state=active]:bg-health-50">
                  <Activity className="h-4 w-4 mr-2" />
                  Actividad reciente
                </TabsTrigger>
              </TabsList>
              
              {/* Contenido de pacientes recientes */}
              <TabsContent value="pacientes" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Pacientes recientes</CardTitle>
                    <CardDescription>
                      Los últimos pacientes que han sido atendidos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pacientesRecientes.map((paciente) => (
                        <PacienteResumen key={paciente.id} paciente={paciente} />
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
              
              {/* Contenido de alertas clínicas */}
              <TabsContent value="alertas" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Alertas clínicas</CardTitle>
                    <CardDescription>
                      Alertas prioritarias que requieren atención
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alertasClinicas.map((alerta) => (
                        <AlertaClinica key={alerta.id} alerta={alerta} />
                      ))}
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

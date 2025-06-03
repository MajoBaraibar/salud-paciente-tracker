
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, Clock, Bell } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";

interface FamiliarDashboardProps {
  currentUser: { email: string; role: string };
}

export const FamiliarDashboard = ({ currentUser }: FamiliarDashboardProps) => {
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardHeader
        title="Panel Familiar"
        subtitle="Bienvenido, información de su paciente en tiempo real"
        userEmail={currentUser.email}
        userRole="Familiar"
        avatarFallback="FM"
      />
      
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
  );
};

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCenterConfig } from "@/hooks/useCenterConfig";
import { useDemoStore } from "@/stores/demoStore";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  FileText, 
  Activity, 
  Calendar,
  CreditCard,
  MessageSquare,
  Shield,
  Zap,
  Heart,
  Clock,
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react";

const DemoPresentation = () => {
  const centerConfig = useCenterConfig();
  const navigate = useNavigate();
  const { pacientes, historiales, notasEnfermeria, contactosEmergencia, pagos } = useDemoStore();

  const stats = [
    { 
      label: "Pacientes Activos", 
      value: pacientes.length, 
      icon: Users,
      color: "text-blue-600" 
    },
    { 
      label: "Registros Médicos", 
      value: historiales.length, 
      icon: FileText,
      color: "text-green-600" 
    },
    { 
      label: "Notas de Enfermería", 
      value: notasEnfermeria.length, 
      icon: Activity,
      color: "text-purple-600" 
    },
    { 
      label: "Contactos de Emergencia", 
      value: contactosEmergencia.length, 
      icon: Shield,
      color: "text-red-600" 
    }
  ];

  const features = [
    {
      title: "Gestión Integral de Pacientes",
      description: "Registro completo de información médica, contactos y seguimiento personalizado",
      icon: Users,
      demo: "/pacientes"
    },
    {
      title: "Historial Médico Digital",
      description: "Consultas, diagnósticos y tratamientos organizados cronológicamente",
      icon: FileText,
      demo: "/pacientes"
    },
    {
      title: "Notas de Enfermería",
      description: "Registro diario de observaciones y cuidados especializados",
      icon: Activity,
      demo: "/pacientes"
    },
    {
      title: "Control de Pagos",
      description: "Seguimiento de mensualidades, estados de pago y recordatorios",
      icon: CreditCard,
      demo: "/pagos"
    },
    {
      title: "Comunicación Familiar",
      description: "Canal directo entre familiares y equipo médico",
      icon: MessageSquare,
      demo: "/mensajes"
    },
    {
      title: "Calendario de Citas",
      description: "Programación y seguimiento de consultas médicas",
      icon: Calendar,
      demo: "/calendario"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Ahorro de Tiempo",
      description: "Reduce el tiempo administrativo en un 60%"
    },
    {
      icon: Shield,
      title: "Seguridad de Datos",
      description: "Información protegida con estándares hospitalarios"
    },
    {
      icon: Heart,
      title: "Mejor Atención",
      description: "Seguimiento personalizado para cada paciente"
    },
    {
      icon: Zap,
      title: "Fácil de Usar",
      description: "Interfaz intuitiva, sin necesidad de capacitación extensa"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-health-100 text-health-700 p-2 rounded mr-3">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{centerConfig.name}</h1>
                <p className="text-sm text-gray-600">Sistema de Gestión Médica</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              DEMO EN VIVO
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            La Solución Digital para Casas de Salud
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gestione eficientemente la atención médica, historiales de pacientes, 
            comunicación familiar y administración en una sola plataforma moderna y segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-health-600 hover:bg-health-700"
              onClick={() => navigate("/login")}
            >
              <Play className="mr-2 h-5 w-5" />
              Probar Demo Interactivo
            </Button>
            <Button variant="outline" size="lg">
              Solicitar Presentación
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-8">Funcionalidades Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-health-600" />
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="w-full"
                  >
                    Ver en Acción
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-8">Beneficios Comprobados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <benefit.icon className="h-12 w-12 mx-auto mb-4 text-health-600" />
                  <h4 className="font-semibold mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-health-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Listo para Modernizar su Casa de Salud?</h3>
            <p className="text-health-100 mb-6 max-w-2xl mx-auto">
              Únase a las casas de salud que ya han mejorado su eficiencia operativa 
              y calidad de atención con nuestro sistema.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate("/login")}
              >
                <Play className="mr-2 h-5 w-5" />
                Iniciar Demo Ahora
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-health-600">
                Agendar Reunión
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          <p>© 2024 {centerConfig.name}. Sistema desarrollado para optimizar la gestión de casas de salud.</p>
        </footer>
      </div>
    </div>
  );
};

export default DemoPresentation;
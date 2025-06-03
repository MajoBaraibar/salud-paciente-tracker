
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, User, Clock } from "lucide-react";
import { useNotificationStore } from "@/stores/notificationStore";

const anunciosMock = [
  {
    id: "1",
    titulo: "Nuevo protocolo de administración de medicamentos",
    contenido: "Se ha actualizado el protocolo para la administración de medicamentos. Todos los profesionales deben revisar los nuevos procedimientos.",
    fecha: new Date(),
    autor: "Administración",
    tipo: "protocolo" as const,
    prioridad: "alta" as const
  },
  {
    id: "2",
    titulo: "Capacitación en primeros auxilios",
    contenido: "Se realizará una capacitación obligatoria en primeros auxilios el próximo viernes a las 14:00 horas.",
    fecha: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    autor: "Recursos Humanos",
    tipo: "capacitacion" as const,
    prioridad: "media" as const
  },
  {
    id: "3",
    titulo: "Actualización del sistema",
    contenido: "El sistema estará en mantenimiento el domingo de 02:00 a 06:00 horas. Durante este tiempo no estará disponible.",
    fecha: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
    autor: "Sistemas",
    tipo: "mantenimiento" as const,
    prioridad: "baja" as const
  }
];

export default function Anuncios() {
  const { markAllAsRead } = useNotificationStore();

  // Marcar notificaciones de anuncios como leídas al entrar a la página
  useEffect(() => {
    markAllAsRead('announcement');
  }, [markAllAsRead]);

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "bg-red-100 text-red-700 border-red-300";
      case "media":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "baja":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "protocolo":
        return <FileText className="h-4 w-4" />;
      case "capacitacion":
        return <User className="h-4 w-4" />;
      case "mantenimiento":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-health-700">Tablón de anuncios</h1>
            <p className="text-muted-foreground">
              Comunicaciones importantes del centro médico
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {anunciosMock.map((anuncio) => (
            <Card key={anuncio.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(anuncio.tipo)}
                    <CardTitle className="text-lg">{anuncio.titulo}</CardTitle>
                  </div>
                  <Badge className={getPriorityColor(anuncio.prioridad)}>
                    {anuncio.prioridad.charAt(0).toUpperCase() + anuncio.prioridad.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {anuncio.autor}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {anuncio.fecha.toLocaleDateString('es-ES')}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{anuncio.contenido}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

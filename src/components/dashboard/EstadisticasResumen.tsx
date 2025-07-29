import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Activity, Calendar, AlertTriangle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EstadisticasResumenProps {
  estadisticas: {
    totalPacientes: number;
    nuevoPacientesHoy: number;
    ocupacionPromedio: number;
    consultasSemanales: number;
    alertasCriticas: number;
    satisfaccionPromedio: number;
  } | null;
  loading?: boolean;
}

export const EstadisticasResumen = ({ estadisticas, loading }: EstadisticasResumenProps) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay datos disponibles
      </div>
    );
  }

  const tarjetas = [
    {
      titulo: "Total Pacientes",
      valor: estadisticas.totalPacientes.toString(),
      descripcion: "Pacientes activos",
      icono: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      tendencia: null
    },
    {
      titulo: "Nuevos Hoy",
      valor: estadisticas.nuevoPacientesHoy.toString(),
      descripcion: "Ingresos del día",
      icono: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      tendencia: estadisticas.nuevoPacientesHoy > 0 ? "positive" : null
    },
    {
      titulo: "Ocupación",
      valor: `${estadisticas.ocupacionPromedio}%`,
      descripcion: "Promedio semanal",
      icono: Activity,
      color: estadisticas.ocupacionPromedio > 80 ? "text-red-600" : "text-blue-600",
      bgColor: estadisticas.ocupacionPromedio > 80 ? "bg-red-50" : "bg-blue-50",
      tendencia: estadisticas.ocupacionPromedio > 80 ? "warning" : "normal"
    },
    {
      titulo: "Consultas",
      valor: estadisticas.consultasSemanales.toString(),
      descripcion: "Esta semana",
      icono: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      tendencia: null
    },
    {
      titulo: "Alertas Críticas",
      valor: estadisticas.alertasCriticas.toString(),
      descripcion: "Requieren atención",
      icono: AlertTriangle,
      color: estadisticas.alertasCriticas > 0 ? "text-red-600" : "text-green-600",
      bgColor: estadisticas.alertasCriticas > 0 ? "bg-red-50" : "bg-green-50",
      tendencia: estadisticas.alertasCriticas > 0 ? "critical" : "good"
    },
    {
      titulo: "Satisfacción",
      valor: estadisticas.satisfaccionPromedio.toFixed(1),
      descripcion: "Promedio sobre 5",
      icono: Star,
      color: estadisticas.satisfaccionPromedio >= 4.5 ? "text-green-600" : 
             estadisticas.satisfaccionPromedio >= 4.0 ? "text-yellow-600" : "text-red-600",
      bgColor: estadisticas.satisfaccionPromedio >= 4.5 ? "bg-green-50" : 
               estadisticas.satisfaccionPromedio >= 4.0 ? "bg-yellow-50" : "bg-red-50",
      tendencia: estadisticas.satisfaccionPromedio >= 4.5 ? "excellent" : 
                estadisticas.satisfaccionPromedio >= 4.0 ? "good" : "needs_improvement"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {tarjetas.map((tarjeta, index) => {
        const Icon = tarjeta.icono;
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {tarjeta.titulo}
              </CardTitle>
              <div className={cn("p-2 rounded-full", tarjeta.bgColor)}>
                <Icon className={cn("h-4 w-4", tarjeta.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold">{tarjeta.valor}</div>
                {tarjeta.tendencia && (
                  <div className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    {
                      "bg-green-100 text-green-700": tarjeta.tendencia === "positive" || tarjeta.tendencia === "good" || tarjeta.tendencia === "excellent",
                      "bg-red-100 text-red-700": tarjeta.tendencia === "critical" || tarjeta.tendencia === "needs_improvement",
                      "bg-yellow-100 text-yellow-700": tarjeta.tendencia === "warning",
                      "bg-blue-100 text-blue-700": tarjeta.tendencia === "normal"
                    }
                  )}>
                    {tarjeta.tendencia === "positive" && "↗"}
                    {tarjeta.tendencia === "critical" && "!"}
                    {tarjeta.tendencia === "warning" && "⚠"}
                    {tarjeta.tendencia === "good" && "✓"}
                    {tarjeta.tendencia === "excellent" && "⭐"}
                    {tarjeta.tendencia === "needs_improvement" && "↓"}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {tarjeta.descripcion}
              </p>
            </CardContent>
            
            {/* Indicador de borde para alertas críticas */}
            {tarjeta.tendencia === "critical" && (
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            )}
            
            {/* Indicador de borde para excelente rendimiento */}
            {tarjeta.tendencia === "excellent" && (
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
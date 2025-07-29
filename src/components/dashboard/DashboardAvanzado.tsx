import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useMetricas } from '@/hooks/useMetricas';
import { MetricasChart } from './MetricasChart';
import { AlertasPanel } from './AlertasPanel';
import { EstadisticasResumen } from './EstadisticasResumen';
import { RefreshCw, Download, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const DashboardAvanzado = () => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('30');
  const { 
    metricasCentro, 
    alertas, 
    loading, 
    error, 
    fetchMetricasCentro, 
    fetchAlertas, 
    resolverAlerta,
    getEstadisticasResumen 
  } = useMetricas();

  const handleRefresh = async () => {
    try {
      await Promise.all([
        fetchMetricasCentro(parseInt(periodoSeleccionado)),
        fetchAlertas()
      ]);
      toast.success('Datos actualizados correctamente');
    } catch (error) {
      toast.error('Error al actualizar los datos');
    }
  };

  const handleResolverAlerta = async (alertaId: string) => {
    try {
      await resolverAlerta(alertaId);
      toast.success('Alerta resuelta correctamente');
    } catch (error) {
      toast.error('Error al resolver la alerta');
    }
  };

  const handlePeriodoChange = async (value: string) => {
    setPeriodoSeleccionado(value);
    await fetchMetricasCentro(parseInt(value));
  };

  const estadisticas = getEstadisticasResumen();

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">Error al cargar los datos: {error}</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Avanzado</h1>
          <p className="text-muted-foreground">
            Métricas y estadísticas en tiempo real del centro de salud
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodoSeleccionado} onValueChange={handlePeriodoChange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 días</SelectItem>
              <SelectItem value="15">15 días</SelectItem>
              <SelectItem value="30">30 días</SelectItem>
              <SelectItem value="60">60 días</SelectItem>
              <SelectItem value="90">90 días</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas Resumen */}
      <EstadisticasResumen estadisticas={estadisticas} loading={loading} />

      {/* Dashboard Principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gráficos Principales */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="ocupacion" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ocupacion">Ocupación</TabsTrigger>
              <TabsTrigger value="consultas">Consultas</TabsTrigger>
              <TabsTrigger value="ingresos">Finanzas</TabsTrigger>
              <TabsTrigger value="satisfaccion">Satisfacción</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ocupacion" className="mt-6">
              <MetricasChart 
                data={metricasCentro}
                tipo="ocupacion"
                titulo="Ocupación del Centro"
                descripcion="Porcentaje de ocupación diario y total de pacientes"
              />
            </TabsContent>
            
            <TabsContent value="consultas" className="mt-6">
              <MetricasChart 
                data={metricasCentro}
                tipo="consultas"
                titulo="Consultas Realizadas"
                descripcion="Consultas regulares y emergencias atendidas"
              />
            </TabsContent>
            
            <TabsContent value="ingresos" className="mt-6">
              <MetricasChart 
                data={metricasCentro}
                tipo="ingresos"
                titulo="Análisis Financiero"
                descripcion="Ingresos y gastos diarios del centro"
              />
            </TabsContent>
            
            <TabsContent value="satisfaccion" className="mt-6">
              <MetricasChart 
                data={metricasCentro}
                tipo="satisfaccion"
                titulo="Satisfacción del Paciente"
                descripcion="Calificación promedio de satisfacción"
              />
            </TabsContent>
          </Tabs>

          {/* Métricas Adicionales */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Tendencia Semanal</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nuevos Pacientes</span>
                    <Badge variant="outline" className="text-green-600">
                      +{metricasCentro.slice(-7).reduce((acc, m) => acc + m.nuevos_pacientes, 0)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Consultas Totales</span>
                    <Badge variant="outline" className="text-blue-600">
                      {metricasCentro.slice(-7).reduce((acc, m) => acc + m.consultas_realizadas, 0)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Emergencias</span>
                    <Badge variant="outline" className="text-orange-600">
                      {metricasCentro.slice(-7).reduce((acc, m) => acc + m.emergencias_atendidas, 0)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Estado del Sistema</CardTitle>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conectividad</span>
                    <Badge variant="outline" className="text-green-600">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Última actualización</span>
                    <span className="text-xs text-muted-foreground">Ahora</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sincronización</span>
                    <Badge variant="outline" className="text-green-600">Activa</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Panel de Alertas */}
        <div className="lg:col-span-1">
          <AlertasPanel 
            alertas={alertas}
            onResolverAlerta={handleResolverAlerta}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
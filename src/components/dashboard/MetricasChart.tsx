import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricaCentro } from '@/hooks/useMetricas';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MetricasChartProps {
  data: MetricaCentro[];
  tipo: 'ocupacion' | 'consultas' | 'ingresos' | 'satisfaccion';
  titulo: string;
  descripcion?: string;
}

export const MetricasChart = ({ data, tipo, titulo, descripcion }: MetricasChartProps) => {
  const formatearData = () => {
    return data.map(metrica => ({
      fecha: format(new Date(metrica.fecha), 'dd/MM', { locale: es }),
      fechaCompleta: format(new Date(metrica.fecha), 'dd MMM yyyy', { locale: es }),
      valor: getValorByTipo(metrica, tipo),
      valorSecundario: getValorSecundarioByTipo(metrica, tipo)
    }));
  };

  const getValorByTipo = (metrica: MetricaCentro, tipo: string) => {
    switch (tipo) {
      case 'ocupacion':
        return metrica.ocupacion_porcentaje;
      case 'consultas':
        return metrica.consultas_realizadas;
      case 'ingresos':
        return metrica.ingresos_diarios;
      case 'satisfaccion':
        return metrica.satisfaccion_promedio || 0;
      default:
        return 0;
    }
  };

  const getValorSecundarioByTipo = (metrica: MetricaCentro, tipo: string) => {
    switch (tipo) {
      case 'ocupacion':
        return metrica.total_pacientes;
      case 'consultas':
        return metrica.emergencias_atendidas;
      case 'ingresos':
        return metrica.gastos_diarios;
      default:
        return null;
    }
  };

  const getColorPrimario = () => {
    switch (tipo) {
      case 'ocupacion':
        return 'hsl(var(--primary))';
      case 'consultas':
        return 'hsl(142, 51%, 56%)';
      case 'ingresos':
        return 'hsl(217, 91%, 60%)';
      case 'satisfaccion':
        return 'hsl(262, 83%, 58%)';
      default:
        return 'hsl(var(--primary))';
    }
  };

  const getColorSecundario = () => {
    switch (tipo) {
      case 'ocupacion':
        return 'hsl(var(--muted-foreground))';
      case 'consultas':
        return 'hsl(0, 84%, 60%)';
      case 'ingresos':
        return 'hsl(25, 95%, 53%)';
      default:
        return 'hsl(var(--muted-foreground))';
    }
  };

  const formatValue = (value: number) => {
    switch (tipo) {
      case 'ocupacion':
        return `${value.toFixed(1)}%`;
      case 'ingresos':
        return `$${value.toLocaleString()}`;
      case 'satisfaccion':
        return `${value.toFixed(1)}/5`;
      default:
        return value.toString();
    }
  };

  const dataFormateada = formatearData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.fechaCompleta}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.dataKey === 'valor' ? titulo : 'Secundario'}: {formatValue(entry.value)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{titulo}</CardTitle>
        {descripcion && (
          <CardDescription>{descripcion}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {tipo === 'ocupacion' || tipo === 'satisfaccion' ? (
              <AreaChart data={dataFormateada}>
                <defs>
                  <linearGradient id={`color-${tipo}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getColorPrimario()} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={getColorPrimario()} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="fecha" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke={getColorPrimario()}
                  fillOpacity={1}
                  fill={`url(#color-${tipo})`}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={dataFormateada}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="fecha" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke={getColorPrimario()}
                  strokeWidth={2}
                  dot={{ fill: getColorPrimario(), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: getColorPrimario() }}
                />
                {tipo === 'consultas' && (
                  <Line 
                    type="monotone" 
                    dataKey="valorSecundario" 
                    stroke={getColorSecundario()}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: getColorSecundario(), strokeWidth: 2, r: 3 }}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
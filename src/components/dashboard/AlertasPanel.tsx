import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Clock, CheckCircle, AlertCircle, Pill } from 'lucide-react';
import { AlertaSistema } from '@/hooks/useMetricas';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface AlertasPanelProps {
  alertas: AlertaSistema[];
  onResolverAlerta: (alertaId: string) => void;
  loading?: boolean;
}

export const AlertasPanel = ({ alertas, onResolverAlerta, loading = false }: AlertasPanelProps) => {
  const getIconByTipo = (tipo: string) => {
    switch (tipo) {
      case 'critica':
        return <AlertTriangle className="h-4 w-4" />;
      case 'importante':
        return <AlertCircle className="h-4 w-4" />;
      case 'medicamento':
        return <Pill className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getColorByPrioridad = (prioridad: number) => {
    switch (prioridad) {
      case 4:
        return 'destructive';
      case 3:
        return 'destructive';
      case 2:
        return 'default';
      case 1:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPrioridadTexto = (prioridad: number) => {
    switch (prioridad) {
      case 4:
        return 'Crítica';
      case 3:
        return 'Alta';
      case 2:
        return 'Media';
      case 1:
        return 'Baja';
      default:
        return 'Normal';
    }
  };

  const alertasCriticas = alertas.filter(a => a.prioridad === 4);
  const alertasImportantes = alertas.filter(a => a.prioridad === 3);
  const alertasNormales = alertas.filter(a => a.prioridad <= 2);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas Activas
          <Badge variant="destructive" className="ml-auto">
            {alertas.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alertas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mb-2" />
            <p className="text-sm">No hay alertas activas</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {/* Alertas Críticas */}
              {alertasCriticas.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-destructive mb-2">
                    Críticas ({alertasCriticas.length})
                  </h4>
                  <div className="space-y-2">
                    {alertasCriticas.map(alerta => (
                      <AlertaItem 
                        key={alerta.id} 
                        alerta={alerta} 
                        onResolver={onResolverAlerta}
                        getIcon={getIconByTipo}
                        getColor={getColorByPrioridad}
                        getPrioridadTexto={getPrioridadTexto}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Alertas Importantes */}
              {alertasImportantes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-yellow-600 mb-2">
                    Importantes ({alertasImportantes.length})
                  </h4>
                  <div className="space-y-2">
                    {alertasImportantes.map(alerta => (
                      <AlertaItem 
                        key={alerta.id} 
                        alerta={alerta} 
                        onResolver={onResolverAlerta}
                        getIcon={getIconByTipo}
                        getColor={getColorByPrioridad}
                        getPrioridadTexto={getPrioridadTexto}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Alertas Normales */}
              {alertasNormales.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Otras ({alertasNormales.length})
                  </h4>
                  <div className="space-y-2">
                    {alertasNormales.map(alerta => (
                      <AlertaItem 
                        key={alerta.id} 
                        alerta={alerta} 
                        onResolver={onResolverAlerta}
                        getIcon={getIconByTipo}
                        getColor={getColorByPrioridad}
                        getPrioridadTexto={getPrioridadTexto}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

interface AlertaItemProps {
  alerta: AlertaSistema;
  onResolver: (alertaId: string) => void;
  getIcon: (tipo: string) => React.ReactNode;
  getColor: (prioridad: number) => string;
  getPrioridadTexto: (prioridad: number) => string;
}

const AlertaItem = ({ alerta, onResolver, getIcon, getColor, getPrioridadTexto }: AlertaItemProps) => {
  return (
    <div className="flex items-start gap-3 p-3 border border-border rounded-lg bg-card/50">
      <div className="flex-shrink-0 mt-0.5">
        {getIcon(alerta.tipo)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h5 className="text-sm font-medium leading-tight">{alerta.titulo}</h5>
          <Badge variant={getColor(alerta.prioridad) as any} className="ml-2 text-xs">
            {getPrioridadTexto(alerta.prioridad)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{alerta.descripcion}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(alerta.created_at), { 
              addSuffix: true,
              locale: es 
            })}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onResolver(alerta.id)}
            className="h-6 px-2 text-xs"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolver
          </Button>
        </div>
      </div>
    </div>
  );
};
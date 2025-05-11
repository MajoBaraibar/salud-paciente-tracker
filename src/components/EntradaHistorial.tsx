
import { EntradaHistorial as EntradaHistorialType } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface EntradaHistorialProps {
  entrada: EntradaHistorialType;
}

export function EntradaHistorial({ entrada }: EntradaHistorialProps) {
  const { fecha, doctorNombre, motivoConsulta, diagnostico, tratamiento, notas } = entrada;
  
  return (
    <Card className="mb-4">
      <CardHeader className="bg-muted/30 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{formatDate(fecha)}</h3>
          <span className="text-sm text-muted-foreground">{doctorNombre}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Motivo de consulta</h4>
            <p>{motivoConsulta}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Diagnóstico</h4>
            <p>{diagnostico}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Tratamiento</h4>
            <p>{tratamiento}</p>
          </div>
          
          {notas && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Notas</h4>
              <p>{notas}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

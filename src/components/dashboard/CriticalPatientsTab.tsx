
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AlertaClinica {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tipo: "alergia" | "estudio" | "medicacion";
  descripcion: string;
  prioridad: "alta" | "media" | "baja";
  condicion: string;
}

interface CriticalPatientsTabProps {
  alertasClinicas: AlertaClinica[];
}

export const CriticalPatientsTab = ({ alertasClinicas }: CriticalPatientsTabProps) => {
  return (
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
  );
};


import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, FileMedical, PillIcon, ExternalLink } from "lucide-react";

interface Alerta {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tipo: "alergia" | "estudio" | "medicacion" | "otro";
  descripcion: string;
  prioridad: "baja" | "media" | "alta";
}

interface AlertaClinicaProps {
  alerta: Alerta;
}

export const AlertaClinica: React.FC<AlertaClinicaProps> = ({ alerta }) => {
  const getTipoIcon = () => {
    switch (alerta.tipo) {
      case "alergia":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "estudio":
        return <FileMedical className="h-5 w-5 text-blue-500" />;
      case "medicacion":
        return <PillIcon className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const getBadgeColor = () => {
    switch (alerta.prioridad) {
      case "alta":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "media":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "baja":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };
  
  return (
    <Card className="p-4 hover:bg-muted/20 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-muted">
            {getTipoIcon()}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-base">
                {alerta.pacienteNombre}
              </h3>
              <Badge className={getBadgeColor()}>
                {alerta.prioridad === "alta" ? "Prioridad alta" : 
                 alerta.prioridad === "media" ? "Prioridad media" : "Prioridad baja"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {alerta.descripcion}
            </p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" asChild>
          <Link to={`/pacientes/${alerta.pacienteId}`}>
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>Ver paciente</span>
          </Link>
        </Button>
      </div>
    </Card>
  );
};


import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calcularEdad } from "@/lib/utils";
import { Paciente } from "@/types";
import { FileText, User, FilePen } from "lucide-react";

interface PacienteResumenProps {
  paciente: Paciente;
}

export const PacienteResumen: React.FC<PacienteResumenProps> = ({ paciente }) => {
  const edad = calcularEdad(paciente.fechaNacimiento);
  
  return (
    <Card className="p-4 hover:bg-muted/20 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={paciente.imagenUrl} />
            <AvatarFallback className="bg-health-100 text-health-600">
              {paciente.nombre[0]}{paciente.apellido[0]}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium text-base">
              {paciente.nombre} {paciente.apellido}
            </h3>
            <p className="text-sm text-muted-foreground">
              {edad} años • ID: {paciente.numeroIdentificacion}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="flex items-center space-x-1"
          >
            <Link to={`/pacientes/${paciente.id}`}>
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="flex items-center space-x-1"
          >
            <Link to={`/pacientes/${paciente.id}`} state={{ tab: "historial" }}>
              <FileText className="h-4 w-4" />
              <span>Historial</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="flex items-center space-x-1 hidden md:flex"
          >
            <Link to={`/pacientes/${paciente.id}`} state={{ tab: "enfermeria" }}>
              <FilePen className="h-4 w-4" />
              <span>Notas</span>
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

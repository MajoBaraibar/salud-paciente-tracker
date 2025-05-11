
import { Paciente } from "../types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PacienteCardProps {
  paciente: Paciente;
}

export function PacienteCard({ paciente }: PacienteCardProps) {
  const { id, nombre, apellido, numeroIdentificacion, imagenUrl } = paciente;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="mr-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img 
                src={imagenUrl || "/placeholder.svg"} 
                alt={`${nombre} ${apellido}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{nombre} {apellido}</h3>
            <p className="text-sm text-muted-foreground">ID: {numeroIdentificacion}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-3 flex justify-end">
        <Button asChild variant="ghost" className="text-health-700 hover:text-health-800 hover:bg-health-100">
          <Link to={`/pacientes/${id}`}>Ver perfil</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const ActivityTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Acción</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Fecha/Hora</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-health-100 text-health-700">MD</AvatarFallback>
              </Avatar>
              <span>Dr. Martínez</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Actualización historial
            </Badge>
          </TableCell>
          <TableCell>María González</TableCell>
          <TableCell className="text-muted-foreground text-sm">
            Hace 25 minutos
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-health-100 text-health-700">EF</AvatarFallback>
              </Avatar>
              <span>Enf. Rodríguez</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              Aplicación medicación
            </Badge>
          </TableCell>
          <TableCell>Carlos Sánchez</TableCell>
          <TableCell className="text-muted-foreground text-sm">
            Hace 40 minutos
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-health-100 text-health-700">AD</AvatarFallback>
              </Avatar>
              <span>Admin López</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
              Nuevo paciente
            </Badge>
          </TableCell>
          <TableCell>Laura Pérez</TableCell>
          <TableCell className="text-muted-foreground text-sm">
            Hace 1 hora
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

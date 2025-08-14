import { useState } from "react";
import { Plus, Search, Package, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MedicamentosManager() {
  const [busqueda, setBusqueda] = useState("");

  // Datos simulados de medicamentos
  const medicamentos = [
    {
      id: "1",
      nombre: "Acetaminofén",
      principioActivo: "Acetaminofén",
      presentacion: "Tableta",
      concentracion: "500mg",
      stockActual: 100,
      stockMinimo: 10,
      precioUnitario: 500,
      requiereReceta: false
    },
    {
      id: "2",
      nombre: "Amoxicilina",
      principioActivo: "Amoxicilina",
      presentacion: "Cápsula",
      concentracion: "500mg",
      stockActual: 5,
      stockMinimo: 10,
      precioUnitario: 1200,
      requiereReceta: true
    }
  ];

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medicamentos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-600">{medicamentos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {medicamentos.filter(m => m.stockActual <= m.stockMinimo).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar medicamentos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Medicamento
        </Button>
      </div>

      {/* Lista de medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Medicamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicamento</TableHead>
                <TableHead>Presentación</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Receta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicamentos.map((medicamento) => (
                <TableRow key={medicamento.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{medicamento.nombre}</div>
                      <div className="text-sm text-muted-foreground">{medicamento.principioActivo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {medicamento.presentacion} {medicamento.concentracion}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={medicamento.stockActual <= medicamento.stockMinimo ? "text-red-600 font-medium" : ""}>
                        {medicamento.stockActual}
                      </span>
                      {medicamento.stockActual <= medicamento.stockMinimo && (
                        <Badge variant="destructive" className="text-xs">
                          Stock bajo
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatearPrecio(medicamento.precioUnitario)}</TableCell>
                  <TableCell>
                    <Badge variant={medicamento.requiereReceta ? "destructive" : "secondary"}>
                      {medicamento.requiereReceta ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
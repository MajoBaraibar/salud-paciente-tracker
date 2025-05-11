
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock inventory data
const inventoryItems = [
  { id: "1", name: "Guantes de látex (caja)", quantity: 15, category: "Material médico" },
  { id: "2", name: "Alcohol 70% (litro)", quantity: 8, category: "Desinfección" },
  { id: "3", name: "Pañales adulto talla M", quantity: 45, category: "Higiene" },
  { id: "4", name: "Termómetros digitales", quantity: 5, category: "Equipamiento" },
  { id: "5", name: "Gasas estériles (paquete)", quantity: 20, category: "Material médico" },
  { id: "6", name: "Medicamentos para hipertensión", quantity: 3, category: "Medicamentos" },
  { id: "7", name: "Cremas hidratantes", quantity: 12, category: "Cuidado personal" },
  { id: "8", name: "Paracetamol 500mg", quantity: 30, category: "Medicamentos" },
  { id: "9", name: "Jeringas descartables", quantity: 50, category: "Material médico" },
  { id: "10", name: "Sabanas desechables", quantity: 25, category: "Ropa de cama" }
];

export const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredItems = searchTerm 
    ? inventoryItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : inventoryItems;
  
  const getQuantityBadge = (quantity: number) => {
    if (quantity <= 5) return <Badge className="bg-red-100 text-red-700">Bajo: {quantity}</Badge>;
    if (quantity <= 10) return <Badge className="bg-amber-100 text-amber-700">Medio: {quantity}</Badge>;
    return <Badge className="bg-green-100 text-green-700">Alto: {quantity}</Badge>;
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar por nombre o categoría..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventario existente</CardTitle>
          <CardDescription>
            Consulte esta lista antes de solicitar nuevos insumos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Cantidad disponible</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{getQuantityBadge(item.quantity)}</TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No se encontraron coincidencias
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

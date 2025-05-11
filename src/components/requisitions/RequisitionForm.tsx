
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

type RequisitionItem = {
  id: string;
  name: string;
  quantity: number;
  priority: "baja" | "media" | "alta";
  notes?: string;
};

type RequisitionFormProps = {
  userRole: string;
};

export const RequisitionForm = ({ userRole }: RequisitionFormProps) => {
  const [items, setItems] = useState<RequisitionItem[]>([]);
  const [currentItem, setCurrentItem] = useState<Omit<RequisitionItem, "id">>({
    name: "",
    quantity: 1,
    priority: "media",
    notes: "",
  });
  
  // Category options based on user role
  const categoryOptions = userRole === "medico" 
    ? ["Equipamiento médico", "Dispositivos diagnósticos", "Medicamentos especiales", "Materiales quirúrgicos"]
    : ["Medicamentos básicos", "Material de enfermería", "Elementos de higiene", "Ropa de cama"];

  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  
  const handleAddItem = () => {
    if (!currentItem.name.trim()) {
      toast.error("Debe ingresar un nombre para el artículo");
      return;
    }
    
    const newItem: RequisitionItem = {
      ...currentItem,
      id: Date.now().toString(),
    };
    
    setItems([...items, newItem]);
    setCurrentItem({
      name: "",
      quantity: 1,
      priority: "media",
      notes: "",
    });
    
    toast.success("Artículo agregado a la lista");
  };
  
  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.info("Artículo eliminado de la lista");
  };
  
  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Debe agregar al menos un artículo a la solicitud");
      return;
    }
    
    // Here you would submit the requisition to your backend
    console.log("Enviando solicitud:", {
      items,
      category: selectedCategory,
      userRole,
      date: new Date().toISOString(),
    });
    
    toast.success("Solicitud enviada correctamente");
    setItems([]);
  };
  
  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case "alta": return "text-red-600";
      case "media": return "text-amber-600";
      case "baja": return "text-green-600";
      default: return "";
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-health-700">Solicitud de insumos</h2>
        <p className="text-muted-foreground">
          Complete el formulario para solicitar los insumos que necesita
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Nueva solicitud</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Agregar nuevo artículo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="item-name">Nombre del artículo</Label>
                <Input
                  id="item-name"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                  placeholder="Ej: Guantes estériles"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-quantity">Cantidad</Label>
                <Input
                  id="item-quantity"
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 1})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-priority">Prioridad</Label>
                <Select 
                  value={currentItem.priority} 
                  onValueChange={(value: "baja" | "media" | "alta") => 
                    setCurrentItem({...currentItem, priority: value})
                  }
                >
                  <SelectTrigger id="item-priority">
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="item-notes">Notas adicionales</Label>
                <Textarea
                  id="item-notes"
                  value={currentItem.notes || ""}
                  onChange={(e) => setCurrentItem({...currentItem, notes: e.target.value})}
                  placeholder="Especificaciones o detalles adicionales..."
                  rows={2}
                />
              </div>
              
              <div className="md:col-span-3">
                <Button 
                  variant="outline" 
                  onClick={handleAddItem}
                  className="w-full md:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar a la lista
                </Button>
              </div>
            </div>
          </div>
          
          {items.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Artículos en la solicitud</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <span className="text-sm">Cantidad: {item.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{item.notes || "Sin notas adicionales"}</p>
                        <span className={`text-xs font-medium ${getPriorityClass(item.priority)}`}>
                          Prioridad: {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="ml-2 h-8 w-8 text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={items.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Enviar solicitud
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

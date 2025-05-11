
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, User, UserPlus, Save, Edit } from "lucide-react";
import { toast } from "sonner";

type EmergencyContactData = {
  name: string;
  relationship: string;
  phone: string;
  email: string;
};

type EmergencyContactProps = {
  patientId: string;
  initialContact?: EmergencyContactData;
};

export const EmergencyContact = ({ patientId, initialContact }: EmergencyContactProps) => {
  const [isEditing, setIsEditing] = useState(!initialContact);
  
  const [contactData, setContactData] = useState<EmergencyContactData>(
    initialContact || {
      name: "",
      relationship: "",
      phone: "",
      email: ""
    }
  );
  
  const handleChange = (field: keyof EmergencyContactData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContactData({
      ...contactData,
      [field]: e.target.value,
    });
  };
  
  const handleSave = () => {
    // Validation
    if (!contactData.name.trim()) {
      toast.error("El nombre del contacto es obligatorio");
      return;
    }
    
    if (!contactData.phone.trim()) {
      toast.error("El teléfono del contacto es obligatorio");
      return;
    }
    
    // Here you would save the contact to your database
    console.log("Guardando contacto de emergencia:", contactData);
    
    toast.success("Contacto de emergencia guardado correctamente");
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center">
          <User className="mr-2 h-5 w-5 text-health-600" />
          Contacto de emergencia
        </CardTitle>
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Nombre completo</Label>
                <Input
                  id="contact-name"
                  value={contactData.name}
                  onChange={handleChange("name")}
                  placeholder="Nombre y apellido"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-relationship">Relación</Label>
                <Select 
                  value={contactData.relationship} 
                  onValueChange={(value) => 
                    setContactData({...contactData, relationship: value})
                  }
                >
                  <SelectTrigger id="contact-relationship">
                    <SelectValue placeholder="Seleccionar relación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="familiar">Familiar</SelectItem>
                    <SelectItem value="cónyuge">Cónyuge</SelectItem>
                    <SelectItem value="hijo/a">Hijo/a</SelectItem>
                    <SelectItem value="padre/madre">Padre/Madre</SelectItem>
                    <SelectItem value="amigo">Amigo</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Teléfono</Label>
                <Input
                  id="contact-phone"
                  value={contactData.phone}
                  onChange={handleChange("phone")}
                  placeholder="+34 612 345 678"
                  type="tel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Correo electrónico</Label>
                <Input
                  id="contact-email"
                  value={contactData.email}
                  onChange={handleChange("email")}
                  placeholder="contacto@ejemplo.com"
                  type="email"
                />
              </div>
            </div>
          </div>
        ) : (
          contactData.name ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre completo</p>
                <p className="font-medium">{contactData.name}</p>
              </div>
              
              {contactData.relationship && (
                <div>
                  <p className="text-sm text-muted-foreground">Relación</p>
                  <p className="font-medium capitalize">{contactData.relationship}</p>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${contactData.phone}`} className="text-health-700 hover:underline">
                  {contactData.phone}
                </a>
              </div>
              
              {contactData.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${contactData.email}`} className="text-health-700 hover:underline">
                    {contactData.email}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">No hay contacto de emergencia registrado</p>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="mt-4"
              >
                Agregar contacto
              </Button>
            </div>
          )
        )}
      </CardContent>
      
      {isEditing && (
        <CardFooter className="flex justify-end space-x-2">
          {initialContact && (
            <Button 
              variant="outline" 
              onClick={() => {
                setContactData(initialContact);
                setIsEditing(false);
              }}
            >
              Cancelar
            </Button>
          )}
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

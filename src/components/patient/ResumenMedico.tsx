
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ResumenMedicoProps {
  pacienteId: string;
}

export const ResumenMedico: React.FC<ResumenMedicoProps> = ({ pacienteId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : { role: "medico" };
  });
  
  const [condicionesCronicas, setCondicionesCronicas] = useState([
    { nombre: "Hipertensión", valor: true },
    { nombre: "Diabetes", valor: false },
    { nombre: "Hipotiroidismo", valor: false },
    { nombre: "Anticoagulada", valor: false }
  ]);
  
  const [condicionesMentales, setCondicionesMentales] = useState([
    "Deterioro cognitivo severo",
    "Patología de base psiquiátrica no diagnosticada ni tratada en su juventud"
  ]);
  
  const [otrasPatologias, setOtrasPatologias] = useState([
    "Cardiopatía isquémica con cirugía de revascularización miocárdica en 2019",
    "Cáncer colorectal estadío III en 2003 con tratamiento quirúrgico; secundarismo pulmonar derecho que se resecó",
    "Glaucoma",
    "Fractura de cadera izquierda en 2022 con intervención quirúrgica (osteosíntesis)",
    "Anemia",
    "Insuficiencia renal"
  ]);
  
  const [alergias] = useState([
    { nombre: "Penicilina", severa: true }
  ]);

  const [nuevaCondicionCronica, setNuevaCondicionCronica] = useState("");
  const [nuevaCondicionMental, setNuevaCondicionMental] = useState("");
  const [nuevaPatologia, setNuevaPatologia] = useState("");

  const handleGuardarCambios = () => {
    // Aquí se guardarían los cambios en la base de datos
    setIsEditing(false);
    toast.success("Información médica actualizada correctamente");
  };

  const handleCancelarEdicion = () => {
    setIsEditing(false);
    // Resetear cambios si es necesario
  };

  const agregarCondicionCronica = () => {
    if (nuevaCondicionCronica.trim()) {
      setCondicionesCronicas(prev => [...prev, { nombre: nuevaCondicionCronica, valor: false }]);
      setNuevaCondicionCronica("");
    }
  };

  const agregarCondicionMental = () => {
    if (nuevaCondicionMental.trim()) {
      setCondicionesMentales(prev => [...prev, nuevaCondicionMental]);
      setNuevaCondicionMental("");
    }
  };

  const agregarPatologia = () => {
    if (nuevaPatologia.trim()) {
      setOtrasPatologias(prev => [...prev, nuevaPatologia]);
      setNuevaPatologia("");
    }
  };

  const eliminarCondicionCronica = (index: number) => {
    setCondicionesCronicas(prev => prev.filter((_, i) => i !== index));
  };

  const eliminarCondicionMental = (index: number) => {
    setCondicionesMentales(prev => prev.filter((_, i) => i !== index));
  };

  const eliminarPatologia = (index: number) => {
    setOtrasPatologias(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCondicionCronica = (index: number) => {
    setCondicionesCronicas(prev => 
      prev.map((cond, i) => 
        i === index ? { ...cond, valor: !cond.valor } : cond
      )
    );
  };

  return (
    <div className="mb-6">
      {/* Header con botón de edición */}
      {currentUser.role === "medico" && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Resumen Médico</h2>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar información médica
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleGuardarCambios}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
                Guardar
              </Button>
              <Button
                onClick={handleCancelarEdicion}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Condiciones crónicas */}
        <Card className="overflow-hidden border-l-4 border-l-amber-500">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent pb-2">
            <CardTitle className="text-lg font-bold">Condiciones Crónicas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {condicionesCronicas.map((condicion, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">¿{condicion.nombre}?</span>
                    {isEditing ? (
                      <Checkbox
                        checked={condicion.valor}
                        onCheckedChange={() => toggleCondicionCronica(index)}
                      />
                    ) : (
                      condicion.valor ? 
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">SÍ</Badge> : 
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">NO</Badge>
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarCondicionCronica(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
            
            {isEditing && (
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Nueva condición crónica"
                  value={nuevaCondicionCronica}
                  onChange={(e) => setNuevaCondicionCronica(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && agregarCondicionCronica()}
                />
                <Button onClick={agregarCondicionCronica} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Condiciones mentales/cognitivas */}
        <Card className="overflow-hidden border-l-4 border-l-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent pb-2">
            <CardTitle className="text-lg font-bold">Cognitivo/Mental</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                {condicionesMentales.map((condicion, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Textarea
                      value={condicion}
                      onChange={(e) => {
                        const updated = [...condicionesMentales];
                        updated[index] = e.target.value;
                        setCondicionesMentales(updated);
                      }}
                      className="mr-2 min-h-[60px]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarCondicionMental(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Nueva condición cognitiva/mental"
                    value={nuevaCondicionMental}
                    onChange={(e) => setNuevaCondicionMental(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button onClick={agregarCondicionMental} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {condicionesMentales.map((condicion, index) => (
                  <li key={index} className="text-gray-700">{condicion}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Otras patologías */}
        <Card className="overflow-hidden border-l-4 border-l-rose-500 md:col-span-2">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-transparent pb-2">
            <CardTitle className="text-lg font-bold">Otras Patologías</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-2">
                {otrasPatologias.map((patologia, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Textarea
                      value={patologia}
                      onChange={(e) => {
                        const updated = [...otrasPatologias];
                        updated[index] = e.target.value;
                        setOtrasPatologias(updated);
                      }}
                      className="mr-2 min-h-[60px]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarPatologia(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Nueva patología"
                    value={nuevaPatologia}
                    onChange={(e) => setNuevaPatologia(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button onClick={agregarPatologia} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="list-disc pl-5 grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4">
                {otrasPatologias.map((patologia, index) => (
                  <li key={index} className="text-gray-700">{patologia}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Alergias */}
        {alergias.length > 0 && (
          <Card className="overflow-hidden border-l-4 border-l-red-500 md:col-span-2">
            <CardHeader className="bg-gradient-to-r from-red-50 to-transparent pb-2">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                <span>Alergias</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {alergias.map((alergia, index) => (
                  <li key={index} className="flex items-center text-red-700 font-semibold">
                    {alergia.severa && (
                      <span className="inline-flex gap-1 mr-2">
                        <span className="h-5 w-5 bg-red-500 rounded-full"></span>
                        <span className="h-5 w-5 border-2 border-red-500 rounded-full text-red-500 flex items-center justify-center">!</span>
                      </span>
                    )}
                    ALÉRGICA A {alergia.nombre.toUpperCase()}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

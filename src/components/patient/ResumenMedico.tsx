
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface ResumenMedicoProps {
  pacienteId: string;
}

export const ResumenMedico: React.FC<ResumenMedicoProps> = ({ pacienteId }) => {
  // En una aplicación real, estos datos vendrían de una API o base de datos
  // Aquí usamos datos de ejemplo basados en la imagen de referencia
  
  const condicionesCronicas = [
    { nombre: "Hipertensión", valor: true },
    { nombre: "Diabetes", valor: false },
    { nombre: "Hipotiroidismo", valor: false },
    { nombre: "Anticoagulada", valor: false }
  ];
  
  const condicionesMentales = [
    "Deterioro cognitivo severo",
    "Patología de base psiquiátrica no diagnosticada ni tratada en su juventud"
  ];
  
  const otrasPatologias = [
    "Cardiopatía isquémica con cirugía de revascularización miocárdica en 2019",
    "Cáncer colorectal estadío III en 2003 con tratamiento quirúrgico; secundarismo pulmonar derecho que se resecó",
    "Glaucoma",
    "Fractura de cadera izquierda en 2022 con intervención quirúrgica (osteosíntesis)",
    "Anemia",
    "Insuficiencia renal"
  ];
  
  const alergias = [
    { nombre: "Penicilina", severa: true }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Condiciones crónicas */}
      <Card className="overflow-hidden border-l-4 border-l-amber-500">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent pb-2">
          <CardTitle className="text-lg font-bold">Condiciones Crónicas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {condicionesCronicas.map((condicion, index) => (
              <li key={index} className="flex items-center">
                <span className="font-medium mr-2">¿{condicion.nombre}?</span>
                {condicion.valor ? 
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">SÍ</Badge> : 
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">NO</Badge>
                }
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Condiciones mentales/cognitivas */}
      <Card className="overflow-hidden border-l-4 border-l-orange-500">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent pb-2">
          <CardTitle className="text-lg font-bold">Cognitivo/Mental</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1">
            {condicionesMentales.map((condicion, index) => (
              <li key={index} className="text-gray-700">{condicion}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Otras patologías */}
      <Card className="overflow-hidden border-l-4 border-l-rose-500 md:col-span-2">
        <CardHeader className="bg-gradient-to-r from-rose-50 to-transparent pb-2">
          <CardTitle className="text-lg font-bold">Otras Patologías</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4">
            {otrasPatologias.map((patologia, index) => (
              <li key={index} className="text-gray-700">{patologia}</li>
            ))}
          </ul>
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
  );
};

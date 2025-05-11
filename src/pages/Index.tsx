
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, FileText, Plus } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-health-700 mb-2">Sistema de Historial Médico</h1>
              <p className="text-muted-foreground">
                Gestione eficientemente los historiales médicos de sus pacientes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-health-100 rounded-full flex items-center justify-center mb-4">
                  <User className="text-health-600" />
                </div>
                <h2 className="text-lg font-medium mb-2">Gestión de Pacientes</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Acceda a la lista completa de pacientes registrados en el sistema
                </p>
                <Button asChild className="mt-auto bg-health-600 hover:bg-health-700">
                  <Link to="/pacientes">Ver pacientes</Link>
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-health-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="text-health-600" />
                </div>
                <h2 className="text-lg font-medium mb-2">Nuevo Paciente</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Registre un nuevo paciente en el sistema
                </p>
                <Button asChild className="mt-auto bg-health-600 hover:bg-health-700">
                  <Link to="/pacientes/nuevo">Registrar paciente</Link>
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-health-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-health-600" />
                </div>
                <h2 className="text-lg font-medium mb-2">Historiales Médicos</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Consulte y actualice los historiales médicos de los pacientes
                </p>
                <Button asChild className="mt-auto bg-health-600 hover:bg-health-700">
                  <Link to="/pacientes">Ver historiales</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-medium mb-4">Acerca del sistema</h2>
              <div className="text-muted-foreground">
                <p className="mb-3">
                  Este sistema de historial médico permite al personal de la casa de salud:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ver la lista completa de pacientes</li>
                  <li>Acceder al perfil detallado de cada paciente</li>
                  <li>Consultar el historial médico completo</li>
                  <li>Añadir nuevos registros al historial</li>
                  <li>Gestionar la información básica de los pacientes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

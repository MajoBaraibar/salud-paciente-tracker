
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { pacientesMock } from "../data/mockData";
import { PacienteCard } from "@/components/PacienteCard";
import { Search } from "lucide-react";

const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar pacientes según el término de búsqueda
  const pacientesFiltrados = pacientesMock.filter(paciente => {
    const fullName = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchTermLower) || 
           paciente.numeroIdentificacion.includes(searchTermLower);
  });
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-health-700">Pacientes</h1>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o identificación..."
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {pacientesFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron pacientes con esa búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pacientesFiltrados.map(paciente => (
                  <PacienteCard key={paciente.id} paciente={paciente} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Pacientes;

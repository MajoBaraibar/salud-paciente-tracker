
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pacientesMock } from "../data/mockData";
import { PacienteCard } from "@/components/PacienteCard";
import { Search, Plus, Filter } from "lucide-react";

const Pacientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenero, setFilterGenero] = useState("todos");
  const [pacientesFiltrados, setPacientesFiltrados] = useState(pacientesMock);
  
  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("user");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);
  
  // Filtrar pacientes cuando cambian los criterios
  useEffect(() => {
    let filtered = pacientesMock;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(paciente => {
        const fullName = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
        return fullName.includes(searchTermLower) || 
              paciente.numeroIdentificacion.includes(searchTermLower);
      });
    }
    
    // Filtrar por género
    if (filterGenero !== "todos") {
      filtered = filtered.filter(paciente => 
        paciente.genero.toLowerCase() === filterGenero
      );
    }
    
    setPacientesFiltrados(filtered);
  }, [searchTerm, filterGenero]);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-health-700">Pacientes</h1>
              <Button 
                onClick={() => navigate("/pacientes/nuevo")} 
                className="bg-health-600 hover:bg-health-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo paciente
              </Button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Barra de búsqueda */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por nombre o identificación..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Filtro por género */}
                <div>
                  <Select value={filterGenero} onValueChange={setFilterGenero}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Filtrar por género" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los géneros</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {pacientesFiltrados.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground mb-4">No se encontraron pacientes con esos criterios</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterGenero("todos");
                  }}
                >
                  Limpiar filtros
                </Button>
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

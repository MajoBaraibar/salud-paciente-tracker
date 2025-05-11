
import { useState, useEffect } from "react";
import { Home, User, Search, Plus, MessageSquare, Bell, Calendar, ShoppingCart, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);
  
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="px-6 py-3 border-b">
        <h2 className="text-xl font-bold text-health-700">Salud Pacientes</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/dashboard" 
                    className={`flex items-center gap-3 ${location.pathname === "/dashboard" ? "text-health-700 font-medium" : ""}`}
                  >
                    <Home size={18} />
                    <span>Inicio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/pacientes" 
                    className={`flex items-center gap-3 ${location.pathname === "/pacientes" ? "text-health-700 font-medium" : ""}`}
                  >
                    <User size={18} />
                    <span>Pacientes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/calendario" 
                    className={`flex items-center gap-3 ${location.pathname === "/calendario" ? "text-health-700 font-medium" : ""}`}
                  >
                    <Calendar size={18} />
                    <span>Calendario</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/mensajes" 
                    className={`flex items-center gap-3 ${location.pathname === "/mensajes" ? "text-health-700 font-medium" : ""}`}
                  >
                    <MessageSquare size={18} />
                    <span>Mensajes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/anuncios" 
                    className={`flex items-center gap-3 ${location.pathname === "/anuncios" ? "text-health-700 font-medium" : ""}`}
                  >
                    <Bell size={18} />
                    <span>Tablón de Anuncios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Acciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/pacientes/nuevo" 
                    className={`flex items-center gap-3 ${location.pathname === "/pacientes/nuevo" ? "text-health-700 font-medium" : ""}`}
                  >
                    <Plus size={18} />
                    <span>Nuevo Paciente</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/requisiciones" 
                    className={`flex items-center gap-3 ${location.pathname === "/requisiciones" ? "text-health-700 font-medium" : ""}`}
                  >
                    <ShoppingCart size={18} />
                    <span>Requisiciones</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/buscar" 
                    className={`flex items-center gap-3 ${location.pathname === "/buscar" ? "text-health-700 font-medium" : ""}`}
                  >
                    <Search size={18} />
                    <span>Buscar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {currentUser?.role === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link 
                      to="/admin" 
                      className={`flex items-center gap-3 ${location.pathname === "/admin" ? "text-health-700 font-medium" : ""}`}
                    >
                      <Settings size={18} />
                      <span>Administración</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-6 py-3 border-t">
        <div className="text-xs text-muted-foreground">
          Casa de Salud &copy; 2025
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

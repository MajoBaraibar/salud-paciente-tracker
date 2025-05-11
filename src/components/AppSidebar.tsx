
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Package,
  Home,
} from "lucide-react";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock notification counts
  const notifications = {
    mensajes: 3,
    calendario: 1,
    anuncios: 2,
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex justify-center items-center h-16 border-b">
        <button 
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-health-700 flex items-center"
        >
          <span className="bg-health-100 text-health-700 p-1.5 rounded mr-2">HC</span>
          HealthCenter
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/dashboard"}
              onClick={() => navigate("/dashboard")}
            >
              <Home size={20} />
              <span>Inicio</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/pacientes" || location.pathname.includes("/pacientes/")}
              onClick={() => navigate("/pacientes")}
            >
              <Users size={20} />
              <span>Pacientes</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/calendario"}
              onClick={() => navigate("/calendario")}
            >
              <Calendar size={20} />
              <span>Calendario</span>
              {notifications.calendario > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.calendario}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/mensajes"}
              onClick={() => navigate("/mensajes")}
            >
              <MessageSquare size={20} />
              <span>Mensajes</span>
              {notifications.mensajes > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.mensajes}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/anuncios"}
              onClick={() => navigate("/anuncios")}
            >
              <FileText size={20} />
              <span>Tablón de anuncios</span>
              {notifications.anuncios > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.anuncios}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/requisiciones"}
              onClick={() => navigate("/requisiciones")}
            >
              <Package size={20} />
              <span>Requisiciones</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/admin"}
              onClick={() => navigate("/admin")}
            >
              <Settings size={20} />
              <span>Administración</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 text-xs text-muted-foreground text-center">
        v1.0 © 2025 HealthCenter
      </SidebarFooter>
    </Sidebar>
  );
};

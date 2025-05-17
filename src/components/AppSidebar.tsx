
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
  Package,
  Home,
  CreditCard,
  LogOut,
  Settings,
} from "lucide-react";
import { useNotificationStore } from "@/stores/notificationStore";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, totalUnread } = useNotificationStore();

  // Get notification counts by type
  const messageNotifications = notifications.filter(n => n.type === 'message' && !n.read).length;
  const calendarNotifications = notifications.filter(n => n.type === 'calendar' && !n.read).length;
  const announcementNotifications = notifications.filter(n => n.type === 'announcement' && !n.read).length;

  // Get current user role
  const currentUser = JSON.parse(localStorage.getItem("user") || '{"role":"medico"}');
  const userRole = currentUser.role;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex justify-center items-center h-16 border-b">
        <button 
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-health-700 flex items-center"
        >
          <span className="bg-health-100 text-health-700 p-1.5 rounded mr-2">ES</span>
          En Suma
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
          
          {(userRole === "admin" || userRole === "medico" || userRole === "enfermera") && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === "/pacientes" || location.pathname.includes("/pacientes/")}
                onClick={() => navigate("/pacientes")}
              >
                <Users size={20} />
                <span>Pacientes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/calendario"}
              onClick={() => navigate("/calendario")}
            >
              <Calendar size={20} />
              <span>Calendario</span>
              {calendarNotifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {calendarNotifications}
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
              {messageNotifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {messageNotifications}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {userRole !== "familiar" && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === "/anuncios"}
                onClick={() => navigate("/anuncios")}
              >
                <FileText size={20} />
                <span>Tablón de anuncios</span>
                {announcementNotifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {announcementNotifications}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {(userRole === "admin" || userRole === "medico" || userRole === "enfermera") && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === "/requisiciones"}
                onClick={() => navigate("/requisiciones")}
              >
                <Package size={20} />
                <span>Requisiciones</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {userRole === "admin" && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === "/admin"}
                onClick={() => navigate("/admin")}
              >
                <CreditCard size={20} />
                <span>Administración</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {userRole === "familiar" && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={location.pathname === "/pagos"}
                onClick={() => navigate("/pagos")}
              >
                <CreditCard size={20} />
                <span>Pagos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/configuracion"}
              onClick={() => navigate("/configuracion")}
            >
              <Settings size={20} />
              <span>Configuración</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Logout button - always visible for all users */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span>Salir</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 text-xs text-muted-foreground text-center">
        v1.0 © 2025 En Suma
      </SidebarFooter>
    </Sidebar>
  );
};


import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: string;
  type: 'message' | 'calendar' | 'announcement';
  read: boolean;
  date: string;
  title: string;
  content: string;
}

interface NotificationState {
  notifications: Notification[];
  totalUnread: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'date'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (type?: 'message' | 'calendar' | 'announcement') => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: (() => {
        // Obtener el rol del usuario del localStorage
        const currentUser = JSON.parse(localStorage.getItem("user") || '{"role":"admin"}');
        const userRole = currentUser.role;
        
        if (userRole === "admin" || userRole === "administrativo") {
          return [
            {
              id: '1',
              type: 'message' as const,
              read: false,
              date: new Date().toISOString(),
              title: 'Reporte mensual pendiente',
              content: 'El contador principal ha enviado el reporte de pagos para revisión'
            },
            {
              id: '2',
              type: 'calendar' as const,
              read: false,
              date: new Date().toISOString(),
              title: 'Reunión programada',
              content: 'Reunión de presupuesto trimestral mañana a las 10:00'
            },
            {
              id: '3',
              type: 'announcement' as const,
              read: false,
              date: new Date().toISOString(),
              title: 'Nuevas políticas',
              content: 'Se han actualizado las políticas de contratación y recursos humanos'
            },
            {
              id: '4',
              type: 'message' as const,
              read: false,
              date: new Date().toISOString(),
              title: 'Requisiciones pendientes',
              content: 'Hay 4 requisiciones de alta prioridad esperando aprobación'
            },
          ];
        } else if (userRole === "medico" || userRole === "enfermera") {
          return [
            {
              id: '1',
              type: 'message' as const,
              read: false,
              date: new Date().toISOString(),
              title: 'Consulta urgente',
              content: 'La enfermera solicita revisión del paciente en sala 3'
            },
            {
              id: '2',
              type: 'calendar' as const,
              read: false,
              date: new Date().toISOString(),
              title: 'Consulta programada',
              content: 'Consulta con María García en 30 minutos'
            },
            {
              id: '3',
              type: 'announcement' as const,
              read: false,
              date: new Date().toISOString(),
              title: 'Nuevo protocolo médico',
              content: 'Actualización en el protocolo de administración de medicamentos'
            },
          ];
        } else {
          return [
            {
              id: '1',
              type: 'message' as const,
              read: false,
              date: new Date().toISOString(),
              title: 'Actualización médica',
              content: 'El Dr. Martínez ha enviado el informe médico de Roberto'
            },
            {
              id: '2',
              type: 'calendar' as const,
              read: false,
              date: new Date().toISOString(),
              title: 'Horario de visita',
              content: 'Recordatorio: Visita programada mañana de 14:00 a 16:00'
            },
          ];
        }
      })(),
      totalUnread: (() => {
        const currentUser = JSON.parse(localStorage.getItem("user") || '{"role":"admin"}');
        const userRole = currentUser.role;
        return userRole === "admin" ? 4 : userRole === "familiar" ? 2 : 3;
      })(),
      
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString(),
          read: false,
          date: new Date().toISOString(),
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          totalUnread: state.totalUnread + 1,
        }));
      },
      
      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(notification => 
            notification.id === id || (notification.type === 'message' && id === '1') ? 
              { ...notification, read: true } : notification
          );
          
          // Recalculate unread count
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            totalUnread: unreadCount,
          };
        });
      },
      
      markAllAsRead: (type) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(notification => 
            type ? (notification.type === type ? { ...notification, read: true } : notification)
              : { ...notification, read: true }
          );
          
          // Recalculate unread count
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            totalUnread: unreadCount,
          };
        });
      },
      
      clearNotifications: () => {
        set({ notifications: [], totalUnread: 0 });
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);

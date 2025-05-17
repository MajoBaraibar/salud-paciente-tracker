
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
      notifications: [
        {
          id: '1',
          type: 'message',
          read: false,
          date: new Date().toISOString(),
          title: 'Nuevo mensaje',
          content: 'Tiene un nuevo mensaje del Dr. Martínez'
        },
        {
          id: '2',
          type: 'calendar',
          read: false,
          date: new Date().toISOString(),
          title: 'Cita programada',
          content: 'Recordatorio: Reunión con el equipo médico mañana a las 10:00'
        },
        {
          id: '3',
          type: 'announcement',
          read: false,
          date: new Date().toISOString(),
          title: 'Nuevo protocolo',
          content: 'Se ha actualizado el protocolo de administración de medicamentos'
        },
      ],
      totalUnread: 3,
      
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
            notification.id === id ? { ...notification, read: true } : notification
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

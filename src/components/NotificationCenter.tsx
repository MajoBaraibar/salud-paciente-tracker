import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Calendar, MessageSquare, Megaphone, CheckCircle, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/stores/notificationStore";

export const NotificationCenter = () => {
  const { notifications, totalUnread, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Ahora';
    if (diffMinutes < 60) return `Hace ${diffMinutes}m`;
    if (diffMinutes < 1440) return `Hace ${Math.floor(diffMinutes / 60)}h`;
    return date.toLocaleDateString('es-ES');
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {totalUnread > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalUnread > 99 ? '99+' : totalUnread}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notificaciones</SheetTitle>
            <div className="flex gap-2">
              {totalUnread > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  className="text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Marcar todas
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearNotifications}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium truncate ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-xs ${
                        notification.read ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(new Date(notification.date))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
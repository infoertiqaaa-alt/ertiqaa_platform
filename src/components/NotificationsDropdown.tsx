import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Calendar, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

interface Notification {
  id: string;
  type: 'reminder' | 'exam' | 'assignment' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  urgent?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'exam',
    title: 'امتحان الرياضيات',
    description: 'غداً الساعة 10:00 ص',
    time: 'منذ ساعة',
    read: false,
    urgent: true
  },
  {
    id: '2',
    type: 'assignment',
    title: 'واجب اللغة العربية',
    description: 'آخر موعد للتسليم بعد يومين',
    time: 'منذ 3 ساعات',
    read: false
  },
  {
    id: '3',
    type: 'reminder',
    title: 'محاضرة الفيزياء',
    description: 'اليوم الساعة 2:00 ظهراً',
    time: 'منذ 5 ساعات',
    read: true
  },
  {
    id: '4',
    type: 'system',
    title: 'تحديث المنصة',
    description: 'تم إضافة ميزات جديدة',
    time: 'أمس',
    read: true
  }
];

interface NotificationsDropdownProps {
  notificationCount: number;
}

export default function NotificationsDropdown({ notificationCount }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'exam':
        return <FileText className="w-4 h-4 text-warning" />;
      case 'assignment':
        return <Calendar className="w-4 h-4 text-primary" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-success" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>الإشعارات</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-6"
            >
              قراءة الكل
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">لا توجد إشعارات</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-4 cursor-pointer hover:bg-muted/50 ${
                !notification.read ? 'bg-muted/30' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-medium truncate ${
                      !notification.read ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {notification.title}
                    </h4>
                    {notification.urgent && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0">
                        عاجل
                      </Badge>
                    )}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                    {notification.description}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="p-3 text-center">
          <Button variant="ghost" size="sm" className="w-full text-primary">
            عرض جميع الإشعارات
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import { 
  BookOpen, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  LogOut, 
  Settings,
  Bell,
  Home,
  Shield,
  GraduationCap
} from "lucide-react";

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const navigationTabs = [
  {
    id: 'dashboard',
    label: 'الرئيسية',
    icon: Home
  },
  {
    id: 'subjects',
    label: 'المواد الدراسية',
    icon: BookOpen
  },
  {
    id: 'exams',
    label: 'الامتحانات',
    icon: FileText
  },
  {
    id: 'inquiries',
    label: 'الاستفسارات والحجز',
    icon: MessageCircle
  },
  {
    id: 'status',
    label: 'حالة الطالب',
    icon: BarChart3
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings
  }
];

export default function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const [notifications] = useState(3);
  const { toast } = useToast();
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleNotifications = () => {
    toast({
      title: "الإشعارات",
      description: "لديك 3 إشعارات جديدة",
    });
  };

  const handleSettings = () => {
    onTabChange('settings');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const quickLinks = [
    ...(userProfile?.role === 'admin' ? [{
      label: 'لوحة الادمن',
      path: '/admin',
      icon: Shield
    }] : []),
    ...(userProfile?.role === 'teacher' ? [{
      label: 'لوحة المعلم',
      path: '/teacher',
      icon: GraduationCap
    }] : []),
    ...(userProfile?.role === 'student' ? [{
      label: 'جميع الكورسات',
      path: '/all-courses',
      icon: BookOpen
    }] : [])
  ];
  
  return (
    <header className="bg-card shadow-medium border-b border-border/50 sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">منصة التعلم</h1>
              <p className="text-xs text-muted-foreground">نحو مستقبل أفضل</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-2">
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.path}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 transition-bounce"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
            
            <div className="w-px h-6 bg-border mx-2" />
            
            {navigationTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={currentTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="gap-2 transition-bounce"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <NotificationsDropdown notificationCount={notifications} />
            
            <Button variant="ghost" size="icon" onClick={handleSettings}>
              <Settings className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3 pr-4 border-r border-border/50">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt="الطالب" />
                <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-bold">
                  أح
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-foreground">{userProfile?.full_name || 'مستخدم'}</p>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.role === 'admin' ? 'مدير النظام' : 
                   userProfile?.role === 'teacher' ? `معلم ${userProfile.subject || ''}` : 
                   userProfile?.grade || 'طالب'}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden pb-4">
          <div className="flex overflow-x-auto gap-2 scrollbar-hide">
            {navigationTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={currentTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="gap-2 whitespace-nowrap flex-shrink-0"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
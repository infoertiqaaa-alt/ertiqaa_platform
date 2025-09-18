import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, MessageCircle, BarChart3, Video, Clock, Award, Calendar } from "lucide-react";

const dashboardSections = [
  {
    id: 'subjects',
    title: 'المواد الدراسية',
    description: 'تصفح جميع المواد والدروس المتاحة',
    icon: BookOpen,
    color: 'primary',
    stats: '12 مادة متاحة',
    href: '/subjects'
  },
  {
    id: 'exams',
    title: 'الامتحانات',
    description: 'الامتحانات المجدولة والنتائج',
    icon: FileText,
    color: 'secondary',
    stats: '3 امتحانات قادمة',
    href: '/exams'
  },
  {
    id: 'inquiries',
    title: 'الاستفسارات والحجز',
    description: 'اطرح أسئلتك واحجز المواعيد',
    icon: MessageCircle,
    color: 'success',
    stats: '2 استفسار جديد',
    href: '/inquiries'
  },
  {
    id: 'status',
    title: 'حالة الطالب',
    description: 'تتبع تقدمك وإنجازاتك',
    icon: BarChart3,
    color: 'warning',
    stats: '85% معدل الحضور',
    href: '/student-status'
  }
];

const quickStats = [
  {
    label: 'الدروس المكتملة',
    value: '24',
    icon: Video,
    color: 'success'
  },
  {
    label: 'الدروس المتبقية',
    value: '8',
    icon: Clock,
    color: 'warning'
  },
  {
    label: 'متوسط الدرجات',
    value: '92%',
    icon: Award,
    color: 'primary'
  },
  {
    label: 'الحضور الشهري',
    value: '96%',
    icon: Calendar,
    color: 'secondary'
  }
];

interface DashboardSectionsProps {
  onTabChange: (tab: string) => void;
}

export default function DashboardSections({ onTabChange }: DashboardSectionsProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getGradientClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'gradient-primary';
      case 'secondary':
        return 'gradient-secondary';
      case 'success':
        return 'gradient-success';
      case 'warning':
        return 'bg-gradient-to-r from-warning to-warning-light';
      default:
        return 'gradient-primary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="p-4 text-center shadow-soft">
            <div className={`inline-flex p-3 rounded-full mb-3 ${getColorClasses(stat.color)}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {dashboardSections.map((section) => (
          <Card key={section.id} className="section-card group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${getColorClasses(section.color)}`}>
                <section.icon className="w-8 h-8" />
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {section.stats}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
              {section.title}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {section.description}
            </p>
            
            <Button 
              className={`w-full ${getGradientClasses(section.color)} border-0 transition-bounce`}
              size="lg"
              onClick={() => onTabChange(section.id)}
            >
              {section.title === 'المواد الدراسية' ? 'تصفح المواد' :
               section.title === 'الامتحانات' ? 'عرض الامتحانات' :
               section.title === 'الاستفسارات والحجز' ? 'إرسال استفسار' :
               'عرض التفاصيل'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
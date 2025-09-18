import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, FileText, AlertCircle } from "lucide-react";

interface Reminder {
  id: number;
  type: 'lesson' | 'exam';
  title: string;
  subject: string;
  time: string;
  urgent?: boolean;
}

const todayReminders: Reminder[] = [
  {
    id: 1,
    type: 'lesson',
    title: 'درس الجبر المتقدم',
    subject: 'الرياضيات',
    time: '02:00 م'
  },
  {
    id: 2,
    type: 'exam',
    title: 'امتحان الفصل الثالث',
    subject: 'الفيزياء',
    time: '04:30 م',
    urgent: true
  },
  {
    id: 3,
    type: 'lesson',
    title: 'درس التفاضل والتكامل',
    subject: 'الرياضيات',
    time: '06:00 م'
  }
];

interface TodayRemindersProps {
  onTabChange: (tab: string) => void;
}

export default function TodayReminders({ onTabChange }: TodayRemindersProps) {
  return (
    <Card className="p-6 shadow-medium">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-warning/10 rounded-lg">
          <Clock className="w-6 h-6 text-warning" />
        </div>
        <h2 className="text-xl font-bold text-foreground">تذكيرات اليوم</h2>
      </div>

      <div className="space-y-4">
        {todayReminders.map((reminder) => (
          <div 
            key={reminder.id}
            className={`p-4 rounded-lg border transition-smooth hover:shadow-soft ${
              reminder.urgent 
                ? 'bg-destructive/5 border-destructive/20' 
                : 'bg-muted/30 border-border/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  reminder.type === 'exam' 
                    ? 'bg-destructive/10' 
                    : 'bg-primary/10'
                }`}>
                  {reminder.type === 'exam' ? (
                    <FileText className="w-5 h-5 text-destructive" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{reminder.title}</h3>
                    {reminder.urgent && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{reminder.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">الوقت: {reminder.time}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant={reminder.type === 'exam' ? 'destructive' : 'default'}
                className="text-xs"
                onClick={() => onTabChange(reminder.type === 'exam' ? 'exams' : 'subjects')}
              >
                {reminder.type === 'exam' ? 'ابدأ الامتحان' : 'ادخل للدرس'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => onTabChange('status')}
      >
        عرض جميع التذكيرات
      </Button>
    </Card>
  );
}
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Star } from "lucide-react";

interface TopStudent {
  id: number;
  name: string;
  image?: string;
  grade: string;
  achievement: string;
}

const topStudents: TopStudent[] = [
  {
    id: 1,
    name: "أحمد محمد علي",
    grade: "الصف الثالث الثانوي",
    achievement: "المركز الأول في الرياضيات"
  },
  {
    id: 2,
    name: "فاطمة حسن محمود",
    grade: "الصف الثاني الثانوي",
    achievement: "المركز الأول في الفيزياء"
  },
  {
    id: 3,
    name: "محمد عبد الله أحمد",
    grade: "الصف الأول الثانوي",
    achievement: "المركز الأول في الكيمياء"
  },
  {
    id: 4,
    name: "نور الهدى إبراهيم",
    grade: "الصف الثالث الثانوي",
    achievement: "المركز الأول في البيولوجي"
  }
];

export default function NewsMarquee() {
  return (
    <div className="w-full bg-gradient-success rounded-xl p-4 shadow-medium overflow-hidden">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-success-foreground" />
          <h3 className="text-lg font-bold text-success-foreground">الطلاب المتفوقون</h3>
        </div>
        <Star className="w-5 h-5 text-success-foreground animate-pulse" />
      </div>
      
      <div className="relative">
        <div className="news-ticker flex gap-8 whitespace-nowrap">
          {[...topStudents, ...topStudents].map((student, index) => (
            <div key={`${student.id}-${index}`} className="flex items-center gap-4 bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <Avatar className="w-12 h-12 border-2 border-white/30">
                <AvatarImage src={student.image} alt={student.name} />
                <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                  {student.name.split(' ')[0][0]}{student.name.split(' ')[1]?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <div className="text-foreground">
                <p className="font-bold text-sm">{student.name}</p>
                <p className="text-xs opacity-90">{student.grade}</p>
                <p className="text-xs font-medium">{student.achievement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
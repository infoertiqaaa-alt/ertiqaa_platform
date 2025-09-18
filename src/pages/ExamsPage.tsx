import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, GraduationCap, Trophy, Target, AlertCircle, CheckCircle2 } from "lucide-react";

const subjects = [
  { id: "math", name: "الرياضيات", color: "primary" },
  { id: "physics", name: "الفيزياء", color: "secondary" },
  { id: "chemistry", name: "الكيمياء", color: "success" },
  { id: "biology", name: "الأحياء", color: "warning" },
  { id: "arabic", name: "اللغة العربية", color: "primary" },
  { id: "english", name: "اللغة الإنجليزية", color: "secondary" },
];

const finalExams = {
  math: [
    {
      id: 1,
      title: "الامتحان النهائي - الجبر والهندسة",
      description: "امتحان شامل يغطي جميع موضوعات الجبر والهندسة التحليلية",
      duration: 180,
      questions: 50,
      difficulty: "صعب",
      level: "متقدم",
      maxScore: 100,
      passingScore: 60
    },
    {
      id: 2,
      title: "امتحان تحديد المستوى - التفاضل والتكامل",
      description: "امتحان لتحديد مستوى الطالب في التفاضل والتكامل",
      duration: 120,
      questions: 30,
      difficulty: "متوسط",
      level: "متوسط",
      maxScore: 100,
      passingScore: 50
    }
  ],
  physics: [
    {
      id: 3,
      title: "الامتحان النهائي - الميكانيكا والكهرباء",
      description: "امتحان شامل في الميكانيكا والكهرباء والمغناطيسية",
      duration: 150,
      questions: 40,
      difficulty: "صعب",
      level: "متقدم",
      maxScore: 100,
      passingScore: 65
    }
  ],
  chemistry: [
    {
      id: 4,
      title: "الامتحان النهائي - الكيمياء العضوية وغير العضوية",
      description: "امتحان شامل يغطي الكيمياء العضوية وغير العضوية",
      duration: 135,
      questions: 45,
      difficulty: "صعب",
      level: "متقدم",
      maxScore: 100,
      passingScore: 60
    }
  ]
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "سهل": return "success";
    case "متوسط": return "warning";
    case "صعب": return "destructive";
    default: return "secondary";
  }
};

const ExamsPage = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const getSubjectExams = () => {
    if (!selectedSubject) return [];
    return finalExams[selectedSubject as keyof typeof finalExams] || [];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">الامتحانات النهائية</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            اختبر مستواك في المواد المختلفة من خلال الامتحانات النهائية المصممة لتقييم فهمك الشامل
          </p>
        </div>

        {/* Subject Selection */}
        <Card className="p-6 shadow-medium">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">اختر المادة</h2>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="اختر المادة للامتحان..." />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Exams List */}
        {selectedSubject && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-warning" />
              <h2 className="text-2xl font-bold text-foreground">
                الامتحانات المتاحة - {subjects.find(s => s.id === selectedSubject)?.name}
              </h2>
            </div>

            {getSubjectExams().length > 0 ? (
              <div className="grid gap-6">
                {getSubjectExams().map((exam) => (
                  <Card key={exam.id} className="section-card">
                    <div className="space-y-6">
                      {/* Exam Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-foreground">{exam.title}</h3>
                            <Badge variant={getDifficultyColor(exam.difficulty) as any} className="px-3 py-1">
                              {exam.difficulty}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{exam.description}</p>
                        </div>
                        <Badge variant="outline" className="text-lg px-4 py-2 self-start">
                          مستوى {exam.level}
                        </Badge>
                      </div>

                      {/* Exam Details */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Clock className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">المدة</p>
                            <p className="font-bold text-foreground">{exam.duration} دقيقة</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-warning" />
                          <div>
                            <p className="text-sm text-muted-foreground">عدد الأسئلة</p>
                            <p className="font-bold text-foreground">{exam.questions} سؤال</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Trophy className="w-5 h-5 text-success" />
                          <div>
                            <p className="text-sm text-muted-foreground">النهاية العظمى</p>
                            <p className="font-bold text-foreground">{exam.maxScore} درجة</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          <div>
                            <p className="text-sm text-muted-foreground">درجة النجاح</p>
                            <p className="font-bold text-foreground">{exam.passingScore} درجة</p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar for passing score */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">درجة النجاح المطلوبة</span>
                          <span className="font-medium text-foreground">{exam.passingScore}%</span>
                        </div>
                        <Progress value={exam.passingScore} className="h-2" />
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full gradient-primary border-0 text-lg py-6"
                        size="lg"
                      >
                        ابدأ الامتحان الآن
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">لا توجد امتحانات متاحة</h3>
                <p className="text-muted-foreground">
                  الامتحانات لهذه المادة قيد التحضير وستكون متاحة قريباً
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Instructions when no subject selected */}
        {!selectedSubject && (
          <Card className="p-8 text-center">
            <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">اختر المادة لبدء الامتحان</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              قم باختيار المادة التي تريد امتحانها من القائمة أعلاه لعرض الامتحانات المتاحة
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
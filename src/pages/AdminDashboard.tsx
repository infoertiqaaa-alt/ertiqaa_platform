import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  BookOpen, 
  BarChart3,
  TrendingUp,
  DollarSign,
  Star,
  Edit,
  Trash2,
  Plus,
  Crown,
  Award,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTeachers } from "@/hooks/useTeachers";
import { useTopStudents } from "@/hooks/useTopStudents";
import { AddTeacherDialog } from "@/components/dialogs/AddTeacherDialog";
import { AddTopStudentDialog } from "@/components/dialogs/AddTopStudentDialog";
import { supabase } from "@/integrations/supabase/client";

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  students: number;
  rating: number;
  status: 'active' | 'inactive';
}

interface TopStudent {
  id: string;
  name: string;
  image: string;
  grade: string;
  achievement: string;
  score: number;
}

interface Subscription {
  id: string;
  studentName: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
}

interface SubjectStats {
  subject: string;
  studentsCount: number;
  teacher: string;
  completion: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);
  const [addTopStudentOpen, setAddTopStudentOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { teachers, fetchTeachers, deleteTeacher } = useTeachers();
  const { topStudents, fetchTopStudents, deleteTopStudent } = useTopStudents();

  useEffect(() => {
    fetchTeachers();
    fetchTopStudents();
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          users!subscriptions_student_id_fkey (
            full_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedSubs: Subscription[] = data?.map(sub => ({
        id: sub.id,
        studentName: sub.users?.full_name || 'غير محدد',
        plan: sub.plan,
        status: sub.status,
        startDate: new Date(sub.start_date).toLocaleDateString('ar-EG'),
        endDate: sub.end_date ? new Date(sub.end_date).toLocaleDateString('ar-EG') : 'غير محدد',
        amount: sub.amount
      })) || [];
      
      setSubscriptions(formattedSubs);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-teacher':
        setAddTeacherOpen(true);
        break;
      case 'add-top-student':
        setAddTopStudentOpen(true);
        break;
      case 'reports':
        alert('تقارير مفصلة - سيتم تطوير هذه الميزة قريباً');
        break;
      case 'add-subject':
        alert('إضافة مادة جديدة - سيتم تطوير هذه الميزة قريباً');
        break;
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المدرس؟ سيتم حذف جميع المواد التعليمية المرتبطة به.')) {
      await deleteTeacher(teacherId);
    }
  };

  const handleDeleteTopStudent = async (studentId: string) => {
    if (confirm('هل أنت متأكد من إزالة هذا الطالب من قائمة المتفوقين؟')) {
      await deleteTopStudent(studentId);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Mock data for stats - in real app, this would come from database
  const stats = {
    totalStudents: 1247,
    totalTeachers: teachers.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    monthlyRevenue: subscriptions.reduce((total, sub) => total + (sub.status === 'active' ? sub.amount : 0), 0)
  };

  const subjectStats: SubjectStats[] = [
    { subject: "الرياضيات", studentsCount: 156, teacher: "د. أحمد محمد", completion: 78 },
    { subject: "الفيزياء", studentsCount: 134, teacher: "د. فاطمة علي", completion: 82 },
    { subject: "الكيمياء", studentsCount: 98, teacher: "د. محمد حسن", completion: 65 },
    { subject: "اللغة العربية", studentsCount: 145, teacher: "د. سارة أحمد", completion: 88 },
    { subject: "اللغة الإنجليزية", studentsCount: 167, teacher: "د. يوسف محمد", completion: 71 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة تحكم المدير</h1>
            <p className="text-muted-foreground">إدارة المنصة التعليمية</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 ml-2" />
              الإعدادات
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلاب</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">عدد المدرسين</p>
                  <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                </div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الاشتراكات النشطة</p>
                  <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الإيرادات الشهرية</p>
                  <p className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()} جنيه</p>
                </div>
                <DollarSign className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="teachers">المدرسين</TabsTrigger>
            <TabsTrigger value="top-students">الطلاب المتفوقون</TabsTrigger>
            <TabsTrigger value="subscriptions">الاشتراكات</TabsTrigger>
            <TabsTrigger value="subjects">المواد الدراسية</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>الإجراءات السريعة</CardTitle>
                  <CardDescription>إضافة وإدارة عناصر المنصة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleQuickAction('add-teacher')}>
                      <UserPlus className="w-6 h-6" />
                      إضافة مدرس جديد
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleQuickAction('add-top-student')}>
                      <Star className="w-6 h-6" />
                      تحديث المتفوقين
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleQuickAction('reports')}>
                      <BarChart3 className="w-6 h-6" />
                      تقارير مفصلة
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleQuickAction('add-subject')}>
                      <BookOpen className="w-6 h-6" />
                      إضافة مادة جديدة
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>آخر الأنشطة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <UserPlus className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">مدرس جديد انضم</p>
                        <p className="text-xs text-muted-foreground">د. سارة أحمد - اللغة العربية</p>
                      </div>
                      <span className="text-xs text-muted-foreground">منذ ساعة</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">اشتراك جديد</p>
                        <p className="text-xs text-muted-foreground">باقة Premium</p>
                      </div>
                      <span className="text-xs text-muted-foreground">منذ 3 ساعات</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة المدرسين</h2>
              <Button onClick={() => setAddTeacherOpen(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة مدرس جديد
              </Button>
            </div>

            <div className="grid gap-4">
              {teachers.map((teacher) => (
                <Card key={teacher.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={teacher.avatar_url} />
                          <AvatarFallback>{teacher.full_name.split(' ')[1]?.[0] || teacher.full_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{teacher.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{teacher.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge>{teacher.subject || 'غير محدد'}</Badge>
                            <span className="text-sm text-muted-foreground">{teacher.phone || 'لا يوجد هاتف'}</span>
                          </div>
                          {teacher.cover_image_url && (
                            <Badge variant="secondary" className="mt-1">
                              يحتوي على غلاف
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="default">نشط</Badge>
                        <Button variant="ghost" size="icon" onClick={() => alert('تحرير المدرس - سيتم تطويرها قريباً')}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTeacher(teacher.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="top-students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة الطلاب المتفوقون</h2>
              <Button onClick={() => setAddTopStudentOpen(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة طالب متفوق
              </Button>
            </div>

            <div className="grid gap-4">
              {topStudents.map((student, index) => (
                <Card key={student.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={student.image_url} />
                            <AvatarFallback>{student.student_name?.split(' ').map(n => n[0]).join('') || 'ط'}</AvatarFallback>
                          </Avatar>
                          {index < 3 && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                              {index === 0 && <Crown className="w-3 h-3 text-white" />}
                              {index === 1 && <Award className="w-3 h-3 text-white" />}
                              {index === 2 && <Star className="w-3 h-3 text-white" />}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{student.student_name || 'غير محدد'}</h3>
                          <p className="text-sm text-muted-foreground">{student.grade || 'غير محدد'}</p>
                          <p className="text-sm text-primary font-medium">{student.achievement}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="text-2xl font-bold text-success">{student.score}%</p>
                          <p className="text-xs text-muted-foreground">النتيجة</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => alert('تحرير الطالب - سيتم تطويرها قريباً')}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteTopStudent(student.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إدارة الاشتراكات</h2>
            </div>

            <div className="grid gap-4">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{subscription.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{subscription.studentName}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant={subscription.plan === 'vip' ? 'default' : subscription.plan === 'premium' ? 'secondary' : 'outline'}>
                              {subscription.plan === 'vip' ? 'VIP' : subscription.plan === 'premium' ? 'Premium' : 'Basic'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {subscription.startDate} - {subscription.endDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="text-lg font-bold">{subscription.amount} جنيه</p>
                          <Badge variant={subscription.status === 'active' ? 'default' : subscription.status === 'expired' ? 'destructive' : 'secondary'}>
                            {subscription.status === 'active' ? 'نشط' : subscription.status === 'expired' ? 'منتهي' : 'معلق'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">إحصائيات المواد الدراسية</h2>
            </div>

            <div className="grid gap-4">
              {subjectStats.map((subject, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{subject.subject}</h3>
                          <p className="text-sm text-muted-foreground">مدرس المادة: {subject.teacher}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{subject.studentsCount}</p>
                          <p className="text-xs text-muted-foreground">عدد الطلاب</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success">{subject.completion}%</p>
                          <p className="text-xs text-muted-foreground">معدل الإنجاز</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <AddTeacherDialog 
          open={addTeacherOpen} 
          onOpenChange={setAddTeacherOpen}
        />
        
        <AddTopStudentDialog 
          open={addTopStudentOpen} 
          onOpenChange={setAddTopStudentOpen}
        />
      </div>
    </div>
  );
}
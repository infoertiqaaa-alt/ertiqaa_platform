import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { TeacherCourseDetailDialog } from "@/components/dialogs/TeacherCourseDetailDialog";
import { 
  BookOpen, 
  Search, 
  Star, 
  Clock, 
  Users, 
  ArrowLeft,
  CreditCard,
  User
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
  description: string;
  price: number;
  teacher_id: string;
  is_active: boolean;
  created_at: string;
}

interface Teacher {
  id: string;
  full_name: string;
  avatar_url?: string;
  cover_image_url?: string;
  phone?: string;
  email: string;
  subject?: string;
}

interface CourseWithTeacher extends Subject {
  teacher: Teacher;
  enrollment_count?: number;
}

const AllCoursesPage = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<CourseWithTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithTeacher | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch subjects with teachers
      const { data: subjects, error: subjectsError } = await supabase
        .from('subjects')
        .select(`
          *,
          teacher:users!subjects_teacher_id_fkey (
            id,
            full_name,
            avatar_url,
            cover_image_url,
            phone,
            email,
            subject
          )
        `)
        .eq('is_active', true);

      if (subjectsError) throw subjectsError;

      // Fetch user's enrollments if they're a student
      if (user && userProfile?.role === 'student') {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('subject_id')
          .eq('student_id', user.id)
          .eq('is_active', true);
        
        setEnrolledCourses(enrollments?.map(e => e.subject_id) || []);
      }

      setCourses(subjects || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الكورسات",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const handleEnrollment = async (courseId: string, price: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If it's a free course, enroll directly
    if (price === 0) {
      try {
        const { error } = await supabase
          .from('enrollments')
          .insert({
            student_id: user.id,
            subject_id: courseId,
            enrollment_date: new Date().toISOString(),
            progress: 0,
            is_active: true
          });

        if (error) throw error;

        toast({
          title: "تم التسجيل بنجاح",
          description: "تم تسجيلك في الكورس المجاني بنجاح",
        });

        setEnrolledCourses(prev => [...prev, courseId]);
      } catch (error: any) {
        toast({
          title: "خطأ في التسجيل",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Redirect to payment page for paid courses
      navigate(`/payment?courseId=${courseId}&price=${price}`);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-10 w-full max-w-md mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للصفحة الرئيسية
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-primary-foreground">جميع الكورسات</h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              اكتشف مجموعة واسعة من الكورسات التعليمية المصممة خصيصاً لمساعدتك على تحقيق أهدافك الأكاديمية
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Latest News Bar */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">📢 آخر الأخبار</h3>
                  <div className="news-ticker">
                    <p className="text-white/90">
                      تم إضافة كورس جديد للرياضيات المتقدمة • كورس الفيزياء الحديثة متاح الآن • انضم إلى كورس الكيمياء العضوية • دورة جديدة في اللغة الإنجليزية
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Promotional Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-primary text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="p-8 relative z-10">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">🎉 عروض خاصة على الكورسات الجديدة!</h2>
                <p className="text-white/90 text-lg mb-6">
                  احصل على خصم 30% على جميع الكورسات الجديدة لفترة محدودة
                </p>
                <Badge className="bg-yellow-500 text-black text-lg px-4 py-2">
                  ⏰ العرض ينتهي خلال 7 أيام
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Teachers with Covers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">🌟 المدرسين المميزين</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {courses.filter(course => course.teacher.cover_image_url).slice(0, 3).map((course) => (
              <Card 
                key={course.teacher.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedCourse(course);
                  setDetailDialogOpen(true);
                }}
              >
                <div className="aspect-video relative overflow-hidden group">
                  <img
                    src={course.teacher.cover_image_url}
                    alt={`غلاف ${course.teacher.full_name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{course.teacher.full_name}</h3>
                    <p className="text-white/80 text-sm">{course.name}</p>
                    <Badge className="bg-primary/80 text-white mt-2">مدرس معتمد</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="ابحث عن كورس أو معلم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">جميع الكورسات المتاحة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourses.includes(course.id);
              const isFree = course.price === 0;
              
              return (
                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-primary/20">
                  {/* Course Image */}
                  <div className="aspect-video bg-gradient-subtle relative">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute top-3 right-3">
                      {isFree ? (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold">مجاني</Badge>
                      ) : (
                        <Badge className="bg-primary hover:bg-primary/80 text-white font-bold">{course.price} جنيه</Badge>
                      )}
                    </div>
                    {isEnrolled && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                          ✅ مسجل
                        </Badge>
                      </div>
                    )}
                    {/* Special offer badge */}
                    {!isEnrolled && !isFree && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-yellow-400 text-black text-xs font-bold py-1 px-2 rounded-full text-center animate-pulse">
                          🔥 خصم 30% - عرض محدود!
                        </div>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-1 font-bold">{course.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{course.teacher.full_name}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollment_count || 0} طالب</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8</span>
                      </div>
                    </div>

                    {isEnrolled ? (
                      <Link to="/">
                        <Button className="w-full" variant="outline" size="lg">
                          <BookOpen className="w-4 h-4 ml-2" />
                          انتقل إلى الكورس
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        className="w-full gap-2 font-bold text-base" 
                        onClick={() => handleEnrollment(course.id, course.price)}
                        size="lg"
                      >
                        {isFree ? (
                          <>
                            <BookOpen className="w-4 h-4" />
                            اشترك مجاناً
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            اشترك الآن - {Math.round(course.price * 0.7)} جنيه
                            <span className="line-through text-xs opacity-70 ml-1">
                              {course.price}
                            </span>
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">لا توجد كورسات متاحة</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "لم نجد كورسات تطابق البحث" : "لم يتم إضافة أي كورسات بعد"}
            </p>
          </div>
        )}
      </div>

      {/* Teacher Course Detail Dialog */}
      <TeacherCourseDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        course={selectedCourse}
        isEnrolled={selectedCourse ? enrolledCourses.includes(selectedCourse.id) : false}
      />
    </div>
  );
};

export default AllCoursesPage;
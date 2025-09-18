import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  CreditCard,
  Shield,
  CheckCircle,
  BookOpen,
  User,
  Clock
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  description: string;
  price: number;
  teacher: {
    full_name: string;
    avatar_url?: string;
  };
}

const PaymentPage = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const courseId = searchParams.get('courseId');
  const price = searchParams.get('price');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        navigate('/all-courses');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subjects')
          .select(`
            *,
            teacher:users!subjects_teacher_id_fkey (
              full_name,
              avatar_url
            )
          `)
          .eq('id', courseId)
          .single();

        if (error) throw error;
        setCourse(data);
      } catch (error: any) {
        toast({
          title: "خطأ في تحميل بيانات الكورس",
          description: error.message,
          variant: "destructive",
        });
        navigate('/all-courses');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, navigate, toast]);

  const handlePayment = async () => {
    if (!user || !course) return;

    setProcessing(true);
    try {
      // Simulate payment processing (replace with real payment integration)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create enrollment record
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          subject_id: course.id,
          enrollment_date: new Date().toISOString(),
          progress: 0,
          is_active: true
        });

      if (enrollmentError) throw enrollmentError;

      // Create subscription record
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          student_id: user.id,
          plan: course.name,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          amount: Math.round(course.price * 0.7), // Apply 30% discount
          stripe_subscription_id: `sim_${Date.now()}` // Simulated ID
        });

      if (subscriptionError) throw subscriptionError;

      toast({
        title: "تم الدفع بنجاح! 🎉",
        description: `تم تسجيلك في كورس ${course.name} بنجاح`,
      });

      // Redirect to student dashboard
      setTimeout(() => {
        navigate('/student');
      }, 1500);

    } catch (error: any) {
      toast({
        title: "فشل في عملية الدفع",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">الكورس غير موجود</h3>
            <p className="text-muted-foreground mb-4">لم نتمكن من العثور على الكورس المطلوب</p>
            <Link to="/all-courses">
              <Button>العودة للكورسات</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/all-courses">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للكورسات
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">إتمام عملية الدفع</h1>
            <p className="text-white/80">أكمل عملية الدفع للاشتراك في الكورس</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                تفاصيل الكورس
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gradient-subtle rounded-lg flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <User className="w-4 h-4" />
                  <span>المعلم: {course.teacher.full_name}</span>
                </div>
                {course.description && (
                  <p className="text-muted-foreground">{course.description}</p>
                )}
              </div>

               <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>السعر الأصلي:</span>
                    <span className="line-through text-muted-foreground">{course.price} جنيه</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الخصم (30%):</span>
                    <span className="text-green-600">-{Math.round(course.price * 0.3)} جنيه</span>
                  </div>
                  <div className="flex items-center justify-between text-lg border-t pt-2">
                    <span className="font-semibold">إجمالي المبلغ:</span>
                    <Badge className="text-lg px-3 py-1">
                      {Math.round(course.price * 0.7)} جنيه
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      🎉 توفر {Math.round(course.price * 0.3)} جنيه!
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>وصول مدى الحياة للكورس</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>دعم فني متاح 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>شهادة إتمام معتمدة</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                طريقة الدفع
              </CardTitle>
              <CardDescription>
                اختر طريقة الدفع المناسبة لك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">بيانات الطالب</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">الاسم:</span> {userProfile?.full_name}</p>
                  <p><span className="font-medium">البريد الإلكتروني:</span> {user?.email}</p>
                  <p><span className="font-medium">المرحلة الدراسية:</span> {userProfile?.grade}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h4 className="font-semibold">طريقة الدفع</h4>
                <div className="border rounded-lg p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">دفع آمن عبر الإنترنت</p>
                      <p className="text-sm text-muted-foreground">فيزا، ماستركارد، أو محافظ إلكترونية</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>معاملة آمنة ومشفرة</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="space-y-4">
                <Button 
                  className="w-full h-12 text-lg gap-3" 
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    ادفع {Math.round(course.price * 0.7)} جنيه
                  </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  بالنقر على "ادفع" أنت توافق على 
                  <Link to="/terms" className="text-primary hover:underline mx-1">
                    الشروط والأحكام
                  </Link>
                  و
                  <Link to="/privacy" className="text-primary hover:underline mx-1">
                    سياسة الخصوصية
                  </Link>
                </p>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-800 text-sm">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">دفع آمن 100%</span>
                </div>
                <p className="text-green-700 text-xs mt-1">
                  جميع المعاملات محمية بتشفير SSL متقدم
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
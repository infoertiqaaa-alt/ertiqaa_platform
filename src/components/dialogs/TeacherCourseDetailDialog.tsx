import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Star, 
  Users, 
  Clock, 
  CreditCard,
  User,
  Phone,
  Mail,
  GraduationCap
} from "lucide-react";

interface CourseWithTeacher {
  id: string;
  name: string;
  description: string;
  price: number;
  teacher: {
    id: string;
    full_name: string;
    avatar_url?: string;
    cover_image_url?: string;
    phone?: string;
    email: string;
    subject?: string;
  };
  enrollment_count?: number;
}

interface TeacherCourseDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: CourseWithTeacher | null;
  isEnrolled?: boolean;
}

export function TeacherCourseDetailDialog({ 
  open, 
  onOpenChange, 
  course,
  isEnrolled = false
}: TeacherCourseDetailDialogProps) {
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!course) return null;

  const handleEnrollment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (course.price === 0) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('enrollments')
          .insert({
            student_id: user.id,
            subject_id: course.id,
            enrollment_date: new Date().toISOString(),
            progress: 0,
            is_active: true
          });

        if (error) throw error;

        toast({
          title: "تم التسجيل بنجاح",
          description: "تم تسجيلك في الكورس المجاني بنجاح",
        });

        onOpenChange(false);
      } catch (error: any) {
        toast({
          title: "خطأ في التسجيل",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      navigate(`/payment?courseId=${course.id}&price=${course.price}`);
    }
  };

  const isFree = course.price === 0;
  const discountedPrice = Math.round(course.price * 0.7);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">تفاصيل الكورس</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Teacher Cover Image */}
          {course.teacher.cover_image_url && (
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src={course.teacher.cover_image_url}
                alt={`غلاف ${course.teacher.full_name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
                <p className="text-white/80">مع {course.teacher.full_name}</p>
              </div>
            </div>
          )}

          {/* Course Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={course.teacher.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {course.teacher.full_name.split(' ')[1]?.[0] || course.teacher.full_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{course.name}</h3>
                  <p className="text-muted-foreground mb-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollment_count || 0} طالب</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>متاح دائماً</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                {isFree ? (
                  <Badge className="bg-green-500 text-white text-lg px-4 py-2">مجاني</Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{discountedPrice} جنيه</span>
                    <span className="line-through text-muted-foreground">{course.price} جنيه</span>
                    <Badge className="bg-red-500 text-white">خصم 30%</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Teacher Info */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                معلومات المدرس
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم</p>
                    <p className="font-medium">{course.teacher.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">التخصص</p>
                    <p className="font-medium">{course.teacher.subject || 'غير محدد'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium">{course.teacher.email}</p>
                  </div>
                </div>
                {course.teacher.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">الهاتف</p>
                      <p className="font-medium">{course.teacher.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Action */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              إغلاق
            </Button>
            {!isEnrolled && (
              <Button 
                onClick={handleEnrollment}
                disabled={loading}
                className="flex-1 gap-2"
              >
                {isFree ? (
                  <>
                    <BookOpen className="w-4 h-4" />
                    اشترك مجاناً
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    اشترك الآن - {discountedPrice} جنيه
                  </>
                )}
              </Button>
            )}
            {isEnrolled && (
              <Button variant="secondary" className="flex-1" onClick={() => navigate('/')}>
                <BookOpen className="w-4 h-4 ml-2" />
                انتقل إلى الكورس
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
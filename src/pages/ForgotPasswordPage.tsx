import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Mail,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "بريد إلكتروني غير صالح",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-strong border-0 text-center">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">تم إرسال البريد الإلكتروني</h2>
              <p className="text-muted-foreground mb-6">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى:
                <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  اتبع التعليمات في البريد الإلكتروني لإعادة تعيين كلمة المرور
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => setEmailSent(false)}
                  className="w-full"
                >
                  إرسال مرة أخرى
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    العودة لتسجيل الدخول
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">نسيت كلمة المرور؟</h1>
          <p className="text-white/80">لا تقلق، سنساعدك في استعادة حسابك</p>
        </div>

        <Card className="shadow-strong border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
            <CardDescription>
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ahmed@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-3 pr-10"
                />
              </div>
            </div>

            <Button 
              onClick={handleResetPassword} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  جاري الإرسال...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  إرسال رابط إعادة التعيين
                </div>
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                تذكرت كلمة المرور؟
              </p>
              <Link to="/login">
                <Button variant="ghost" className="text-primary font-medium">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  العودة لتسجيل الدخول
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
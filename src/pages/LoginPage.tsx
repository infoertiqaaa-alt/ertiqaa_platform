import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  LogIn
} from "lucide-react";

export default function LoginPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, user, userProfile } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && userProfile) {
      console.log('User already logged in, redirecting...', userProfile.role);
      if (userProfile.role === 'admin') {
        navigate('/admin');
      } else if (userProfile.role === 'teacher') {
        navigate('/teacher');
      } else if (userProfile.role === 'student') {
        navigate('/student');
      } else {
        navigate('/');
      }
    }
  }, [user, userProfile, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await signIn(email, password);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في المنصة",
      });

      // The redirect will happen automatically via useEffect when userProfile loads
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">منصة التعلم</h1>
          <p className="text-white/80">نحو مستقبل أفضل</p>
        </div>

        <Card className="shadow-strong border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <CardDescription>
              أدخل بياناتك لتسجيل الدخول إلى المنصة
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmed@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-3 pr-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember" className="text-sm">
                  تذكرني
                </Label>
              </div>

              <Button 
                onClick={handleLogin} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    تسجيل الدخول
                  </div>
                )}
              </Button>

              <div className="text-center space-y-2">
                <Link to="/forgot-password">
                  <Button variant="link" className="text-sm text-primary">
                    نسيت كلمة المرور؟
                  </Button>
                </Link>
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    ليس لديك حساب؟{" "}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                      إنشاء حساب جديد
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
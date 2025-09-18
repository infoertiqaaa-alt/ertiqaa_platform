import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  phone?: string;
  grade?: string;
  subject?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في المنصة",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'student' | 'teacher' = 'student', additionalData?: { grade?: string; subject?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            grade: additionalData?.grade,
            subject: additionalData?.subject,
          });

        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى تفعيل حسابك من خلال الرابط المرسل لبريدك الإلكتروني",
        });
      }

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نراك قريباً",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "تحقق من بريدك الإلكتروني",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "خطأ في إرسال رابط إعادة التعيين",
        description: error.message || "حدث خطأ غير متوقع",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Teacher {
  id: string;
  email: string;
  full_name: string;
  subject?: string;
  phone?: string;
  avatar_url?: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTeachers(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل المدرسين",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTeacher = async (teacherData: {
    email: string;
    password: string;
    full_name: string;
    subject: string;
    phone?: string;
  }) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: teacherData.email,
        password: teacherData.password,
      });

      if (authError) throw authError;

      // Create user profile
      if (authData.user) {
        const { data, error } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: teacherData.email,
            full_name: teacherData.full_name,
            role: 'teacher',
            subject: teacherData.subject,
            phone: teacherData.phone,
          })
          .select()
          .single();

        if (error) throw error;

        // Create subject if it doesn't exist
        await supabase
          .from('subjects')
          .upsert({
            name: teacherData.subject,
            teacher_id: authData.user.id,
            is_active: true,
          });

        setTeachers(prev => [data, ...prev]);
        toast({
          title: "تم إضافة المدرس بنجاح",
          description: `تم إنشاء حساب ${teacherData.full_name} وإضافة مادة ${teacherData.subject}`,
        });
        return data;
      }
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة المدرس",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTeachers(prev => prev.map(t => t.id === id ? data : t));
      toast({
        title: "تم تحديث بيانات المدرس",
        description: "تم حفظ التغييرات بنجاح",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث البيانات",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTeachers(prev => prev.filter(t => t.id !== id));
      toast({
        title: "تم حذف المدرس",
        description: "تم إزالة المدرس من المنصة",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف المدرس",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    teachers,
    loading,
    fetchTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
  };
};
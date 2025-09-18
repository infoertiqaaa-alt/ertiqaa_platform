import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TopStudent {
  id: string;
  student_id: string;
  achievement: string;
  score: number;
  image_url?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields from users table
  student_name?: string;
  student_email?: string;
  grade?: string;
}

export const useTopStudents = () => {
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTopStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('top_students')
        .select(`
          *,
          users!top_students_student_id_fkey (
            full_name,
            email,
            grade
          )
        `)
        .order('score', { ascending: false });
      
      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        student_name: item.users?.full_name,
        student_email: item.users?.email,
        grade: item.users?.grade,
      })) || [];
      
      setTopStudents(formattedData);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الطلاب المتفوقين",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTopStudent = async (studentData: {
    student_id: string;
    achievement: string;
    score: number;
    image_url?: string;
    is_featured?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('top_students')
        .insert(studentData)
        .select(`
          *,
          users!top_students_student_id_fkey (
            full_name,
            email,
            grade
          )
        `)
        .single();

      if (error) throw error;

      const formattedData = {
        ...data,
        student_name: data.users?.full_name,
        student_email: data.users?.email,
        grade: data.users?.grade,
      };

      setTopStudents(prev => [formattedData, ...prev].sort((a, b) => b.score - a.score));
      toast({
        title: "تم إضافة الطالب المتفوق",
        description: "تم إضافة الطالب لقائمة المتفوقين بنجاح",
      });
      return formattedData;
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة الطالب",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTopStudent = async (id: string, updates: Partial<TopStudent>) => {
    try {
      const { data, error } = await supabase
        .from('top_students')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          users!top_students_student_id_fkey (
            full_name,
            email,
            grade
          )
        `)
        .single();

      if (error) throw error;

      const formattedData = {
        ...data,
        student_name: data.users?.full_name,
        student_email: data.users?.email,
        grade: data.users?.grade,
      };

      setTopStudents(prev => prev.map(s => s.id === id ? formattedData : s).sort((a, b) => b.score - a.score));
      toast({
        title: "تم تحديث بيانات الطالب",
        description: "تم حفظ التغييرات بنجاح",
      });
      return formattedData;
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث البيانات",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTopStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('top_students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTopStudents(prev => prev.filter(s => s.id !== id));
      toast({
        title: "تم حذف الطالب",
        description: "تم إزالة الطالب من قائمة المتفوقين",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف الطالب",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    topStudents,
    loading,
    fetchTopStudents,
    addTopStudent,
    updateTopStudent,
    deleteTopStudent,
  };
};
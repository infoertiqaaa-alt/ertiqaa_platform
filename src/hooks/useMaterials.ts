import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: string;
  file_url?: string;
  subject_id: string;
  teacher_id: string;
  views: number;
  file_size?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMaterials = async (teacherId?: string) => {
    setLoading(true);
    try {
      let query = supabase.from('materials').select('*');
      
      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل المواد",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = async (material: Omit<Material, 'id' | 'views' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .insert({
          ...material,
          views: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setMaterials(prev => [data, ...prev]);
      toast({
        title: "تم إضافة المادة بنجاح",
        description: "تم رفع المادة التعليمية الجديدة",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة المادة",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMaterial = async (id: string, updates: Partial<Material>) => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMaterials(prev => prev.map(m => m.id === id ? data : m));
      toast({
        title: "تم تحديث المادة بنجاح",
        description: "تم حفظ التغييرات",
      });
      return data;
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث المادة",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMaterials(prev => prev.filter(m => m.id !== id));
      toast({
        title: "تم حذف المادة بنجاح",
        description: "تم إزالة المادة من المنصة",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف المادة",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const { error } = await supabase
        .from('materials')
        .update({ views: materials.find(m => m.id === id)?.views + 1 })
        .eq('id', id);

      if (error) throw error;

      setMaterials(prev => prev.map(m => 
        m.id === id ? { ...m, views: m.views + 1 } : m
      ));
    } catch (error: any) {
      console.error('Error incrementing views:', error);
    }
  };

  return {
    materials,
    loading,
    fetchMaterials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    incrementViews,
  };
};
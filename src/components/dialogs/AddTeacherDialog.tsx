import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useTeachers } from '@/hooks/useTeachers';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTeacherDialog({ open, onOpenChange }: AddTeacherDialogProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { addTeacher } = useTeachers();
  const { toast } = useToast();

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadCoverImage = async (teacherId: string): Promise<string | null> => {
    if (!coverImage) return null;

    try {
      const fileExt = coverImage.name.split('.').pop();
      const fileName = `${teacherId}-cover.${fileExt}`;
      const filePath = `${teacherId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('teacher-covers')
        .upload(filePath, coverImage, { 
          upsert: true,
          contentType: coverImage.type 
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('teacher-covers')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "حدث خطأ أثناء رفع صورة الغلاف",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !subject) return;

    setLoading(true);
    try {
      // Create the teacher first
      const newTeacher = await addTeacher({
        full_name: fullName,
        email,
        password,
        subject,
        phone: phone || undefined,
      });

      // Upload cover image if provided
      if (coverImage && newTeacher) {
        const coverImageUrl = await uploadCoverImage(newTeacher.id);
        
        // Update teacher with cover image URL
        if (coverImageUrl) {
          await supabase
            .from('users')
            .update({ cover_image_url: coverImageUrl })
            .eq('id', newTeacher.id);
        }
      }

      // Reset form
      setFullName('');
      setEmail('');
      setPassword('');
      setSubject('');
      setPhone('');
      setCoverImage(null);
      setCoverImagePreview('');
      onOpenChange(false);

      toast({
        title: "تم إنشاء المدرس بنجاح",
        description: "تم إضافة المدرس الجديد إلى المنصة",
      });
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast({
        title: "خطأ في إنشاء المدرس",
        description: "حدث خطأ أثناء إنشاء حساب المدرس",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مدرس جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات المدرس الجديد لإنشاء حسابه
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل البريد الإلكتروني"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="subject">المادة الدراسية</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="أدخل اسم المادة"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="أدخل رقم الهاتف"
            />
          </div>
          
          <div>
            <Label htmlFor="coverImage">صورة الغلاف (اختياري)</Label>
            <div className="mt-2">
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('coverImage')?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 ml-2" />
                {coverImage ? 'تغيير صورة الغلاف' : 'اختيار صورة الغلاف'}
              </Button>
              {coverImagePreview && (
                <div className="mt-3 relative">
                  <img
                    src={coverImagePreview}
                    alt="معاينة صورة الغلاف"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading || !fullName || !email || !password || !subject}>
              {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              إنشاء حساب المدرس
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
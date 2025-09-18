import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import { useTopStudents } from '@/hooks/useTopStudents';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  full_name: string;
  email: string;
  grade?: string;
}

interface AddTopStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTopStudentDialog({ open, onOpenChange }: AddTopStudentDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [achievement, setAchievement] = useState('');
  const [score, setScore] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { addTopStudent } = useTopStudents();

  useEffect(() => {
    if (open) {
      fetchStudents();
    }
  }, [open]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, grade')
        .eq('role', 'student')
        .order('full_name');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !achievement || !score) return;

    setLoading(true);
    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${selectedStudentId}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('student-images')
          .upload(fileName, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('student-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      await addTopStudent({
        student_id: selectedStudentId,
        achievement,
        score: parseFloat(score),
        image_url: imageUrl || undefined,
        is_featured: isFeatured,
      });

      // Reset form
      setSelectedStudentId('');
      setAchievement('');
      setScore('');
      setIsFeatured(false);
      setImageFile(null);
      setImagePreview('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding top student:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة طالب متفوق</DialogTitle>
          <DialogDescription>
            أضف طالب إلى قائمة المتفوقين
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">اختر الطالب</Label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="اختر طالب من القائمة" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.full_name} - {student.grade || 'غير محدد'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStudent && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar>
                <AvatarFallback>
                  {selectedStudent.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedStudent.full_name}</p>
                <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                <p className="text-sm text-muted-foreground">{selectedStudent.grade || 'غير محدد'}</p>
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="achievement">الإنجاز</Label>
            <Input
              id="achievement"
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="مثال: الأول على الفصل، متفوق في الرياضيات"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="score">النتيجة/الدرجة</Label>
            <Input
              id="score"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="مثال: 98.5"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="image">صورة الطالب</Label>
            <div className="mt-2">
              <label htmlFor="image" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">انقر لاختيار صورة</p>
                  </div>
                )}
                <input
                  id="image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(checked === true)}
            />
            <Label htmlFor="featured">عرض في الشريط المتحرك (الصفحة الرئيسية)</Label>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading || !selectedStudentId || !achievement || !score}>
              {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              إضافة الطالب
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
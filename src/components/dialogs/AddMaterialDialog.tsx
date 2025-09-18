import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Loader2 } from "lucide-react";
import { useMaterials } from '@/hooks/useMaterials';
import { useAuth } from '@/hooks/useAuth';

interface AddMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materialType?: 'video' | 'document' | 'exam' | 'quiz' | 'summary';
}

export function AddMaterialDialog({ open, onOpenChange, materialType }: AddMaterialDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(materialType || 'video');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { addMaterial } = useMaterials();
  const { userProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !userProfile) return;

    setLoading(true);
    try {
      await addMaterial({
        title,
        description,
        type: type as any,
        subject_id: userProfile.subject || 'default',
        teacher_id: userProfile.id,
        is_published: true,
        file_size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : undefined,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding material:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مادة تعليمية جديدة</DialogTitle>
          <DialogDescription>
            أضف مادة تعليمية جديدة لطلابك
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان المادة</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان المادة"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">نوع المادة</Label>
            <Select value={type} onValueChange={(value) => setType(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع المادة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">فيديو تعليمي</SelectItem>
                <SelectItem value="document">مستند</SelectItem>
                <SelectItem value="exam">امتحان</SelectItem>
                <SelectItem value="quiz">اختبار قصير</SelectItem>
                <SelectItem value="summary">ملخص</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">الوصف (اختياري)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف المادة التعليمية"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="file">رفع الملف</Label>
            <div className="mt-2">
              <label htmlFor="file" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    {file ? file.name : 'انقر لاختيار الملف'}
                  </p>
                </div>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept={type === 'video' ? 'video/*' : type === 'document' ? '.pdf,.doc,.docx' : '*'}
                />
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading || !title}>
              {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              إضافة المادة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
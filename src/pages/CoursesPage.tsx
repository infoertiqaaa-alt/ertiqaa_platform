import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Users, 
  Star, 
  Search,
  Filter,
  ShoppingCart,
  Play,
  FileText,
  Trophy,
  Video,
  FileIcon,
  ClipboardCheck,
  HelpCircle,
  ScrollText
} from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function CoursesPage() {
  const { materials, loading, fetchMaterials, incrementViews } = useMaterials();
  const [filteredMaterials, setFilteredMaterials] = useState(materials);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { userProfile, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [searchTerm, typeFilter, materials]);

  const filterMaterials = () => {
    let filtered = materials.filter(material => material.is_published);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(material => material.type === typeFilter);
    }

    setFilteredMaterials(filtered);
  };

  const handleViewMaterial = async (materialId: string) => {
    if (!user) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "تحتاج إلى تسجيل الدخول لمشاهدة المواد",
        variant: "destructive",
      });
      return;
    }

    try {
      await incrementViews(materialId);
      toast({
        title: "تم فتح المادة",
        description: "يمكنك الآن مشاهدة المحتوى",
      });
    } catch (error) {
      console.error('Error viewing material:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileIcon className="w-4 h-4" />;
      case 'exam': return <ClipboardCheck className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      case 'summary': return <ScrollText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'فيديو تعليمي';
      case 'document': return 'مستند';
      case 'exam': return 'امتحان';
      case 'quiz': return 'اختبار قصير';
      case 'summary': return 'ملخص';
      default: return 'مادة تعليمية';
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      video: "default",
      document: "secondary", 
      exam: "destructive",
      quiz: "outline",
      summary: "default"
    };
    const variant = variants[type] || "outline";
    return <Badge variant={variant}>{getTypeLabel(type)}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">جميع المواد التعليمية</h1>
          <p className="text-muted-foreground text-lg">استكشف المواد التعليمية المتاحة وابدأ رحلة التعلم</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن المواد..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 ml-2" />
                    <SelectValue placeholder="فلترة النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="video">فيديو تعليمي</SelectItem>
                    <SelectItem value="document">مستند</SelectItem>
                    <SelectItem value="exam">امتحان</SelectItem>
                    <SelectItem value="quiz">اختبار قصير</SelectItem>
                    <SelectItem value="summary">ملخص</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{material.title}</CardTitle>
                  {getTypeBadge(material.type)}
                </div>
                <CardDescription className="text-sm">
                  {material.description || "وصف المادة غير متوفر"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Material Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getTypeIcon(material.type)}
                  <span>{getTypeLabel(material.type)}</span>
                  {material.file_size && (
                    <>
                      <span>•</span>
                      <span>{material.file_size}</span>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    <span>{material.views} مشاهدة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{new Date(material.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => handleViewMaterial(material.id)}
                  className="w-full flex items-center gap-2"
                >
                  {getTypeIcon(material.type)}
                  مشاهدة المادة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد مواد تعليمية متاحة</h3>
            <p className="text-muted-foreground">جرب تغيير معايير البحث أو الفلترة</p>
          </div>
        )}
      </div>
    </div>
  );
}
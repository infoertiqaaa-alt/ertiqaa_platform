import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Crown, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Send, 
  Headphones, 
  Clock,
  Users
} from "lucide-react";

const subscriptionPlans = [
  {
    id: "premium",
    name: "الخطة الشاملة",
    price: "299",
    period: "شهرياً",
    description: "وصول كامل لجميع المواد والخدمات",
    features: [
      "جميع المواد الدراسية (6 مواد)",
      "حضور الحصص المباشرة",
      "امتحانات تقييمية شهرية",
      "دعم فني 24/7",
      "تتبع التقدم الشخصي",
      "شهادات إتمام معتمدة",
      "وصول للأرشيف الكامل",
      "جلسات فردية مع المدرسين"
    ],
    color: "primary",
    popular: true
  },
  {
    id: "individual",
    name: "مادة واحدة",
    price: "89",
    period: "شهرياً",
    description: "التركيز على مادة واحدة فقط",
    features: [
      "مادة دراسية واحدة",
      "حضور الحصص المباشرة",
      "امتحانات تقييمية",
      "دعم فني في أوقات العمل",
      "تتبع التقدم الأساسي",
      "شهادة إتمام"
    ],
    color: "secondary",
    popular: false
  },
  {
    id: "multiple",
    name: "3 مواد مختارة",
    price: "199",
    period: "شهرياً",
    description: "اختر 3 مواد حسب احتياجاتك",
    features: [
      "3 مواد دراسية (اختيارية)",
      "حضور الحصص المباشرة",
      "امتحانات تقييمية شهرية",
      "دعم فني يومياً",
      "تتبع التقدم المتقدم",
      "شهادات إتمام معتمدة",
      "وصول للأرشيف المحدود"
    ],
    color: "success",
    popular: false
  }
];

const recentMessages = [
  {
    id: 1,
    user: "أحمد محمد",
    message: "مرحباً، أريد الاستفسار عن الخطة الشاملة",
    time: "منذ 5 دقائق",
    status: "جديد"
  },
  {
    id: 2,
    user: "فاطمة أحمد",
    message: "هل يمكنني تغيير المواد في الخطة الثلاثية؟",
    time: "منذ 15 دقيقة",
    status: "تم الرد"
  },
  {
    id: 3,
    user: "محمد علي",
    message: "مشكلة في الوصول للحصة المباشرة",
    time: "منذ 30 دقيقة",
    status: "قيد المعالجة"
  }
];

const InquiriesPage = () => {
  const [message, setMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد": return "primary";
      case "تم الرد": return "success";
      case "قيد المعالجة": return "warning";
      default: return "secondary";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">الاستفسارات والاشتراكات</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            تواصل معنا للحصول على المساعدة أو اختر خطة الاشتراك المناسبة لك
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              خدمة العملاء
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              خطط الاشتراك
            </TabsTrigger>
          </TabsList>

          {/* Customer Service Chat */}
          <TabsContent value="chat" className="mt-8 space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="section-card h-[600px] flex flex-col">
                  <div className="flex items-center gap-3 p-4 border-b border-border">
                    <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
                    <div>
                      <h3 className="font-bold text-foreground">فريق خدمة العملاء</h3>
                      <p className="text-sm text-muted-foreground">متاح الآن • متوسط الرد: دقيقتان</p>
                    </div>
                  </div>

                  {/* Chat Messages Area */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Headphones className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg max-w-xs">
                        <p className="text-foreground">مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
                        <span className="text-xs text-muted-foreground">منذ دقيقة</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-3">
                      <Textarea
                        placeholder="اكتب رسالتك هنا..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 min-h-[60px] resize-none"
                      />
                      <Button className="gradient-primary border-0 px-4">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Inquiries */}
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground">الاستفسارات الأخيرة</h3>
                  </div>
                  <div className="space-y-3">
                    {recentMessages.map((msg) => (
                      <div key={msg.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground text-sm">{msg.user}</span>
                          <Badge variant={getStatusColor(msg.status) as any} className="text-xs">
                            {msg.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{msg.message}</p>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-success" />
                    <h3 className="font-bold text-foreground">معلومات الدعم</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ساعات العمل:</span>
                      <span className="text-foreground font-medium">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">متوسط الرد:</span>
                      <span className="text-foreground font-medium">دقيقتان</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">نسبة الرضا:</span>
                      <span className="text-foreground font-medium">98%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Subscription Plans */}
          <TabsContent value="plans" className="mt-8">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">اختر الخطة المناسبة لك</h2>
                <p className="text-muted-foreground">جميع الخطط تشمل ضمان استرداد الأموال خلال 7 أيام</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative section-card ${selectedPlan === plan.id ? 'ring-2 ring-primary' : ''} ${plan.popular ? 'ring-2 ring-warning' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 right-4">
                        <Badge className="gradient-warning border-0 text-warning-foreground px-3 py-1">
                          <Star className="w-3 h-3 ml-1" />
                          الأكثر شعبية
                        </Badge>
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      {/* Plan Header */}
                      <div className="text-center space-y-2">
                        <div className={`w-16 h-16 mx-auto rounded-full bg-${plan.color}/10 flex items-center justify-center`}>
                          {plan.id === 'premium' && <Crown className={`w-8 h-8 text-${plan.color}`} />}
                          {plan.id === 'individual' && <BookOpen className={`w-8 h-8 text-${plan.color}`} />}
                          {plan.id === 'multiple' && <Star className={`w-8 h-8 text-${plan.color}`} />}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                        <p className="text-muted-foreground text-sm">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-foreground">ريال</span>
                        </div>
                        <span className="text-muted-foreground text-sm">{plan.period}</span>
                      </div>

                      {/* Features */}
                      <div className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                            <span className="text-foreground text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <Button 
                        className={`w-full ${plan.popular ? 'gradient-warning' : `gradient-${plan.color}`} border-0`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? 'تم الاختيار' : 'اختر هذه الخطة'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {selectedPlan && (
                <Card className="p-6 bg-success/5 border-success/20">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                    <h3 className="text-lg font-bold text-foreground">تم اختيار الخطة</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    لقد اخترت خطة {subscriptionPlans.find(p => p.id === selectedPlan)?.name}. 
                    سيتم توجيهك لصفحة الدفع لإتمام عملية الاشتراك.
                  </p>
                  <Button className="gradient-success border-0">
                    متابعة للدفع
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InquiriesPage;
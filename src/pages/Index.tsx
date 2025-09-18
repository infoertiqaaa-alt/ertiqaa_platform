import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import NewsMarquee from "@/components/NewsMarquee";
import TodayReminders from "@/components/TodayReminders";
import DashboardSections from "@/components/DashboardSections";
import SubjectsPage from "./SubjectsPage";
import ExamsPage from "./ExamsPage";
import InquiriesPage from "./InquiriesPage";
import StudentStatusPage from "./StudentStatusPage";
import SettingsPage from "./SettingsPage";
import LoginPage from "./LoginPage";

const Index = () => {
  console.log('Index component loading...');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  console.log('Index render - user:', user?.email, 'loading:', loading, 'profile:', userProfile);

  // Redirect admin and teacher users only
  useEffect(() => {
    if (!loading && user && userProfile) {
      console.log('Checking user role for redirect:', userProfile.role);
      if (userProfile.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      } else if (userProfile.role === 'teacher') {
        navigate('/teacher', { replace: true });
        return;
      }
      // Students stay on the main page
    }
  }, [user, userProfile, loading, navigate]);

  // Don't render Index if user should be redirected (admin/teacher only)
  if (!loading && user && userProfile && (userProfile.role === 'admin' || userProfile.role === 'teacher')) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التوجيه...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'subjects':
        return <SubjectsPage />;
      case 'exams':
        return <ExamsPage />;
      case 'inquiries':
        return <InquiriesPage />;
      case 'status':
        return <StudentStatusPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  مرحباً بك في منصة التعلم
                </h1>
                <p className="text-muted-foreground">
                  ابدأ رحلتك التعليمية معنا نحو مستقبل أفضل
                </p>
              </div>
              
              <NewsMarquee />
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <DashboardSections onTabChange={setCurrentTab} />
                </div>
                <div>
                  <TodayReminders onTabChange={setCurrentTab} />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;

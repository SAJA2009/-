/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  Dna, 
  ChevronRight,
  School,
  BrainCircuit,
  MessageSquare,
  ArrowLeft,
  User as UserIcon,
  LogOut,
  BarChart3,
  Sparkles,
  GraduationCap
} from "lucide-react";
import { Layout, SectionHeader, Card, AppLogo } from "./components/Shared";
import { ModuleHub } from "./components/ModuleHub";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { Subject, Semester, GradeLevel } from "./types";
import { cn } from "./lib/utils";
import { auth, signInWithGoogle, logout } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createUserProfile } from "./services/progressService";

type View = 'home' | 'grade' | 'semester' | 'subject' | 'module' | 'standardized' | 'progress';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [grade, setGrade] = useState<GradeLevel | null>(null);
  const [semester, setSemester] = useState<Semester | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        createUserProfile({
          uid: u.uid,
          email: u.email || "",
          displayName: u.displayName || "طالب مساعد",
          photoURL: u.photoURL || undefined,
          role: 'student'
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setView('home');
    } catch (e) {
      console.error(e);
    }
  };

  const startJourney = () => setView('grade');

  const selectGrade = (g: GradeLevel) => {
    setGrade(g);
    setView('semester');
  };

  const selectSemester = (s: Semester) => {
    setSemester(s);
    setView('subject');
  };

  const selectSubject = (sub: Subject) => {
    setSubject(sub);
    setView('module');
  };

  const goBack = () => {
    if (view === 'module') setView('subject');
    else if (view === 'subject') setView('semester');
    else if (view === 'semester') setView('grade');
    else if (view === 'grade') setView('home');
  };

  return (
    <Layout activeView={view} onNavigate={(v) => setView(v as View)} user={user} onLogin={handleLogin} onLogout={handleLogout}>
      <div className="min-h-[80vh] flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="px-4 py-12 md:py-20 flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              {!user && !authLoading && (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
                  <button 
                    onClick={handleLogin}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-2 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <UserIcon size={18} className="text-primary" />
                    <span>سجل دخولك لحفظ تقدمك</span>
                  </button>
                </motion.div>
              )}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8"
              >
                <AppLogo size="md" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.2] md:leading-[1.1]">
                نساعدك لـ <span className="text-primary italic">بناء مستقبل</span> طموح
              </h1>
              <p className="text-base sm:text-lg md:text-2xl text-slate-500 mb-8 md:mb-12 max-w-2xl leading-relaxed">
                منصتك التعليمية الذكية والمتخصصة في المنهج السعودي العلمي للمرحلة الثانوية. حلول دقيقة، معلمون افتراضيون، واختبارات قياسية.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full mb-8 md:mb-12">
                <FeatureCard icon={<BrainCircuit className="text-primary" />} text="حلول ذكية بالقوانين" />
                <FeatureCard icon={<MessageSquare className="text-accent" />} text="اسأل معلمك الافتراضي" />
                <FeatureCard icon={<Sparkles className="text-emerald-500" />} text="تدريبات شاملة وموثوقة" />
              </div>

              <button 
                onClick={startJourney}
                className="bg-primary text-white text-lg md:text-xl font-bold px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl shadow-2xl shadow-primary/40 hover:bg-secondary hover:-translate-y-1 transition-all flex items-center gap-3"
              >
                ابدأ رحلتك التعليمية
                <ChevronRight size={24} />
              </button>
            </motion.div>
          )}

          {view === 'grade' && (
            <motion.div 
              key="grade"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <SectionHeader 
                title="اختر سنتك الدراسية" 
                subtitle="حدد مستواك الدراسي لنقدم لك المحتوى الدقيق المتوافق مع المسارات الثانوية في المملكة." 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GradeCard 
                  title="أول ثانوي" 
                  grade="الصف العاشر"
                  icon={<School size={48} />}
                  onClick={() => selectGrade('grade_10')} 
                />
                <GradeCard 
                  title="ثاني ثانوي" 
                  grade="الصف الحادي عشر"
                  icon={<Sparkles size={48} />}
                  onClick={() => selectGrade('grade_11')} 
                />
                <GradeCard 
                  title="ثالث ثانوي" 
                  grade="الصف الثاني عشر"
                  icon={<GraduationCap size={48} />}
                  onClick={() => selectGrade('grade_12')} 
                />
              </div>

              <div className="mt-12">
                <Card onClick={() => setView('standardized')} className="bg-gradient-to-r from-primary to-accent text-white border-none py-8 flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <AppLogo size="sm" />
                    <div>
                      <h3 className="text-2xl font-bold">القدرات والتحصيلي</h3>
                      <p className="text-white/80 font-medium">استعد للاختبارات المعيارية مع أقوى المراجعات الذكية</p>
                    </div>
                  </div>
                  <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </Card>
              </div>
            </motion.div>
          )}

          {view === 'standardized' && (
            <motion.div 
               key="standardized"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="max-w-4xl mx-auto px-4 py-12"
            >
              <button onClick={goBack} className="flex items-center gap-2 mb-8 text-primary font-bold hover:gap-3 transition-all">
                <ArrowLeft size={20} />
                <span>العودة للرئيسية</span>
              </button>
              <SectionHeader 
                title="مركز القدرات والتحصيلي" 
                subtitle="تدرب على أحدث نماذج الاختبارات المعيارية لعام 2026." 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card onClick={() => { setSubject('math'); setView('module'); setSemester('semester_2_3'); }} className="flex flex-col items-center gap-6 py-12 hover:border-accent">
                   <div className="p-6 bg-primary/10 text-primary rounded-3xl">
                     <Calculator size={48} />
                   </div>
                   <div className="text-center">
                     <h3 className="text-2xl font-black">قدرات (كمي)</h3>
                     <p className="text-slate-500">تدريب على المسائل الرياضية</p>
                   </div>
                </Card>
                <Card onClick={() => { setSubject('biology'); setView('module'); setSemester('semester_2_3'); }} className="flex flex-col items-center gap-6 py-12 hover:border-accent">
                   <div className="p-6 bg-accent/10 text-accent rounded-3xl">
                     <MessageSquare size={48} />
                   </div>
                   <div className="text-center">
                     <h3 className="text-2xl font-black">قدرات (لفظي)</h3>
                     <p className="text-slate-500">تدريب على التناظر والاستيعاب</p>
                   </div>
                </Card>
                <Card onClick={() => { setSubject('physics'); setView('module'); setSemester('semester_2_3'); }} className="flex flex-col items-center gap-6 py-12 hover:border-accent">
                   <div className="p-6 bg-primary/10 text-primary rounded-3xl">
                     <GraduationCap size={48} />
                   </div>
                   <div className="text-center">
                     <h3 className="text-2xl font-black">الاختبار التحصيلي</h3>
                     <p className="text-slate-500">مراجعة شاملة للمواد العلمية</p>
                   </div>
                </Card>
              </div>
            </motion.div>
          )}

          {view === 'semester' && (
            <motion.div 
              key="semester"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <button onClick={goBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <ArrowLeft size={24} />
                </button>
                <div className="h-10 w-1 bg-primary rounded-full" />
                <span className="text-primary font-bold">
                  {grade === 'grade_10' ? "أول ثانوي" : grade === 'grade_11' ? "ثاني ثانوي" : "ثالث ثانوي"}
                </span>
              </div>
              <SectionHeader 
                title="اختر الفصل الدراسي" 
                subtitle="حدد الفصل الذي تدرسه حالياً وفقاً لنظام الفصول الثلاثة." 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SemesterCard 
                  title="الفصل الأول" 
                  description="بداية العام الدراسي والأساسيات العلمية"
                  onClick={() => selectSemester('semester_1')} 
                />
                <SemesterCard 
                  title="الفصل الدراسي الثاني" 
                  description="المحتوى المدمج للفصول الختامية"
                  onClick={() => selectSemester('semester_2_3')} 
                />
              </div>
            </motion.div>
          )}

          {view === 'subject' && (
            <motion.div 
              key="subject"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <button onClick={goBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <ArrowLeft size={24} />
                </button>
                <div className="h-10 w-1 bg-primary rounded-full" />
                <span className="text-primary font-bold">
                   {grade === 'grade_10' ? "أول ثانوي" : grade === 'grade_11' ? "ثاني ثانوي" : "ثالث ثانوي"} • {semester === 'semester_1' ? "الفصل الأول" : "الفصل الثاني"}
                </span>
              </div>
              <SectionHeader 
                title="اختر المادة العلمية" 
                subtitle="تخصصنا في المواد العلمية لنضمن لك أعلى جودة في الشرح والحلول لمسارك التعليمي." 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <SubjectCard 
                  title="الرياضيات" 
                  icon={<Calculator size={40} />} 
                  color="bg-primary" 
                  onClick={() => selectSubject('math')}
                />
                <SubjectCard 
                  title="الفيزياء" 
                  icon={<Atom size={40} />} 
                  color="bg-accent" 
                  onClick={() => selectSubject('physics')}
                />
                <SubjectCard 
                  title="الكيمياء" 
                  icon={<FlaskConical size={40} />} 
                  color="bg-primary" 
                  onClick={() => selectSubject('chemistry')}
                />
                <SubjectCard 
                  title="الأحياء" 
                  icon={<Dna size={40} />} 
                  color="bg-accent" 
                  onClick={() => selectSubject('biology')}
                />
              </div>
            </motion.div>
          )}

          {view === 'progress' && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ProgressDashboard onBack={goBack} />
            </motion.div>
          )}

          {view === 'module' && subject && semester && grade && (
            <motion.div 
              key="module"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ModuleHub 
                subject={subject} 
                semester={semester} 
                grade={grade}
                onBack={goBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

function GradeCard({ title, grade, icon, onClick }: { title: string, grade: string, icon: any, onClick: () => void }) {
  return (
    <Card onClick={onClick} className="flex flex-col items-center text-center gap-4 py-12 group hover:border-primary">
      <div className="w-24 h-24 bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary rounded-full flex items-center justify-center transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900">{title}</h3>
        <p className="text-slate-500 font-bold">{grade}</p>
      </div>
    </Card>
  );
}

function FeatureCard({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-3">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <span className="font-bold text-slate-800">{text}</span>
    </div>
  );
}

function SemesterCard({ title, description, onClick }: { title: string, description: string, onClick: () => void }) {
  return (
    <Card onClick={onClick} className="group relative overflow-hidden h-64 flex flex-col justify-end">
      <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-all">
        <School size={120} />
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 font-medium">{description}</p>
      </div>
      <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
        <div className="bg-primary text-white p-2 rounded-full shadow-lg">
          <ChevronRight size={20} />
        </div>
      </div>
    </Card>
  );
}

function SubjectCard({ title, icon, color, onClick }: { title: string, icon: any, color: string, onClick: () => void }) {
  return (
    <Card onClick={onClick} className="flex flex-col items-center gap-6 py-12 group">
      <div className={cn("p-6 rounded-3xl text-white transform transition-all group-hover:rotate-12 group-hover:scale-110 shadow-xl", color)}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <div className="flex gap-1 mt-auto">
        <div className="w-2 h-2 rounded-full bg-slate-200" />
        <div className="w-8 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-slate-200" />
      </div>
    </Card>
  );
}

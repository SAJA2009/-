import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  Brain,
  History,
  BarChart3,
  Sparkles
} from "lucide-react";
import { getQuizAttempts, getProblemAttempts, getAreasOfDifficulty } from "../services/progressService";
import { QuizAttempt, ProblemAttempt, AreaOfDifficulty } from "../types";
import { Card, SectionHeader } from "./Shared";
import { cn } from "../lib/utils";

export function ProgressDashboard({ onBack }: { onBack: () => void }) {
  const [quizzes, setQuizzes] = useState<QuizAttempt[]>([]);
  const [problems, setProblems] = useState<ProblemAttempt[]>([]);
  const [areas, setAreas] = useState<AreaOfDifficulty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [q, p, a] = await Promise.all([
          getQuizAttempts(),
          getProblemAttempts(),
          getAreasOfDifficulty()
        ]);
        setQuizzes(q);
        setProblems(p);
        setAreas(a);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalQuizzes = quizzes.length;
  const avgScore = totalQuizzes > 0 
    ? Math.round((quizzes.reduce((acc, q) => acc + (q.score / q.totalQuestions), 0) / totalQuizzes) * 100) 
    : 0;
  
  const solvedProblems = problems.filter(p => p.isSolved).length;

  const chartData = quizzes.slice().reverse().map((q, i) => ({
    name: `اختبار ${i + 1}`,
    score: Math.round((q.score / q.totalQuestions) * 100)
  }));

  const subjectData = [
    { name: 'الرياضيات', value: quizzes.filter(q => q.subject === 'math').length },
    { name: 'الفيزياء', value: quizzes.filter(q => q.subject === 'physics').length },
    { name: 'الكيمياء', value: quizzes.filter(q => q.subject === 'chemistry').length },
    { name: 'الأحياء', value: quizzes.filter(q => q.subject === 'biology').length },
  ].filter(s => s.value > 0);

  const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-primary">
        <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold">جاري تحليل بياناتك الدراسية...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <SectionHeader 
          title="لوحة التقدم الدراسي" 
          subtitle="تتبع أداءك في الاختبارات واكتشف نقاط القوة والضعف لتحسين مستواك العلمي." 
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 mt-4 md:mt-0">
        <StatCard 
          title="متوسط الدرجات" 
          value={`${avgScore}%`} 
          icon={<Trophy className="text-amber-500" />} 
          trend="+5% مؤخراً"
        />
        <StatCard 
          title="اختبارات" 
          value={totalQuizzes.toString()} 
          icon={<CheckCircle2 className="text-emerald-500" />} 
          trend="أداء مستقر"
        />
        <StatCard 
          title="مسائل منجزة" 
          value={solvedProblems.toString()} 
          icon={<Target className="text-primary" />} 
          trend={`من ${problems.length}`}
        />
        <StatCard 
          title="ساعات التدريب" 
          value="12.5" 
          icon={<Clock className="text-accent" />} 
          trend="نشط اليوم"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="text-primary" />
            منحنى الأداء في الاختبارات
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#2563eb', strokeWidth: 0 }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Brain className="text-accent" />
            توزيع الجهد الدراسي
          </h3>
          <div className="flex-1 min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-bold text-slate-500">
            {subjectData.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              مواضيع تحتاج تركيز أكثر
            </h3>
            <span className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold">بناءً على أخطائك</span>
          </div>
          <div className="space-y-4">
            {areas.length > 0 ? areas.map((area, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <h4 className="font-bold text-slate-800">{area.topic}</h4>
                  <p className="text-xs text-slate-500">{getSubjectName(area.subject)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${area.level * 100}%` }} 
                    />
                  </div>
                  <span className="text-xs font-black text-red-500">حرج</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-400">
                <Sparkles className="mx-auto mb-2 opacity-20" size={40} />
                <p>لا يوجد مواضيع حرجة حالياً. استمر في التدرب!</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <History className="text-slate-400" />
            آخر الأنشطة
          </h3>
          <div className="space-y-4">
            {quizzes.slice(0, 5).map((q, idx) => (
              <div key={idx} className="flex items-center gap-4 border-b border-slate-50 pb-4 last:border-none">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">اختبار في مادة {getSubjectName(q.subject)}</h4>
                  <p className="text-xs text-slate-500">{new Date(q.timestamp).toLocaleDateString()} • {q.score}/{q.totalQuestions}</p>
                </div>
                <div className="text-lg font-black text-primary">
                  {Math.round((q.score/q.totalQuestions)*100)}%
                </div>
              </div>
            ))}
            {problems.slice(0, 5).map((p, idx) => (
              <div key={idx} className="flex items-center gap-4 border-b border-slate-50 pb-4 last:border-none">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Brain size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">محاولة حل مسألة</h4>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{p.query}</p>
                </div>
                <div className="text-xs font-bold text-accent italic">
                  {p.isSolved ? 'ناجحة' : 'تحتاج مراجعة'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex justify-between items-start mb-2 md:mb-4">
        <div className="p-2 md:p-3 bg-slate-50 rounded-xl md:rounded-2xl shrink-0">{icon}</div>
      </div>
      <div>
        <h4 className="text-slate-500 text-[10px] md:text-sm font-medium">{title}</h4>
        <div className="text-xl md:text-3xl font-black text-slate-900 my-1">{value}</div>
        <p className="text-[10px] md:text-xs text-emerald-600 font-bold">{trend}</p>
      </div>
    </Card>
  );
}

function getSubjectName(subject: any) {
  const map: any = {
    math: 'الرياضيات',
    physics: 'الفيزياء',
    chemistry: 'الكيمياء',
    biology: 'الأحياء'
  };
  return map[subject] || subject;
}

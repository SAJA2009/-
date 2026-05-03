import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  MessageCircle,
  HelpCircle,
  GraduationCap,
  Sparkles,
  Book
} from "lucide-react";
import { cn } from "../lib/utils";
import { Subject, Semester, ChatMessage, SolutionResponse, QuizQuestion, GradeLevel } from "../types";
import { solveProblem, chatWithTeacher, generateQuiz, generateStandardizedQuiz } from "../services/geminiService";
import { SectionHeader, Card } from "./Shared";
import { recordQuizAttempt, recordProblemAttempt } from "../services/progressService";
import { SUBJECT_TOPICS, CurriculumChapter } from "../constants";

interface ModuleProps {
  subject: Subject;
  semester: Semester;
  grade: GradeLevel;
  onBack: () => void;
}

export function ModuleHub({ subject, semester, grade, onBack }: ModuleProps) {
  const [activeTab, setActiveTab] = useState<'solver' | 'chat' | 'quiz'>('solver');
  const [selectedTopic, setSelectedTopic] = useState<CurriculumChapter | null>(null);
  
  const topicsKey = `${subject}_${grade}_${semester}`;
  const availableTopics = SUBJECT_TOPICS[topicsKey] || [];
  
  const isStandardized = semester === 'semester_2_3' && (subject === 'math' || subject === 'physics');

  if (availableTopics.length > 0 && !selectedTopic) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">اختر الفصل الدراسي</h2>
            <p className="text-slate-500">حدد الوحدة التي تود التركيز عليها في مادة {getSubjectName(subject)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableTopics.map((topic) => (
            <Card 
              key={topic.id} 
              onClick={() => setSelectedTopic(topic)}
              className="p-8 cursor-pointer hover:border-primary transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-2 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                  <Book size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{topic.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{topic.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={selectedTopic ? () => setSelectedTopic(null) : onBack}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isStandardized ? "مركز التدريب المعياري" : selectedTopic ? selectedTopic.title : "وحدة المنهج الدراسي"}
          </h2>
          <p className="text-slate-500">
             {getGradeName(grade)} - {getSubjectName(subject)} - {getSemesterName(semester)}
             {selectedTopic && " • وحدة مختارة"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-primary/5 border border-primary/5 rounded-2xl mb-8 w-fit mx-auto md:mx-0">
        <TabButton 
          active={activeTab === 'solver'} 
          onClick={() => setActiveTab('solver')}
          icon={<Hash size={18} />}
          label="المسائل"
        />
        <TabButton 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')}
          icon={<MessageCircle size={18} />}
          label="معلم"
        />
        <TabButton 
          active={activeTab === 'quiz'} 
          onClick={() => setActiveTab('quiz')}
          icon={<HelpCircle size={18} />}
          label="اختبار"
        />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'solver' && (
          <motion.div
            key="solver"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ProblemSolver 
              subject={subject} 
              semester={semester} 
              grade={grade} 
              topic={selectedTopic?.title}
            />
          </motion.div>
        )}
        {activeTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <TeacherChat subject={subject} grade={grade} topic={selectedTopic?.title} />
          </motion.div>
        )}
        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <QuizModule 
              subject={subject} 
              semester={semester} 
              grade={grade} 
              topic={selectedTopic?.title}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl transition-all font-bold text-sm md:text-base",
        active 
          ? "bg-white text-primary shadow-sm" 
          : "text-slate-500 hover:text-slate-700"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Sub-components for each tab
function ProblemSolver({ subject, semester, grade, topic }: { subject: Subject; semester: Semester, grade: GradeLevel, topic?: string }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SolutionResponse | null>(null);

  const handleSolve = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const fullQuery = topic ? `${topic}: ${query}` : query;
      const data = await solveProblem(fullQuery, subject, semester, grade);
      setResult(data);
      // Record attempt
      await recordProblemAttempt({
        subject,
        semester,
        grade,
        query,
        isSolved: !!data.answer
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-0 overflow-hidden border-2 border-primary/10">
        <div className="p-6 bg-primary/5">
          <label className="block text-sm font-bold text-primary mb-2">أدخل مسألتك أو سؤالك العلمي</label>
          <textarea 
            className="w-full bg-white rounded-2xl border-none p-4 min-h-[120px] focus:ring-2 focus:ring-primary shadow-inner text-lg outline-none"
            placeholder="مثال: احسب سرعة جسم يتحرك مسافة 100 متر في 5 ثوانٍ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button 
              disabled={loading}
              onClick={handleSolve}
              className={cn(
                "bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-secondary disabled:opacity-50",
                loading && "animate-pulse"
              )}
            >
              {loading ? "جاري التفكير..." : "حل الآن"}
              <Bot size={20} />
            </button>
          </div>
        </div>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 border-r-4 border-primary pr-3 flex items-center gap-2">
                خطوات الحل
                <GraduationCap className="text-primary" size={24} />
              </h3>
              {result.steps.map((step, idx) => (
                <div key={idx}>
                  <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-primary/20" />
                    <h4 className="font-bold text-primary mb-1">{step.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{step.explanation}</p>
                    {step.formula && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-lg font-mono text-primary text-center">
                        {step.formula}
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <div className="bg-secondary p-6 rounded-3xl text-white shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                   القوانين المستخدمة
                </h3>
                <ul className="space-y-3">
                  {result.lawsUsed.map((law, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-emerald-50">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <span className="font-medium">{law}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">الإجابة النهائية</h3>
                <div className="text-3xl font-bold text-primary">{result.answer}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function TeacherChat({ subject, grade, topic }: { subject: Subject, grade: GradeLevel, topic?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || !gender) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      if (topic) {
        chatHistory[0].content = `(موضوع النقاش: ${topic}) ${chatHistory[0].content}`;
      }
      
      const response = await chatWithTeacher(
        chatHistory,
        subject,
        grade,
        gender
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!gender) {
    return (
      <div className="max-w-2xl mx-auto py-8 md:py-12 text-center">
        <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">مع من تود التحدث اليوم؟</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          <Card onClick={() => setGender('male')} className="flex flex-col items-center gap-4 hover:border-primary bg-white/50 border-white cursor-pointer py-8 md:py-12">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <User size={32} md:size={40} />
            </div>
            <span className="text-lg md:text-xl font-bold text-secondary">المعلم (أحمد)</span>
          </Card>
          <Card onClick={() => setGender('female')} className="flex flex-col items-center gap-4 hover:border-accent bg-white/50 border-white cursor-pointer py-8 md:py-12">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <User size={32} md:size={40} />
            </div>
            <span className="text-lg md:text-xl font-bold text-secondary">المعلمة (نورة)</span>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[500px] md:h-[600px] bg-white rounded-3xl border border-primary/5 overflow-hidden shadow-xl">
      <div className="p-4 bg-primary/5 border-b border-primary/5 flex justify-between items-center">
        <div className="flex items-center gap-3 text-slate-700">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", gender === 'male' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent")}>
            <Bot size={24} />
          </div>
          <div>
            <span className="font-bold">{gender === 'male' ? 'المعلم أحمد' : 'المعلمة نورة'}</span>
            <span className="text-xs block text-slate-500">متوفر الآن للمساعدة {topic && `• نناقش ${topic}`}</span>
          </div>
        </div>
        <button onClick={() => setGender(null)} className="text-slate-400 hover:text-slate-600">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="mx-auto mb-4 text-slate-300" size={48} />
            <p className="text-slate-400">أهلاً بك! أنا خبير في مادة {getSubjectName(subject)}{topic ? ` وتحديداً في ${topic}` : ''}، كيف يمكنني مساعدتك اليوم؟</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
            <div className={cn(
              "max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
              m.role === 'user' ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-800"
            )}>
              {m.content}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 uppercase">
              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex items-start flex-col">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-1 shadow-sm">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 py-3 px-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-primary text-white p-3 rounded-xl disabled:opacity-50 transition-all hover:bg-secondary"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizModule({ subject, semester, grade, topic }: { subject: Subject; semester: Semester, grade: GradeLevel, topic?: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    try {
      // If we are in a merged semester mode, we might want specialized standardized tests
      const data = semester === 'semester_2_3' && !topic
        ? await generateStandardizedQuiz(subject === 'math' ? 'qudurat' : 'tahsili', subject)
        : await generateQuiz(subject, semester, grade, topic);
      setQuestions(data);
      setCurrentIdx(0);
      setScore(0);
      setFinished(false);
      setSelectedAnswer(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    if (option === questions[currentIdx].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
      setSelectedAnswer(null);
    } else {
      setFinished(true);
      // Record quiz completion
      await recordQuizAttempt({
        subject,
        semester,
        grade,
        score: score,
        totalQuestions: questions.length
      });
    }
  };

  if (loading) return (
    <div className="text-center py-20 flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-bold">جاري تحضير أسئلة الاختبار...</p>
    </div>
  );

  if (finished) return (
    <Card className="max-w-xl mx-auto py-12 text-center space-y-6">
      <div className="w-24 h-24 bg-primary/10 text-primary mx-auto rounded-full flex items-center justify-center">
        <GraduationCap size={48} />
      </div>
      <h3 className="text-3xl font-bold">انتهى الاختبار!</h3>
      <div className="text-5xl font-black text-primary">{score} / {questions.length}</div>
      <p className="text-slate-500">
        {score === questions.length ? "أداء ممتاز! أنت مستعد تماماً." : "أداء جيد، حاول مراجعة الدروس السابقة لتعزيز فهمك."}
      </p>
      <button onClick={startQuiz} className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto">
        إعادة الاختبار
      </button>
    </Card>
  );

  if (questions.length === 0) return (
    <div className="text-center py-12">
      <HelpCircle className="mx-auto mb-4 text-slate-300" size={64} />
      <h3 className="text-xl font-bold text-slate-700 mb-4">اختبر معلوماتك لعام 2026</h3>
      <button onClick={startQuiz} className="bg-primary text-white px-8 py-3 rounded-xl font-bold transition-all hover:bg-secondary">
        ابدأ الاختبار الآن
      </button>
    </div>
  );

  const current = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-slate-400">السؤال {currentIdx + 1} من {questions.length}</span>
        <div className="h-2 flex-1 mx-8 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} 
          />
        </div>
      </div>

      <Card className="p-4 md:p-8 border-2 border-primary/5">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 md:mb-8 leading-tight">{current.question}</h3>
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {current.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className={cn(
                "p-3 md:p-4 rounded-xl md:rounded-2xl text-right font-bold border-2 transition-all flex justify-between items-center text-sm md:text-base",
                !selectedAnswer && "hover:border-primary hover:bg-primary/5 border-slate-100",
                selectedAnswer === option && option === current.correctAnswer && "border-green-500 bg-green-50 text-green-700",
                selectedAnswer === option && option !== current.correctAnswer && "border-red-500 bg-red-50 text-red-700",
                selectedAnswer && option === current.correctAnswer && "border-green-500 bg-green-50 text-green-700"
              )}
            >
              <span>{option}</span>
              {selectedAnswer && option === current.correctAnswer && <CheckCircle2 size={20} className="text-green-500" />}
              {selectedAnswer === option && option !== current.correctAnswer && <AlertCircle size={20} className="text-red-500" />}
            </button>
          ))}
        </div>
      </Card>

      {selectedAnswer && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 italic text-slate-600">
            <span className="font-bold text-primary not-italic">التفسير: </span>
            {current.explanation}
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold transition-all hover:bg-black"
          >
            {currentIdx + 1 === questions.length ? "عرض النتيجة" : "السؤال التالي"}
          </button>
        </motion.div>
      )}
    </div>
  );
}

// Utility names
function getSubjectName(subject: Subject) {
  const map: Record<Subject, string> = {
    math: 'الرياضيات',
    physics: 'الفيزياء',
    chemistry: 'الكيمياء',
    biology: 'الأحياء'
  };
  return map[subject];
}

function getSemesterName(semester: Semester) {
  const map: Record<Semester, string> = {
    semester_1: 'الفصل الدراسي الأول',
    semester_2_3: 'الفصل الدراسي الثاني'
  };
  return map[semester];
}

function getGradeName(grade: GradeLevel) {
  const map: Record<GradeLevel, string> = {
    grade_10: 'أول ثانوي',
    grade_11: 'ثاني ثانوي',
    grade_12: 'ثالث ثانوي'
  };
  return map[grade];
}

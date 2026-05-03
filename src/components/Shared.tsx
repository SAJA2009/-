import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  PenTool, 
  LayoutDashboard, 
  Atom, 
  FlaskConical, 
  Calculator, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  BarChart3,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { cn } from "../lib/utils";
import { User } from "firebase/auth";

interface LayoutProps {
  children: ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Layout({ children, activeView, onNavigate, user, onLogin, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF9F0] font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-primary/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <AppLogo size="sm" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-secondary leading-tight">مسـاعد لـبناء المسـتقبل</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-wider">المنهج السعودي • ثانوي</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <NavItem 
              active={activeView === 'home'} 
              onClick={() => onNavigate('home')}
              icon={<LayoutDashboard size={18} />}
              label="الرئيسية"
            />
            <NavItem 
              active={['semester', 'subject', 'module'].includes(activeView)} 
              onClick={() => onNavigate('semester')}
              icon={<BookOpen size={18} />}
              label="المناهج"
            />
            {user && (
              <NavItem 
                active={activeView === 'progress'} 
                onClick={() => onNavigate('progress')}
                icon={<BarChart3 size={18} />}
                label="تقدمك الدراسي"
              />
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-800 leading-none">{user.displayName}</span>
                  <span className="text-[10px] text-slate-400 font-bold">طالب مسار عام</span>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-xl border-2 border-primary/10 shadow-sm" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary/10 flex items-center justify-center text-primary">
                    <UserIcon size={20} />
                  </div>
                )}
                <button 
                  onClick={onLogout}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="bg-primary text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-secondary transition-all shadow-lg shadow-primary/20"
              >
                <UserIcon size={18} />
                <span className="hidden sm:inline">تسجيل الدخول</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-primary/10 px-6 py-3 flex md:hidden items-center justify-between z-50">
        <MobileNavItem 
          active={activeView === 'home'} 
          onClick={() => onNavigate('home')}
          icon={<LayoutDashboard size={24} />}
          label="الرئيسية"
        />
        <MobileNavItem 
          active={['semester', 'subject', 'module'].includes(activeView)} 
          onClick={() => onNavigate('semester')}
          icon={<BookOpen size={24} />}
          label="المناهج"
        />
        {user && (
          <MobileNavItem 
            active={activeView === 'progress'} 
            onClick={() => onNavigate('progress')}
            icon={<BarChart3 size={24} />}
            label="تقدمك"
          />
        )}
      </nav>

      <footer className="hidden md:block border-t border-primary/5 py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <AppLogo size="sm" />
          <p className="text-slate-400 text-sm font-medium mt-4">© 2026 مساعد لـبناء المستقبل - جميع الحقوق محفوظة لوزارة التعليم (محاكاة تعليمية)</p>
        </div>
      </footer>
    </div>
  );
}

function MobileNavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-primary" : "text-slate-400"
      )}
    >
      <div className={cn(
        "p-1 rounded-lg transition-all",
        active ? "bg-primary/10" : ""
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      )}
    >
      {icon}
      <span>{label}</span>
      {active && <motion.div layoutId="nav-pill" className="absolute" />}
    </button>
  );
}

export function SectionHeader({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      {subtitle && <p className="text-slate-500 text-lg">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, onClick, className, ...props }: { children: ReactNode, onClick?: () => void, className?: string, [key: string]: any }) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AppLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { 
      container: 'w-10 h-10', 
      icon: 16,
      dot: 'w-1.5 h-1.5'
    },
    md: { 
      container: 'w-24 h-24', 
      icon: 40,
      dot: 'w-3 h-3'
    },
    lg: { 
      container: 'w-40 h-40', 
      icon: 64,
      dot: 'w-5 h-5'
    }
  };
  const current = sizes[size];

  return (
    <div className={cn("relative flex items-center justify-center bg-[#FDF9F0] rounded-[25%] shadow-xl border-2 border-primary/10 overflow-hidden", current.container)}>
      {/* Decorative Dark Blue Corner */}
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary rotate-45 opacity-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="text-primary"
          >
            <GraduationCap size={current.icon} strokeWidth={2.5} />
          </motion.div>
          
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 text-accent"
          >
            <Sparkles size={current.icon / 2} fill="currentColor" />
          </motion.div>
        </div>

        <div className="flex gap-1 mt-1">
          <div className={cn("rounded-full bg-primary", current.dot)} />
          <div className={cn("rounded-full bg-accent", current.dot)} />
          <div className={cn("rounded-full bg-primary/30", current.dot)} />
        </div>
      </motion.div>

      {/* Abstract Waves */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
    </div>
  );
}

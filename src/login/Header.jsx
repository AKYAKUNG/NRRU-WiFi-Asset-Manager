import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon,} from 'lucide-react';

export default function Header({ isDarkMode, toggleTheme }) {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
      {/* ปุ่มกลับหน้าหลัก */}
      <button
        onClick={() => navigate('/')}
        className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800/60 transition-all shadow-xs active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>กลับหน้าหลัก</span>
      </button>

      {/* ปุ่มสลับธีม */}
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all shadow-xs"
        aria-label="Toggle Theme"
        title={isDarkMode ? "สลับเป็น Light Mode" : "สลับเป็น Dark Mode"}
      >
        {isDarkMode ? (
          <Sun className="w-4.5 h-4.5 text-amber-400 animate-spin-slow" />
        ) : (
          <Moon className="w-4.5 h-4.5 text-slate-600" />
        )}
      </button>
    </header>
  );
}
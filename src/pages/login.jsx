import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../login/Header';
import LoginForm from '../login/LoginForm';
import { Activity } from 'lucide-react';
import '../login/css/Login.css';

export default function Login() {
  const navigate = useNavigate();

  // 1. ตรวจสอบว่าผู้ใช้เคยล็อกอินแล้วหรือไม่ ถ้าล็อกอินแล้วให้ส่งไปหน้า /manage ทันที
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const allowedRoles = ['Officer', 'Super Admin', 'Admin', 'Network Engineer'];
        if (allowedRoles.includes(user.role)) {
          navigate('/manage', { replace: true });
        }
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  // 2. ระบบจัดการ Theme (Dark / Light Mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden bg-grid-pattern">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full pt-2 z-20">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto my-auto z-10 py-4 sm:py-6">
        <LoginForm />
      </main>

      {/* System Status Badge */}
      <div className="z-20 pb-2 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 shadow-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>สถานะระบบ: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">ปกติ (Online)</strong></span>
        </div>
      </div>
    </div>
  );
}
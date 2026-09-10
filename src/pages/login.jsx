import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../login/Header';
import LoginForm from '../login/LoginForm';
import { Activity } from 'lucide-react';
import '../login/css/Login.css';

export default function Login() {
  const navigate = useNavigate();

  // State สำหรับจัดการฟอร์ม
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ตรวจสอบสถานะการล็อกอินเดิม
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

  // ระบบจัดการ Theme
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

  // ฟังก์ชันยิง API ล็อกอิน
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:81/db-NRRU-WiFi-Asset-Manager/login.php',
        { username, password }
      );

      if (response.data.success) {
        const user = response.data.user;
        const allowedRoles = ['Officer', 'Admin'];

        if (allowedRoles.includes(user.role)) {
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/manage');
        } else {
          setErrorMessage('บัญชีผู้ใช้ของคุณไม่มีสิทธิ์เข้าถึงหน้าบริหารจัดการ');
        }
      } else {
        setErrorMessage(response.data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden bg-grid-pattern">
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] pointer-events-none" />

      <div className="w-full pt-2 z-20">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      <main className="w-full max-w-5xl mx-auto my-auto z-10 py-4 sm:py-6">
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          errorMessage={errorMessage}
          loading={loading}
          onSubmit={handleLogin}
        />
      </main>

      <div className="z-20 pb-2 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 shadow-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>สถานะระบบ: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">ปกติ (Online)</strong></span>
        </div>
      </div>
    </div>
  );
}
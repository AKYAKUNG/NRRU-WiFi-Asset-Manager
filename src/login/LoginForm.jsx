import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  ArrowUpSquare,
  HelpCircle,
  ShieldCheck,
  Wifi,
  Server,
  Database,
  Radio,
  Sparkles
} from 'lucide-react';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleKeyCheck = (e) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost/db-NRRU-WiFi-Asset-Manager/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setErrorMessage(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  // เช็คว่าช่องมีข้อมูลหรือไม่ สำหรับบังคับลอย Label
  const hasUsername = formData.username.trim().length > 0;
  const hasPassword = formData.password.trim().length > 0;

  return (
    <div className="login-glass-card bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden grid grid-cols-1 lg:grid-cols-2 transition-all duration-300 w-full">
      
      {/* ================= ฝั่งซ้าย: 3D Illustration ================= */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-56 h-56 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-blue-100 mb-6">
            <Wifi className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>NRRU Network & Asset Control</span>
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-tight">
            จัดการระบบเครือข่าย <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200">
              อย่างมืออาชีพ
            </span>
          </h2>
        </div>

        <div className="relative my-6 flex items-center justify-center py-4">
          <div className="absolute w-48 h-48 rounded-full bg-blue-500/30 blur-2xl animate-pulse" />

          <div className="relative z-10 animate-float-3d">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
              alt="3D Tech Network Illustration"
              className="w-full max-w-[260px] h-auto object-cover rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm"
            />
          </div>

          <div className="absolute -bottom-2 -left-2 z-20 bg-slate-900/85 backdrop-blur-md border border-white/15 p-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-float-reverse">
            <div className="p-2.5 bg-blue-500/20 rounded-xl text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Access Points</p>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                Active Status <Sparkles className="w-3 h-3 text-amber-400" />
              </p>
            </div>
          </div>

          <div className="absolute -top-2 -right-2 z-20 bg-slate-900/85 backdrop-blur-md border border-white/15 p-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-float-3d">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Bandwidth</p>
              <p className="text-xs font-bold text-emerald-400">Ultra Fast 10Gbps</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-300 font-medium flex items-center justify-between border-t border-white/10 pt-4">
          <span>NRRU Wi-Fi Asset Manager</span>
          <span className="flex items-center gap-1 text-cyan-300">
            <Database className="w-3.5 h-3.5" /> v2.5 Online
          </span>
        </div>
      </div>

      {/* ================= ฝั่งขวา: ฟอร์มเข้าสู่ระบบ ================= */}
      <div className="p-6 sm:p-10 flex flex-col justify-center h-full">
        {/* เพิ่ม mb-10 เพื่อเว้นระยะไม่ให้ Label ลอยไปชนข้อความหัวข้อ */}
        <div className="text-center sm:text-left mb-10">
          <div className="inline-flex lg:hidden items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 mb-3">
            <Wifi className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            เข้าสู่ระบบ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            กรอกบัญชีผู้ใช้เพื่อเข้าจัดการระบบสินทรัพย์เครือข่าย
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMessage && (
            <div className="flex items-start gap-3 p-3.5 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 rounded-2xl border border-rose-200 dark:border-rose-900/60 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Floating Username Field */}
          <div className="relative z-0 w-full group">
            <User className="w-4 h-4 absolute left-0 top-3 text-slate-400 dark:text-slate-500 transition-colors duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 pointer-events-none" />
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder=" "
              disabled={loading}
              className="peer w-full pl-7 pr-3 py-2.5 text-sm bg-transparent border-0 border-b-2 border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 transition-colors duration-300 disabled:opacity-50"
            />
            <label
              htmlFor="username"
              className={`absolute left-7 top-2.5 text-xs sm:text-sm text-slate-400 dark:text-slate-500 duration-300 transform origin-[0] pointer-events-none
              ${hasUsername ? '-translate-y-6 scale-90 left-0 font-semibold text-blue-600 dark:text-blue-400' : 'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0'}
              peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:left-0 peer-focus:font-semibold peer-focus:text-blue-600 dark:peer-focus:text-blue-400`}
            >
              ชื่อผู้ใช้งานของคุณ
            </label>
          </div>

          {/* Floating Password Field */}
          <div className="relative z-0 w-full group">
            <Lock className="w-4 h-4 absolute left-0 top-3 text-slate-400 dark:text-slate-500 transition-colors duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyCheck}
              onKeyUp={handleKeyCheck}
              placeholder=" "
              disabled={loading}
              className="peer w-full pl-7 pr-10 py-2.5 text-sm bg-transparent border-0 border-b-2 border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 transition-colors duration-300 disabled:opacity-50"
            />
            <label
              htmlFor="password"
              className={`absolute left-7 top-2.5 text-xs sm:text-sm text-slate-400 dark:text-slate-500 duration-300 transform origin-[0] pointer-events-none
              ${hasPassword ? '-translate-y-6 scale-90 left-0 font-semibold text-blue-600 dark:text-blue-400' : 'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0'}
              peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:left-0 peer-focus:font-semibold peer-focus:text-blue-600 dark:peer-focus:text-blue-400`}
            >
              รหัสผ่านของคุณ
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-2.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors z-10"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {isCapsLockOn && (
              <div className="absolute right-8 top-2.5 flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 animate-fade-in">
                <ArrowUpSquare className="w-3 h-3" /> Caps Lock
              </div>
            )}
          </div>

          {/* Remember Me & Help Link */}
          <div className="flex items-center justify-between text-xs pt-2">
            <label className="flex items-center gap-2 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500/40 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer transition-colors"
              />
              <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                จดจำการใช้งาน
              </span>
            </label>

            <a
              href="#help"
              onClick={(e) => {
                e.preventDefault();
                alert('หากพบปัญหาการเข้าใช้งาน กรุณาติดต่อสำนักคอมพิวเตอร์ NRRU');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>ลืมรหัสผ่าน / ช่วยเหลือ</span>
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-shimmer w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center sm:text-left">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>ระบบบริหารจัดการเครือข่ายไร้สาย NRRU</span>
          </p>
        </div>
      </div>

    </div>
  );
}
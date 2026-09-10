import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wifi, AlertTriangle, LogIn, LogOut, Sun, Moon, User } from "lucide-react";
import "./css/Header.css";

const ManageHeader = ({ onReportIssueClick, onLoginClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    setUser(savedUser ? JSON.parse(savedUser) : null);
  }, [location]);

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

  const handleLogin = () => {
    if (onLoginClick) onLoginClick();
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* LOGO & BRANDING */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <Wifi className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="header-status-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-slate-900"></span>
            </span>
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <h1 className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight whitespace-nowrap">
                <span className="brand-nrru">NRRU</span>{" "}
                <span className="text-blue-600 dark:text-blue-400">Wi-Fi</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-blue-600 text-white border border-blue-600 rounded-full shadow-xs">
                Asset Manager
              </span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-400 dark:text-slate-400 font-medium leading-tight truncate">
              ระบบบริหารจัดการเครือข่ายไร้สาย
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* ปุ่มสลับธีม */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn scale-90 sm:scale-100"
            title={isDarkMode ? "สลับเป็น Light Mode" : "สลับเป็น Dark Mode"}
          >
            <Sun className={`w-3.5 h-3.5 text-amber-500 transition-opacity duration-300 ${isDarkMode ? "opacity-30" : "opacity-100"}`} />
            <Moon className={`w-3.5 h-3.5 text-slate-400 dark:text-blue-200 transition-opacity duration-300 ${isDarkMode ? "opacity-100" : "opacity-30"}`} />
            <span className="theme-toggle-thumb">
              {isDarkMode ? <Moon className="w-3.5 h-3.5 theme-icon-moon" /> : <Sun className="w-3.5 h-3.5 theme-icon-sun" />}
            </span>
          </button>

          {/* ปุ่มแจ้งปัญหา (โมเดิร์น เติม Gradient + Pulse Light) */}
          <button
            onClick={onReportIssueClick}
            className="group relative overflow-hidden bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 hover:from-rose-600 hover:to-red-700 text-white p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 active:scale-95 transition-all duration-300 shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/35 border border-rose-400/30"
          >
            <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
              <AlertTriangle className="w-3.5 h-3.5 text-white stroke-[2.5] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="hidden sm:inline whitespace-nowrap tracking-wide">แจ้งปัญหา</span>
          </button>

          {/* ตรวจสอบผู้ใช้ */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* การ์ดชื่อผู้ใช้งาน (Badge สไตล์ Modern Profile) */}
              <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-300">
                <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 shrink-0 border border-blue-200/60 dark:border-blue-800/60">
                  <User className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal leading-none mb-0.5">ผู้ใช้งาน</span>
                  <span className="truncate max-w-[110px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {user.full_name || user.username}
                  </span>
                </div>
              </div>

              {/* ปุ่มออกจากระบบ (Soft Hover Effect) */}
              <button
                onClick={handleLogout}
                className="group bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-800/80 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all duration-300 shadow-2xs hover:shadow-sm"
                title="ออกจากระบบ"
              >
                <div className="p-1 rounded-lg bg-slate-200/60 dark:bg-slate-700/60 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                  <LogOut className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
                <span className="hidden sm:inline whitespace-nowrap">ออกจากระบบ</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="btn-header-shine btn-login-hover bg-blue-600 hover:bg-blue-500 text-white p-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-300 shadow-md shadow-blue-500/20"
            >
              <LogIn className="btn-icon-animate w-4 h-4 stroke-[2.2]" />
              <span className="hidden sm:inline whitespace-nowrap">เข้าสู่ระบบ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ManageHeader;
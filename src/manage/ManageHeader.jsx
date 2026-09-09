import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wifi, AlertTriangle, LogIn, Sun, Moon } from "lucide-react";
import "./css/Header.css";

const ManageHeader = ({ onReportIssueClick, onLoginClick }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const navigate = useNavigate();

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

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    }
    navigate("/login"); // สั่งเปลี่ยนหน้าไปที่ /login ทันที
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
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

            <p className="text-[9px] sm:text-[11px] text-slate-400 dark:text-slate-400 font-medium leading-tight truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
              ระบบบริหารจัดการเครือข่ายไร้สาย
            </p>
          </div>
        </div>

        {/* ACTION CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* ปุ่มสลับธีม */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn scale-90 sm:scale-100"
            title={isDarkMode ? "สลับเป็น Light Mode" : "สลับเป็น Dark Mode"}
            aria-label="Toggle Theme"
          >
            <Sun
              className={`w-3.5 h-3.5 text-amber-500 transition-opacity duration-300 ${isDarkMode ? "opacity-30" : "opacity-100"}`}
            />
            <Moon
              className={`w-3.5 h-3.5 text-slate-400 dark:text-blue-200 transition-opacity duration-300 ${isDarkMode ? "opacity-100" : "opacity-30"}`}
            />
            <span className="theme-toggle-thumb">
              {isDarkMode ? (
                <Moon className="w-3.5 h-3.5 theme-icon-moon" />
              ) : (
                <Sun className="w-3.5 h-3.5 theme-icon-sun" />
              )}
            </span>
          </button>

          {/* ปุ่มแจ้งปัญหา */}
          <button
            onClick={onReportIssueClick}
            className="btn-header-shine btn-report-pulse bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 p-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm shadow-rose-500/20"
          >
            <AlertTriangle className="btn-icon-animate w-4 h-4 text-white stroke-[2.2]" />
            <span className="hidden sm:inline whitespace-nowrap">
              แจ้งปัญหา
            </span>
          </button>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            onClick={handleLogin}
            className="btn-header-shine btn-login-hover bg-blue-600 hover:bg-blue-500 text-white p-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-300"
          >
            <LogIn className="btn-icon-animate w-4 h-4 stroke-[2.2]" />
            <span className="hidden sm:inline whitespace-nowrap">
              เข้าสู่ระบบ
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ManageHeader;
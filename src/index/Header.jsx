// src/index/Header.jsx
import { useState, useEffect } from "react";
import { Wifi, AlertTriangle, LogIn, Sun, Moon } from "lucide-react";
import "./css/Header.css";

/**
 * Header Component
 * คอมโพเนนต์ส่วนหัวหลักของระบบ NRRU Wi-Fi Asset Manager
 * รองรับการสลับ Theme (Dark/Light), แสดงไฟสถานะ Real-time และปุ่ม Action หลัก
 */
const Header = ({ onReportIssueClick, onLoginClick }) => {
  // =========================================================================
  // 1. STATE & THEME MANAGEMENT (จัดการธีมและข้อมูลสถานะ)
  // =========================================================================

  // ดึงค่าธีมตั้งต้นจาก localStorage หากไม่มีจะอ้างอิงจาก System Preference ของผู้ใช้
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // ซิงก์ Class 'dark' บน <html> สำหรับ Tailwind CSS และบันทึกค่าลง localStorage
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

  // ฟังก์ชันสลับโหมด Dark / Light Mode
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // =========================================================================
  // 2. RENDER UI
  // =========================================================================
  return (
    <header className="sticky top-0 z-50 header-glass border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 md:px-8 md:py-3.5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* ------------------------------------------------------------------- */}
        {/* SECTION A: BRANDING & LOGO (โลโก้ และข้อมูลระบบ)                    */}
        {/* ------------------------------------------------------------------- */}
        <div className="flex items-center gap-3 cursor-pointer group">
          {/* ไอคอนโลโก้ Wi-Fi + ไฟสัญญาณ Real-time Pulse Status */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <Wifi className="w-5 h-5 stroke-[2.5]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="header-status-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-slate-900"></span>
            </span>
          </div>

          {/* ชื่อระบบ และ Badge ระบุประเภทระบบ */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-extrabold tracking-tight">
                <span className="brand-nrru">NRRU</span>{" "}
                <span className="text-blue-600 dark:text-blue-400">Wi-Fi</span>
              </h1>

              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-blue-600 text-white dark:bg-blue-600 dark:text-white border border-blue-600 rounded-full shadow-xs">
                Asset Manager
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium hidden md:block">
              ระบบบริหารจัดการและติดตามสถานะครุภัณฑ์เครือข่ายไร้สาย
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* SECTION B: ACTION CONTROLS (ปุ่มเครื่องมือด้านขวา)                  */}
        {/* ------------------------------------------------------------------- */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* 🔘 ปุ่มที่ 1: สลับธีม Dark / Light Mode */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
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

          {/* ⚠️ ปุ่มที่ 2: แจ้งปัญหา (Alert Solid Red Button) */}
          <button
            onClick={onReportIssueClick}
            className="btn-header-shine btn-report-pulse bg-rose-600 hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500 text-white border border-rose-500 dark:border-rose-500 px-3.5 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 active:scale-95 transition-all shadow-sm shadow-rose-500/20"
          >
            <AlertTriangle className="btn-icon-animate w-4 h-4 text-white stroke-[2.2]" />
            <span>แจ้งปัญหา</span>
          </button>

          {/* 🔑 ปุ่มที่ 3: เข้าสู่ระบบ (Primary Executive Blue Button) */}
          <button
            onClick={onLoginClick}
            className="btn-header-shine btn-login-hover bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all duration-300"
          >
            <LogIn className="btn-icon-animate w-4 h-4 stroke-[2.2]" />
            <span>เข้าสู่ระบบ</span>
          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;
// src/index/LoadingScreen.jsx
import { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import './css/LoadingScreen.css';

export default function ManageLoadingScreen() {
  // อ่านค่าธีมทันทีตอนสร้าง State ( Synchronous ) ไม่ต้องรอ useEffect
  const [isDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hasDarkClass = document.documentElement.classList.contains('dark');

    // ถ้ามีการตั้งค่า 'dark' หรือระบบเป็น Dark Mode ให้สว่างดำตั้งแต่แรก
    return savedTheme === 'dark' || (!savedTheme && systemPrefersDark) || hasDarkClass;
  });

  useEffect(() => {
    // กำหนด class ให้ <html> สอดคล้องกัน
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center font-sans ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div
        className={`flex flex-col items-center gap-5 p-8 rounded-3xl backdrop-blur-xl border shadow-2xl max-w-sm w-full mx-4 text-center ${
          isDark
            ? 'bg-slate-900/80 border-slate-800/80 shadow-slate-950/60'
            : 'bg-white/80 border-slate-200/80 shadow-slate-200/50'
        }`}
      >
        {/* Spinner & Glowing Icon */}
        <div className="relative flex items-center justify-center my-2">
          <div className="loader-spinner" />
          <div
            className={`loader-icon-glow ${
              isDark
                ? 'bg-blue-950/60 border border-blue-900/40'
                : 'bg-blue-50/80 border border-blue-100'
            }`}
          >
            <Wifi className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        </div>

        {/* ข้อความกำกับ */}
        <div className="space-y-1.5">
          <h3
            className={`text-base font-bold tracking-wide ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}
          >
            NRRU WiFi Asset Manager
          </h3>
          <p
            className={`text-xs font-medium leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            กำลังโหลดและประมวลผลข้อมูล Access Point...
          </p>
        </div>

        {/* Progress Bar */}
        <div
          className={`w-full h-1.5 rounded-full overflow-hidden mt-1 ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}
        >
          <div className="loader-progress-fill" />
        </div>
      </div>
    </div>
  );
}
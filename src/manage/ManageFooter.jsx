// src/index/Footer.jsx
import { Wifi, ShieldCheck } from 'lucide-react';

function ManageFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-6 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          
          {/* ฝั่งซ้าย: โลโก้ และชื่อระบบ */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <div className="p-1.5 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              NRRU WiFi Asset Manager
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs">
              มหาวิทยาลัยราชภัฏนครราชสีมา
            </span>
          </div>

          {/* ฝั่งขวา: สถานะระบบ & ลิขสิทธิ์ */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-end text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Internal Asset System</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-400 dark:text-slate-500">
              © {currentYear} All Rights Reserved.
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default ManageFooter;
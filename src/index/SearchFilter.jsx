// src/index/SearchFilter.jsx
import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Building2,
  Activity,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  WifiOff,
  AlertCircle,
  Wrench,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './css/SearchFilter.css';

// รายการตัวเลือกสถานะพร้อมไอคอนและสีประจำสถานะ
const STATUS_OPTIONS = [
  { value: 'All', label: 'ทุกสถานะ', icon: Filter, color: 'text-slate-400 dark:text-slate-500' },
  { value: 'Online', label: 'Online (ปกติ)', icon: CheckCircle2, color: 'text-emerald-500' },
  { value: 'Offline', label: 'Offline (ขัดข้อง)', icon: WifiOff, color: 'text-rose-500' },
  { value: 'Unstable', label: 'Unstable (สัญญาณไม่เสถียร)', icon: AlertCircle, color: 'text-amber-500' },
  { value: 'Maintenance', label: 'Maintenance (กำลังซ่อมบำรุง)', icon: Wrench, color: 'text-indigo-500' },
];

function SearchFilter({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedBuilding,
  setSelectedBuilding,
  buildings = [],
  onExportExcel,
  onExportPDF,
}) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusRef = useRef(null);
  

  const hasFilterActive = searchTerm !== '' || selectedStatus !== 'All' || selectedBuilding !== 'All';

  // ปิด Custom Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedBuilding('All');
  };

  // ดึงข้อมูลสถานะปัจจุบันที่ถูกเลือก
  const currentStatusObj = STATUS_OPTIONS.find((item) => item.value === selectedStatus) || STATUS_OPTIONS[0];
  const CurrentIcon = currentStatusObj.icon;

  return (
    <div className="search-filter-glass p-5 rounded-2xl shadow-sm mb-6 transition-all duration-300">
      
      {/* HEADER & EXPORT BUTTONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            🔍 กรองข้อมูล & เครื่องมือค้นหา
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ระบุเงื่อนไขเพื่อค้นหาเครื่อง Access Point หรือส่งออกข้อมูลเป็นรายงาน
          </p>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
            <span>Export Excel</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400 stroke-[2.2]" />
            <span>Export PDF</span>
          </motion.button>
        </div>
      </div>

      {/* FILTER INPUTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* 1. ช่องค้นหาทั่วไป */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            ค้นหาทั่วไป
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 stroke-[2.2]" />
            <input
              type="text"
              placeholder="ยี่ห้อ, รุ่น, IP, MAC, รหัสครุภัณฑ์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>
        </div>

        {/* 2. อาคาร */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>อาคาร</span>
          </label>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all cursor-pointer"
          >
            <option value="All" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
              ทุกอาคาร
            </option>
            {buildings.map((building, index) => (
              <option 
                key={index} 
                value={building} 
                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              >
                {building}
              </option>
            ))}
          </select>
        </div>

        {/* 3. สถานะการเชื่อมต่อ (Custom Dropdown พร้อมไอคอนในเมนู) */}
        <div className="relative" ref={statusRef}>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>สถานะการเชื่อมต่อ</span>
            </label>
            
            {hasFilterActive && (
              <button
                onClick={handleReset}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>รีเซ็ต</span>
              </button>
            )}
          </div>
          
          {/* ปุ่ม Trigger Dropdown */}
          <button
            type="button"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <CurrentIcon className={`w-4 h-4 stroke-[2.2] shrink-0 ${currentStatusObj.color}`} />
              <span className="truncate">{currentStatusObj.label}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* รายการตัวเลือกแบบ Custom (พร้อม Animation) */}
          {/* รายการตัวเลือกแบบ Custom (พร้อม Animation) */}
<AnimatePresence>
  {isStatusOpen && (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      /* ปรับปรุง Class ตรงนี้ */
      className="absolute right-0 sm:left-0 z-50 w-full min-w-[240px] mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl py-1 max-h-64 overflow-y-auto backdrop-blur-none"
    >
      {STATUS_OPTIONS.map((option) => {
        const ItemIcon = option.icon;
        const isSelected = selectedStatus === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setSelectedStatus(option.value);
              setIsStatusOpen(false);
            }}
            className={`w-full px-3 py-2.5 text-xs flex items-center gap-2.5 transition-colors cursor-pointer text-left whitespace-nowrap ${
              isSelected
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ItemIcon className={`w-4 h-4 stroke-[2.2] shrink-0 ${option.color}`} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </motion.div>
  )}
</AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default SearchFilter;
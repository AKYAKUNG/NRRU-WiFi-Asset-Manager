// src/index/SummaryCharts.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  PieChart as PieIcon,
  BarChart3,
  Radio,
  CheckCircle2,
  AlertCircle,
  Wrench,
  WifiOff,
} from "lucide-react";
import { motion } from "framer-motion";
import "./css/SummaryCharts.css";

// =========================================================================
// CUSTOM TOOLTIP (ย้ายไว้นอก Component หลัก เพื่อแก้ Error Re-render และ ESLint)
// =========================================================================
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const item = data?.payload || {};

    // ดึงชื่อที่แสดง (รองรับทั้ง Donut Chart และ Bar Chart)
    const title = data?.name || item?.building || "ไม่ระบุ";
    // ดึงจำนวนตัวเลข
    const countValue = data?.value ?? item?.count ?? 0;

    return (
      <div className="chart-tooltip-glass p-3 rounded-xl text-xs shadow-xl border border-slate-200/50 dark:border-slate-700/60">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">
          {title}
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-slate-600 dark:text-slate-300">
            จำนวน:{" "}
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
              {countValue}
            </span>{" "}
            เครื่อง
          </span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * SummaryCharts Component
 */
function SummaryCharts({ accessPoints = [] }) {
  const total = accessPoints.length;

  // 1. คำนวณสถิติ
  const onlineCount = accessPoints.filter((ap) => ap.connection_status === "Online").length;
  const offlineCount = accessPoints.filter((ap) => ap.connection_status === "Offline").length;
  const maintenanceCount = accessPoints.filter((ap) => ap.connection_status === "Maintenance").length;
  const unstableCount = accessPoints.filter((ap) => ap.connection_status === "Unstable").length;

  const statusConfig = [
    {
      name: "Online",
      value: onlineCount,
      color: "#10B981",
      badgeStyle: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
      icon: CheckCircle2,
    },
    {
      name: "Offline",
      value: offlineCount,
      color: "#EF4444",
      badgeStyle: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
      icon: WifiOff,
    },
    {
      name: "Unstable",
      value: unstableCount,
      color: "#F59E0B",
      badgeStyle: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
      icon: AlertCircle,
    },
    {
      name: "Maintenance",
      value: maintenanceCount,
      color: "#6366F1",
      badgeStyle: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60",
      icon: Wrench,
    },
  ];

  const statusData = statusConfig.filter((item) => item.value > 0);

  const buildingCounts = accessPoints.reduce((acc, ap) => {
    const buildingName = ap.building || "ไม่ระบุอาคาร";
    acc[buildingName] = (acc[buildingName] || 0) + 1;
    return acc;
  }, {});

  const buildingData = Object.keys(buildingCounts).map((building) => ({
    building,
    count: buildingCounts[building],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      {/* Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="summary-card-glass p-6 rounded-2xl flex flex-col justify-between"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <PieIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                สัดส่วนสถานะการใช้งาน
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-400">
                สรุปการเชื่อมต่ออุปกรณ์ทั้งหมด
              </p>
            </div>
          </div>
          
          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-bold border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            รวม {total} เครื่อง
          </span>
        </div>

        {total === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-medium">
            ไม่มีข้อมูลในระบบ
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-64">
            <div className="w-full sm:w-1/2 h-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1200}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" cornerRadius={6} />
                    ))}
                  </Pie>
                  {/* เรียกใช้ CustomTooltip จุดที่ 1 */}
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                  {total}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  TOTAL AP
                </span>
              </div>
            </div>

            <div className="w-full sm:w-1/2 space-y-2.5">
              {statusConfig.map((item) => {
                const IconComponent = item.icon;
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg border ${item.badgeStyle}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {item.value}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal ml-1">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="summary-card-glass p-6 rounded-2xl flex flex-col justify-between"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
            <BarChart3 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              จำนวน Access Point แยกตามอาคาร
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400">
              การกระจายตัวของอุปกรณ์ในแต่ละพื้นที่
            </p>
          </div>
        </div>

        {buildingData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-medium">
            ไม่มีข้อมูลอาคาร
          </div>
        ) : (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="barBlueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.85} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis
                  dataKey="building"
                  tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                {/* เรียกใช้ CustomTooltip จุดที่ 2 */}
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.1)", radius: 8 }} />
                <Bar
                  dataKey="count"
                  fill="url(#barBlueGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

    </div>
  );
}

export default SummaryCharts;
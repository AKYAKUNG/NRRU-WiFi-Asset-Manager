import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  User,
  Gauge,
  MapPin,
  Building,
  Globe,
  Wifi,
  Edit3,
  Layers,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import "./css/AccessPointList.css";

function ManageAccessPointList({
  loading = false,
  filteredAccessPoints = [],
  totalCount = 0,
  onResetFilters,
  hasFilterActive = false,
  onEdit,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("cards"); // 'cards' หรือ 'table'
  const buildingsPerPage = 1;

  // รีเซ็ตไปหน้า 1 เมื่อมีการกรองข้อมูลใหม่
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAccessPoints]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Online":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60";
      case "Offline":
        return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/60";
      case "Maintenance":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/60";
      case "Unstable":
        return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-700/60";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const getStatusDotClass = (status) => {
    switch (status) {
      case "Online":
        return "bg-emerald-500 animate-pulse";
      case "Offline":
        return "bg-rose-500";
      case "Maintenance":
        return "bg-amber-500";
      case "Unstable":
        return "bg-purple-500";
      default:
        return "bg-slate-400";
    }
  };

  const getFormattedDeviceTitle = (brand = "", model = "") => {
    const cleanBrand = String(brand || "").trim();
    const cleanModel = String(model || "").trim();

    if (!cleanBrand) return cleanModel || "Access Point";
    if (!cleanModel) return cleanBrand;

    if (cleanBrand.toLowerCase().includes(cleanModel.toLowerCase())) {
      return cleanBrand;
    }
    if (cleanModel.toLowerCase().includes(cleanBrand.toLowerCase())) {
      return cleanModel;
    }

    const brandWords = cleanBrand.split(/\s+/);
    const modelWords = cleanModel.split(/\s+/);

    const uniqueModelWords = modelWords.filter(
      (word) => !brandWords.some((b) => b.toLowerCase() === word.toLowerCase())
    );

    return `${cleanBrand} ${uniqueModelWords.join(" ")}`.trim();
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 0 || diffInMinutes < 1) return "เมื่อสักครู่นี้";
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ชม. ที่แล้ว`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;

    return date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
  };

  const getRecentBadge = (ap) => {
    const rawDate = ap?.updated_at || ap?.created_at;
    if (!rawDate) return null;

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return null;

    const diffInHours = (new Date() - date) / (1000 * 60 * 60);

    if (diffInHours >= 0 && diffInHours <= 24) {
      const isNew =
        ap?.created_at &&
        (!ap?.updated_at || ap?.created_at === ap?.updated_at);
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
            isNew
              ? "bg-amber-500 text-white border border-amber-600"
              : "bg-indigo-500 text-white border border-indigo-600"
          }`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          {isNew ? "ใหม่" : "อัปเดต"}
        </span>
      );
    }
    return null;
  };

  // 1. เรียงลำดับตามชื่ออาคาร ชั้น และ IP
  const sortedAccessPoints = [...filteredAccessPoints].sort((a, b) => {
    const buildingA = a?.building || "";
    const buildingB = b?.building || "";

    const buildingCompare = buildingA.localeCompare(buildingB, "th", {
      numeric: true,
    });
    if (buildingCompare !== 0) return buildingCompare;

    const floorA = parseInt(a?.floor, 10);
    const floorB = parseInt(b?.floor, 10);
    const isANum = !isNaN(floorA);
    const isBNum = !isNaN(floorB);

    if (isANum && isBNum) {
      if (floorA !== floorB) return floorA - floorB;
    } else if (isANum) return -1;
    else if (isBNum) return 1;
    else {
      const floorStrA = String(a?.floor || "");
      const floorStrB = String(b?.floor || "");
      const floorCompare = floorStrA.localeCompare(floorStrB, "th", {
        numeric: true,
      });
      if (floorCompare !== 0) return floorCompare;
    }

    return (a?.ip_address || "").localeCompare(b?.ip_address || "", "en", {
      numeric: true,
    });
  });

  // 2. จัดกลุ่มข้อมูลทั้งหมดตาม: อาคาร ➔ ชั้น
  const allGroupedAccessPoints = sortedAccessPoints.reduce((acc, ap) => {
    const buildingName = ap?.building || "ไม่ระบุอาคาร/สถานที่";
    const floorName = ap?.floor ? `ชั้น ${ap.floor}` : "ไม่ระบุชั้น";

    if (!acc[buildingName]) {
      acc[buildingName] = {};
    }
    if (!acc[buildingName][floorName]) {
      acc[buildingName][floorName] = [];
    }
    acc[buildingName][floorName].push(ap);
    return acc;
  }, {});

  // 3. แบ่งหน้าตามรายชื่ออาคาร
  const buildingList = Object.keys(allGroupedAccessPoints);
  const totalPages = Math.ceil(buildingList.length / buildingsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const currentBuildingNames = buildingList.slice(
    (activePage - 1) * buildingsPerPage,
    activePage * buildingsPerPage
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            รายงานรายการ Access Point
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            แสดงข้อมูลทั้งหมด {filteredAccessPoints.length} จาก {totalCount}{" "}
            รายการ ({buildingList.length} อาคาร)
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* ปุ่มสลับมุมมอง */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-300/50 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "cards"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
              title="มุมมองการ์ด (จัดกลุ่มอาคาร)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">การ์ด</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
              title="มุมมองตารางรายงาน"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden md:inline">ตาราง</span>
            </button>
          </div>

          {hasFilterActive && (
            <button
              type="button"
              onClick={onResetFilters}
              className="btn-interactive text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer"
            >
              ล้างการค้นหา
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 border dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800/40 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="skeleton-loader h-5 w-32 rounded-md"></div>
                <div className="skeleton-loader h-6 w-20 rounded-full"></div>
              </div>
              <div className="skeleton-loader h-16 w-full rounded-xl"></div>
              <div className="skeleton-loader h-12 w-full rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredAccessPoints.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Wifi className="w-10 h-10 mx-auto mb-3 opacity-40 stroke-1" />
          <p className="text-base font-medium text-slate-600 dark:text-slate-400">
            ไม่พบข้อมูล Access Point ที่ตรงกับเงื่อนไขการค้นหา
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW (มุมมองตารางรายงาน) */
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3 text-center w-12">#</th>
                <th className="p-3">รหัสครุภัณฑ์</th>
                <th className="p-3">อุปกรณ์ / รุ่น</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">MAC Address</th>
                <th className="p-3">สถานที่ / จุดติดตั้ง</th>
                <th className="p-3 text-center">สถานะ</th>
                <th className="p-3">ผู้รับผิดชอบ</th>
                <th className="p-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedAccessPoints.map((ap, idx) => (
                <tr
                  key={ap?.id || `ap-table-${idx}`}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-3 text-center font-medium text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {ap?.asset_code || "-"}
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                    {getFormattedDeviceTitle(ap?.brand, ap?.model)}
                  </td>
                  <td className="p-3 font-mono text-sky-700 dark:text-sky-300 font-semibold">
                    {ap?.ip_address || "-"}
                  </td>
                  <td className="p-3 font-mono text-slate-500 dark:text-slate-400">
                    {ap?.mac_address || "-"}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {ap?.building || "-"} {ap?.floor ? `(ชั้น ${ap.floor})` : ""}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      {ap?.installation_point || "-"}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(
                        ap?.connection_status
                      )}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(ap?.connection_status)}`} />
                      {ap?.connection_status || "Unknown"}
                    </span>
                  </td>
                  <td className="p-3 font-medium">{ap?.responsible_person || "-"}</td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => onEdit && onEdit(ap)}
                      className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
                      title="แก้ไขข้อมูล"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARD VIEW (มุมมองการ์ดแบ่งกลุ่มตามอาคารและชั้น) */
        <>
          <div className="space-y-10">
            {currentBuildingNames.map((buildingName) => {
              const floors = allGroupedAccessPoints[buildingName];
              const totalInBuilding = Object.values(floors).reduce(
                (sum, list) => sum + list.length,
                0
              );

              return (
                <div key={buildingName} className="space-y-6">
                  {/* Header อาคาร */}
                  <div className="flex items-center gap-2 pb-2.5 border-b-2 border-indigo-500/20 dark:border-indigo-500/40">
                    <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {buildingName}
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {totalInBuilding} รายการ
                    </span>
                  </div>

                  {/* รายการแต่ละชั้นในอาคารนี้ */}
                  <div className="space-y-6 pl-1 sm:pl-3">
                    {Object.entries(floors).map(([floorName, apList]) => (
                      <div key={floorName} className="space-y-4">
                        {/* Header ชั้น */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800/90 px-3 py-1 rounded-lg flex items-center gap-1.5 border border-slate-300/60 dark:border-slate-700">
                            <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                            {floorName} ({apList.length})
                          </span>
                          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                        </div>

                        {/* Grid แสดงการ์ด AP */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {apList.map((ap, idx) => {
                            const recentBadge = getRecentBadge(ap);
                            const timeAgo = formatTimeAgo(
                              ap?.updated_at || ap?.created_at
                            );
                            const title = getFormattedDeviceTitle(
                              ap?.brand,
                              ap?.model
                            );

                            return (
                              <div
                                key={ap?.id || `ap-${idx}`}
                                className="group overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                              >
                                <div>
                                  {/* SECTION 1: HEADER */}
                                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <h3
                                            className="font-bold text-slate-900 dark:text-slate-100 text-base truncate"
                                            title={title}
                                          >
                                            {title}
                                          </h3>
                                          {recentBadge}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                                          MAC: {ap?.mac_address || "-"}
                                        </p>
                                      </div>

                                      {/* Status Badge */}
                                      <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 shadow-xs ${getStatusBadgeClass(
                                          ap?.connection_status
                                        )}`}
                                      >
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(
                                            ap?.connection_status
                                          )}`}
                                        ></span>
                                        {ap?.connection_status || "Unknown"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="p-4 space-y-3">
                                    {/* SECTION 2: LOCATION & NETWORK */}
                                    <div className="p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-2">
                                      <div className="flex items-start gap-2 text-xs text-sky-950 dark:text-sky-200">
                                        <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                                        <span className="leading-tight">
                                          <strong className="font-semibold text-sky-900 dark:text-sky-300">
                                            จุดติดตั้ง:
                                          </strong>{" "}
                                          {ap?.installation_point || "-"}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 text-xs text-sky-950 dark:text-sky-200">
                                        <Building className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                                        <span>
                                          <strong className="font-semibold text-sky-900 dark:text-sky-300">
                                            สถานที่:
                                          </strong>{" "}
                                          {ap?.building || "-"}{" "}
                                          {ap?.floor ? `(ชั้น ${ap.floor})` : ""}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 pt-1.5 border-t border-sky-200/60 dark:border-sky-800/50 text-xs">
                                        <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                                        <span className="font-mono text-sky-700 dark:text-sky-300 font-bold bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-md">
                                          {ap?.ip_address || "-"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* SECTION 3: METRICS & RESPONSIBILITY */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/70 dark:border-emerald-900/40">
                                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 mb-1">
                                          <Gauge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                          <span>ความเร็ว</span>
                                        </div>
                                        <p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 truncate">
                                          {ap?.current_link_speed || "-"}
                                        </p>
                                      </div>

                                      <div className="p-2.5 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200/70 dark:border-amber-900/40">
                                        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-400 mb-1">
                                          <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                          <span>ผู้รับผิดชอบ</span>
                                        </div>
                                        <p className="text-xs font-bold text-amber-950 dark:text-amber-200 truncate">
                                          {ap?.responsible_person || "-"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* SECTION 4: FOOTER ACTION */}
                                <div className="px-4 pb-4 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => onEdit && onEdit(ap)}
                                    className="w-full py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white border border-indigo-200/80 dark:border-indigo-800/50 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    แก้ไขข้อมูล
                                  </button>

                                  {timeAgo && (
                                    <div className="mt-2.5 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-end gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>อัปเดตล่าสุด {timeAgo}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-5 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 order-2 sm:order-1">
                แสดงอาคารที่ {activePage} จาก {totalPages} อาคาร (รวม{" "}
                {filteredAccessPoints.length} รายการ)
              </span>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={activePage === 1}
                  className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="อาคารก่อนหน้า"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {activePage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={activePage === totalPages}
                  className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="อาคารถัดไป"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

ManageAccessPointList.propTypes = {
  loading: PropTypes.bool,
  filteredAccessPoints: PropTypes.array,
  totalCount: PropTypes.number,
  onResetFilters: PropTypes.func,
  hasFilterActive: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default ManageAccessPointList;
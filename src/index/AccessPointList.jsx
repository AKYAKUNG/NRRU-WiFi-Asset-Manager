// src/components/AccessPointList.jsx
import { useState, useEffect, useMemo } from "react";
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
  Layers,
  AlertTriangle,
} from "lucide-react";
import "./css/AccessPointList.css";

function AccessPointList({
  loading = false,
  filteredAccessPoints = [],
  totalCount = 0,
  onResetFilters,
  hasFilterActive = false,
  onReportIssue,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const buildingsPerPage = 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAccessPoints]);

  // ฟังก์ชันจัดการเมื่อคลิกปุ่มแจ้งปัญหา (ให้อยู่หน้าเดิม)
  const handleReportClick = (ap) => {
    if (onReportIssue) {
      onReportIssue(ap);
    }
  };

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

  const getDeviceTitle = (brand = "", model = "") => {
    if (!brand && !model) return "Access Point";
    if (!brand) return model;
    if (!model) return brand;

    const cleanBrand = brand.trim();
    const cleanModel = model.trim();
    const bLower = cleanBrand.toLowerCase();
    const mLower = cleanModel.toLowerCase();

    if (bLower === mLower || bLower.includes(mLower)) {
      return cleanBrand;
    }
    if (mLower.includes(bLower)) {
      return cleanModel;
    }

    return `${cleanBrand} ${cleanModel}`;
  };

  const allGroupedAccessPoints = useMemo(() => {
    const sorted = [...filteredAccessPoints].sort((a, b) => {
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

    return sorted.reduce((acc, ap) => {
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
  }, [filteredAccessPoints]);

  const buildingList = useMemo(() => Object.keys(allGroupedAccessPoints), [allGroupedAccessPoints]);
  const totalPages = Math.ceil(buildingList.length / buildingsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentBuildingNames = buildingList.slice(
    (currentPage - 1) * buildingsPerPage,
    currentPage * buildingsPerPage,
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            รายการ Access Point
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            แสดงข้อมูลทั้งหมด {filteredAccessPoints.length} จาก {totalCount}{" "}
            รายการ ({buildingList.length} อาคาร)
          </p>
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
      ) : (
        /* Data Grouped by Building -> Floor */
        <>
          <div className="space-y-10">
            {currentBuildingNames.map((buildingName) => {
              const floors = allGroupedAccessPoints[buildingName];
              const totalInBuilding = Object.values(floors).reduce(
                (sum, list) => sum + list.length,
                0,
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

                  {/* รายการแต่ละชั้น */}
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
                              ap?.updated_at || ap?.created_at,
                            );
                            const title = getDeviceTitle(
                              ap?.brand,
                              ap?.model,
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
                                            className="font-bold text-slate-800 dark:text-slate-100 text-base truncate"
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

                                      <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 shadow-xs ${getStatusBadgeClass(
                                          ap?.connection_status,
                                        )}`}
                                      >
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(
                                            ap?.connection_status,
                                          )}`}
                                        ></span>
                                        {ap?.connection_status || "Unknown"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="p-4 space-y-3">
                                    {/* SECTION 2: LOCATION & IP */}
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
                                          {ap?.floor
                                            ? `(ชั้น ${ap.floor})`
                                            : ""}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-sky-200/60 dark:border-sky-800/50 text-xs">
                                        <div className="flex items-center gap-1.5">
                                          <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                                          <span className="font-mono text-sky-700 dark:text-sky-300 font-bold bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-md">
                                            {ap?.ip_address || "-"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* SECTION 3: SPEED & RESPONSIBLE PERSON */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/70 dark:border-emerald-900/40">
                                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 mb-1">
                                          <Gauge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                          <span>ความเร็วเชื่อมต่อ</span>
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

                                {/* SECTION 4: FOOTER & REPORT BUTTON */}
                                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/50">
                                  <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 min-w-0">
                                    {timeAgo && (
                                      <>
                                        <Clock className="w-3 h-3 shrink-0" />
                                        <span className="truncate">อัปเดต {timeAgo}</span>
                                      </>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleReportClick(ap)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95"
                                    title={`แจ้งปัญหาสำหรับ ${title}`}
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
                                    <span>แจ้งปัญหา</span>
                                  </button>
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
                แสดงอาคารที่ {currentPage} จาก {totalPages} อาคาร (รวม{" "}
                {filteredAccessPoints.length} รายการ)
              </span>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="อาคารก่อนหน้า"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
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

AccessPointList.propTypes = {
  loading: PropTypes.bool,
  filteredAccessPoints: PropTypes.array,
  totalCount: PropTypes.number,
  onResetFilters: PropTypes.func,
  hasFilterActive: PropTypes.bool,
  onReportIssue: PropTypes.func,
};

export default AccessPointList;
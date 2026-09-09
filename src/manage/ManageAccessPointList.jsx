// src/components/AccessPointList.jsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Clock } from 'lucide-react';
import './css/AccessPointList.css';

function ManageAccessPointList({
  loading,
  filteredAccessPoints = [],
  totalCount = 0,
  onResetFilters,
  hasFilterActive
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // รีเซ็ตกลับไปหน้า 1 เมื่อมีการกรองข้อมูลใหม่
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAccessPoints.length]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Online':
        return 'status-online';
      case 'Offline':
        return 'status-offline';
      case 'Maintenance':
        return 'status-maintenance';
      case 'Unstable':
        return 'status-unstable';
      default:
        return 'status-unstable';
    }
  };

  // ฟังก์ชันคำนวณเวลาที่ผ่านไป (Time Ago)
  const formatTimeAgo = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 0) return 'เมื่อสักครู่นี้';
    if (diffInMinutes < 1) return 'เมื่อสักครู่นี้';
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ชม. ที่แล้ว`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;

    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  // ตรวจสอบว่าเป็นรายการที่เพิ่งเพิ่ม/อัปเดตไม่เกิน 24 ชั่วโมงหรือไม่
  const getRecentBadge = (ap) => {
    const rawDate = ap.updated_at || ap.created_at;
    if (!rawDate) return null;

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return null;

    const diffInHours = (new Date() - date) / (1000 * 60 * 60);

    // หากปรับปรุงภายใน 24 ชั่วโมง ให้แสดง Badge พิเศษ
    if (diffInHours >= 0 && diffInHours <= 24) {
      const isNew = ap.created_at && (!ap.updated_at || ap.created_at === ap.updated_at);
      return (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs ${
            isNew
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          {isNew ? 'ใหม่' : 'อัปเดต'}
        </span>
      );
    }
    return null;
  };

  // คำนวณการตัดแบ่งหน้า (Pagination)
  const totalPages = Math.ceil(filteredAccessPoints.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAccessPoints = filteredAccessPoints.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">
          รายการ Access Point ({filteredAccessPoints.length} / {totalCount} รายการ)
        </h2>

        {hasFilterActive && (
          <button
            onClick={onResetFilters}
            className="btn-interactive text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline"
          >
            ล้างการค้นหา
          </button>
        )}
      </div>

      {/* Loading State (Skeleton Effect) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 border dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-800/50 space-y-3">
              <div className="flex justify-between items-center">
                <div className="skeleton-loader h-5 w-32"></div>
                <div className="skeleton-loader h-5 w-16 rounded-full"></div>
              </div>
              <div className="skeleton-loader h-4 w-full"></div>
              <div className="skeleton-loader h-4 w-3/4"></div>
            </div>
          ))}
        </div>
      ) : filteredAccessPoints.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-gray-200 dark:border-slate-800">
          <p className="text-base font-medium">ไม่พบข้อมูล Access Point ที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
      ) : (
        /* Data Grid & Pagination */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentAccessPoints.map((ap) => {
              const recentBadge = getRecentBadge(ap);
              const timeAgo = formatTimeAgo(ap.updated_at || ap.created_at);

              return (
                <div
                  key={ap.id}
                  className="ap-card p-4 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/90 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-base block">
                            {ap.brand || 'Access Point'} {ap.model || ''}
                          </span>
                          {recentBadge}
                        </div>

                        {ap.mac_address && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal tracking-wide leading-relaxed">
                            mac_address: {ap.mac_address}
                          </p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span className={`status-badge shrink-0 ${getStatusBadgeClass(ap.connection_status)}`}>
                        <span className="status-dot"></span>
                        {ap.connection_status || 'Unknown'}
                      </span>
                    </div>

                    {/* Detail List */}
                    <div className="space-y-1.5 text-sm text-gray-600 dark:text-slate-300">
                      <p>
                        <strong className="text-gray-700 dark:text-slate-200">จุดติดตั้ง:</strong> {ap.installation_point || '-'}
                      </p>
                      <p>
                        <strong className="text-gray-700 dark:text-slate-200">สถานที่:</strong> {ap.building || '-'} {ap.floor ? `(${ap.floor})` : ''}
                      </p>
                      <p className="flex items-center gap-1.5 pt-1">
                        <strong className="text-gray-700 dark:text-slate-200">IP Address:</strong>
                        <span className="ip-tag">{ap.ip_address || '-'}</span>
                      </p>
                    </div>
                  </div>

                  {/* เวลาอัปเดตล่าสุด */}
                  {timeAgo && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        อัปเดต {timeAgo}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 order-2 sm:order-1">
                แสดง {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredAccessPoints.length)} จาก {filteredAccessPoints.length} รายการ
              </span>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="หน้าก่อนหน้า"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="หน้าถัดไป"
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

export default ManageAccessPointList;
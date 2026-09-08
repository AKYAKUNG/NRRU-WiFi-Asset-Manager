// src/components/AccessPointList.jsx
function AccessPointList({
  loading,
  filteredAccessPoints,
  totalCount,
  onResetFilters,
  hasFilterActive
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          รายการ Access Point ({filteredAccessPoints.length} / {totalCount} รายการ)
        </h2>

        {hasFilterActive && (
          <button
            onClick={onResetFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            ล้างการค้นหา
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">กำลังโหลดข้อมูลจากฐานข้อมูล...</p>
      ) : filteredAccessPoints.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>ไม่พบข้อมูล Access Point ที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccessPoints.map((ap) => (
            <div key={ap.id} className="p-4 border rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-blue-600">
                    {ap.brand || 'Access Point'} {ap.model || ''}
                  </span>
                  {ap.asset_code && (
                    <p className="text-xs text-gray-400">รหัส: {ap.asset_code}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    ap.connection_status === 'Online'
                      ? 'bg-green-100 text-green-700'
                      : ap.connection_status === 'Offline'
                      ? 'bg-red-100 text-red-700'
                      : ap.connection_status === 'Maintenance'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {ap.connection_status || 'Unknown'}
                </span>
              </div>
              <p className="text-sm text-gray-600"><strong>จุดติดตั้ง:</strong> {ap.installation_point || '-'}</p>
              <p className="text-sm text-gray-600"><strong>สถานที่:</strong> {ap.building || '-'} ({ap.floor || '-'})</p>
              <p className="text-sm text-gray-600"><strong>IP Address:</strong> {ap.ip_address || '-'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AccessPointList;
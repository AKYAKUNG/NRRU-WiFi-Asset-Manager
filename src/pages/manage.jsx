import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // เพิ่มการนำเข้า useNavigate
import axios from 'axios';
import * as XLSX from 'xlsx';
import { exportToPDF } from '../utils/exportPDF';

// Import Component ตามโครงสร้างไฟล์
import ManageHeader from '../manage/ManageHeader';
import ManageSummaryCharts from '../manage/ManageSummaryCharts';
import ManageSearchFilter from '../manage/ManageSearchFilter';
import ManageAccessPointList from '../manage/ManageAccessPointList';
import ManageFooter from '../manage/ManageFooter';
import ManageLoadingScreen from '../manage/ManageLoadingScreen';

function Manage() {
  const navigate = useNavigate();

  // 1. ตรวจสอบสิทธิ์การเข้าใช้งานทันทีเมื่อเปิดหน้า Manage (Protected Route)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const allowedRoles = ['Officer', 'Super Admin', 'Admin', 'Network Engineer'];

    // ถ้าไม่มีข้อมูลการล็อกอิน หรือ Role ไม่ถูกต้อง ให้เด้งกลับไปหน้า Login
    if (!user || !allowedRoles.includes(user.role)) {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบก่อน');
      navigate('/login');
    }
  }, [navigate]);

  // 2. State สำหรับจัดการข้อมูล Access Points
  const [accessPoints, setAccessPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedBuilding, setSelectedBuilding] = useState('All');

  // 3. ดึงข้อมูล Access Points จาก PHP API
  useEffect(() => {
    const fetchAccessPoints = async () => {
      try {
        const response = await axios.get(
          'http://localhost:81/db-NRRU-WiFi-Asset-Manager/get_access_points.php'
        );
        if (response.data.status === 'success' || response.data.success === true) {
          setAccessPoints(response.data.data);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล AP:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchAccessPoints();
  }, []);

  const buildings = Array.from(
    new Set(accessPoints.map((item) => item.building).filter(Boolean))
  );

  const filteredAccessPoints = accessPoints.filter((ap) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      term === '' ||
      (ap.brand && ap.brand.toLowerCase().includes(term)) ||
      (ap.model && ap.model.toLowerCase().includes(term)) ||
      (ap.installation_point && ap.installation_point.toLowerCase().includes(term)) ||
      (ap.ip_address && ap.ip_address.toLowerCase().includes(term)) ||
      (ap.mac_address && ap.mac_address.toLowerCase().includes(term)) ||
      (ap.asset_code && ap.asset_code.toLowerCase().includes(term));

    const matchesStatus = selectedStatus === 'All' || ap.connection_status === selectedStatus;
    const matchesBuilding = selectedBuilding === 'All' || ap.building === selectedBuilding;

    return matchesSearch && matchesStatus && matchesBuilding;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedBuilding('All');
  };

  const hasFilterActive = searchTerm !== '' || selectedStatus !== 'All' || selectedBuilding !== 'All';

  // Export Excel
  const handleExportExcel = () => {
    if (filteredAccessPoints.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const dataToExport = filteredAccessPoints.map((item, index) => ({
      'ลำดับ': index + 1,
      'รหัสครุภัณฑ์': item.asset_code || '-',
      'ยี่ห้อ': item.brand || '-',
      'รุ่น': item.model || '-',
      'IP Address': item.ip_address || '-',
      'MAC Address': item.mac_address || '-',
      'อาคาร': item.building || '-',
      'จุดติดตั้ง': item.installation_point || '-',
      'สถานะ': item.connection_status || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AccessPoints');

    const fileName = `NRRU_WiFi_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Export PDF
  const handleExportPDF = () => {
    exportToPDF(filteredAccessPoints, {
      searchTerm,
      selectedStatus,
      selectedBuilding,
    });
  };

  // แสดง LoadingScreen เมื่อกำลังโหลดข้อมูล
  if (loading) {
    return <ManageLoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <ManageHeader />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 space-y-6">
        <ManageSummaryCharts accessPoints={filteredAccessPoints} />

        <ManageSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedBuilding={selectedBuilding}
          setSelectedBuilding={setSelectedBuilding}
          buildings={buildings}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
        />

        <ManageAccessPointList
          loading={loading}
          filteredAccessPoints={filteredAccessPoints}
          totalCount={accessPoints.length}
          onResetFilters={handleResetFilters}
          hasFilterActive={hasFilterActive}
        />
      </main>

      <ManageFooter />
    </div>
  );
}

export default Manage;
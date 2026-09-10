import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { exportToPDF } from '../utils/exportPDF';

import ManageHeader from '../manage/ManageHeader';
import ManageSummaryCharts from '../manage/ManageSummaryCharts';
import ManageSearchFilter from '../manage/ManageSearchFilter';
import ManageAccessPointList from '../manage/ManageAccessPointList';
import ManageFooter from '../manage/ManageFooter';
import ManageLoadingScreen from '../manage/ManageLoadingScreen';
import EditAccessPointModal from '../manage/EditAccessPointModal';

function Manage() {
  const navigate = useNavigate();

  // 1. ตรวจสอบสิทธิ์การเข้าใช้งาน
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const allowedRoles = ['Officer', 'Super Admin', 'Admin', 'Network Engineer'];

    if (!user || !allowedRoles.includes(user.role)) {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบก่อน');
      navigate('/login');
    }
  }, [navigate]);

  // 2. State จัดการข้อมูล
  const [accessPoints, setAccessPoints] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedBuilding, setSelectedBuilding] = useState('All');

  // State สำหรับ Modal แก้ไขข้อมูล
  const [selectedAp, setSelectedAp] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. ฟังก์ชันดึงข้อมูล Access Points
  const fetchAccessPoints = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:81/db-NRRU-WiFi-Asset-Manager/get_access_points.php'
      );

      let dataArray = [];
      if (Array.isArray(response.data)) {
        dataArray = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        dataArray = response.data.data;
      }

      setAccessPoints(dataArray);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล AP:', error);
      setAccessPoints([]);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, []);

  // ฟังก์ชันดึงข้อมูล Locations
  const fetchLocations = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:81/db-NRRU-WiFi-Asset-Manager/get_locations.php'
      );

      let dataArray = [];
      if (Array.isArray(response.data)) {
        dataArray = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        dataArray = response.data.data;
      }

      setLocations(dataArray);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Locations:', error);
      setLocations([]);
    }
  }, []);

  useEffect(() => {
    fetchAccessPoints();
    fetchLocations();
  }, [fetchAccessPoints, fetchLocations]);

  // 4. บันทึกการแก้ไขข้อมูล
  const handleOpenEditModal = (ap) => {
    setSelectedAp(ap);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAp(null);
  };

  const handleSaveEdit = async (updatedData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost:81/db-NRRU-WiFi-Asset-Manager/update_access_point.php',
        updatedData
      );

      if (response.data.status === 'success' || response.data.success === true) {
        fetchAccessPoints();
        return true;
      } else {
        alert('เกิดข้อผิดพลาด: ' + (response.data.message || 'ไม่สามารถแก้ไขข้อมูลได้'));
        return false;
      }
    } catch (error) {
      console.error('Error updating AP:', error);
      const serverMessage =
        error.response?.data?.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
      alert(serverMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeAccessPoints = Array.isArray(accessPoints) ? accessPoints : [];

  const buildings = Array.from(
    new Set(safeAccessPoints.map((item) => item?.building).filter(Boolean))
  );

  // Filter Logic
  const filteredAccessPoints = safeAccessPoints.filter((ap) => {
    if (!ap) return false;

    const term = searchTerm.toLowerCase().trim();
    const brand = String(ap.brand || '').toLowerCase();
    const model = String(ap.model || '').toLowerCase();
    const installPoint = String(ap.installation_point || '').toLowerCase();
    const ip = String(ap.ip_address || '').toLowerCase();
    const mac = String(ap.mac_address || '').toLowerCase();
    const assetCode = String(ap.asset_code || '').toLowerCase();
    const responsible = String(ap.responsible_person || '').toLowerCase();

    const matchesSearch =
      term === '' ||
      brand.includes(term) ||
      model.includes(term) ||
      installPoint.includes(term) ||
      ip.includes(term) ||
      mac.includes(term) ||
      assetCode.includes(term) ||
      responsible.includes(term);

    const matchesStatus =
      selectedStatus === 'All' || ap.connection_status === selectedStatus;
    const matchesBuilding =
      selectedBuilding === 'All' || ap.building === selectedBuilding;

    return matchesSearch && matchesStatus && matchesBuilding;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
    setSelectedBuilding('All');
  };

  const hasFilterActive =
    searchTerm !== '' || selectedStatus !== 'All' || selectedBuilding !== 'All';

  // Export Excel ครอบคลุมฟิลด์รายงานทั้งหมด
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
      'ชั้น': item.floor ? `ชั้น ${item.floor}` : '-',
      'จุดติดตั้ง': item.installation_point || '-',
      'สถานะการเชื่อมต่อ': item.connection_status || '-',
      'ความเร็ว Link': item.current_link_speed || '-',
      'ผู้รับผิดชอบ': item.responsible_person || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AccessPoints');

    const fileName = `NRRU_WiFi_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Export PDF
  const handleExportPDF = () => {
    if (filteredAccessPoints.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก PDF');
      return;
    }
    exportToPDF(filteredAccessPoints, {
      searchTerm,
      selectedStatus,
      selectedBuilding,
    });
  };

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
          totalCount={safeAccessPoints.length}
          onResetFilters={handleResetFilters}
          hasFilterActive={hasFilterActive}
          onEdit={handleOpenEditModal}
        />
      </main>

      <ManageFooter />

      <EditAccessPointModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        apData={selectedAp}
        onSave={handleSaveEdit}
        isSubmitting={isSubmitting}
        existingAccessPoints={safeAccessPoints}
        locations={locations}
      />
    </div>
  );
}

export default Manage;
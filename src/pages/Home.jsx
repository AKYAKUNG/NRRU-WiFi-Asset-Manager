// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { exportToPDF } from '../utils/exportPDF';
import Header from '../index/Header';
import SummaryCharts from '../index/SummaryCharts';
import SearchFilter from '../index/SearchFilter';
import AccessPointList from '../index/AccessPointList';
import Footer from '../index/Footer';
import LoadingScreen from '../index/LoadingScreen';

function Home() {
  const [accessPoints, setAccessPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedBuilding, setSelectedBuilding] = useState('All');

  useEffect(() => {
    const fetchAccessPoints = async () => {
      try {
        const response = await axios.get(
          'http://localhost:81/db-NRRU-WiFi-Asset-Manager/get_access_points.php'
        );
        if (response.data.status === 'success') {
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

  // 2. ถ้ากำลังโหลดอยู่ แสดง LoadingScreen
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Header />

    <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 space-y-6">
      <SummaryCharts accessPoints={filteredAccessPoints} />

        <SearchFilter
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

        <AccessPointList
          loading={loading}
          filteredAccessPoints={filteredAccessPoints}
          totalCount={accessPoints.length}
          onResetFilters={handleResetFilters}
          hasFilterActive={hasFilterActive}
        />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
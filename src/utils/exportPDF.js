// src/utils/exportPDF.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * ฟังก์ชันส่งออกรายงาน PDF พร้อมการจัดรูปแบบเอกสารทางการ
 */
export const exportToPDF = async (data = []) => {
  if (data.length === 0) {
    alert('ไม่มีข้อมูลสำหรับส่งออกรายงาน');
    return;
  }

  // 1. คำนวณสถิติสรุปสำหรับใส่ในรายงาน
  const total = data.length;
  const online = data.filter((item) => item.connection_status === 'Online').length;
  const offline = data.filter((item) => item.connection_status === 'Offline').length;
  const unstable = data.filter((item) => item.connection_status === 'Unstable').length;
  const maintenance = data.filter((item) => item.connection_status === 'Maintenance').length;

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // 2. สร้าง Container จำลองสำหรับ Render
  const reportContainer = document.createElement('div');
  reportContainer.style.position = 'absolute';
  reportContainer.style.left = '-9999px';
  reportContainer.style.top = '-9999px';
  reportContainer.style.width = '794px';
  reportContainer.style.padding = '32px';
  reportContainer.style.backgroundColor = '#ffffff';
  reportContainer.style.color = '#0f172a';
  reportContainer.style.fontFamily = "'Prompt', 'Sarabun', sans-serif";
  reportContainer.style.boxSizing = 'border-box';

  // Helper สำหรับดึง CSS สีประจำสถานะ
  const getStatusTextStyle = (status) => {
  switch (status) {
    case 'Online':
      return 'color: #047857; font-weight: 700;';
    case 'Offline':
      return 'color: #b91c1c; font-weight: 700;';
    case 'Unstable':
      return 'color: #b45309; font-weight: 700;';
    case 'Maintenance':
      return 'color: #4338ca; font-weight: 700;';
    default:
      return 'color: #475569; font-weight: 700;';
  }
};

  // 3. สร้าง HTML Content ของรายงาน
  reportContainer.innerHTML = `
    <!-- Header รายงาน -->
    <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="font-size: 20px; font-weight: 800; color: #1e3a8a; margin: 0; line-height: 1.2;">รายงานสรุปอุปกรณ์ NRRU Wi-Fi Asset</h1>
        <p style="font-size: 11px; color: #64748b; margin: 6px 0 0 0;">มหาวิทยาลัยราชภัฏนครราชสีมา (Nakhon Ratchasima Rajabhat University)</p>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 10px; padding: 5px 12px; border-radius: 20px; color: #334155; font-weight: 600; display: inline-block;">
          พิมพ์เมื่อ: ${currentDate} น.
        </span>
      </div>
    </div>

    <!-- ส่วนสรุปสถิติ (Summary Cards Table ) -->
    <table style="width: 100%; border-collapse: separate; border-spacing: 8px 0; margin-bottom: 20px; margin-left: -8px; margin-right: -8px;">
      <tr>
        <td style="width: 20%; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center; vertical-align: middle;">
          <div style="font-size: 10px; color: #64748b; font-weight: 600; line-height: 12px;">ทั้งหมด</div>
          <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px; line-height: 20px;">${total}</div>
        </td>
        <td style="width: 20%; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px; text-align: center; vertical-align: middle;">
          <div style="font-size: 10px; color: #047857; font-weight: 600; line-height: 12px;">Online</div>
          <div style="font-size: 18px; font-weight: 800; color: #047857; margin-top: 4px; line-height: 20px;">${online}</div>
        </td>
        <td style="width: 20%; border: 1px solid #fecaca; border-radius: 8px; padding: 10px; text-align: center; vertical-align: middle;">
          <div style="font-size: 10px; color: #b91c1c; font-weight: 600; line-height: 12px;">Offline</div>
          <div style="font-size: 18px; font-weight: 800; color: #b91c1c; margin-top: 4px; line-height: 20px;">${offline}</div>
        </td>
        <td style="width: 20%; border: 1px solid #fde68a; border-radius: 8px; padding: 10px; text-align: center; vertical-align: middle;">
          <div style="font-size: 10px; color: #b45309; font-weight: 600; line-height: 12px;">Unstable</div>
          <div style="font-size: 18px; font-weight: 800; color: #b45309; margin-top: 4px; line-height: 20px;">${unstable}</div>
        </td>
        <td style="width: 20%; border: 1px solid #c7d2fe; border-radius: 8px; padding: 10px; text-align: center; vertical-align: middle;">
          <div style="font-size: 10px; color: #4338ca; font-weight: 600; line-height: 12px;">Maintenance</div>
          <div style="font-size: 18px; font-weight: 800; color: #4338ca; margin-top: 4px; line-height: 20px;">${maintenance}</div>
        </td>
      </tr>
    </table>

    <!-- ตารางรายการข้อมูล -->
    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
      <thead>
        <tr style="background-color: #0f172a; color: #ffffff; text-align: left;">
          <th style="padding: 10px 8px; text-align: center; width: 40px; vertical-align: middle;">ลำดับ</th>
          <th style="padding: 10px 8px; vertical-align: middle;">รหัสครุภัณฑ์</th>
          <th style="padding: 10px 8px; vertical-align: middle;">ยี่ห้อ / รุ่น</th>
          <th style="padding: 10px 8px; vertical-align: middle;">IP Address</th>
          <th style="padding: 10px 8px; vertical-align: middle;">MAC Address</th>
          <th style="padding: 10px 8px; vertical-align: middle;">อาคาร / จุดติดตั้ง</th>
          <th style="padding: 10px 8px; text-align: center; vertical-align: middle; width: 90px;">สถานะ</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (item, index) => `
          <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 10px 8px; text-align: center; font-weight: 600; color: #64748b; vertical-align: middle;">${index + 1}</td>
            <td style="padding: 10px 8px; font-weight: 700; color: #1e293b; vertical-align: middle;">${item.asset_code || '-'}</td>
            <td style="padding: 10px 8px; vertical-align: middle;">${item.brand || ''} ${item.model || '-'}</td>
            <td style="padding: 10px 8px; font-family: monospace; color: #2563eb; vertical-align: middle;">${item.ip_address || '-'}</td>
            <td style="padding: 10px 8px; font-family: monospace; color: #475569; vertical-align: middle;">${item.mac_address || '-'}</td>
            <td style="padding: 10px 8px; vertical-align: middle;">
              <div style="font-weight: 600; color: #334155; line-height: 1.3;">${item.building || '-'}</div>
              <div style="font-size: 9px; color: #94a3b8; margin-top: 2px;">${item.installation_point || '-'}</div>
            </td>
            <td style="padding: 10px 8px; text-align: center; vertical-align: middle;">
              <span style="font-size: 11px; line-height: 14px; ${getStatusTextStyle(item.connection_status)}">
                ${item.connection_status || '-'}
              </span>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <!-- Footer รายงาน -->
    <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #94a3b8;">
      <div>เอกสารนี้สร้างจากระบบอัตโนมัติ NRRU Wi-Fi Asset Manager</div>
      <div>หน้า 1 จาก 1</div>
    </div>
  `;

  document.body.appendChild(reportContainer);

  try {
    const canvas = await html2canvas(reportContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const fileName = `NRRU_WiFi_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้าง PDF:', error);
    alert('ไม่สามารถสร้างไฟล์ PDF ได้ กรุณาลองใหม่อีกครั้ง');
  } finally {
    document.body.removeChild(reportContainer);
  }
};



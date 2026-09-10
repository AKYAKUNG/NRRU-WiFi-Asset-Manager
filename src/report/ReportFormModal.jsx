// src/report/ReportFormModal.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  X, 
  AlertTriangle, 
  Building, 
  MapPin, 
  Wifi, 
  Upload, 
  CheckCircle2, 
  Layers, 
  Tag, 
  Fingerprint 
} from "lucide-react";

import "./css/ReportFormModal.css";

const API_BASE_URL = "http://localhost:81/db-NRRU-WiFi-Asset-Manager";

export default function ReportFormModal({
  isOpen,
  onClose,
  accessPoints = [],
  initialAccessPoint = null,
  accessPoint = null,
  onSuccess,
}) {
  const targetAp = initialAccessPoint || accessPoint;

  const [formData, setFormData] = useState({
    access_point_id: "",
    reporter_name: "",
    issue_description: "",
    photo: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      if (targetAp) {
        setFormData((prev) => ({
          ...prev,
          access_point_id: targetAp.id || targetAp.ap_id || "",
        }));
      } else {
        setFormData((prev) => ({ ...prev, access_point_id: "" }));
      }
    } else {
      setFormData({
        access_point_id: "",
        reporter_name: "",
        issue_description: "",
        photo: null,
      });
      setPreviewImage(null);
      setIsSuccess(false);
    }
  }, [isOpen, targetAp]);

  if (!isOpen) return null;

  const selectedAp =
    targetAp ||
    accessPoints.find((ap) => String(ap.id || ap.ap_id) === String(formData.access_point_id));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.access_point_id) {
      alert("กรุณาเลือก Access Point");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("access_point_id", formData.access_point_id);
      data.append("reporter_name", formData.reporter_name);
      data.append("issue_description", formData.issue_description);
      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      const res = await fetch(`${API_BASE_URL}/add_report.php`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.status === "success") {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.message || "ไม่สามารถบันทึกได้"}`);
      }
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto modal-overlay-animate">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transition-all modal-content-animate">
        
        {isSuccess ? (
          /* หน้าจอยืนยันเมื่อส่งสำเร็จแบบมี Ripple & Stagger Animation */
          <div className="p-8 text-center space-y-5">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              {/* Pulse Ring ด้านหลัง */}
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ripple" />
              {/* Icon Container */}
              <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-success-bounce">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-1.5 animate-stagger-1">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                แจ้งปัญหาเรียบร้อยแล้ว!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                ระบบได้บันทึกข้อมูลการแจ้งปัญหาของคุณแล้ว เจ้าหน้าที่จะทำการตรวจสอบโดยเร็วที่สุด
              </p>
            </div>

            <div className="animate-stagger-2">
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-8 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
              >
                ตกลง / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl">
                  <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    แจ้งปัญหา Access Point
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {targetAp
                      ? "ตรวจสอบรายละเอียดตำแหน่งอุปกรณ์และกรอกข้อมูลปัญหา"
                      : "เลือกอุปกรณ์และกรอกข้อมูลเพื่อแจ้งปัญหา"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              {/* Card แสดงข้อมูลอุปกรณ์ */}
              {targetAp || selectedAp ? (
                <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border border-indigo-500/20 dark:border-indigo-500/30 rounded-2xl space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
                    <span className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                      <Wifi className="w-4 h-4" />
                      อุปกรณ์ที่เลือก
                    </span>
                    {selectedAp?.asset_code && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-mono font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-md">
                        <Tag className="w-3 h-3" /> {selectedAp.asset_code}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xs">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400 flex items-center gap-1 mb-0.5">
                        <Building className="w-3.5 h-3.5 text-indigo-500" /> อาคาร / ชั้น
                      </span>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                        {selectedAp?.building || "ไม่ระบุ"}
                        {selectedAp?.floor ? ` (ชั้น ${selectedAp.floor})` : ""}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xs">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400 flex items-center gap-1 mb-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> จุดติดตั้ง
                      </span>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                        {selectedAp?.installation_point || "ไม่ระบุ"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xs">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400 flex items-center gap-1 mb-0.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-500" /> ยี่ห้อ / รุ่น
                      </span>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                        {selectedAp?.brand} {selectedAp?.model}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-xs">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400 flex items-center gap-1 mb-0.5">
                        <Fingerprint className="w-3.5 h-3.5 text-sky-500" /> MAC Address
                      </span>
                      <p className="font-bold text-xs font-mono text-slate-800 dark:text-slate-100 truncate">
                        {selectedAp?.mac_address || selectedAp?.mac || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    เลือก Access Point <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="access_point_id"
                    value={formData.access_point_id}
                    onChange={handleChange}
                    required
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-hidden transition-all"
                  >
                    <option value="">-- กรุณาเลือก Access Point --</option>
                    {accessPoints.map((ap) => (
                      <option key={ap.id || ap.ap_id} value={ap.id || ap.ap_id}>
                        {ap.building} {ap.floor ? `(ชั้น ${ap.floor})` : ""} - {ap.brand} {ap.model} [{ap.mac_address || ap.mac || "-"}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reporter Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  ชื่อผู้แจ้งปัญหา <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="reporter_name"
                  placeholder="ระบุชื่อ-นามสกุล หรือหน่วยงานผู้แจ้ง"
                  value={formData.reporter_name}
                  onChange={handleChange}
                  required
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-hidden transition-all"
                />
              </div>

              {/* Issue Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  รายละเอียดอาการเสีย / ปัญหาที่พบ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="issue_description"
                  rows={3}
                  placeholder="เช่น ไฟไม่เข้า, เชื่อมต่อเน็ตไม่ได้, สัญญาณหลุดบ่อย..."
                  value={formData.issue_description}
                  onChange={handleChange}
                  required
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-hidden resize-none transition-all"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  แนบรูปภาพประกอบ (ถ้ามี)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-all border border-slate-200 dark:border-slate-700 active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>เลือกรูปภาพ</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {formData.photo && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                      {formData.photo.name}
                    </span>
                  )}
                </div>

                {previewImage && (
                  <div className="mt-2 relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs animate-stagger-1">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer active:scale-95"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:opacity-50 transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  {submitting ? "กำลังบันทึก..." : "ยืนยันการแจ้งปัญหา"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

ReportFormModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  accessPoints: PropTypes.array,
  initialAccessPoint: PropTypes.object,
  accessPoint: PropTypes.object,
  onSuccess: PropTypes.func,
};
import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

function EditAccessPointModal({
  isOpen,
  onClose,
  apData,
  onSave,
  isSubmitting = false,
  locations = [],
  existingAccessPoints = [],
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    location_id: "",
    installation_point: "",
    ip_address: "",
    mac_address: "",
    serial_number: "",
    responsible_person: "",
    current_link_speed: "",
    connection_status: "Online",
    usage_condition: "Normal",
    issues_requirements: "",
    remarks: "",
  });

  // ฟังก์ชันดึง Location ID อัตโนมัติ รองรับโครงสร้าง API ทุกแบบ
  const getSafeLocationId = (data) => {
    if (!data) return "";
    const rawId =
      data.location_id ??
      data.location?.id ??
      data.locationId ??
      data.location?._id ??
      "";
    return rawId !== null && rawId !== undefined ? String(rawId) : "";
  };

  const validateDuplicates = (data) => {
    const newErrors = {};
    const targetMac = data.mac_address?.trim().toLowerCase();
    const targetSerial = data.serial_number?.trim().toLowerCase();

    const otherItems = existingAccessPoints.filter(
      (item) => String(item.id) !== String(data.id),
    );

    if (
      targetMac &&
      otherItems.some(
        (item) => item.mac_address?.trim().toLowerCase() === targetMac,
      )
    ) {
      newErrors.mac_address = "MAC Address นี้มีในระบบแล้ว";
    }

    if (
      targetSerial &&
      otherItems.some(
        (item) => item.serial_number?.trim().toLowerCase() === targetSerial,
      )
    ) {
      newErrors.serial_number = "Serial Number นี้มีในระบบแล้ว";
    }

    return newErrors;
  };

  const targetApId = apData?.id ?? apData?._id;

  useEffect(() => {
    if (isOpen && apData) {
      setFormData({
        id: targetApId ?? "",
        location_id: getSafeLocationId(apData),
        installation_point:
          apData.installation_point ?? apData.installationPoint ?? "",
        ip_address: apData.ip_address ?? apData.ipAddress ?? "",
        mac_address: apData.mac_address ?? apData.macAddress ?? "",
        serial_number: apData.serial_number ?? apData.serialNumber ?? "",
        responsible_person:
          apData.responsible_person ?? apData.responsiblePerson ?? "",
        current_link_speed: apData.current_link_speed ?? apData.linkSpeed ?? "",
        connection_status:
          apData.connection_status || apData.status || "Online",
        usage_condition: apData.usage_condition || apData.condition || "Normal",
        issues_requirements: apData.issues_requirements ?? apData.issues ?? "",
        remarks: apData.remarks ?? "",
      });
      setErrors({});
      setIsSuccess(false);
    }
  }, [targetApId, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (["mac_address", "serial_number"].includes(name)) {
      const validationErrors = validateDuplicates(formData);
      if (validationErrors[name]) {
        setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateDuplicates(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await onSave(formData);
      if (result !== false) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrors({});
    onClose();
  };

  const hasDuplicateErrors = Object.values(errors).some(Boolean);

  return (
    <>
      <style>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes modalPopIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes drawCircle {
          0% { stroke-dasharray: 150; stroke-dashoffset: 150; }
          100% { stroke-dasharray: 150; stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          0% { stroke-dasharray: 40; stroke-dashoffset: 40; }
          100% { stroke-dasharray: 40; stroke-dashoffset: 0; }
        }
        @keyframes successPop {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-overlay { animation: overlayFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-modal-pop { animation: modalPopIn 0.3s cubic-bezier(0.34, 1.45, 0.64, 1) forwards; }
        .animate-success-box { animation: successPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-draw-circle { stroke-dasharray: 150; stroke-dashoffset: 150; animation: drawCircle 0.45s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
        .animate-draw-check { stroke-dasharray: 40; stroke-dashoffset: 40; animation: drawCheck 0.35s cubic-bezier(0.65, 0, 0.45, 1) 0.35s forwards; }
      `}</style>

      <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto animate-overlay">
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl w-full border border-slate-200/80 dark:border-slate-800/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] overflow-hidden my-8 transition-all duration-300 animate-modal-pop ring-1 ring-white/10 max-h-[90vh] flex flex-col ${isSuccess ? "max-w-md" : "max-w-2xl"}`}
        >
          {isSuccess ? (
            <div className="p-8 text-center space-y-4 animate-success-box">
              <div className="w-20 h-20 mx-auto relative flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-emerald-500"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="26"
                    cy="26"
                    r="23"
                    className="stroke-emerald-100 dark:stroke-emerald-950/80"
                    strokeWidth="4"
                  />
                  <circle
                    cx="26"
                    cy="26"
                    r="23"
                    className="stroke-emerald-500 animate-draw-circle"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 27l7 7 16-16"
                    className="stroke-emerald-500 animate-draw-check"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                แก้ไขข้อมูลสำเร็จ!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                อัปเดตข้อมูล Access Point เรียบร้อยแล้ว
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl transition-all shadow-lg shadow-emerald-600/25 cursor-pointer"
                >
                  ตกลง
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm shrink-0">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  แก้ไขข้อมูล Access Point
                </h3>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all active:scale-90 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 overflow-y-auto"
              >
                <fieldset
                  disabled={isSubmitting}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 disabled:opacity-70"
                >
                  {/* สถานที่ (Location Foreign Key Dropdown) */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      อาคาร / ชั้น / หน่วยงาน
                    </label>
                    <select
                      name="location_id"
                      value={String(formData.location_id || "")}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">-- เลือกระบุสถานที่ --</option>
                      {Array.isArray(locations) &&
                        locations.map((loc, idx) => {
                          const locId = String(
                            loc.id ?? loc._id ?? loc.location_id ?? idx,
                          );

                          // ยืดหยุ่นรองรับชื่อ Field ทั้ง building, building_name, หรือ name
                          const buildingText =
                            loc.building ||
                            loc.building_name ||
                            loc.name ||
                            "ไม่ระบุอาคาร";
                          const floorText = loc.floor
                            ? ` - ชั้น ${loc.floor}`
                            : "";
                          const deptText = loc.department
                            ? ` (${loc.department})`
                            : "";

                          return (
                            <option key={locId} value={locId}>
                              {buildingText}
                              {floorText}
                              {deptText}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  {/* จุดติดตั้ง */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      จุดติดตั้ง
                    </label>
                    <input
                      type="text"
                      name="installation_point"
                      value={formData.installation_point}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* ผู้รับผิดชอบ */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ผู้รับผิดชอบ
                    </label>
                    <input
                      type="text"
                      name="responsible_person"
                      value={formData.responsible_person}
                      onChange={handleChange}
                      placeholder="เช่น สำนักคอมพิวเตอร์"
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* ความเร็วลิงก์ */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ความเร็วลิงก์ (Link Speed)
                    </label>
                    <input
                      type="text"
                      name="current_link_speed"
                      value={formData.current_link_speed}
                      onChange={handleChange}
                      placeholder="เช่น 1 Gbps, 100 Mbps"
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* IP Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      IP Address
                    </label>
                    <input
                      type="text"
                      name="ip_address"
                      value={formData.ip_address}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* MAC Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      MAC Address
                    </label>
                    <input
                      type="text"
                      name="mac_address"
                      value={formData.mac_address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all ${
                        errors.mac_address
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                          : "border-slate-300 dark:border-slate-700/80 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      }`}
                    />
                    {errors.mac_address && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.mac_address}
                      </p>
                    )}
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      name="serial_number"
                      value={formData.serial_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full p-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all ${
                        errors.serial_number
                          ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                          : "border-slate-300 dark:border-slate-700/80 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      }`}
                    />
                    {errors.serial_number && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.serial_number}
                      </p>
                    )}
                  </div>

                  {/* สถานะการเชื่อมต่อ */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      สถานะการเชื่อมต่อ
                    </label>
                    <select
                      name="connection_status"
                      value={formData.connection_status}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Unstable">Unstable</option>
                    </select>
                  </div>

                  {/* สภาพการใช้งาน */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      สภาพการใช้งาน
                    </label>
                    <select
                      name="usage_condition"
                      value={formData.usage_condition}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="Normal">ปกติ</option>
                      <option value="Damaged">ชำรุด/มีปัญหา</option>
                      <option value="Replaced">รอดำเนินการเปลี่ยน</option>
                    </select>
                  </div>

                  {/* ปัญหา / ความต้องการเพิ่มเติม */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      ปัญหา / ความต้องการเพิ่มเติม
                    </label>
                    <textarea
                      name="issues_requirements"
                      rows="2"
                      value={formData.issues_requirements}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none transition-all"
                    />
                  </div>

                  {/* หมายเหตุ */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      หมายเหตุ
                    </label>
                    <input
                      type="text"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      className="w-full p-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </fieldset>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/80 shrink-0">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || hasDuplicateErrors}
                    className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default EditAccessPointModal;

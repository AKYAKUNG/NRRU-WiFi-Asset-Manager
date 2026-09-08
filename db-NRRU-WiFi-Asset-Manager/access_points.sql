-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 08, 2026 at 04:00 PM
-- Server version: 8.0.17
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nrru_wifi_asset_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_points`
--

CREATE TABLE `access_points` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL COMMENT 'รหัสสถานที่',
  `model_id` int(11) NOT NULL COMMENT 'รหัสรุ่นอุปกรณ์',
  `asset_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'รหัสครุภัณฑ์',
  `installation_point` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'จุดติดตั้ง',
  `asset_category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'หมวดครุภัณฑ์',
  `responsible_person` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'ผู้รับผิดชอบ',
  `serial_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Serial Number',
  `mac_address` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'MAC Address',
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'IP Address',
  `current_link_speed` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'ความเร็วลิงก์ปัจจุบัน',
  `os_firmware` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'เฟิร์มแวร์ปัจจุบัน',
  `connection_status` enum('Online','Offline','Unstable','Maintenance') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Online' COMMENT 'สถานะการเชื่อมต่อ',
  `usage_condition` enum('Normal','Damaged','Repairing','Retired') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Normal' COMMENT 'สภาพการใช้งาน',
  `issues_requirements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'ปัญหาที่พบ/ความต้องการ',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'ข้อเสนอแนะ/หมายเหตุ',
  `map_x` float DEFAULT NULL COMMENT 'พิกัดแกน X บนแผนที่',
  `map_y` float DEFAULT NULL COMMENT 'พิกัดแกน Y บนแผนที่',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `access_points`
--

INSERT INTO `access_points` (`id`, `location_id`, `model_id`, `asset_code`, `installation_point`, `asset_category`, `responsible_person`, `serial_number`, `mac_address`, `ip_address`, `current_link_speed`, `os_firmware`, `connection_status`, `usage_condition`, `issues_requirements`, `remarks`, `map_x`, `map_y`, `created_at`) VALUES
(1, 2, 1, 'NW-67-001', 'ห้องปฏิบัติการคอมพิวเตอร์ 1521', 'อุปกรณ์เครือข่ายไร้สาย', 'นายสมชาย ใจดี', 'FCW2412L0A1', '70:69:5A:11:22:01', '192.168.10.11', '1 Gbps', 'v17.3.4', 'Online', 'Normal', 'ไม่มี', 'ใช้งานปกติ', 120.5, 340.2, '2026-03-01 03:00:00'),
(2, 1, 2, 'NW-67-002', 'โถงทางเดินกลาง ชั้น 1', 'อุปกรณ์เครือข่ายไร้สาย', 'นายวิชัย รักชาติ', 'CNF8K12002', '70:69:5A:11:22:02', '192.168.10.12', '1 Gbps', 'ArubaOS 8.7.1', 'Online', 'Normal', 'ไม่มี', 'สัญญาณครอบคลุมดี', 450, 210.8, '2026-03-01 03:30:00'),
(3, 3, 3, 'NW-67-003', 'หน้าห้องพักครู ชั้น 3', 'อุปกรณ์เครือข่ายไร้สาย', 'นางสาวนภา สดใส', 'G1M9820003', '00:0B:86:AA:BB:03', '192.168.14.21', '1 Gbps', 'Reyee_3.0', 'Online', 'Normal', 'ไม่มี', 'เพิ่มจุดติดตั้งใหม่', 310.2, 115, '2026-03-02 02:00:00'),
(4, 3, 3, 'NW-67-004', 'ห้องเรียน 941 ชั้น 4', 'อุปกรณ์เครือข่ายไร้สาย', 'นางสาวนภา สดใส', 'G1M9820004', '00:0B:86:AA:BB:04', '192.168.14.22', '0 Mbps', 'Reyee_3.0', 'Offline', 'Damaged', 'พอร์ต LAN หลุดหลวม', 'ส่งซ่อมเปลี่ยนหัว RJ45', 330, 140.5, '2026-03-02 02:30:00'),
(5, 8, 1, 'NW-67-005', 'ห้องโถงรับรอง ชั้น 1', 'อุปกรณ์เครือข่ายไร้สาย', 'นายสมชาย ใจดี', 'FCW2412L0A5', '80:05:88:CC:DD:05', '192.168.27.31', '1 Gbps', 'v17.3.4', 'Online', 'Normal', 'ไม่มี', 'ใช้งานปกติ', 520.4, 400.1, '2026-03-05 04:00:00'),
(6, 4, 5, 'NW-67-006', 'หน้าห้องปฏิบัติการชีววิทยา', 'อุปกรณ์เครือข่ายไร้สาย', 'นายวิชัย รักชาติ', 'CNF8K12006', '70:69:5A:11:22:06', '192.168.15.51', '1 Gbps', 'ArubaOS 8.7.1', 'Unstable', 'Repairing', 'สัญญาณแกว่งช่วงบ่าย', 'กำลังเช็กสัญญาณรบกวน', 200, 180, '2026-03-10 07:00:00'),
(7, 7, 2, 'NW-67-007', 'พื้นที่อ่านหนังสือโซน A', 'อุปกรณ์เครือข่ายไร้สาย', 'นางสาวนภา สดใส', 'CNF8K12007', '70:69:5A:11:22:07', '192.168.25.10', '1 Gbps', 'ArubaOS 8.7.1', 'Online', 'Normal', 'ไม่มี', 'ผู้ใช้งานหนาแน่น', 150.8, 600.2, '2026-03-12 06:20:00'),
(8, 5, 3, 'NW-67-008', 'หน้าห้องประชุมคณะ ชั้น 4', 'อุปกรณ์เครือข่ายไร้สาย', 'นายวิชัย รักชาติ', 'G1M9820008', '00:0B:86:AA:BB:08', '192.168.30.88', '1 Gbps', 'Reyee_3.0', 'Maintenance', 'Repairing', 'ปรับปรุงระบบ Firmware', 'ปิดปรับปรุงชั่วคราว', 280, 310, '2026-03-15 02:10:00'),
(9, 6, 4, 'NW-67-009', 'เสาไฟภายนอกแปลงเกษตร', 'อุปกรณ์เครือข่ายไร้สาย', 'นายสมชาย ใจดี', 'FCW2424OUT9', '80:05:88:CC:DD:09', '192.168.14.99', '1 Gbps', 'v17.3.4', 'Online', 'Normal', 'กล่องกันน้ำกันฝุ่น', 'ติดตั้งภายนอกอาคาร', 610.2, 520, '2026-04-01 08:30:00'),
(10, 1, 3, 'NW-67-010', 'โถงกิจกรรมหอพักชาย 1', 'อุปกรณ์เครือข่ายไร้สาย', 'นายกิตติศักดิ์ มั่นคง', 'G1M9820010', '00:0B:86:AA:BB:10', '192.168.40.10', '1 Gbps', 'Reyee_3.0', 'Online', 'Normal', 'ไม่มี', 'เปิดใช้งานช่วงค่ำ', 100, 100, '2026-04-10 03:00:00'),
(11, 1, 1, 'NRRU-AP-2026-011', 'โถงทางเดินหน้าห้องพักครู ชั้น 1', 'ครุภัณฑ์คอมพิวเตอร์', 'นายสมชาย ใจดี', 'SN-NRRU-AP011', '00:0B:86:AA:BB:11', '192.168.31.15', '1 Gbps', 'v8.2.1', 'Online', 'Normal', NULL, 'ใช้งานได้ปกติ', NULL, NULL, '2026-09-08 15:32:27'),
(12, 2, 2, 'NRRU-AP-2026-012', 'โซนอ่านหนังสือเงียบ ชั้น 3', 'ครุภัณฑ์คอมพิวเตอร์', 'นางสาววิภาดา สุขใจ', 'SN-NRRU-AP012', '00:0B:86:AA:BB:12', '192.168.25.22', '1 Gbps', 'v10.4.0', 'Online', 'Normal', NULL, 'ติดตั้งเพิ่มปี 2026', NULL, NULL, '2026-09-08 15:32:27'),
(13, 3, 1, 'NRRU-AP-2026-013', 'ห้องปฏิบัติการคอมพิวเตอร์ 322', 'ครุภัณฑ์คอมพิวเตอร์', 'งานเครือข่าย สำนักคอมฯ', 'SN-NRRU-AP013', '00:0B:86:AA:BB:13', '192.168.32.40', '100 Mbps', 'v8.2.1', 'Offline', 'Normal', 'รอเช็คสาย LAN', 'ไฟไม่เข้าอุปกรณ์', NULL, NULL, '2026-09-08 15:32:27'),
(14, 4, 3, 'NRRU-AP-2026-014', 'หน้าห้องประชุมใหญ่ ชั้น 2', 'ครุภัณฑ์คอมพิวเตอร์', 'งานเครือข่าย สำนักคอมฯ', 'SN-NRRU-AP014', '00:0B:86:AA:BB:14', '192.168.35.18', '1 Gbps', 'v9.1.0', 'Unstable', 'Damaged', 'สัญญาณหลุดบ่อย', 'ส่งทีมช่างเข้าตรวจสอบ', NULL, NULL, '2026-09-08 15:32:27'),
(15, 5, 2, 'NRRU-AP-2026-015', 'โถงกิจกรรมนักศึกษา ชั้น 1', 'ครุภัณฑ์คอมพิวเตอร์', 'นายอภิชาติ ธาตุลม', 'SN-NRRU-AP015', '00:0B:86:AA:BB:15', '192.168.12.08', '1 Gbps', 'v10.4.0', 'Maintenance', 'Repairing', 'ส่งเคลมศูนย์', 'อยู่ระหว่างรออะไหล่เปลี่ยน', NULL, NULL, '2026-09-08 15:32:27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_points`
--
ALTER TABLE `access_points`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD UNIQUE KEY `mac_address` (`mac_address`),
  ADD UNIQUE KEY `asset_code` (`asset_code`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `model_id` (`model_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_points`
--
ALTER TABLE `access_points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `access_points`
--
ALTER TABLE `access_points`
  ADD CONSTRAINT `access_points_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `access_points_ibfk_2` FOREIGN KEY (`model_id`) REFERENCES `device_models` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php'; // ดึงการเชื่อมต่อฐานข้อมูลมาใช้

try {
    // JOIN ตาราง locations และ device_models เพื่อดึงชื่ออาคาร ยี่ห้อ และรุ่น
    $sql = "SELECT 
                ap.*, 
                l.building, 
                l.floor, 
                l.department,
                l.floor_plan_image,
                m.brand, 
                m.model,
                m.device_type
            FROM access_points ap
            LEFT JOIN locations l ON ap.location_id = l.id
            LEFT JOIN device_models m ON ap.model_id = m.id
            ORDER BY ap.id DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $access_points = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ส่งข้อมูลกลับไปเป็น JSON
    echo json_encode([
        "status" => "success",
        "data" => $access_points
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
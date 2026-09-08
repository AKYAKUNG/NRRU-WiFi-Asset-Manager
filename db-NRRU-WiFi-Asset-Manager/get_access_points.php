<?php
require_once 'db.php'; // ดึงการเชื่อมต่อฐานข้อมูลมาใช้

try {
    // ดึงข้อมูล AP ทั้งหมด (เดี๋ยวเราค่อยมา Join ตารางเพื่อให้ได้ชื่อสถานที่ภายหลัง)
    $stmt = $conn->prepare("SELECT * FROM access_points ORDER BY id DESC");
    $stmt->execute();
    $access_points = $stmt->fetchAll();

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
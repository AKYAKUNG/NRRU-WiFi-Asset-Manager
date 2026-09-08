<?php
// 1. ตั้งค่า CORS อนุญาตให้ React (Frontend) เชื่อมต่อ API ได้
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// จัดการ Preflight Request จาก Axios (React)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. ข้อมูลสำหรับเชื่อมต่อฐานข้อมูล
$host = "localhost";
$dbname = "nrru_wifi_asset_manager";
$username = "root";
$password = "12345678"; 

try {
    // 3. สร้างการเชื่อมต่อ PDO
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // แจ้งเตือนเมื่อมี Error
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // รูปแบบข้อมูลที่ดึงมาเป็น Associative Array (key-value)
        PDO::ATTR_EMULATE_PREPARES   => false,                  // ป้องกัน SQL Injection
    ];

    $conn = new PDO($dsn, $username, $password, $options);
    
    //echo json_encode(["status" => "success", "message" => "เชื่อมต่อฐานข้อมูล NRRU-WiFi-Asset-Manager สำเร็จ!"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Database connection failed: " . $e->getMessage()
    ]);
    exit;
}
?>
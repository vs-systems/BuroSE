<?php
// admin_fetch_logs.php
require_once 'config.php';

if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 200");
    $stmt->execute();
    $logs = $stmt->fetchAll();

    echo json_encode(["status" => "success", "logs" => $logs]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
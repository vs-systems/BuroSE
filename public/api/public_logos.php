<?php
// public_logos.php - Permite ver los logos sin estar logueado
require_once 'config.php';

try {
    $stmt = $conn->query("SELECT * FROM brand_logos ORDER BY display_order ASC");
    $logos = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $logos]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
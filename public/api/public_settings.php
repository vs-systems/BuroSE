<?php
// public_settings.php
require_once 'config.php';

try {
    $stmt = $conn->query("SELECT setting_key, setting_value FROM system_settings");
    $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    echo json_encode(["status" => "success", "data" => $settings]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
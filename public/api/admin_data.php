<?php
// admin_data.php
require_once 'config.php';
session_start();

if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

try {
    // Obtener solicitudes de acceso
    $stmt1 = $conn->query("SELECT * FROM contact_submissions ORDER BY created_at DESC");
    $contacts = $stmt1->fetchAll();

    // Obtener solicitudes de derecho a réplica
    $stmt2 = $conn->query("SELECT * FROM replica_requests ORDER BY created_at DESC");
    $replicas = $stmt2->fetchAll();

    // Obtener socios activos/registrados
    $stmt3 = $conn->query("SELECT * FROM membership_companies ORDER BY created_at DESC");
    $socios = $stmt3->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => [
            "contacts" => $contacts,
            "replicas" => $replicas,
            "socios" => $socios
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
<?php
// admin_data.php
require_once 'config.php';

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

try {
    // Obtener solicitudes de acceso
    $contacts = $conn->query("SELECT * FROM contact_submissions ORDER BY created_at DESC")->fetchAll();

    // Obtener solicitudes de derecho a réplica
    $replicas = $conn->query("SELECT * FROM replica_requests ORDER BY created_at DESC")->fetchAll();

    // Obtener socios activos/registrados
    $socios = $conn->query("SELECT * FROM membership_companies ORDER BY created_at DESC")->fetchAll();

    // Obtener reportes cargados
    try {
        $reports = $conn->query("SELECT r.*, mc.razon_social as reporter_name FROM reports r LEFT JOIN membership_companies mc ON r.reporter_id = mc.id ORDER BY r.created_at DESC")->fetchAll();
    } catch (Exception $e_rep) {
        $reports = [];
    }

    echo json_encode([
        "status" => "success",
        "data" => [
            "contacts" => $contacts,
            "replicas" => $replicas,
            "socios" => $socios,
            "reports" => $reports
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
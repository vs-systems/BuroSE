<?php
// member_reports.php
require_once 'config.php';
session_start();

// Validar sesión de socio
if (!isset($_SESSION['is_member']) || $_SESSION['is_member'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$reporter_id = $_SESSION['member_id'];

try {
    $stmt = $conn->prepare("SELECT id, cuit_denunciado, nombre_denunciado, monto, descripcion, estado, fecha_denuncia, evidencia_url 
                            FROM reports 
                            WHERE reporter_id = ? 
                            ORDER BY fecha_denuncia DESC");
    $stmt->execute([$reporter_id]);
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $reports]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error de base de datos: " . $e->getMessage()]);
}
?>
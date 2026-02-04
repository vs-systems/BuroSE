<?php
// member_update_report.php
require_once 'config.php';
session_start();

// Validar sesión de socio
if (!isset($_SESSION['is_member']) || $_SESSION['is_member'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$reporter_id = $_SESSION['member_id'];
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$cuit = preg_replace('/\D/', '', $data['cuit_denunciado'] ?? '');
$nombre = $data['nombre_denunciado'] ?? '';
$monto = $data['monto'] ?? 0;
$descripcion = $data['descripcion'] ?? '';

if (!$id || empty($cuit) || empty($nombre) || empty($monto)) {
    echo json_encode(["status" => "error", "message" => "Faltan parámetros requeridos"]);
    exit();
}

try {
    // Verificar que el reporte pertenezca al socio
    $check = $conn->prepare("SELECT id FROM reports WHERE id = ? AND reporter_id = ?");
    $check->execute([$id, $reporter_id]);

    if (!$check->fetch()) {
        echo json_encode(["status" => "error", "message" => "Reporte no encontrado o no autorizado"]);
        exit();
    }

    // Actualizar reporte
    $stmt = $conn->prepare("UPDATE reports SET cuit_denunciado = ?, nombre_denunciado = ?, monto = ?, descripcion = ? WHERE id = ?");
    $stmt->execute([$cuit, $nombre, $monto, $descripcion, $id]);

    echo json_encode(["status" => "success", "message" => "Reporte actualizado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error de base de datos: " . $e->getMessage()]);
}
?>
<?php
// admin_create_report.php - Carga directa de deudas por el administrador
require_once 'config.php';

if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$cuit_denunciado = preg_replace('/\D/', '', $data['cuit_denunciado'] ?? '');
$nombre_denunciado = trim($data['nombre_denunciado'] ?? '');
$monto = floatval($data['monto'] ?? 0);
$descripcion = trim($data['descripcion'] ?? '');
$reporter_cuit = preg_replace('/\D/', '', $data['reporter_cuit'] ?? '20255621867'); // Default Javier Gozzi

if (empty($cuit_denunciado) || empty($nombre_denunciado) || $monto <= 0) {
    echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios (CUIT, Nombre, Monto)"]);
    exit();
}

try {
    // 1. Encontrar ID del reportero
    $stmtRep = $conn->prepare("SELECT id FROM membership_companies WHERE cuit = ? LIMIT 1");
    $stmtRep->execute([$reporter_cuit]);
    $reporter_id = $stmtRep->fetchColumn();

    if (!$reporter_id) {
        // Si no existe el reportero, usamos el primer admin o creamos uno genérico?
        // Mejor usamos el primer registro o fallamos.
        $reporter_id = $conn->query("SELECT id FROM membership_companies ORDER BY id ASC LIMIT 1")->fetchColumn();
    }

    // 2. Insertar reporte validado directamente
    $stmt = $conn->prepare("INSERT INTO reports (reporter_id, cuit_denunciado, nombre_denunciado, monto, descripcion, estado, fecha_denuncia) VALUES (?, ?, ?, ?, ?, 'validado', NOW())");
    $stmt->execute([
        $reporter_id,
        $cuit_denunciado,
        $nombre_denunciado,
        $monto,
        $descripcion
    ]);

    echo json_encode(["status" => "success", "message" => "Informe de deuda cargado y validado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
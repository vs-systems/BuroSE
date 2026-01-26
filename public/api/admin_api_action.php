<?php
// admin_api_action.php - Gestión de Tokens de API por el administrador
require_once 'config.php';

// Verificar login de administrador
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$cuit = $data['cuit'] ?? '';
$action = $data['action'] ?? '';

if (!$cuit || !$action) {
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
    exit();
}

try {
    if ($action === 'generate') {
        $token = bin2hex(random_bytes(16)) . "." . bin2hex(random_bytes(8));
        $stmt = $conn->prepare("UPDATE membership_companies SET api_token = ? WHERE cuit = ?");
        $stmt->execute([$token, $cuit]);
        echo json_encode(["status" => "success", "message" => "Token generado con éxito", "token" => $token]);
    } elseif ($action === 'revoke') {
        $stmt = $conn->prepare("UPDATE membership_companies SET api_token = NULL WHERE cuit = ?");
        $stmt->execute([$cuit]);
        echo json_encode(["status" => "success", "message" => "Token revocado"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
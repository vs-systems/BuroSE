<?php
// admin_ranking_action.php - Gestión del ranking por administrador
require_once 'config.php';

// Verificar sesión de administrador
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Acceso no autorizado"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? $_GET['action'] ?? '';

try {
    if ($action === 'list') {
        $stmt = $conn->query("SELECT * FROM debtor_rankings ORDER BY is_forced DESC, forced_position ASC, amount DESC");
        echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
    } elseif ($action === 'save') {
        $cuit = preg_replace('/[^0-9]/', '', $input['cuit']);
        $full_name = $input['full_name'];
        $amount = (float) $input['amount'];
        $status = $input['status'] ?? 'RED';
        $is_forced = (int) ($input['is_forced'] ?? 0);
        $forced_position = $input['forced_position'] ? (int) $input['forced_position'] : null;

        $sql = "INSERT INTO debtor_rankings (cuit, full_name, amount, status, is_forced, forced_position) 
                VALUES (?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                full_name = VALUES(full_name), 
                amount = VALUES(amount), 
                status = VALUES(status), 
                is_forced = VALUES(is_forced), 
                forced_position = VALUES(forced_position)";

        $stmt = $conn->prepare($sql);
        $stmt->execute([$cuit, $full_name, $amount, $status, $is_forced, $forced_position]);

        echo json_encode(["status" => "success", "message" => "Ranking actualizado con éxito"]);
    } elseif ($action === 'delete') {
        $id = (int) $input['id'];
        $stmt = $conn->prepare("DELETE FROM debtor_rankings WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "Registro eliminado"]);
    } else {
        throw new Exception("Acción no válida");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
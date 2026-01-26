<?php
// admin_user_action.php
require_once 'config.php';

// Solo admin puede realizar estas acciones
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$cuit = $data['cuit'] ?? '';
$action = $data['action'] ?? '';

if (empty($cuit) || empty($action)) {
    echo json_encode(["status" => "error", "message" => "Faltan parámetros requeridos"]);
    exit();
}

try {
    if ($action === 'block') {
        // Alternar bloqueo
        $stmt = $conn->prepare("SELECT estado FROM membership_companies WHERE cuit = ?");
        $stmt->execute([$cuit]);
        $row = $stmt->fetch();

        if ($row) {
            $nuevoEstado = ($row['estado'] === 'bloqueado') ? 'validado' : 'bloqueado';
            $stmt = $conn->prepare("UPDATE membership_companies SET estado = ? WHERE cuit = ?");
            $stmt->execute([$nuevoEstado, $cuit]);
            echo json_encode(["status" => "success", "message" => "Estado actualizado a: " . $nuevoEstado]);
        } else {
            echo json_encode(["status" => "error", "message" => "Socio no encontrado"]);
        }
    } elseif ($action === 'delete') {
        // Eliminar definitivamente un SOCIO
        $stmt = $conn->prepare("DELETE FROM membership_companies WHERE cuit = ?");
        $stmt->execute([$cuit]);
        echo json_encode(["status" => "success", "message" => "Socio eliminado correctamente"]);
    } elseif ($action === 'delete_lead') {
        // Eliminar definitivamente un LEAD (Solicitud)
        $stmt = $conn->prepare("DELETE FROM contact_submissions WHERE cuit = ?");
        $stmt->execute([$cuit]);
        echo json_encode(["status" => "success", "message" => "Solicitud/Lead eliminada correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Acción no válida"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
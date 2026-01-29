<?php
// member_change_password.php - Permite a los socios cambiar su contraseña
require_once 'config.php';

// Verificar login de socio
if (!isset($_SESSION['is_member']) || $_SESSION['is_member'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $current_pass = $data['current_pass'] ?? '';
    $new_pass = $data['new_pass'] ?? '';
    $cuit = $_SESSION['member_cuit'];

    if (empty($current_pass) || empty($new_pass)) {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
        exit();
    }

    try {
        // Obtener password actual
        $stmt = $conn->prepare("SELECT password FROM membership_companies WHERE cuit = ?");
        $stmt->execute([$cuit]);
        $row = $stmt->fetch();

        if ($row && password_verify($current_pass, $row['password'])) {
            // Actualizar a la nueva
            $hashed_pass = password_hash($new_pass, PASSWORD_DEFAULT);
            $update = $conn->prepare("UPDATE membership_companies SET password = ? WHERE cuit = ?");
            $update->execute([$hashed_pass, $cuit]);

            echo json_encode(["status" => "success", "message" => "Contraseña actualizada correctamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "La contraseña actual es incorrecta"]);
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
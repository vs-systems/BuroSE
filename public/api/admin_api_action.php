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

        // Obtener datos del socio para enviar el mail
        $stmt_email = $conn->prepare("SELECT email, razon_social FROM membership_companies WHERE cuit = ?");
        $stmt_email->execute([$cuit]);
        $user_data = $stmt_email->fetch();

        $stmt = $conn->prepare("UPDATE membership_companies SET api_token = ? WHERE cuit = ?");
        $stmt->execute([$token, $cuit]);

        $msg = "Token generado con éxito";
        if ($user_data && !empty($user_data['email'])) {
            $to = $user_data['email'];
            $subject = "BuroSE: Credenciales de API Generadas";
            $body = "Hola " . $user_data['razon_social'] . ",\n\n" .
                "Se ha generado un nuevo Token de acceso para la API de BuroSE.\n\n" .
                "TOKEN: " . $token . "\n\n" .
                "Puedes consultar la documentación técnica solicitándola a soporte.\n" .
                "Atentamente,\nEquipo BuroSE";
            $headers = "From: no-reply@burose.com.ar";
            mail($to, $subject, $body, $headers);
            $msg .= " y enviado a " . $to;
        }

        echo json_encode(["status" => "success", "message" => $msg, "token" => $token]);
    } elseif ($action === 'revoke') {
        $stmt = $conn->prepare("UPDATE membership_companies SET api_token = NULL WHERE cuit = ?");
        $stmt->execute([$cuit]);
        echo json_encode(["status" => "success", "message" => "Token revocado"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
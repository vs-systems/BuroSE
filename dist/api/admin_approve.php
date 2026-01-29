<?php
// admin_approve.php
require_once 'config.php';
// Solo admin puede aprobar
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$cuit = trim($data['cuit'] ?? '');
$password = trim($data['password'] ?? '');
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$whatsapp = $data['whatsapp'] ?? '';
$rubro = $data['rubro'] ?? '';
$localidad = $data['localidad'] ?? '';

if (empty($cuit) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "CUIT y Password requeridos"]);
    exit();
}

try {
    // Calcular fecha de vencimiento (30 días desde hoy) - Rolling Billing
    $expiry_date = date('Y-m-d', strtotime('+30 days'));
    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO membership_companies (cuit, password, razon_social, email, whatsapp, localidad, rubro, estado, expiry_date, plan) VALUES (?, ?, ?, ?, ?, ?, ?, 'validado', ?, 'active')");
    if ($stmt->execute([$cuit, $hashed_pass, $name, $email, $whatsapp, $localidad, $rubro, $expiry_date])) {
        // Eliminar de solicitudes tras aprobar
        $stmtDel = $conn->prepare("DELETE FROM contact_submissions WHERE cuit = ?");
        $stmtDel->execute([$cuit]);
        echo json_encode(["status" => "success", "message" => "Socio aprobado correctamente. Vencimiento: " . $expiry_date]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
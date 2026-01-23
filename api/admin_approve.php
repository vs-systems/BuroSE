<?php
// admin_approve.php
require_once 'config.php';
session_start();

// Solo admin puede aprobar
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$cuit = $data['cuit'] ?? '';
$password = $data['password'] ?? '';
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
    // 1. Insertar o actualizar en membership_companies
    // Usamos ON DUPLICATE KEY UPDATE por si ya existía el CUIT
    $sql = "INSERT INTO membership_companies (razon_social, cuit, email, whatsapp, rubro, localidad, password, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'validado')
            ON DUPLICATE KEY UPDATE 
            razon_social = VALUES(razon_social),
            password = VALUES(password),
            email = VALUES(email),
            estado = 'validado'";

    $stmt = $conn->prepare($sql);
    $stmt->execute([$name, $cuit, $email, $whatsapp, $rubro, $localidad, $password]);

    echo json_encode(["status" => "success", "message" => "Socio aprobado y activado"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
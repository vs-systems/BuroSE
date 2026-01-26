<?php
// admin_create_socio.php - Creación manual de socios por el administrador
require_once 'config.php';

// Verificar login de administrador
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $razon_social = $data['razon_social'] ?? '';
    $cuit = $data['cuit'] ?? '';
    $email = $data['email'] ?? '';
    $pass = $data['pass'] ?? 'burose2026'; // Password por defecto
    $expiry_days = $data['expiry_days'] ?? 365; // 1 año por defecto para cuentas gratis

    if (!$razon_social || !$cuit || !$email) {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
        exit();
    }

    try {
        // Verificar si ya existe
        $check = $conn->prepare("SELECT id FROM membership_companies WHERE cuit = ? OR email = ?");
        $check->execute([$cuit, $email]);
        if ($check->fetch()) {
            echo json_encode(["status" => "error", "message" => "El CUIT o Email ya están registrados"]);
            exit();
        }

        $expiry_date = date('Y-m-d', strtotime("+$expiry_days days"));

        $stmt = $conn->prepare("INSERT INTO membership_companies (razon_social, cuit, email, password, estado, expiry_date) VALUES (?, ?, ?, ?, 'validado', ?)");
        $stmt->execute([
            $razon_social,
            $cuit,
            $email,
            password_hash($pass, PASSWORD_DEFAULT),
            $expiry_date
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Socio creado exitosamente",
            "expiry_date" => $expiry_date
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>
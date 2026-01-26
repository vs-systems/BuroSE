<?php
// config.php - Configuración de conexión a la base de datos
header("Access-Control-Allow-Origin: https://www.burose.com.ar");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Configuración de sesión para persistencia en Hostinger
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '', // Dejar vacío para dominio actual
    'secure' => false, // Cambiar a true si usas HTTPS obligatorio
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

// Inicialización de esquema (si no existe)
try {
    // Agregar columna de vencimiento si no existe
    $conn->exec("ALTER TABLE membership_companies ADD COLUMN IF NOT EXISTS expiry_date DATE DEFAULT NULL");

    // Asegurar tabla de logos
    $conn->exec("CREATE TABLE IF NOT EXISTS brand_logos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(255) NOT NULL,
        website_url VARCHAR(255),
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
} catch (Exception $e) {
    // Silencioso si falla por permisos o si ya existe
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Datos reales de la base de datos en Hostinger
$host = 'localhost';
$db_name = 'u499089589_burose_db';
$username = 'u499089589_burose_admin';
$password = 'v5yS_2024_P@ss!#';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error de conexión a la base de datos: " . $e->getMessage(),
        "db_host" => $host,
        "db_name" => $db_name
    ]);
    exit();
}
?>
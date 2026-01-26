<?php
// config.php - Configuración de conexión con alta compatibilidad
error_reporting(0); // Prevenir que advertencias rompan el JSON

// CORS Broad - Para máxima compatibilidad
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de Sesión
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Datos de Conexión
$host = 'localhost';
$db_name = 'u499089589_burose_db';
$username = 'u499089589_burose_admin';
$password = 'v5yS_2024_P@ss!#';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Inicialización suave de esquema
    try {
        // Solo intentamos crear si no existen, uno por uno
        $conn->exec("CREATE TABLE IF NOT EXISTS brand_logos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            logo_url VARCHAR(255) NOT NULL,
            website_url VARCHAR(255),
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Verificación de columna segura
        $check = $conn->query("SHOW COLUMNS FROM membership_companies LIKE 'expiry_date'");
        if ($check && $check->rowCount() == 0) {
            $conn->exec("ALTER TABLE membership_companies ADD COLUMN expiry_date DATE DEFAULT NULL");
        }
    } catch (Exception $e_schema) {
        // Ignorar errores de esquema para no bloquear el login
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Base de datos desconectada"]);
    exit();
}
?>
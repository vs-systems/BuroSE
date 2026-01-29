<?php
// config.php - Configuración de BuroSE
error_reporting(E_ALL);
ini_set('display_errors', 0); // Desactivar en producción para no romper JSON

// CORS Security
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header("Access-Control-Allow-Origin: https://www.burose.com.ar");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de Sesión para Hostinger
session_set_cookie_params([
    'lifetime' => 86400 * 30, // 30 días
    'path' => '/',
    'secure' => false, // Cambiar a true si el sitio es HTTPS obligatorio
    'httponly' => true,
    'samesite' => 'Lax'
]);
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Credenciales de Base de Datos
$host = 'localhost';
$db_name = 'u499089589_burose_db';
$username = 'u499089589_burose_admin';
$password = 'v5yS_2024_P@ss!#';

// Credenciales de Mercado Pago (Producción)
define('MP_PUBLIC_KEY', 'APP_USR-2a15d890-9c19-462b-8abc-ebd8013bbf71');
define('MP_ACCESS_TOKEN', 'APP_USR-2049883684966828-012615-bf374d86d3738be454a0b9689664e8b9-2517343428');
define('MP_CLIENT_ID', '2049883684966828');
define('MP_CLIENT_SECRET', '56FamKPjqO0cqwaDzParFWNAdxvRRRzF');

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Inicialización suave de esquema (Solo si es necesario)
    try {
        $check = $conn->query("SHOW COLUMNS FROM membership_companies LIKE 'expiry_date'");
        if ($check && $check->rowCount() == 0) {
            $conn->exec("ALTER TABLE membership_companies ADD COLUMN expiry_date DATE DEFAULT NULL");
        }

        $check_vip = $conn->query("SHOW COLUMNS FROM membership_companies LIKE 'is_vip'");
        if ($check_vip && $check_vip->rowCount() == 0) {
            $conn->exec("ALTER TABLE membership_companies ADD COLUMN is_vip TINYINT DEFAULT 0");
        }

        $check_token = $conn->query("SHOW COLUMNS FROM membership_companies LIKE 'api_token'");
        if ($check_token && $check_token->rowCount() == 0) {
            $conn->exec("ALTER TABLE membership_companies ADD COLUMN api_token VARCHAR(255) DEFAULT NULL");
        }

        $check_plan = $conn->query("SHOW COLUMNS FROM membership_companies LIKE 'plan'");
        if ($check_plan && $check_plan->rowCount() == 0) {
            $conn->exec("ALTER TABLE membership_companies ADD COLUMN plan VARCHAR(20) DEFAULT 'free'");
        }

        // Nuevos campos para reportes (Enriquecimiento de datos)
        // Nuevos campos para reportes (Enriquecimiento de datos)
        $new_report_cols = [
            'intencion_pago' => 'TINYINT DEFAULT 0',
            'instancia_judicial' => 'TINYINT DEFAULT 0',
            'domicilio_particular' => 'VARCHAR(255) DEFAULT NULL',
            'domicilio_comercial' => 'VARCHAR(255) DEFAULT NULL',
            'celular_contacto' => 'VARCHAR(50) DEFAULT NULL',
            'provincia' => 'VARCHAR(100) DEFAULT NULL',
            'localidad' => 'VARCHAR(100) DEFAULT NULL'
        ];
        foreach ($new_report_cols as $col => $type) {
            $check = $conn->query("SHOW COLUMNS FROM reports LIKE '$col'");
            if ($check && $check->rowCount() == 0) {
                $conn->exec("ALTER TABLE reports ADD COLUMN $col $type");
            }
        }

        // Estado para replicas
        $check_rep = $conn->query("SHOW COLUMNS FROM replica_requests LIKE 'estado'");
        if ($check_rep && $check_rep->rowCount() == 0) {
            $conn->exec("ALTER TABLE replica_requests ADD COLUMN estado VARCHAR(20) DEFAULT 'pendiente'");
        }

        // Reparación de VIPs (Asegurar que los socios estratégicos sean VIP)
        $vips_to_ensure = ['Biosegur', 'Javier Gozzi', 'DyR Sistemas', 'Block Seguridad'];
        foreach ($vips_to_ensure as $v_name) {
            $stmtV = $conn->prepare("UPDATE membership_companies SET is_vip = 1, plan = 'business', expiry_date = NULL WHERE razon_social LIKE ?");
            $stmtV->execute(["%$v_name%"]);
        }

    } catch (Exception $e_schema) {
        // Ignorar
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Base de datos en mantenimiento"]);
    exit();
}
?>
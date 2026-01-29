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
        // Normalizar membership_companies
        $mc_fields = [
            'is_vip' => "TINYINT DEFAULT 0",
            'expiry_date' => "DATE DEFAULT NULL",
            'plan' => "VARCHAR(50) DEFAULT 'free'",
            'api_token' => "VARCHAR(255) DEFAULT NULL",
            'password' => "VARCHAR(255) DEFAULT NULL",
            'gremio' => "VARCHAR(100) DEFAULT NULL",
            'creds_monthly' => "INT DEFAULT 0",
            'creds_package' => "INT DEFAULT 0",
            'creds_package_expiry' => "DATE DEFAULT NULL",
            'fingerprint' => "VARCHAR(255) DEFAULT NULL",
            'last_ip' => "VARCHAR(100) DEFAULT NULL",
            'creds_purchased' => "INT DEFAULT 0",
            'reports_submitted_count' => "INT DEFAULT 0"
        ];
        foreach ($mc_fields as $f => $d) {
            $check = $conn->query("SHOW COLUMNS FROM membership_companies LIKE '$f'");
            if ($check && $check->rowCount() == 0) {
                $conn->exec("ALTER TABLE membership_companies ADD COLUMN $f $d");
            }
        }

        // 3. Tabla de Configuración Global
        $conn->exec("CREATE TABLE IF NOT EXISTS system_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(100) NOT NULL UNIQUE,
            setting_value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        // Insertar valores por defecto si no existen
        $conn->exec("INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES ('footer_update_date', '2026-01-29 12:48:48')");

        // Normalizar reports
        $rep_fields = [
            'monto' => "DECIMAL(15,2) DEFAULT 0",
            'fecha_denuncia' => "DATE DEFAULT NULL",
            'created_at' => "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            'evidencia_url' => "TEXT",
            'intencion_pago' => "TINYINT DEFAULT 0",
            'instancia_judicial' => "TINYINT DEFAULT 0",
            'domicilio_particular' => "VARCHAR(255) DEFAULT NULL",
            'domicilio_comercial' => "VARCHAR(255) DEFAULT NULL",
            'celular_contacto' => "VARCHAR(50) DEFAULT NULL",
            'provincia' => "VARCHAR(100) DEFAULT NULL",
            'localidad' => "VARCHAR(100) DEFAULT NULL"
        ];
        foreach ($rep_fields as $f => $d) {
            $check = $conn->query("SHOW COLUMNS FROM reports LIKE '$f'");
            if ($check && $check->rowCount() == 0) {
                if ($f === 'monto') {
                    $check_alt = $conn->query("SHOW COLUMNS FROM reports LIKE 'amount'");
                    if ($check_alt && $check_alt->rowCount() > 0) {
                        $conn->exec("ALTER TABLE reports CHANGE COLUMN amount monto DECIMAL(15,2) DEFAULT 0");
                    } else {
                        $conn->exec("ALTER TABLE reports ADD COLUMN monto DECIMAL(15,2) DEFAULT 0");
                    }
                } else {
                    $conn->exec("ALTER TABLE reports ADD COLUMN $f $d");
                }
            } else {
                // Si existe pero queremos cambiar el tipo (ej: evidencia_url a TEXT)
                if ($f === 'evidencia_url') {
                    $conn->exec("ALTER TABLE reports MODIFY COLUMN evidencia_url TEXT");
                }
            }
        }
        $conn->exec("UPDATE reports SET fecha_denuncia = DATE(created_at) WHERE fecha_denuncia IS NULL");

        /*
        // Restaurar VIPs (DESHABILITADO: Para permitir borrar duplicados)
        $vips = [
            ['Biosegur', '20111111111', 'info@biosegur.com.ar'],
            ['Javier Gozzi', '20255621867', 'sistemas@burose.com.ar'], // CUIT Corregido
            ['DyR Sistemas', '30333333333', 'info@dyrsistemas.com.ar'],
            ['Block Seguridad', '30444444444', 'info@block.com.ar']
        ];
        foreach ($vips as $v) {
            $stmt = $conn->prepare("UPDATE membership_companies SET is_vip = 1, plan = 'business', expiry_date = NULL, estado = 'validado' WHERE razon_social LIKE ?");
            $stmt->execute(["%{$v[0]}%"]);
            if ($stmt->rowCount() == 0) {
                $stmtIns = $conn->prepare("INSERT IGNORE INTO membership_companies (razon_social, cuit, email, is_vip, plan, estado) VALUES (?, ?, ?, 1, 'business', 'validado')");
                $stmtIns->execute([$v[0], $v[1], $v[2]]);
            }
        }
        */

        // 4. Asegurar tabla de ranking
        $conn->exec("CREATE TABLE IF NOT EXISTS debtor_rankings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            cuit VARCHAR(20) NOT NULL UNIQUE,
            full_name VARCHAR(255) NOT NULL,
            amount DECIMAL(15,2) DEFAULT 0,
            status ENUM('GREEN', 'YELLOW', 'RED') DEFAULT 'RED',
            is_forced TINYINT DEFAULT 0,
            forced_position INT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        // 5. Tabla de Auditoría / Logs de Actividad
        $conn->exec("CREATE TABLE IF NOT EXISTS activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NULL,
            user_name VARCHAR(255) NULL,
            action VARCHAR(100) NOT NULL,
            details TEXT,
            ip_address VARCHAR(50),
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    } catch (Exception $e_schema) {
        // Ignorar fallos de alter silenciosamente
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Base de datos en mantenimiento"]);
    exit();
}

function log_activity($conn, $user_id, $user_name, $action, $details = null)
{
    try {
        $stmt = $conn->prepare("INSERT INTO activity_logs (user_id, user_name, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $user_id,
            $user_name,
            $action,
            $details,
            $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
        ]);
    } catch (Exception $e) {
        // Ignorar fallos de log para no interrumpir flujo principal
    }
}
?>
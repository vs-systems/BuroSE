<?php
// search.php - Motor de Inteligencia Comercial BuroSE
require_once 'config.php';

// Global error handler for JSON responses
set_exception_handler(function ($e) {
    @file_put_contents('critical_errors.log', date('[Y-m-d H:i:s] ') . $e->getMessage() . PHP_EOL . $e->getTraceAsString() . PHP_EOL, FILE_APPEND);
    echo json_encode([
        "status" => "error",
        "message" => "Error interno del servidor",
        "debug" => $e->getMessage()
    ]);
    exit();
});

if (!isset($_GET['cuit'])) {
    echo json_encode(["status" => "error", "message" => "Falta el CUIT/DNI"]);
    exit();
}

$cuit = preg_replace('/[^0-9]/', '', $_GET['cuit']); // Limpiar guiones

// --- Funciones de Inteligencia Externa ---

function obtener_nombre_scraper($cuit)
{
    $url = "https://www.cuitonline.com/search.php?q=" . $cuit;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    $html = curl_exec($ch);
    curl_close($ch);

    if ($html) {
        if (preg_match('/itemprop="name">(.*?)<\//', $html, $matches)) {
            return strtoupper(trim(strip_tags($matches[1])));
        }
        if (preg_match('/CUIT\s+[\d-]+\s+-\s+(.*?)\s+-\s+Cuit/i', $html, $matches)) {
            $name = trim($matches[1]);
            if (strtoupper($name) !== "CUIT ONLINE")
                return strtoupper($name);
        }
    }
    return null;
}

function consultar_bcra($cuit)
{
    $url = "https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/" . $cuit;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($httpCode == 200) {
        $data = json_decode($response, true);
        return [
            "success" => true,
            "data" => $data['results'] ?? null
        ];
    }

    if ($httpCode == 404) {
        return [
            "success" => true,
            "data" => null,
            "not_found" => true
        ];
    }

    return [
        "success" => false,
        "message" => "El servicio del BCRA no responde momentáneamente.",
        "code" => $httpCode,
        "error" => $error
    ];
}

// --- PROCESAMIENTO ---

// 1. Obtener Nombre del Sujeto
// Prioridad 1: Base de datos interna
$stmtName = $conn->prepare("SELECT razon_social FROM membership_companies WHERE cuit = ?");
$stmtName->execute([$cuit]);
$internal_name = $stmtName->fetchColumn();

// Prioridad 2: Scraper externo
$scraped_name = $internal_name ?: obtener_nombre_scraper($cuit);

// 2. Buscar en Base de Datos Interna (Denuncias del Gremio)
$stmt = $conn->prepare("SELECT r.*, mc.razon_social as reporter_name 
                        FROM reports r 
                        LEFT JOIN membership_companies mc ON r.reporter_id = mc.id 
                        WHERE r.cuit_denunciado = ? AND r.estado = 'validado' 
                        ORDER BY r.fecha_denuncia DESC");
$stmt->execute([$cuit]);
$internal_reports = $stmt->fetchAll();

$total_internal_debt = 0;
foreach ($internal_reports as $report) {
    $total_internal_debt += $report['monto'];
}

// 3. Consultar BCRA en Tiempo Real
$bcra_response = consultar_bcra($cuit);
$bcra_normalized = [
    "entidades" => [],
    "deuda_total" => 0,
    "max_situacion" => 1,
    "found" => false,
    "success" => $bcra_response['success'],
    "message" => $bcra_response['message'] ?? null
];

if ($bcra_response['success'] && $bcra_response['data']) {
    $bcra_results = $bcra_response['data'];
    $bcra_normalized["found"] = true;

    // Estructura BCRA: results contiene un objeto con la llave 'periodos'
    // Cada periodo contiene la lista de entidades
    $periodos = $bcra_results['periodos'] ?? [];

    if (is_array($periodos) && count($periodos) > 0) {
        // Tomamos el periodo más reciente (el primero)
        $ultimo = $periodos[0];
        if (isset($ultimo['entidades']) && is_array($ultimo['entidades'])) {
            foreach ($ultimo['entidades'] as $b) {
                $bcra_normalized["entidades"][] = [
                    "entidad" => $b['denominacion'],
                    "periodo" => $ultimo['periodo'],
                    "situacion" => $b['situacion'],
                    "monto" => $b['monto'] * 1000
                ];
                $bcra_normalized["deuda_total"] += $b['monto'] * 1000;
                if ($b['situacion'] > $bcra_normalized["max_situacion"]) {
                    $bcra_normalized["max_situacion"] = $b['situacion'];
                }
            }
        }
    }
}

// 4. Contador de Consultas Recientes (Contador de Socios interesados)
$recent_consultants = 0;
try {
    $stmtCount = $conn->prepare("SELECT COUNT(DISTINCT user_id) FROM search_logs WHERE cuit_searched = ? AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)");
    $stmtCount->execute([$cuit]);
    $recent_consultants = $stmtCount->fetchColumn();
} catch (Exception $e_logs) {
    $recent_consultants = 0;
}

// 5. Determinar Nivel de Riesgo
$has_internal_risk = ($total_internal_debt > 0);
$has_bcra_risk = ($bcra_normalized["max_situacion"] > 1);
$has_bcra_debt = ($bcra_normalized["deuda_total"] > 0);

$alert_level = "GREEN";
if ($has_internal_risk || $has_bcra_risk) {
    $alert_level = "RED";
} elseif ($has_bcra_debt) {
    $alert_level = "YELLOW";
}

// 5. Verificar sesión y Créditos
$is_authenticated = false;
$user_id = $_SESSION['member_id'] ?? null;
$user_name = $_SESSION['member_name'] ?? 'Socio';
$user_plan = 'guest';

if (isset($_SESSION['is_member']) && $_SESSION['is_member'] === true && $user_id) {
    // Buscar datos actualizados del usuario
    $stmtUser = $conn->prepare("SELECT id, plan, creds_monthly, creds_package, creds_package_expiry, fingerprint, last_ip FROM membership_companies WHERE id = ?");
    $stmtUser->execute([$user_id]);
    $dbUser = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if ($dbUser) {
        $is_authenticated = true;
        $user_plan = $dbUser['plan'];

        // --- LOGICA DE CREDITOS ---
        $can_search = false;
        $consumption_type = null;

        if ($user_plan === 'free') {
            // Límite Gratuito: 1 por semana
            // Verificamos consultas en los últimos 7 días
            $countLastWeek = 99; // Default restrictiva si falla la tabla
            try {
                $stmtCheckFree = $conn->prepare("SELECT COUNT(*) FROM search_logs WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)");
                $stmtCheckFree->execute([$user_id]);
                $countLastWeek = $stmtCheckFree->fetchColumn();
            } catch (Exception $e_check_free) {
                // Si falla la tabla de logs, dejamos pasar si tiene créditos de paquete
            }

            if ($countLastWeek < 1) {
                // Verificar Anti-Abuso (IP/Fingerprint)
                $ip = $_SERVER['REMOTE_ADDR'];
                $stmtCheckAbuse = $conn->prepare("SELECT id FROM membership_companies WHERE (fingerprint = ? OR last_ip = ?) AND id != ? AND plan = 'free' LIMIT 1");
                $stmtCheckAbuse->execute([$dbUser['fingerprint'], $ip, $user_id]);
                if ($stmtCheckAbuse->fetch()) {
                    echo json_encode(["status" => "error", "message" => "Detección de múltiples cuentas. Su acceso ha sido restringido."]);
                    exit();
                }
                $can_search = true;
                $consumption_type = 'weekly_free';
            } elseif ($dbUser['creds_package'] > 0) {
                // Usar créditos obtenidos por informes o comprados
                $can_search = true;
                $consumption_type = 'package';
            } else {
                echo json_encode(["status" => "error", "message" => "Límite semanal alcanzado (1/1). Suba un informe de deuda validado para obtener créditos extra o adquiera un paquete."]);
                exit();
            }
        } else {
            // Socio BuroSE / Business / API
            // 1. Mensuales (Prioridad 1)
            if ($dbUser['creds_monthly'] > 0) {
                $can_search = true;
                $consumption_type = 'monthly';
            }
            // 2. Paquetes (Prioridad 2)
            elseif ($dbUser['creds_package'] > 0) {
                // Verificar vencimiento
                $expiry = $dbUser['creds_package_expiry'];
                if (!$expiry || $expiry >= date('Y-m-d')) {
                    $can_search = true;
                    $consumption_type = 'package';
                } else {
                    echo json_encode(["status" => "error", "message" => "Sus créditos adicionales han vencido. Por favor, renueve su saldo."]);
                    exit();
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Sin créditos disponibles. Suscripción agotada."]);
                exit();
            }
        }

        if ($can_search) {
            // Consumir Crédito
            if ($consumption_type === 'monthly') {
                $conn->prepare("UPDATE membership_companies SET creds_monthly = creds_monthly - 1 WHERE id = ?")->execute([$user_id]);
            } elseif ($consumption_type === 'package') {
                $conn->prepare("UPDATE membership_companies SET creds_package = creds_package - 1 WHERE id = ?")->execute([$user_id]);
            }

            // Log de búsqueda
            try {
                $stmtLog = $conn->prepare("INSERT INTO search_logs (user_id, cuit_searched, consumption_type, ip_address) VALUES (?, ?, ?, ?)");
                $stmtLog->execute([$user_id, $cuit, $consumption_type, $_SERVER['REMOTE_ADDR']]);
            } catch (Exception $e_log_search) {
                // Silencioso
            }

            // Actualizar IP
            $conn->prepare("UPDATE membership_companies SET last_ip = ? WHERE id = ?")->execute([$_SERVER['REMOTE_ADDR'], $user_id]);
        }
    }
} elseif (isset($_SESSION['admin_logged']) && $_SESSION['admin_logged'] === true) {
    $is_authenticated = true;
    $user_plan = 'admin';
}

if (!$is_authenticated) {
    // Notificar por mail (burosearg@gmail.com)
    $to = "burosearg@gmail.com";
    $subject = "CONSULTA GUEST - BuroSE";
    $body = "Invitado buscó: $cuit\nNombre: " . ($scraped_name ?: "No identificado") . "\nAlerta: $alert_level\nFecha: " . date('Y-m-d H:i:s');
    @mail($to, $subject, $body, "From: info@burose.com.ar");

    echo json_encode([
        "status" => "success",
        "authenticated" => false,
        "cuit" => $cuit,
        "name" => $scraped_name ?: null,
        "alert_level" => $alert_level,
        "recent_consultants" => $recent_consultants,
        "has_risk" => ($has_internal_risk || $has_bcra_risk),
        "message" => "Regístrese para ver el detalle de los reportes y montos."
    ]);
} else {
    // Limpiar reportes internos para cumplir con políticas de privacidad
    $sanitized_reports = array_map(function ($r) {
        return [
            "reporter_name" => $r['reporter_name'] ?: 'Miembro BuroSE',
            "monto" => $r['monto'],
            "fecha_denuncia" => $r['fecha_denuncia'],
            // Se elimina descripcion y evidencia_url por política de privacidad comercial
        ];
    }, $internal_reports);

    // Notificación por mail (burosearg@gmail.com)
    $to = "burosearg@gmail.com";
    $subject = "CONSULTA SOCIO - " . $user_name;
    $body = "Socio: " . $user_name . " (" . ($_SESSION['member_cuit'] ?? 'N/A') . ")\nBuscó: $cuit\nNombre: " . ($scraped_name ?: "No identificado") . "\nAlerta: $alert_level";
    @mail($to, $subject, $body, "From: info@burose.com.ar");

    try {
        log_activity($conn, $user_id, $user_name, 'SEARCH_SOCIO', "Buscó: $cuit ($scraped_name), Alerta: $alert_level");
    } catch (Exception $e_final_log) {
        // Silencioso
    }

    echo json_encode([
        "status" => "success",
        "authenticated" => true,
        "cuit" => $cuit,
        "name" => $scraped_name ?: null,
        "recent_consultants" => $recent_consultants,
        "internal" => [
            "count" => count($internal_reports),
            "total_debt" => $total_internal_debt,
            "reports" => $sanitized_reports
        ],
        "bcra" => $bcra_normalized,
        "total_risk_debt" => $total_internal_debt + $bcra_normalized["deuda_total"],
        "alert_level" => $alert_level
    ]);
}
?>
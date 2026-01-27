<?php
// search.php - Motor de Inteligencia Comercial BuroSE
require_once 'config.php';

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
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 200) {
        $data = json_decode($response, true);
        return $data['results'] ?? null;
    }
    return null;
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
$bcra_results = consultar_bcra($cuit);
$bcra_normalized = [
    "entidades" => [],
    "deuda_total" => 0,
    "max_situacion" => 1,
    "found" => false
];

if ($bcra_results) {
    $bcra_normalized["found"] = true;
    // Si el API devuelve 'periodos' dentro de results
    $periodos = $bcra_results['periodos'] ?? null;

    if ($periodos) {
        $ultimo = reset($periodos);
        if (isset($ultimo['entidades'])) {
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

// 4. Determinar Nivel de Riesgo
// RED si tiene deudas internas o SIT > 1 en BCRA
// Si tiene SIT 1 pero deuda > 0 corporativa, se puede considerar riesgo menor o amarillo
$has_internal_risk = ($total_internal_debt > 0);
$has_bcra_risk = ($bcra_normalized["max_situacion"] > 1);

$alert_level = "GREEN";
if ($has_internal_risk || $has_bcra_risk) {
    $alert_level = "RED";
} elseif ($bcra_normalized["deuda_total"] > 0) {
    // Si tiene deuda bancaria aunque esté en SIT 1, lo dejamos en VERDE pero mostramos el monto
    $alert_level = "GREEN";
}

// 5. Verificar sesión (Usuario socio o Administrador)
$is_authenticated = (
    (isset($_SESSION['is_member']) && $_SESSION['is_member'] === true) ||
    (isset($_SESSION['admin_logged']) && $_SESSION['admin_logged'] === true)
);

if (!$is_authenticated) {
    // Modo GUEST: Información limitada para incentivar registro
    echo json_encode([
        "status" => "success",
        "authenticated" => false,
        "cuit" => $cuit,
        "name" => $scraped_name ?: null,
        "alert_level" => $alert_level,
        "has_risk" => ($has_internal_risk || $has_bcra_risk),
        "message" => "Regístrese para ver el detalle de los reportes y montos."
    ]);
} else {
    // Modo FULL: Información detallada para socios/admin
    echo json_encode([
        "status" => "success",
        "authenticated" => true,
        "cuit" => $cuit,
        "name" => $scraped_name ?: null,
        "internal" => [
            "count" => count($internal_reports),
            "total_debt" => $total_internal_debt,
            "reports" => $internal_reports
        ],
        "bcra" => $bcra_normalized,
        "total_risk_debt" => $total_internal_debt + $bcra_normalized["deuda_total"],
        "alert_level" => $alert_level
    ]);
}
?>
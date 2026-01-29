<?php
// v1/search.php - Public API de BuroSE
require_once '../config.php';

// 1. Autenticación por Bearer Token
$headers = apache_request_headers();
$auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

if (!preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Token faltante o formato inválido (Use Bearer {token})"]);
    exit();
}

$token = $matches[1];

// 2. Validar Token y Membresía
try {
    $stmt = $conn->prepare("SELECT cuit, raison_social, estado, expiry_date, is_vip FROM membership_companies WHERE api_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Token inválido o revocado"]);
        exit();
    }

    if ($user['estado'] !== 'validado') {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Cuenta suspendida"]);
        exit();
    }

    // Verificar vencimiento (excepto VIPs)
    if ($user['is_vip'] != 1 && $user['expiry_date'] && strtotime($user['expiry_date']) < time()) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Membresía vencida. Favor de renovar abono."]);
        exit();
    }

} catch (PDOException $e) {
    http_response_code(500);
    exit();
}

// 3. Ejecutar Búsqueda (Reutilizando lógica de search.php pero devolviendo JSON puro)
if (!isset($_GET['cuit'])) {
    echo json_encode(["status" => "error", "message" => "Parámetro 'cuit' requerido"]);
    exit();
}

// Importar funciones de búsqueda (Como esto es un motor, lo ideal es tener un include de funciones, pero por ahora duplicamos por velocidad o incluimos el original)
// Para evitar duplicar, vamos a requerir la lógica de búsqueda.
// NOTA: En un refactor futuro, search.php debería ser solo funciones.

$cuit_target = preg_replace('/[^0-9]/', '', $_GET['cuit']);

// Copia funcional de la lógica de search.php adaptada para API
// --- Repitiendo funciones por ahora para independencia técnica del endpoint publico ---
function obtener_nombre($cuit)
{
    $url = "https://www.cuitonline.com/search.php?q=" . $cuit;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, "BuroSE-API/1.0");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    $html = curl_exec($ch);
    curl_close($ch);
    if ($html && preg_match('/itemprop="name">(.*?)<\//', $html, $matches))
        return strtoupper(trim(strip_tags($matches[1])));
    return null;
}

function consultar_bcra_api($cuit)
{
    $url = "https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/" . $cuit;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true)['results'] ?? null;
}

// Datos Internos
$stInt = $conn->prepare("SELECT monto, fecha_denuncia, descripcion FROM reports WHERE cuit_denunciado = ? AND estado = 'validado'");
$stInt->execute([$cuit_target]);
$internos = $stInt->fetchAll();

// Datos BCRA
$bcra = consultar_bcra_api($cuit_target);
$bcra_normalized = ["entities" => [], "total_debt" => 0, "max_situation" => 1];
if ($bcra && isset($bcra['periodos'])) {
    $u = reset($bcra['periodos']);
    foreach ($u['entidades'] as $ent) {
        $bcra_normalized["entities"][] = ["bank" => $ent['denominacion'], "situation" => $ent['situacion'], "amount" => $ent['monto'] * 1000];
        $bcra_normalized["total_debt"] += $ent['monto'] * 1000;
        if ($ent['situacion'] > $bcra_normalized["max_situation"])
            $bcra_normalized["max_situation"] = $ent['situacion'];
    }
}

echo json_encode([
    "version" => "1.0",
    "timestamp" => date('c'),
    "query" => $cuit_target,
    "name" => obtener_nombre($cuit_target) ?: "Unknown",
    "risk_analysis" => [
        "alert_level" => ($bcra_normalized["max_situation"] > 1 || count($internos) > 0) ? "RED" : "GREEN",
        "total_consolidated_debt" => $bcra_normalized["total_debt"] + array_sum(array_column($internos, 'monto')),
        "guild_reports" => $internos,
        "bcra_status" => $bcra_normalized
    ]
]);
?>
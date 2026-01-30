<?php
// admin_renaper.php
require_once 'config.php';

header('Content-Type: application/json');

// Seguridad: Solo admin
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$dni = $_GET['dni'] ?? '';
$gender = $_GET['gender'] ?? 'M';

if (strlen($dni) < 7 || strlen($dni) > 9) {
    echo json_encode(["status" => "error", "message" => "DNI inválido"]);
    exit();
}

$url = "https://apirnpr.onrender.com/renaper/$dni/$gender";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($httpCode == 200) {
    echo $response;
} else {
    echo json_encode([
        "status" => "error",
        "message" => "El servicio de Renaper no respondió correctamente.",
        "debug" => $error,
        "code" => $httpCode
    ]);
}
?>
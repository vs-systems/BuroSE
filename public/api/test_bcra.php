<?php
header('Content-Type: application/json');
$cuit = "20255621867";
$url = "https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/" . $cuit;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// No UA to match bcra/index.php
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo json_encode([
    "url" => $url,
    "httpCode" => $httpCode,
    "error" => $error,
    "response" => json_decode($response, true)
], JSON_PRETTY_PRINT);
?>
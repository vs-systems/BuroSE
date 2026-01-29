<?php
// mp_checkout.php - Genera preferencia de pago en Mercado Pago
require_once 'config.php';

// Verificar login de socio
if (!isset($_SESSION['is_member']) || $_SESSION['is_member'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$cuit = $_SESSION['member_cuit'];

// Configuración de Mercado Pago desde config.php
$access_token = MP_ACCESS_TOKEN;

$url = "https://api.mercadopago.com/checkout/preferences";

$data = [
    "items" => [
        [
            "title" => "BuroSE - Abono Mensual (CUIT $cuit)",
            "quantity" => 1,
            "unit_price" => 15000.00, // Precio real configurado
            "currency_id" => "ARS"
        ]
    ],
    "payer" => [
        "email" => $_SESSION['member_email'] ?? "socio@burose.com.ar"
    ],
    "back_urls" => [
        "success" => "https://www.burose.com.ar/#/dashboard?payment=success",
        "failure" => "https://www.burose.com.ar/#/dashboard?payment=failure",
        "pending" => "https://www.burose.com.ar/#/dashboard?payment=pending"
    ],
    "auto_return" => "approved",
    "external_reference" => $cuit,
    "notification_url" => "https://www.burose.com.ar/api/mp_webhook.php"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $access_token",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
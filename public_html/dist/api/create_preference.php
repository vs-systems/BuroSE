<?php
// create_preference.php - Genera link de pago para suscripción/alta
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$cuit = $data['cuit'] ?? '';
$price = 15000; // Precio fijo membresía (ajustar si viene dinámico)
$title = "Suscripción Mensual BuroSE";

if (empty($email) || empty($cuit)) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit();
}

// Configuración de la preferencia
$preference_data = [
    "items" => [
        [
            "title" => $title,
            "quantity" => 1,
            "currency_id" => "ARS",
            "unit_price" => $price
        ]
    ],
    "payer" => [
        "email" => $email
    ],
    "back_urls" => [
        "success" => "https://burose.com.ar/pago-exitoso",
        "failure" => "https://burose.com.ar/pago-fallido",
        "pending" => "https://burose.com.ar/pago-pendiente"
    ],
    "auto_return" => "approved",
    "external_reference" => $cuit, // USAMOS EL CUIT PARA IDENTIFICAR AL USUARIO EN EL WEBHOOK
    "notification_url" => "https://burose.com.ar/api/webhook_mp.php",
    "statement_descriptor" => "BUROSE SUSCRIPCION"
];

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.mercadopago.com/checkout/preferences",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($preference_data),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . MP_ACCESS_TOKEN
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo json_encode(["status" => "error", "message" => "Error al conectar con MP: " . $err]);
} else {
    $mp_response = json_decode($response, true);
    if (isset($mp_response['init_point'])) {
        echo json_encode([
            "status" => "success",
            "init_point" => $mp_response['init_point'], // Link para redirigir
            "preference_id" => $mp_response['id']
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error MP", "debug" => $mp_response]);
    }
}
?>
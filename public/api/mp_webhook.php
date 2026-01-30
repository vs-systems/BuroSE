<?php
// mp_webhook.php - Recibe notificaciones de pago de Mercado Pago
require_once 'config.php';

// Obtener el ID del pago de la notificación
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id = $data['data']['id'] ?? null;
$type = $data['type'] ?? '';

if ($type === 'payment' && $id) {
    // Configuración de Mercado Pago desde config.php
    $access_token = MP_ACCESS_TOKEN;

    // Consultar el estado del pago a la API de Mercado Pago
    $url = "https://api.mercadopago.com/v1/payments/$id";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $access_token"]);
    $response = curl_exec($ch);
    $payment_data = json_decode($response, true);
    curl_close($ch);

    if (isset($payment_data['status']) && $payment_data['status'] === 'approved') {
        $external_ref = $payment_data['external_reference'];
        $parts = explode('|', $external_ref);
        $cuit = $parts[0];
        $type = $parts[1] ?? 'subscription';

        try {
            if ($type === 'subscription') {
                // Extender vencimiento 30 días y resetear créditos mensuales
                $stmt = $conn->prepare("SELECT expiry_date FROM membership_companies WHERE cuit = ?");
                $stmt->execute([$cuit]);
                $row = $stmt->fetch();

                $current_expiry = $row['expiry_date'] ?? date('Y-m-d');
                $base_date = (strtotime($current_expiry) > time()) ? $current_expiry : date('Y-m-d');
                $new_expiry = date('Y-m-d', strtotime($base_date . ' + 30 days'));

                $update = $conn->prepare("UPDATE membership_companies SET expiry_date = ?, creds_monthly = 25, plan = 'business' WHERE cuit = ?");
                $update->execute([$new_expiry, $cuit]);

                $log_msg = "Suscripción aprobada CUIT $cuit - Nuevo vencimiento: $new_expiry";
            } else {
                // Paquetes de Créditos
                $credits_to_add = 0;
                if ($type === 'topup5')
                    $credits_to_add = 5;
                elseif ($type === 'topup10')
                    $credits_to_add = 10;
                elseif ($type === 'topup20')
                    $credits_to_add = 20;
                elseif ($type === 'topup50')
                    $credits_to_add = 50;

                if ($credits_to_add > 0) {
                    $update = $conn->prepare("UPDATE membership_companies SET creds_package = creds_package + ? WHERE cuit = ?");
                    $update->execute([$credits_to_add, $cuit]);
                    $log_msg = "Pack $credits_to_add créditos aprobado CUIT $cuit";
                }
            }

            // Log del pago
            file_put_contents('payments.log', date('Y-m-d H:i:s') . " - " . $log_msg . "\n", FILE_APPEND);

        } catch (Exception $e) {
            file_put_contents('payments_error.log', date('Y-m-d H:i:s') . " - Error CUIT $cuit Type $type: " . $e->getMessage() . "\n", FILE_APPEND);
        }
    }
}

http_response_code(200);
?>
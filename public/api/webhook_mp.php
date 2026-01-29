<?php
// webhook_mp.php - Webhook para procesar pagos de Mercado Pago
require_once 'config.php';

// Leer el cuerpo de la notificación
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Registrar log para depuración (opcional)
file_put_contents("mp_webhook.log", date('Y-m-d H:i:s') . " - " . $input . "\n", FILE_APPEND);

if (!isset($data['type']) || $data['type'] !== 'payment') {
    http_response_code(200); // Responder OK para que MP no reintente si no es pago
    exit();
}

$payment_id = $data['data']['id'];

// Consultar estado del pago a MP
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.mercadopago.com/v1/payments/$payment_id",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . MP_ACCESS_TOKEN
    ]
]);
$response = curl_exec($curl);
curl_close($curl);

$payment = json_decode($response, true);

if (isset($payment['status']) && $payment['status'] === 'approved') {
    $cuit = $payment['external_reference']; // Aquí recibimos el CUIT del socio

    // Activar usuario en DB
    try {
        // Verificar si el usuario ya existe (puede estar 'pending')
        $stmt = $conn->prepare("SELECT * FROM membership_companies WHERE cuit = ?");
        $stmt->execute([$cuit]);
        $user = $stmt->fetch();

        $password_plain = null;
        $is_new_user = false;

        if (!$user) {
            // El usuario pagó pero no estaba en forms contact submissions ni company members? Raro.
            // Quizás deberíamos buscar en contact_submissions
            $stmtLead = $conn->prepare("SELECT * FROM contact_submissions WHERE cuit = ?");
            $stmtLead->execute([$cuit]);
            $lead = $stmtLead->fetch();

            if ($lead) {
                // Mover de Lead a Socio
                $password_plain = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyz"), 0, 8);
                $hashed_pass = password_hash($password_plain, PASSWORD_DEFAULT);
                $expiry_date = date('Y-m-d', strtotime('+30 days'));

                $stmtIns = $conn->prepare("INSERT INTO membership_companies (cuit, password, razon_social, email, whatsapp, localidad, rubro, estado, expiry_date, plan, is_vip) VALUES (?, ?, ?, ?, ?, ?, ?, 'validado', ?, 'active', 0)");
                $stmtIns->execute([
                    $lead['cuit'],
                    $hashed_pass,
                    $lead['nombre_social'],
                    $lead['email'],
                    $lead['whatsapp'],
                    $lead['localidad'],
                    $lead['rubro'],
                    $expiry_date
                ]);

                // Borrar de leads
                $stmtDel = $conn->prepare("DELETE FROM contact_submissions WHERE cuit = ?");
                $stmtDel->execute([$cuit]);

                $user = ['email' => $lead['email'], 'razon_social' => $lead['nombre_social']];
                $is_new_user = true;
            } else {
                // Caso extremo: Pago sin registro previo. (Loguear error)
                file_put_contents("mp_errors.log", "Pago aprobado sin Lead previo CUIT: $cuit\n", FILE_APPEND);
                exit;
            }
        } else {
            // Usuario ya existente (renovación o reintento)
            $expiry_date = date('Y-m-d', strtotime('+30 days'));
            $stmtUpd = $conn->prepare("UPDATE membership_companies SET estado = 'validado', plan = 'active', expiry_date = ? WHERE cuit = ?");
            $stmtUpd->execute([$expiry_date, $cuit]);
        }

        /* Enviar Email de Bienvenida / Confirmación deshabilitado por spam
        $to = $user['email'];
        $subject = "¡Bienvenido a BuroSE! Pago Confirmado";
        $body = "Hola " . $user['razon_social'] . ",\n\n";
        $body .= "Tu pago ha sido procesado exitosamente. Tu cuenta está activa.\n";

        if ($is_new_user && $password_plain) {
            $body .= "Usuario: $cuit\n";
            $body .= "Contraseña Temporal: $password_plain\n\n";
            $body .= "Ingresa en: https://burose.com.ar\n";
        } else {
            $body .= "Tu membresía ha sido renovada hasta el $expiry_date.\n";
        }

        $headers = "From: info@burose.com.ar\r\n";
        $headers .= "Bcc: burosearg@gmail.com\r\n"; // Copia de control

        @mail($to, $subject, $body, $headers);
        */

    } catch (Exception $e) {
        file_put_contents("mp_errors.log", "Error DB: " . $e->getMessage() . "\n", FILE_APPEND);
    }
}

http_response_code(200);
?>
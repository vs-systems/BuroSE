<?php
// forms.php - Procesamiento de formularios
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // 1. Técnica Honeypot (Anti-spam)
    // El campo 'website_url' debe estar vacío siempre (los humanos no lo ven)
    if (!empty($data['website_url'])) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Spam detectado"]);
        exit;
    }

    // 2. Validación de Email
    $email = trim($data['email'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Formato de correo electrónico no válido."]);
        exit;
    }

    if (isset($data['type'])) {
        if ($data['type'] === 'contact') {
            $plan = $data['plan'] ?? 'business'; // Default to business (Socio)
            $isFree = ($plan === 'free');

            // 2.5 Security Tracking
            $fingerprint = $data['fingerprint'] ?? null;
            $ip = $_SERVER['REMOTE_ADDR'];

            // Procesar formulario de contacto / solicitud acceso
            $stmt = $conn->prepare("INSERT INTO contact_submissions (nombre_social, cuit, whatsapp, email, preferencia_contacto, rubro, localidad) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['cuit'],
                $data['whatsapp'],
                $data['email'],
                $data['contactPref'],
                $data['sector'],
                $data['city']
            ]);

            $prefUrl = null;

            if ($isFree) {
                // Registro Gratuito: Alta Directa
                $stmtAuth = $conn->prepare("INSERT IGNORE INTO membership_companies (razon_social, cuit, email, is_vip, plan, estado, gremio, fingerprint, last_ip, creds_monthly) VALUES (?, ?, ?, 0, 'free', 'validado', ?, ?, ?, 2)");
                $stmtAuth->execute([
                    $data['name'],
                    $data['cuit'],
                    $data['email'],
                    $data['sector'], // Gremio
                    $fingerprint,
                    $ip
                ]);
                $message = "Gracias. Tu cuenta gratuita ha sido activada (Límite: 2 consultas semanales).";
            } else {
                // Pago Socio: Generar Preferencia
                $paymentData = [
                    'email' => $data['email'],
                    'cuit' => $data['cuit'],
                    'price' => 15000
                ];

                $curl = curl_init();
                $apiUrl = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . dirname($_SERVER['PHP_SELF']) . "/create_preference.php";

                curl_setopt_array($curl, [
                    CURLOPT_URL => $apiUrl,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_CUSTOMREQUEST => "POST",
                    CURLOPT_POSTFIELDS => json_encode($paymentData),
                    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
                    CURLOPT_SSL_VERIFYPEER => false
                ]);
                $respPay = curl_exec($curl);
                curl_close($curl);
                $payJson = json_decode($respPay, true);

                if ($payJson && isset($payJson['status']) && $payJson['status'] === 'success') {
                    $prefUrl = $payJson['init_point'];
                }
                $message = "Solicitud recibida. Redirigiendo al pago...";
            }

            // Notificar por mail (legales@burose.com.ar)
            $to = "legales@burose.com.ar";
            $subject = "Nueva Solicitud [" . strtoupper($plan) . "]: " . $data['name'];
            $body = "Nombre: " . $data['name'] . "\n" .
                "CUIT: " . $data['cuit'] . "\n" .
                "WhatsApp: " . $data['whatsapp'] . "\n" .
                "Email: " . $data['email'] . "\n" .
                "Gremio: " . $data['sector'] . "\n" .
                "IP: " . $ip . "\n" .
                "Fingerprint: " . ($fingerprint ?? 'No disponible') . "\n\n" .
                "Estado: " . ($isFree ? 'ACTIVADO GRATIS' : 'PENDIENTE PAGO') . "\n" .
                "Link Pago: " . ($prefUrl ?? 'N/A') . "\n" .
                "--- LEGAL ---\n" .
                "Aceptó Términos: " . ($data['acceptTerms'] ? 'SÍ' : 'NO') . "\n" .
                "Aceptó NDA: " . ($data['acceptNDA'] ? 'SÍ' : 'NO');
            $headers = "From: no-reply@burose.com.ar\r\n";
            $headers .= "Bcc: burosearg@gmail.com\r\n";
            mail($to, $subject, $body, $headers);

            echo json_encode([
                "status" => "success",
                "message" => $message,
                "payment_url" => $prefUrl
            ]);
        } elseif ($data['type'] === 'general_contact') {
            // Nuevo Formulario de Contacto (General)
            $to = "legales@burose.com.ar";
            $subject = "Consulta Web BuroSE [" . $data['motivo'] . "] - " . $data['name'];
            $body = "De: " . $data['name'] . "\n" .
                "Celular: " . $data['celular'] . "\n" .
                "Motivo: " . $data['motivo'] . "\n\n" .
                "Consulta:\n" . $data['consulta'];
            $headers = "From: web@burose.com.ar\r\n";
            $headers .= "Bcc: burosearg@gmail.com\r\n";
            mail($to, $subject, $body, $headers);

            echo json_encode(["status" => "success", "message" => "Consulta enviada correctamente. Nos contactaremos a la brevedad."]);
        } elseif ($data['type'] === 'replica') {
            // Procesar derecho a réplica
            $stmt = $conn->prepare("INSERT INTO replica_requests (nombre_sujeto, cuit_dni, email, descargo) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['cuit'],
                $data['email'],
                $data['descargo']
            ]);

            // Notificar por mail (legales@burose.com.ar)
            $to = "legales@burose.com.ar";
            $subject = "Solicitud de Derecho a Réplica - " . $data['name'];
            $body = "Nombre: " . $data['name'] . "\n" .
                "CUIT/DNI: " . $data['cuit'] . "\n" .
                "Email: " . $data['email'] . "\n" .
                "Mensaje: " . $data['descargo'];
            $headers = "From: legales@burose.com.ar\r\n";
            $headers .= "Bcc: burosearg@gmail.com\r\n";
            mail($to, $subject, $body, $headers);

            echo json_encode(["status" => "success", "message" => "Solicitud de réplica recibida para revisión"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Tipo de formulario no especificado"]);
    }
}
?>
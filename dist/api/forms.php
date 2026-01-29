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

            // Notificar por mail
            $to = "somos@burose.com.ar";
            $subject = "Nueva Solicitud: Denunciantes / Acceso - " . $data['name'];
            $body = "Nombre: " . $data['name'] . "\n" .
                "CUIT: " . $data['cuit'] . "\n" .
                "WhatsApp: " . $data['whatsapp'] . "\n" .
                "Email: " . $data['email'] . "\n" .
                "Rubro: " . $data['sector'] . "\n" .
                "Localidad: " . $data['city'] . "\n" .
                "Preferencia: " . $data['contactPref'] . "\n\n" .
                "--- LEGAL ---\n" .
                "Aceptó Términos: " . ($data['acceptTerms'] ? 'SÍ' : 'NO') . "\n" .
                "Aceptó NDA: " . ($data['acceptNDA'] ? 'SÍ' : 'NO');
            $headers = "From: no-reply@burose.com.ar";
            mail($to, $subject, $body, $headers);

            echo json_encode(["status" => "success", "message" => "Solicitud de contacto recibida"]);
        } elseif ($data['type'] === 'general_contact') {
            // Nuevo Formulario de Contacto (General/Soporte/Consultas)
            $to = "somos@burose.com.ar";
            $subject = "Consulta Web BuroSE [" . $data['motivo'] . "] - " . $data['name'];
            $body = "De: " . $data['name'] . "\n" .
                "Celular: " . $data['celular'] . "\n" .
                "Motivo: " . $data['motivo'] . "\n\n" .
                "Consulta:\n" . $data['consulta'];
            $headers = "From: web@burose.com.ar";
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

            // Notificar por mail
            $to = "somos@burose.com.ar";
            $subject = "Solicitud de Derecho a Réplica - " . $data['name'];
            $body = "Nombre: " . $data['name'] . "\n" .
                "CUIT/DNI: " . $data['cuit'] . "\n" .
                "Email: " . $data['email'] . "\n" .
                "Mensaje: " . $data['descargo'];
            $headers = "From: legales@burose.com.ar";
            mail($to, $subject, $body, $headers);

            echo json_encode(["status" => "success", "message" => "Solicitud de réplica recibida para revisión"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Tipo de formulario no especificado"]);
    }
}
?>
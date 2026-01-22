<?php
// forms.php - Procesamiento de formularios
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

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
            echo json_encode(["status" => "success", "message" => "Solicitud de contacto recibida"]);
        } elseif ($data['type'] === 'replica') {
            // Procesar derecho a réplica
            $stmt = $conn->prepare("INSERT INTO replica_requests (nombre_sujeto, cuit_dni, email, descargo) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['cuit'],
                $data['email'],
                $data['descargo']
            ]);
            echo json_encode(["status" => "success", "message" => "Solicitud de réplica recibida para revisión"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Tipo de formulario no especificado"]);
    }
}
?>
<?php
// upload_report.php
require_once 'config.php';
session_start();

// Validar sesión de socio
if (!isset($_SESSION['is_member']) || $_SESSION['is_member'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$member_cuit = $_SESSION['member_cuit'];
$member_name = $_SESSION['member_name'];

// Recibir datos adicionales de la deuda (opcional, para el cuerpo del mail)
$debtor_name = $_POST['debtor_name'] ?? 'No especificado';
$debtor_cuit = $_POST['debtor_cuit'] ?? 'No especificado';
$debt_amount = $_POST['debt_amount'] ?? 'No especificado';

if (!isset($_FILES['report'])) {
    echo json_encode(["status" => "error", "message" => "No se recibió ningún archivo"]);
    exit();
}

$file = $_FILES['report'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileSize = $file['size'];
$fileError = $file['error'];
$fileType = $file['type'];

$fileExt = explode('.', $fileName);
$fileActualExt = strtolower(end($fileExt));

$allowed = ['jpg', 'jpeg', 'png', 'pdf'];

if (in_array($fileActualExt, $allowed)) {
    if ($fileError === 0) {
        if ($fileSize < 10000000) { // 10MB límite

            // Preparar el mail
            $to = "burosearg@gmail.com";
            $subject = "NUEVO INFORME DE DEUDA - Socio: $member_name";

            // Boundary para el multipart
            $boundary = md5(time());

            // Headers
            $headers = "From: BuroSE Reports <no-reply@burose.com.ar>\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

            // Cuerpo del mensaje
            $message = "--$boundary\r\n";
            $message .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n";
            $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $message .= "Se ha recibido un nuevo informe confidencial de deuda.\r\n\r\n";
            $message .= "DATOS DEL SOCIO INFORMANTE:\r\n";
            $message .= "Nombre: $member_name\r\n";
            $message .= "CUIT: $member_cuit\r\n\r\n";
            $message .= "DATOS DEL DEUDOR:\r\n";
            $message .= "Nombre: $debtor_name\r\n";
            $message .= "CUIT: $debtor_cuit\r\n";
            $message .= "Monto: $debt_amount\r\n\r\n";
            $message .= "El informe adjunto debe ser guardado en el NAS para respaldo legal.\r\n";

            // Adjuntar archivo
            $content = file_get_contents($fileTmpName);
            $content = chunk_split(base64_encode($content));

            $message .= "--$boundary\r\n";
            $message .= "Content-Type: $fileType; name=\"$fileName\"\r\n";
            $message .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
            $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $message .= $content . "\r\n";
            $message .= "--$boundary--";

            if (mail($to, $subject, $message, $headers)) {
                echo json_encode(["status" => "success", "message" => "Informe enviado con éxito"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error al enviar el correo"]);
            }

        } else {
            echo json_encode(["status" => "error", "message" => "El archivo es demasiado grande (máx 10MB)"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error al subir el archivo"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Tipo de archivo no permitido (solo JPG, PNG, PDF)"]);
}
?>
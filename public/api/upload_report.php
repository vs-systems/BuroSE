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

$reporter_id = $_SESSION['member_id'];
$member_name = $_SESSION['member_name'];

$debtor_name = $_POST['debtor_name'] ?? '';
$debtor_cuit = $_POST['debtor_cuit'] ?? '';
$debt_amount = $_POST['debt_amount'] ?? 0;
$description = $_POST['description'] ?? '';

// Nuevos campos enriquecidos
$intencion_pago = isset($_POST['intencion_pago']) ? (int) $_POST['intencion_pago'] : 0;
$instancia_judicial = isset($_POST['instancia_judicial']) ? (int) $_POST['instancia_judicial'] : 0;
$domicilio_particular = $_POST['domicilio_particular'] ?? NULL;
$domicilio_comercial = $_POST['domicilio_comercial'] ?? NULL;
$celular_contacto = $_POST['celular_contacto'] ?? NULL;
$provincia = $_POST['provincia'] ?? NULL;
$localidad = $_POST['localidad'] ?? NULL;

if (empty($debtor_name) || empty($debtor_cuit) || empty($debt_amount)) {
    echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
    exit();
}

if (!isset($_FILES['report'])) {
    echo json_encode(["status" => "error", "message" => "No se recibió el archivo de respaldo"]);
    exit();
}

$file = $_FILES['report'];
$fileName = time() . '_' . basename($file['name']);
$uploadDir = '../uploads/reports/';

// Crear directorio si no existe
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$targetPath = $uploadDir . $fileName;
$allowedExts = ['jpg', 'jpeg', 'png', 'pdf'];
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (in_array($fileExt, $allowedExts)) {
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        try {
            // Insertar en la tabla 'reports'
            $stmt = $conn->prepare("INSERT INTO reports (reporter_id, cuit_denunciado, nombre_denunciado, monto, descripcion, evidencia_url, estado, intencion_pago, instancia_judicial, domicilio_particular, domicilio_comercial, celular_contacto, provincia, localidad, fecha_denuncia) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $reporter_id,
                $debtor_cuit,
                $debtor_name,
                $debt_amount,
                $description,
                'api/uploads/reports/' . $fileName,
                $intencion_pago,
                $instancia_judicial,
                $domicilio_particular,
                $domicilio_comercial,
                $celular_contacto,
                $provincia,
                $localidad,
                date('Y-m-d')
            ]);

            // Notificación por mail (somos@burose.com.ar)
            $to = "somos@burose.com.ar";
            $subject = "NUEVO REPORTE CARGADO - BuroSE";
            $body = "Socio: $member_name\nDeudor: $debtor_name ($debtor_cuit)\nMonto: $debt_amount\nLink: https://burose.com.ar/api/uploads/reports/$fileName";
            @mail($to, $subject, $body, "From: no-reply@burose.com.ar");

            echo json_encode(["status" => "success", "message" => "Reporte cargado correctamente para revisión"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Error de base de datos: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error al guardar el archivo en el servidor"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Formato de archivo no permitido"]);
}
?>
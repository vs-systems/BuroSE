<?php
// admin_approve.php
require_once 'config.php';
// Solo admin puede aprobar
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$cuit = trim($data['cuit'] ?? '');
$password = trim($data['password'] ?? '');
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$whatsapp = $data['whatsapp'] ?? '';
$rubro = $data['rubro'] ?? '';
$localidad = $data['localidad'] ?? '';

if (empty($cuit) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "CUIT y Password requeridos"]);
    exit();
}

try {
    $plan = $data['plan'] ?? 'active';
    // Calcular fecha de vencimiento: 30 días para active, null para free (se maneja por límite semanal)
    $expiry_date = ($plan === 'active') ? date('Y-m-d', strtotime('+30 days')) : null;
    $initial_creds_monthly = ($plan === 'active') ? 25 : 0; // Ejemplo: 25 para socios
    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO membership_companies (cuit, password, razon_social, email, whatsapp, localidad, rubro, estado, expiry_date, plan, creds_monthly) 
        VALUES (:cuit, :pass, :name, :email, :whatsapp, :loc, :rubro, 'validado', :expiry, :plan, :creds)
        ON DUPLICATE KEY UPDATE 
        password = VALUES(password), 
        razon_social = VALUES(razon_social), 
        email = VALUES(email), 
        whatsapp = VALUES(whatsapp), 
        localidad = VALUES(localidad), 
        rubro = VALUES(rubro), 
        estado = 'validado', 
        expiry_date = VALUES(expiry_date), 
        plan = VALUES(plan), 
        creds_monthly = VALUES(creds_monthly)");

    $stmt->bindValue(':cuit', $cuit);
    $stmt->bindValue(':pass', $hashed_pass);
    $stmt->bindValue(':name', $name);
    $stmt->bindValue(':email', $email);
    $stmt->bindValue(':whatsapp', $whatsapp);
    $stmt->bindValue(':loc', $localidad);
    $stmt->bindValue(':rubro', $rubro);
    $stmt->bindValue(':expiry', $expiry_date);
    $stmt->bindValue(':plan', $plan);
    $stmt->bindValue(':creds', $initial_creds_monthly);

    if ($stmt->execute()) {
        // Eliminar de solicitudes tras aprobar
        $stmtDel = $conn->prepare("DELETE FROM contact_submissions WHERE cuit = ?");
        $stmtDel->execute([$cuit]);

        // Notificar por mail
        $notify_email = "somos@burose.com.ar";
        $subject = "Socio Aprobado ($plan): $name";
        $body = "Se ha dado el alta a un nuevo socio en BuroSE.\n\n";
        $body .= "Nombre: $name\n";
        $body .= "CUIT: $cuit\n";
        $body .= "Email: $email\n";
        $body .= "Plan: $plan\n";
        $body .= "Vencimiento: " . ($expiry_date ?: 'N/A') . "\n";
        $headers = "From: admin@burose.com.ar";
        @mail($notify_email, $subject, $body, $headers);

        echo json_encode(["status" => "success", "message" => "Socio aprobado correctamente como $plan."]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
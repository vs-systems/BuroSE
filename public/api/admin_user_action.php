<?php
// admin_user_action.php
require_once 'config.php';

// Solo admin puede realizar estas acciones
if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
    file_put_contents('auth_errors.log', date('[Y-m-d H:i:s] ') . "Auth Failed: " . print_r($_SESSION, true) . PHP_EOL, FILE_APPEND);
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "No autorizado"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$cuit = $data['cuit'] ?? '';
$action = $data['action'] ?? '';

if (empty($cuit) || empty($action)) {
    echo json_encode(["status" => "error", "message" => "Faltan parámetros requeridos"]);
    exit();
}

try {
    if ($action === 'block') {
        // Alternar bloqueo
        $stmt = $conn->prepare("SELECT estado FROM membership_companies WHERE cuit = ?");
        $stmt->execute([$cuit]);
        $row = $stmt->fetch();

        if ($row) {
            $nuevoEstado = ($row['estado'] === 'bloqueado') ? 'validado' : 'bloqueado';
            $stmt = $conn->prepare("UPDATE membership_companies SET estado = ? WHERE cuit = ?");
            $stmt->execute([$nuevoEstado, $cuit]);
            echo json_encode(["status" => "success", "message" => "Estado actualizado a: " . $nuevoEstado]);
        } else {
            echo json_encode(["status" => "error", "message" => "Socio no encontrado"]);
        }
    } elseif ($action === 'delete') {
        // Eliminar definitivamente un SOCIO (Si es VIP, preguntar antes o usar downgrade)
        // Pero el admin pidió que si es VIP y se apreta eliminar, pase a socio activo.
        $stmt = $conn->prepare("SELECT is_vip FROM membership_companies WHERE cuit = ?");
        $stmt->execute([$cuit]);
        $socio = $stmt->fetch();

        if ($socio && $socio['is_vip'] == 1) {
            // Es VIP, lo pasamos a Socio Activo en lugar de borrar
            $stmt = $conn->prepare("UPDATE membership_companies SET is_vip = 0, plan = 'active', expiry_date = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE cuit = ?");
            $stmt->execute([$cuit]);
            echo json_encode(["status" => "success", "message" => "El socio VIP ha sido degradado a Socio Activo (30 días de gracia)"]);
        } else {
            $stmt = $conn->prepare("DELETE FROM membership_companies WHERE cuit = ?");
            $stmt->execute([$cuit]);
            echo json_encode(["status" => "success", "message" => "Socio eliminado correctamente"]);
        }
    } elseif ($action === 'downgrade_vip') {
        $stmt = $conn->prepare("UPDATE membership_companies SET is_vip = 0, plan = 'active', expiry_date = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE cuit = ?");
        $stmt->execute([$cuit]);
        echo json_encode(["status" => "success", "message" => "Socio degradado a Activo"]);
    } elseif ($action === 'edit_socio') {
        $new_razon = $data['razon_social'] ?? '';
        $new_cuit = preg_replace('/\D/', '', $data['new_cuit'] ?? '');
        $new_email = $data['email'] ?? '';
        $new_gremio = $data['gremio'] ?? '';

        $stmt = $conn->prepare("UPDATE membership_companies SET razon_social = ?, cuit = ?, email = ?, gremio = ? WHERE cuit = ?");
        $stmt->execute([$new_razon, $new_cuit, $new_email, $new_gremio, $cuit]);
        echo json_encode(["status" => "success", "message" => "Datos del socio actualizados"]);
    } elseif ($action === 'delete_lead') {
        // Eliminar definitivamente un LEAD (Solicitud)
        $stmt = $conn->prepare("DELETE FROM contact_submissions WHERE cuit = ?");
        $stmt->execute([$cuit]);
        echo json_encode(["status" => "success", "message" => "Solicitud/Lead eliminada correctamente"]);
    } elseif ($action === 'make_vip') {
        $stmtEmail = $conn->prepare("SELECT email, razon_social FROM membership_companies WHERE cuit = ?");
        $stmtEmail->execute([$cuit]);
        $member = $stmtEmail->fetch();

        if ($member) {
            $stmt = $conn->prepare("UPDATE membership_companies SET is_vip = 1, plan = 'business', expiry_date = NULL WHERE cuit = ?");
            $stmt->execute([$cuit]);

            log_activity($conn, 0, 'Admin', 'MAKE_VIP', "Socio $cuit convertido a VIP");

            /* Enviar Mail de Notificación deshabilitado por spam
            $to = $member['email'];
            $subject = "¡Premio VIP BuroSE - Acceso de por vida!";
            $body = "Hola " . $member['razon_social'] . ",\n\n";
            $body .= "Usted fue premiado con una cuenta vip, sin cargo de por vida en BuroSE.\n";
            $body .= "Gracias por confiar en nosotros.\n\n";
            $body .= "Javier Gozzi - BuroSE";

            $headers = "From: burosearg@gmail.com\r\n";
            $headers .= "Reply-To: burosearg@gmail.com\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion();

            @mail($to, $subject, $body, $headers);
            */

            echo json_encode(["status" => "success", "message" => "Socio convertido a VIP correctamente."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Socio no encontrado"]);
        }
    } elseif ($action === 'approve_replica') {
        $id = $data['id'] ?? null;
        $stmt = $conn->prepare("UPDATE replica_requests SET estado = 'aprobado' WHERE id = ?");
        $stmt->execute([$id]);
        log_activity($conn, 0, 'Admin', 'APPROVE_REPLICA', "ID: $id");
        echo json_encode(["status" => "success", "message" => "Réplica marcada como aprobada/leída"]);
    } elseif ($action === 'delete_replica') {
        $id = $data['id'] ?? null;
        $stmt = $conn->prepare("DELETE FROM replica_requests WHERE id = ?");
        $stmt->execute([$id]);
        log_activity($conn, 0, 'Admin', 'DELETE_REPLICA', "ID: $id");
        echo json_encode(["status" => "success", "message" => "Réplica eliminada"]);
    } elseif ($action === 'approve_report') {
        $id = $data['id'] ?? null;

        // 1. Validar reporte
        $stmt = $conn->prepare("UPDATE reports SET estado = 'validado' WHERE id = ?");
        $stmt->execute([$id]);

        // 2. Acreditar Premio (Gratis +2, Socio +4)
        $stmtReporter = $conn->prepare("SELECT r.reporter_id, mc.plan FROM reports r LEFT JOIN membership_companies mc ON r.reporter_id = mc.id WHERE r.id = ?");
        $stmtReporter->execute([$id]);
        $reporter = $stmtReporter->fetch(PDO::FETCH_ASSOC);

        if ($reporter && $reporter['reporter_id']) {
            $bonus = ($reporter['plan'] === 'free') ? 2 : 4;
            // Sumamos los créditos al paquete (creds_package)
            $conn->prepare("UPDATE membership_companies SET creds_package = creds_package + ?, reports_submitted_count = reports_submitted_count + 1 WHERE id = ?")
                ->execute([$bonus, $reporter['reporter_id']]);

            log_activity($conn, 0, 'Admin', 'APPROVE_REPORT', "ID Reporte: $id, acreditado $bonus créditos a ID: " . $reporter['reporter_id']);
            echo json_encode(["status" => "success", "message" => "Reporte validado y $bonus créditos acreditados al Miembro"]);
        } else {
            echo json_encode(["status" => "success", "message" => "Reporte validado (Reportero no encontrado)"]);
        }
    } elseif ($action === 'update_credits') {
        // Fix para recibir 'credits' y 'type' del frontend, o 'creds_monthly'/'creds_package'
        $creditsValue = intval($data['credits'] ?? 0);
        $type = $data['type'] ?? 'all';

        if ($type === 'package') {
            $stmt = $conn->prepare("UPDATE membership_companies SET creds_package = ? WHERE cuit = ?");
            $stmt->execute([$creditsValue, $cuit]);
        } elseif ($type === 'monthly') {
            $stmt = $conn->prepare("UPDATE membership_companies SET creds_monthly = ? WHERE cuit = ?");
            $stmt->execute([$creditsValue, $cuit]);
        } else {
            // Caso por defecto o retrocompatibilidad
            $monthly = intval($data['creds_monthly'] ?? $creditsValue);
            $package = intval($data['creds_package'] ?? 0);
            $stmt = $conn->prepare("UPDATE membership_companies SET creds_monthly = ?, creds_package = ? WHERE cuit = ?");
            $stmt->execute([$monthly, $package, $cuit]);
        }

        log_activity($conn, 0, 'Admin', 'UPDATE_CREDITS', "CUIT: $cuit, Valor: $creditsValue, Tipo: $type");
        echo json_encode(["status" => "success", "message" => "Créditos actualizados correctamente"]);
    } elseif ($action === 'update_plan') {
        $plan = $data['plan'] ?? 'active';
        $expiry_date = ($plan === 'active') ? date('Y-m-d', strtotime('+30 days')) : null;
        if ($plan === 'free')
            $expiry_date = null;

        $stmt = $conn->prepare("UPDATE membership_companies SET plan = ?, expiry_date = ?, is_vip = 0 WHERE cuit = ?");
        $stmt->execute([$plan, $expiry_date, $cuit]);

        log_activity($conn, 0, 'Admin', 'UPDATE_PLAN', "CUIT: $cuit, Plan: $plan");
        echo json_encode(["status" => "success", "message" => "Plan actualizado a $plan"]);
    } elseif ($action === 'system_config') {
        $key = $data['key'] ?? '';
        $value = $data['value'] ?? '';
        if ($key) {
            $stmt = $conn->prepare("INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
            $stmt->execute([$key, $value, $value]);
            echo json_encode(["status" => "success", "message" => "Configuración de $key actualizada"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Falta la clave de configuración"]);
        }
    } elseif ($action === 'delete_report') {
        $id = $data['id'] ?? null;

        // Buscar archivos para eliminar
        $stmt = $conn->prepare("SELECT evidencia_url FROM reports WHERE id = ?");
        $stmt->execute([$id]);
        $rep = $stmt->fetch();
        if ($rep && !empty($rep['evidencia_url'])) {
            $files = explode(',', $rep['evidencia_url']);
            foreach ($files as $f) {
                // El path guardado es "api/uploads/reports/..."
                // Pero este script está en "api/", así que removemos "api/"
                $localPath = str_replace('api/', '', $f);
                if (file_exists($localPath)) {
                    @unlink($localPath);
                }
            }
        }

        $stmt = $conn->prepare("DELETE FROM reports WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "Reporte y archivos eliminados"]);
    } elseif ($action === 'update_report') {
        $id = $data['id'] ?? null;
        $cuit = preg_replace('/\D/', '', $data['cuit_denunciado'] ?? '');
        $nombre = $data['nombre_denunciado'] ?? '';
        $monto = $data['monto'] ?? 0;
        $descripcion = $data['descripcion'] ?? '';

        if (!$id || empty($cuit) || empty($nombre)) {
            echo json_encode(["status" => "error", "message" => "Faltan parámetros requeridos"]);
            exit();
        }

        $stmt = $conn->prepare("UPDATE reports SET cuit_denunciado = ?, nombre_denunciado = ?, monto = ?, descripcion = ? WHERE id = ?");
        $stmt->execute([$cuit, $nombre, $monto, $descripcion, $id]);

        log_activity($conn, 0, 'Admin', 'UPDATE_REPORT', "Reporte ID: $id actualizado");
        echo json_encode(["status" => "success", "message" => "Reporte actualizado correctamente"]);
    } elseif ($action === 'disable_api') {
        $stmt = $conn->prepare("UPDATE membership_companies SET api_token = NULL WHERE cuit = ?");
        $stmt->execute([$cuit]);
        echo json_encode(["status" => "success", "message" => "Acceso API desactivado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Acción no válida"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
<?php
// member_login.php
require_once 'config.php';

// Habilitar CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Intentar leer JSON
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    // Fallback a $_POST si no es JSON (FormData)
    $cuit = trim($data['cuit'] ?? ($_POST['cuit'] ?? ''));
    $password = trim($data['password'] ?? ($_POST['password'] ?? ''));

    if (empty($cuit) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'CUIT y contraseña son requeridos']);
        exit;
    }

    try {
        // En la tabla real la columna se llama 'password' (según admin_approve.php)
        // Buscamos coincidencia por CUIT
        $stmt = $conn->prepare("SELECT id, razon_social, cuit, password, estado, plan, is_vip FROM membership_companies WHERE cuit = ? LIMIT 1");
        $stmt->execute([$cuit]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Uso de password_verify para contraseñas hasheadas
            if (password_verify($password, $user['password'])) {
                if ($user['estado'] !== 'validado') {
                    echo json_encode(['success' => false, 'message' => 'Tu cuenta aún no está validada por el administrador']);
                    exit;
                }

                $_SESSION['member_id'] = $user['id'];
                $_SESSION['member_name'] = $user['razon_social'];
                $_SESSION['member_cuit'] = $user['cuit'];
                $_SESSION['member_plan'] = $user['plan'];
                $_SESSION['member_is_vip'] = $user['is_vip'];
                $_SESSION['is_member'] = true;

                echo json_encode([
                    'success' => true,
                    'message' => 'Login exitoso',
                    'user' => [
                        'name' => $user['razon_social'],
                        'cuit' => $user['cuit']
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Socio no encontrado (verifique el CUIT)']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
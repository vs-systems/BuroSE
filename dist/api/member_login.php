<?php
// member_login.php
session_start();
require_once 'config.php';

// Habilitar CORS si es necesario (ya está en config.php pero por si acaso)
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Si recibimos JSON del frontend
    $data = json_decode(file_get_contents("php://input"), true);

    $cuit = $data['cuit'] ?? ($_POST['cuit'] ?? '');
    $password = $data['password'] ?? ($_POST['password'] ?? '');

    if (empty($cuit) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'CUIT y contraseña son requeridos']);
        exit;
    }

    try {
        // En la tabla real es 'password_hash' pero algunos registros pueden tener 'password'
        // Buscamos coincidencia por CUIT
        $stmt = $conn->prepare("SELECT id, razon_social, cuit, password_hash, estado FROM membership_companies WHERE cuit = ? LIMIT 1");
        $stmt->execute([$cuit]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Verificación: Por ahora permitimos comparación directa ya que la DB tiene texto plano o hash simple
            // En producción deberíamos usar password_verify()
            if ($password === $user['password_hash']) {
                if ($user['estado'] !== 'validado') {
                    echo json_encode(['success' => false, 'message' => 'Tu cuenta aún no está validada por el administrador']);
                    exit;
                }

                $_SESSION['member_id'] = $user['id'];
                $_SESSION['member_name'] = $user['razon_social'];
                $_SESSION['member_cuit'] = $user['cuit'];
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
            echo json_encode(['success' => false, 'message' => 'Socio no encontrado']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}
?>
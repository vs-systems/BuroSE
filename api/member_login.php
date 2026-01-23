<?php
require_once 'config.php';

/**
 * Endpoint de Login para Socios (membership_companies)
 * Recibe: cuit, password (vía POST)
 */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cuit = $_POST['cuit'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($cuit) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'CUIT y contraseña son requeridos']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT id, razon_social, password, estado FROM membership_companies WHERE cuit = ? LIMIT 1");
        $stmt->execute([$cuit]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Verificación. Si implementamos password_hash en el futuro, usamos password_verify.
            // Por ahora, para el MVP y facilidad del usuario, permitiremos comparación directa o simple hash.
            if ($password === $user['password']) {
                if ($user['estado'] !== 'validado') {
                    echo json_encode(['success' => false, 'message' => 'Tu cuenta aún no está validada por el administrador']);
                    exit;
                }

                $_SESSION['member_id'] = $user['id'];
                $_SESSION['member_name'] = $user['razon_social'];
                $_SESSION['member_cuit'] = $cuit;
                $_SESSION['is_member'] = true;

                echo json_encode([
                    'success' => true,
                    'message' => 'Login exitoso',
                    'user' => [
                        'name' => $user['razon_social'],
                        'cuit' => $cuit
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'CUIT no encontrado o no registrado como socio']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
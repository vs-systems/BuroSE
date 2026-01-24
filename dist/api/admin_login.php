<?php
// admin_login.php
require_once 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user = $data['user'] ?? '';
    $pass = $data['pass'] ?? '';

    // Credenciales solicitadas por el usuario
    if ($user === 'admin' && $pass === 'vsys2026') {
        $_SESSION['admin_logged'] = true;
        echo json_encode(["status" => "success", "message" => "Login exitoso"]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Credenciales incorrectas"]);
    }
} else {
    // Check session
    if (isset($_SESSION['admin_logged']) && $_SESSION['admin_logged'] === true) {
        echo json_encode(["status" => "success", "logged" => true]);
    } else {
        echo json_encode(["status" => "error", "logged" => false]);
    }
}
?>
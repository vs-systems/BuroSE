<?php
// logout.php
require_once 'config.php';
session_unset();
session_destroy();

if (isset($_GET['redirect'])) {
    header("Location: /");
    exit();
}

header('Content-Type: application/json');
echo json_encode(["status" => "success", "message" => "Sesión cerrada"]);
?>
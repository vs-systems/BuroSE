<?php
// admin_logos.php - ABM de Logos con debug mejorado
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';
session_start();

try {
    if (!isset($_SESSION['admin_logged']) || $_SESSION['admin_logged'] !== true) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "No autorizado"]);
        exit();
    }

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $stmt = $conn->query("SELECT * FROM brand_logos ORDER BY display_order ASC");
        echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
    } elseif ($method === 'POST') {
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);

        if (!$data) {
            throw new Exception("Datos JSON inválidos recibidos: " . $json);
        }

        $name = $data['name'] ?? '';
        $logo_url = $data['logo_url'] ?? '';
        $website = $data['website_url'] ?? '';

        if (empty($name) || empty($logo_url)) {
            echo json_encode(["status" => "error", "message" => "Nombre y Logo son obligatorios"]);
            exit();
        }

        $stmt = $conn->prepare("INSERT INTO brand_logos (name, logo_url, website_url) VALUES (?, ?, ?)");
        $stmt->execute([$name, $logo_url, $website]);
        echo json_encode(["status" => "success", "message" => "Logo agregado"]);
    } elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? 0;
        $stmt = $conn->prepare("DELETE FROM brand_logos WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "Logo eliminado"]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Excepción capturada: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine(),
        "hint" => "Si ves un error de 'Table not found', debes ejecutar el SQL de setup_logos_table.sql"
    ]);
}
?>
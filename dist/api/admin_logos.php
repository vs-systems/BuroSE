<?php
// admin_logos.php - ABM de Logos
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
        // Para simplificar, recibiremos la URL de la imagen y datos
        $data = json_decode(file_get_contents("php://input"), true);
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
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error en el servidor: " . $e->getMessage(),
        "hint" => "Asegúrate de que la tabla 'brand_logos' haya sido creada en la base de datos."
    ]);
}
?>
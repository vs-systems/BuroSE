<?php
require_once 'config.php';
header('Content-Type: text/plain');

echo "--- CHECKING VIP CANDIDATES ---\n";
$names = ['Biosegur', 'Gozzi', 'Sistemas', 'Seguridad'];
foreach ($names as $n) {
    $stmt = $conn->prepare("SELECT id, cuit, razon_social, is_vip, estado FROM membership_companies WHERE razon_social LIKE ?");
    $stmt->execute(["%$n%"]);
    $results = $stmt->fetchAll();
    echo "Search for '$n': " . count($results) . " found\n";
    foreach ($results as $r) {
        echo " - ID: {$r['id']}, CUIT: {$r['cuit']}, Name: {$r['razon_social']}, VIP: {$r['is_vip']}, Status: {$r['estado']}\n";
    }
}

echo "\n--- CHECKING RECENT REPORTS ---\n";
$stmt = $conn->query("SELECT id, cuit_denunciado, nombre_denunciado, created_at, reporter_id FROM reports ORDER BY created_at DESC LIMIT 5");
$reports = $stmt->fetchAll();
if (count($reports) == 0) {
    echo "No reports found in table 'reports'.\n";
} else {
    foreach ($reports as $re) {
        echo " - ID: {$re['id']}, Debtor: {$re['nombre_denunciado']}, CUIT: {$re['cuit_denunciado']}, Date: {$re['created_at']}, Reporter ID: {$re['reporter_id']}\n";
    }
}

echo "\n--- CHECKING TABLES ---\n";
$tables = ['membership_companies', 'reports', 'contact_submissions', 'replica_requests'];
foreach ($tables as $t) {
    $stmt = $conn->query("SELECT COUNT(*) as total FROM $t");
    $res = $stmt->fetch();
    echo "Table '$t': {$res['total']} rows\n";
}
?>
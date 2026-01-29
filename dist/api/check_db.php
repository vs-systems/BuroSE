<?php
require_once 'config.php';
$output = "DATABASE STATUS:\n\n";

try {
    // 1. Check Tables
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $output .= "TABLES FOUND: " . implode(", ", $tables) . "\n\n";

    foreach ($tables as $table) {
        $output .= "TABLE: $table\n";
        $stmt = $conn->query("DESCRIBE $table");
        $cols = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($cols as $c) {
            $output .= " - {$c['Field']} ({$c['Type']})\n";
        }

        $stmt = $conn->query("SELECT COUNT(*) FROM $table");
        $count = $stmt->fetchColumn();
        $output .= " - TOTAL ROWS: $count\n\n";
    }

    // 2. Check VIPs
    $output .= "VIP SEARCH:\n";
    $stmt = $conn->query("SELECT id, razon_social, is_vip, estado FROM membership_companies WHERE is_vip = 1 OR razon_social LIKE '%Gozzi%'");
    $vips = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($vips as $v) {
        $output .= " - ID: {$v['id']}, Name: {$v['razon_social']}, VIP: {$v['is_vip']}, Status: {$v['estado']}\n";
    }

    // 3. Check Recent Reports
    $output .= "\nRECENT REPORTS (Last 3):\n";
    $stmt = $conn->query("SELECT * FROM reports ORDER BY id DESC LIMIT 3");
    $recent = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($recent as $r) {
        $output .= " - ID: {$r['id']}, Debtor: " . ($r['nombre_denunciado'] ?? 'N/A') . ", CUIT: " . ($r['cuit_denunciado'] ?? 'N/A') . ", Status: " . ($r['estado'] ?? 'N/A') . "\n";
    }

} catch (Exception $e) {
    $output .= "ERROR: " . $e->getMessage() . "\n";
}

// Write to a file in the same directory so I can't read it directly (I have no browser)
// Wait, I can't read it unless I use view_file on the workspace.
// But this script will run on the USER'S server.
// I will tell the user to visit burose.com.ar/api/check_db.php?key=secret
echo $output;
?>
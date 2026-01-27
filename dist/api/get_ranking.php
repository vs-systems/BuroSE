<?php
// get_ranking.php - Obtener el Top 5 de deudores
require_once 'config.php';

try {
    // 1. Obtener deudores forzados (overrides)
    $stmtForced = $conn->prepare("SELECT * FROM debtor_rankings WHERE is_forced = 1 ORDER BY forced_position ASC, amount DESC");
    $stmtForced->execute();
    $forced = $stmtForced->fetchAll();

    // 2. Obtener deudores reales calculados por reportes
    // Agrupamos por CUIT denunciado y sumamos montos
    $sqlReal = "SELECT cuit_denunciado as cuit, nombre_denunciado as full_name, SUM(monto) as amount 
                FROM reports 
                WHERE estado = 'validado' 
                GROUP BY cuit_denunciado 
                ORDER BY amount DESC 
                LIMIT 10";
    $stmtReal = $conn->prepare($sqlReal);
    $stmtReal->execute();
    $real = $stmtReal->fetchAll();

    // 3. Obtener estados manuales (no forzados necesariamente en posición, pero sí en semáforo)
    $stmtStates = $conn->prepare("SELECT cuit, status, full_name, amount FROM debtor_rankings WHERE is_forced = 0");
    $stmtStates->execute();
    $manualStates = [];
    foreach ($stmtStates->fetchAll() as $row) {
        $manualStates[$row['cuit']] = $row;
    }

    // 4. Consolidar el Top 5
    $consolidated = [];
    $usedCuits = [];

    // Prioridad 1: Los forzados en su posición específica
    foreach ($forced as $f) {
        $pos = $f['forced_position'] ? $f['forced_position'] - 1 : count($consolidated);
        if ($pos < 0)
            $pos = 0;

        $item = [
            "cuit" => $f['cuit'],
            "full_name" => $f['full_name'],
            "amount" => (float) $f['amount'],
            "status" => $f['status'],
            "is_forced" => true
        ];

        // Si la posición ya está ocupada, lo movemos al final o buscamos espacio
        if (!isset($consolidated[$pos])) {
            $consolidated[$pos] = $item;
        } else {
            array_splice($consolidated, $pos, 0, [$item]);
        }
        $usedCuits[] = $f['cuit'];
    }

    // Prioridad 2: Deudores reales que no estén ya en la lista
    foreach ($real as $r) {
        if (count($consolidated) >= 5)
            break;
        if (in_array($r['cuit'], $usedCuits))
            continue;

        // Verificar si tiene un estado manual aunque no sea forzado
        $status = 'RED';
        if (isset($manualStates[$r['cuit']])) {
            $status = $manualStates[$r['cuit']]['status'];
        }

        $consolidated[] = [
            "cuit" => $r['cuit'],
            "full_name" => $r['full_name'],
            "amount" => (float) $r['amount'],
            "status" => $status,
            "is_forced" => false
        ];
        $usedCuits[] = $r['cuit'];
    }

    // Asegurar que consolidated es un array indexado 0...4
    $finalRanking = array_slice(array_values($consolidated), 0, 5);

    echo json_encode(["status" => "success", "data" => $finalRanking]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
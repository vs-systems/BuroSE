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

    // Prioridad 1: Los forzados con posición específica
    foreach ($forced as $f) {
        if ($f['forced_position'] !== null && $f['forced_position'] > 0) {
            $pos = $f['forced_position'] - 1;
            $item = [
                "cuit" => $f['cuit'],
                "full_name" => $f['full_name'],
                "amount" => (float) $f['amount'],
                "status" => $f['status'],
                "is_forced" => true
            ];
            $consolidated[$pos] = $item;
            $usedCuits[] = $f['cuit'];
        }
    }

    // Prioridad 2: Deudores reales (calculados)
    foreach ($real as $r) {
        if (in_array($r['cuit'], $usedCuits))
            continue;

        // Buscar si tiene semáforo manual
        $status = 'RED';
        if (isset($manualStates[$r['cuit']])) {
            $status = $manualStates[$r['cuit']]['status'];
        }

        $item = [
            "cuit" => $r['cuit'],
            "full_name" => $r['full_name'],
            "amount" => (float) $r['amount'],
            "status" => $status,
            "is_forced" => false
        ];

        // Buscar el primer hueco vacío en consolidated
        for ($i = 0; $i < 5; $i++) {
            if (!isset($consolidated[$i])) {
                $consolidated[$i] = $item;
                $usedCuits[] = $r['cuit'];
                break;
            }
        }
        if (count($usedCuits) >= 5 && count(array_filter($consolidated)) >= 5)
            break;
    }

    // Prioridad 3: Deudores forzados sin posición específica (relleno)
    foreach ($forced as $f) {
        if (in_array($f['cuit'], $usedCuits))
            continue;

        $item = [
            "cuit" => $f['cuit'],
            "full_name" => $f['full_name'],
            "amount" => (float) $f['amount'],
            "status" => $f['status'],
            "is_forced" => true
        ];

        for ($i = 0; $i < 5; $i++) {
            if (!isset($consolidated[$i])) {
                $consolidated[$i] = $item;
                $usedCuits[] = $f['cuit'];
                break;
            }
        }
    }

    // Limpiar y ordenar por índice
    ksort($consolidated);
    $finalRanking = array_values($consolidated);
    $finalRanking = array_slice($finalRanking, 0, 5);

    echo json_encode(["status" => "success", "data" => $finalRanking]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
<?php
// search.php - Buscador de Riesgo Crediticio
require_once 'config.php';

if (!isset($_GET['cuit'])) {
    echo json_encode(["status" => "error", "message" => "Falta el CUIT/DNI"]);
    exit();
}

$cuit = preg_replace('/[^0-9]/', '', $_GET['cuit']); // Limpiar guiones

// 1. Buscar en Base de Datos Interna (Denuncias del Gremio)
$stmt = $conn->prepare("SELECT * FROM reports WHERE cuit_denunciado = ? AND estado = 'validado'");
$stmt->execute([$cuit]);
$internal_reports = $stmt->fetchAll();

$total_internal_debt = 0;
foreach ($internal_reports as $report) {
    $total_internal_debt += $report['monto'];
}

// 2. Simular/Cachear consulta al BCRA (Central de Deudores)
// En una fase real, aquí se llamaría a una API externa del BCRA o similar.
// Por ahora simulamos según el requerimiento del usuario.

$bcra_data = [
    "cuit" => $cuit,
    "entidades" => [],
    "deuda_total" => 0,
    "max_situacion" => 1
];

if ($cuit === "20111111112") {
    $bcra_data["entidades"] = [
        ["entidad" => "Banco Galicia", "periodo" => "12/23", "situacion" => 1, "monto" => 0]
    ];
} elseif ($cuit === "30222222223") {
    $bcra_data["entidades"] = [
        ["entidad" => "Banco Santander", "periodo" => "11/23", "situacion" => 3, "monto" => 1200000]
    ];
    $bcra_data["deuda_total"] = 1200000;
    $bcra_data["max_situacion"] = 3;
} elseif ($cuit === "20333333334") {
    // Caso solicitado: Limpio en BCRA pero denunciado en el Gremio
    $internal_reports = [
        [
            "monto" => 850000,
            "fecha_denuncia" => date("Y-m-d H:i:s"),
            "descripcion" => "Incumplimiento de pago en factura de cámaras y DVRs. Empresa: Biosegur SRL (Mayorista)",
            "estado" => "validado"
        ]
    ];
    $total_internal_debt = 850000;

    $bcra_data["entidades"] = [
        ["entidad" => "Banco Provincia", "periodo" => "01/24", "situacion" => 1, "monto" => 0]
    ];
}

// 3. Resultado Unificado
$unified_score = [
    "cuit" => $cuit,
    "internal" => [
        "count" => count($internal_reports),
        "total_debt" => $total_internal_debt,
        "reports" => $internal_reports
    ],
    "bcra" => $bcra_data,
    "total_risk_debt" => $total_internal_debt + $bcra_data["deuda_total"],
    "alert_level" => ($total_internal_debt > 0 || $bcra_data["max_situacion"] > 1) ? "RED" : "GREEN"
];

echo json_encode($unified_score);
?>
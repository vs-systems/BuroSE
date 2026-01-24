<?php
// --- BuroSE: Motor de Inteligencia Comercial ---
// Versión 3.1: Corrección de Nombre (Scraping Inteligente)

error_reporting(0); 

$resultado_bcra = null;
$nombre_detectado = null;
$error = null;
$cuit_buscado = "";

// Función MEJORADA para buscar Nombre
function obtener_nombre_scraper($cuit) {
    $url = "https://www.cuitonline.com/search.php?q=" . $cuit;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    // User Agent rotativo para parecer más humano
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6); 
    
    $html = curl_exec($ch);
    curl_close($ch);

    if ($html) {
        // ESTRATEGIA 1: Buscar etiqueta específica de nombre (itemprop o h1)
        // Esto evita confundirse con el título de la web
        if (preg_match('/itemprop="name">(.*?)<\//', $html, $matches)) {
            $nombre_limpio = trim(strip_tags($matches[1]));
            if (strlen($nombre_limpio) > 3) return strtoupper($nombre_limpio);
        }

        // ESTRATEGIA 2: Regex directa sobre el Título
        // Busca patrón: "CUIT (numeros) - (NOMBRE) - Cuit Online"
        if (preg_match('/CUIT\s+[\d-]+\s+-\s+(.*?)\s+-\s+Cuit/i', $html, $matches)) {
            $nombre_limpio = trim($matches[1]);
            // Filtro anti-error: Si trajo "Cuit Online" por error, lo descartamos
            if (strtoupper($nombre_limpio) !== "CUIT ONLINE" && strlen($nombre_limpio) > 3) {
                return strtoupper($nombre_limpio);
            }
        }
    }
    return null; 
}

// Función BCRA (Sin cambios, funciona perfecto)
function consultar_bcra($cuit) {
    $url = "https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas/" . $cuit;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode == 200) return json_decode($response, true)['results'];
    if ($httpCode == 404) return "SIN_DEUDAS";
    return null;
}

// --- PROCESAMIENTO ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cuit_buscado = preg_replace("/[^0-9]/", "", $_POST['cuit']);

    if (strlen($cuit_buscado) >= 10) {
        // 1. Buscamos Nombre
        $nombre_detectado = obtener_nombre_scraper($cuit_buscado);
        
        // 2. Buscamos Deuda
        $resultado_bcra = consultar_bcra($cuit_buscado);
        
        if ($resultado_bcra === null) {
            $error = "El servicio del BCRA no responde momentáneamente.";
        }
    } else {
        $error = "Por favor ingresá un CUIT válido.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BuroSE</title>
    <style>
        /* TUS ESTILOS ACTUALES (Mantengo el look Dark Mode que te gustó) */
        body { background-color: #0f172a; color: #e2e8f0; font-family: 'Segoe UI', system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .container { background-color: #1e293b; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); width: 100%; max-width: 480px; border: 1px solid #334155; }
        
        h1 { color: #2dd4bf; text-align: center; margin: 0 0 10px 0; font-size: 2rem; letter-spacing: -1px; }
        .tagline { text-align: center; color: #94a3b8; font-size: 0.9em; margin-bottom: 30px; }
        
        .input-group { position: relative; margin-bottom: 20px; }
        input[type="text"] { width: 100%; padding: 16px; background-color: #0f172a; border: 2px solid #334155; color: white; border-radius: 12px; box-sizing: border-box; font-size: 18px; text-align: center; transition: all 0.3s; }
        input[type="text"]:focus { border-color: #2dd4bf; outline: none; }
        
        button { width: 100%; padding: 16px; background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 700; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
        button:hover { transform: translateY(-2px); filter: brightness(1.1); }

        /* Tarjeta de Identidad */
        .identity-box { background: #334155; padding: 20px; border-radius: 12px; text-align: center; margin-top: 25px; border: 1px solid #475569; animation: fadeIn 0.5s; }
        .id-label { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; font-weight: bold; }
        .id-name { font-size: 1.4rem; font-weight: 800; color: #f1f5f9; display: block; margin: 5px 0; }
        .id-cuit { font-size: 0.9rem; color: #cbd5e1; font-family: monospace; }

        /* Resultados */
        .result-item { background-color: #1e293b; padding: 15px; margin-top: 15px; border-radius: 10px; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        .result-left { display: flex; flex-direction: column; }
        .bank-name { font-weight: 600; font-size: 1rem; color: #e2e8f0; }
        .status-badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; margin-top: 5px; width: fit-content;}
        
        .sit-1 { background-color: rgba(34, 197, 94, 0.2); color: #4ade80; } /* Verde */
        .sit-2 { background-color: rgba(234, 179, 8, 0.2); color: #facc15; } /* Amarillo */
        .sit-3, .sit-4, .sit-5 { background-color: rgba(239, 68, 68, 0.2); color: #f87171; } /* Rojo */

        .amount { font-size: 1.1rem; font-weight: 700; color: #f8fafc; }
        
        .clean-slate { margin-top: 20px; padding: 20px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; text-align: center; color: #4ade80; font-weight: 600; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>

<div class="container">
    <h1>BuroSE <span style="font-size:0.5em; opacity:0.5;">BETA</span></h1>
    <p class="tagline">Inteligencia Comercial para Seguridad Electrónica</p>
    
    <form method="POST">
        <div class="input-group">
            <input type="text" name="cuit" placeholder="CUIT (sin guiones)" value="<?php echo $cuit_buscado; ?>" required autocomplete="off">
        </div>
        <button type="submit">ANALIZAR RIESGO</button>
    </form>

    <?php if ($cuit_buscado): ?>
        
        <div class="identity-box">
            <span class="id-label">Reporte para</span>
            <span class="id-name">
                <?php echo $nombre_detectado ? $nombre_detectado : "RAZÓN SOCIAL NO DISPONIBLE"; ?>
            </span>
            <span class="id-cuit">CUIT: <?php echo $cuit_buscado; ?></span>
        </div>

        <?php if ($resultado_bcra === "SIN_DEUDAS"): ?>
            <div class="clean-slate">
                ✅ Sin deudas registradas en el sistema financiero.
            </div>
        <?php elseif (is_array($resultado_bcra)): ?>
            
            <p style="margin-top:20px; color:#94a3b8; font-size:0.9rem;">Detalle de Obligaciones:</p>
            
            <?php 
            $periodos = isset($resultado_bcra['periodos']) ? $resultado_bcra['periodos'] : [];
            $ultimo = reset($periodos); 
            
            if (isset($ultimo['entidades'])) {
                foreach ($ultimo['entidades'] as $banco) {
                    $sit = $banco['situacion'];
                    $clase = ($sit == 1) ? 'sit-1' : ( ($sit == 2) ? 'sit-2' : 'sit-3' );
                    $texto_sit = ($sit > 2) ? "RIESGO ALTO (Sit $sit)" : "Situación $sit (Normal)";
                    
                    echo "<div class='result-item'>";
                    echo "<div class='result-left'>";
                    echo "<span class='bank-name'>" . $banco['denominacion'] . "</span>";
                    echo "<span class='status-badge $clase'>$texto_sit</span>";
                    echo "</div>";
                    echo "<span class='amount'>$ " . number_format($banco['monto'], 0, ',', '.') . ".000</span>";
                    echo "</div>";
                }
            }
            ?>
        <?php endif; ?>
        
        <?php if ($error): ?>
            <p style="color:#ef4444; text-align:center; margin-top:20px;"><?php echo $error; ?></p>
        <?php endif; ?>

    <?php endif; ?>

</div>

</body>
</html>
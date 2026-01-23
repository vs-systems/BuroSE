<?php
require_once 'config.php';

/**
 * Endpoint para verificar si hay una sesión activa de Socio o Admin
 */

$response = [
    'authenticated' => false,
    'user_type' => null,
    'user_data' => null
];

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    $response['authenticated'] = true;
    $response['user_type'] = 'admin';
} elseif (isset($_SESSION['is_member']) && $_SESSION['is_member'] === true) {
    $response['authenticated'] = true;
    $response['user_type'] = 'member';
    $response['user_data'] = [
        'name' => $_SESSION['member_name'],
        'cuit' => $_SESSION['member_cuit']
    ];
}

echo json_encode($response);
?>
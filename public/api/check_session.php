<?php
require_once 'config.php';

$response = [
    'authenticated' => false,
    'user' => null,
    'role' => null
];

if (isset($_SESSION['is_member']) && $_SESSION['is_member'] === true) {
    $response['authenticated'] = true;
    $response['user'] = [
        'name' => $_SESSION['member_name'],
        'cuit' => $_SESSION['member_cuit']
    ];
    $response['role'] = 'member';
} elseif (isset($_SESSION['admin_logged']) && $_SESSION['admin_logged'] === true) {
    $response['authenticated'] = true;
    $response['user'] = ['name' => 'Administrator'];
    $response['role'] = 'admin';
}

echo json_encode($response);
?>
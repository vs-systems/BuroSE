<?php
require_once 'config.php';

$response = [
    'authenticated' => false,
    'user' => null,
    'role' => null
];

if (isset($_SESSION['is_member']) && $_SESSION['is_member'] === true) {
    // Refresh credits from DB
    $stmt = $conn->prepare("SELECT plan, is_vip, creds_monthly, creds_package FROM membership_companies WHERE cuit = ?");
    $stmt->execute([$_SESSION['member_cuit']]);
    $db_user = $stmt->fetch();

    $response['authenticated'] = true;
    $response['user'] = [
        'name' => $_SESSION['member_name'],
        'cuit' => $_SESSION['member_cuit'],
        'plan' => $db_user['plan'] ?? 'free',
        'is_vip' => $db_user['is_vip'] ?? 0,
        'creds_monthly' => $db_user['creds_monthly'] ?? 0,
        'creds_package' => $db_user['creds_package'] ?? 0
    ];
    $response['role'] = 'member';
} elseif (isset($_SESSION['admin_logged']) && $_SESSION['admin_logged'] === true) {
    $response['authenticated'] = true;
    $response['user'] = ['name' => 'Administrator'];
    $response['role'] = 'admin';
}

echo json_encode($response);
?>
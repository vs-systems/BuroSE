<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
session_start();

$response = [
    'authenticated' => isset($_SESSION['user_id']),
    'user' => isset($_SESSION['user_id']) ? $_SESSION['username'] : null
];

echo json_encode($response);
?>
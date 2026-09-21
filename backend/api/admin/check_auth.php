<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/auth.php';

$session = requireAuth();

echo json_encode([
    'success' => true,
    'admin' => [
        'id' => (int)$session['admin_id'],
        'username' => $session['username'],
        'name' => $session['name'],
        'role' => $session['role']
    ]
]);

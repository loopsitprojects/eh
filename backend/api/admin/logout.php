<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/auth.php';

$token = getBearerToken();

if ($token) {
    try {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM admin_sessions WHERE token = ?");
        $stmt->execute([$token]);
    } catch (Exception $e) {
        // Continue logout response
    }
}

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);

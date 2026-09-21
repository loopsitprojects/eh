<?php
/**
 * Like Wish API Endpoint
 * POST /api/like_wish.php
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    $raw_input = file_get_contents('php://input');
    $json_data = json_decode($raw_input, true);
    
    $wish_id = $_POST['wish_id'] ?? ($json_data['wish_id'] ?? null);

    if (!$wish_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing wish_id']);
        exit;
    }

    $db = Database::getConnection();

    $stmt = $db->prepare("UPDATE wishes SET likes_count = likes_count + 1 WHERE id = ?");
    $stmt->execute([(int)$wish_id]);

    $stmt_get = $db->prepare("SELECT likes_count FROM wishes WHERE id = ?");
    $stmt_get->execute([(int)$wish_id]);
    $new_likes = $stmt_get->fetchColumn();

    echo json_encode([
        'success' => true,
        'wish_id' => (int)$wish_id,
        'new_likes' => (int)$new_likes
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to like wish: ' . $e->getMessage()]);
}

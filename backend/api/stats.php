<?php
/**
 * Campaign Stats API Endpoint
 * GET /api/stats.php
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

try {
    $db = Database::getConnection();

    $stmt_wishes = $db->query("SELECT COUNT(*) FROM wishes WHERE status = 'approved'");
    $total_wishes = (int)$stmt_wishes->fetchColumn();

    $stmt_likes = $db->query("SELECT SUM(likes_count) FROM wishes WHERE status = 'approved'");
    $total_likes = (int)$stmt_likes->fetchColumn();

    $target_pool_lkr = 1000000; // 1 Million LKR
    $estimated_granted = floor($total_wishes * 0.15) + 12; // Example campaign metric

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_wishes' => $total_wishes,
            'total_likes' => $total_likes,
            'granted_wishes' => $estimated_granted,
            'prize_pool_lkr' => $target_pool_lkr,
            'formatted_pool' => 'LKR 1 MILLION'
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch stats: ' . $e->getMessage()]);
}

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

$adminSession = requireAuth();

try {
    $db = Database::getConnection();

    // Overall wishes metrics & Today's Wishes
    $stmt = $db->query("SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 ELSE 0 END) as todays_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        COALESCE(SUM(likes_count), 0) as total_likes,
        SUM(CASE WHEN lang = 'en' OR lang IS NULL OR lang = '' THEN 1 ELSE 0 END) as count_en,
        SUM(CASE WHEN lang = 'si' THEN 1 ELSE 0 END) as count_si,
        SUM(CASE WHEN lang = 'ta' THEN 1 ELSE 0 END) as count_ta
        FROM wishes");
    $wishStats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Total admin users count
    $userCountStmt = $db->query("SELECT COUNT(*) FROM admins");
    $totalAdminUsers = (int)$userCountStmt->fetchColumn();

    // Chart Data: Group submissions by day for comparison
    $chartStmt = $db->query("SELECT DATE(created_at) as day_date, COUNT(*) as count 
                             FROM wishes 
                             GROUP BY DATE(created_at) 
                             ORDER BY day_date ASC 
                             LIMIT 14");
    $rawChart = $chartStmt->fetchAll(PDO::FETCH_ASSOC);

    // Format chart data for smooth rendering
    $chartData = [];
    foreach ($rawChart as $row) {
        $chartData[] = [
            'date' => date('M d', strtotime($row['day_date'])),
            'full_date' => $row['day_date'],
            'count' => (int)$row['count']
        ];
    }

    // Recent 5 wishes
    $recentWishesStmt = $db->query("SELECT id, wish_title, submitter_name, city_region, status, lang, created_at FROM wishes ORDER BY created_at DESC LIMIT 5");
    $recentWishes = $recentWishesStmt->fetchAll(PDO::FETCH_ASSOC);

    // Recent 5 activity logs
    $recentLogsStmt = $db->query("SELECT id, admin_username, action_type, description, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 5");
    $recentLogs = $recentLogsStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'metrics' => [
            'total_wishes' => (int)($wishStats['total'] ?? 0),
            'todays_wishes' => (int)($wishStats['todays_count'] ?? 0),
            'pending_wishes' => (int)($wishStats['pending'] ?? 0),
            'approved_wishes' => (int)($wishStats['approved'] ?? 0),
            'rejected_wishes' => (int)($wishStats['rejected'] ?? 0),
            'total_likes' => (int)($wishStats['total_likes'] ?? 0),
            'count_en' => (int)($wishStats['count_en'] ?? 0),
            'count_si' => (int)($wishStats['count_si'] ?? 0),
            'count_ta' => (int)($wishStats['count_ta'] ?? 0),
            'total_admins' => $totalAdminUsers
        ],
        'chart_data' => $chartData,
        'recent_wishes' => $recentWishes,
        'recent_logs' => $recentLogs
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch dashboard stats: ' . $e->getMessage()
    ]);
}

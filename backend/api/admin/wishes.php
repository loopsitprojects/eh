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

// Require valid admin authentication token
$adminSession = requireAuth();

try {
    $db = Database::getConnection();

    $filter_status = $_GET['status'] ?? 'all';
    $filter_lang = $_GET['lang'] ?? 'all';
    $search = trim($_GET['q'] ?? '');

    $sql = "SELECT * FROM wishes WHERE 1=1";
    $params = [];

    if ($filter_status !== 'all' && in_array($filter_status, ['pending', 'approved', 'rejected'])) {
        $sql .= " AND status = ?";
        $params[] = $filter_status;
    }

    if ($filter_lang !== 'all' && in_array($filter_lang, ['en', 'si', 'ta'])) {
        $sql .= " AND lang = ?";
        $params[] = $filter_lang;
    }

    if (!empty($search)) {
        $sql .= " AND (wish_title LIKE ? OR wish_story LIKE ? OR submitter_name LIKE ? OR city_region LIKE ?)";
        $term = "%" . $search . "%";
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $wishes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate Admin Stats including language breakdown
    $total_stmt = $db->query("SELECT 
        COUNT(*) as total,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending,
        COALESCE(SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END), 0) as approved,
        COALESCE(SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END), 0) as rejected,
        COALESCE(SUM(CASE WHEN lang = 'en' OR lang IS NULL OR lang = '' THEN 1 ELSE 0 END), 0) as count_en,
        COALESCE(SUM(CASE WHEN lang = 'si' THEN 1 ELSE 0 END), 0) as count_si,
        COALESCE(SUM(CASE WHEN lang = 'ta' THEN 1 ELSE 0 END), 0) as count_ta
        FROM wishes");
    $stats = $total_stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'stats' => [
            'total' => (int)($stats['total'] ?? 0),
            'pending' => (int)($stats['pending'] ?? 0),
            'approved' => (int)($stats['approved'] ?? 0),
            'rejected' => (int)($stats['rejected'] ?? 0),
            'count_en' => (int)($stats['count_en'] ?? 0),
            'count_si' => (int)($stats['count_si'] ?? 0),
            'count_ta' => (int)($stats['count_ta'] ?? 0)
        ],
        'wishes' => $wishes
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch admin wishes: ' . $e->getMessage()
    ]);
}

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
    $search = trim($_GET['q'] ?? '');

    $sql = "SELECT * FROM activity_logs WHERE 1=1";
    $params = [];

    if (!empty($search)) {
        $sql .= " AND (admin_username LIKE ? OR action_type LIKE ? OR description LIKE ? OR ip_address LIKE ?)";
        $term = "%" . $search . "%";
        $params = [$term, $term, $term, $term];
    }

    $sql .= " ORDER BY created_at DESC LIMIT 100";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'logs' => $logs
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch activity logs: ' . $e->getMessage()
    ]);
}

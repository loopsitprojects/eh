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

// Require valid admin authentication token
$adminSession = requireAuth();

$input = json_decode(file_get_contents('php://input'), true);

$id = intval($input['id'] ?? $_POST['id'] ?? 0);
$action = trim($input['action'] ?? $_POST['action'] ?? ''); // 'approve', 'reject', 'pending', 'delete'

if ($id <= 0 || !in_array($action, ['approve', 'reject', 'pending', 'delete'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid wish ID or action'
    ]);
    exit;
}

try {
    $db = Database::getConnection();

    if ($action === 'delete') {
        $stmt = $db->prepare("DELETE FROM wishes WHERE id = ?");
        $stmt->execute([$id]);
        $message = "Wish #{$id} deleted successfully";
    } else {
        $status_map = [
            'approve' => 'approved',
            'reject'  => 'rejected',
            'pending' => 'pending'
        ];
        $new_status = $status_map[$action];

        $stmt = $db->prepare("UPDATE wishes SET status = ? WHERE id = ?");
        $stmt->execute([$new_status, $id]);
        $message = "Wish #{$id} status updated to {$new_status}";
    }

    logAdminActivity($adminSession['admin_id'], $adminSession['username'], "{$action}_wish", "Executed {$action} on Wish #{$id}");

    echo json_encode([
        'success' => true,
        'message' => $message,
        'id' => $id,
        'action' => $action
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Action failed: ' . $e->getMessage()
    ]);
}

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
$ids = $input['ids'] ?? $_POST['ids'] ?? [];
if (!is_array($ids) && !empty($ids)) {
    $ids = explode(',', $ids);
}
$ids = array_map('intval', array_filter($ids));

$action = trim($input['action'] ?? $_POST['action'] ?? ''); // 'approve', 'reject', 'pending', 'delete', 'delete_batch', 'delete_all'

if (!in_array($action, ['approve', 'reject', 'pending', 'delete', 'delete_batch', 'delete_all'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid wish ID or action specified'
    ]);
    exit;
}

try {
    $db = Database::getConnection();

    if ($action === 'delete_all') {
        $db->exec("DELETE FROM wishes");
        logAdminActivity($adminSession['admin_id'], $adminSession['username'], 'delete_all_wishes', 'Deleted all wishes from database');
        echo json_encode([
            'success' => true,
            'message' => 'All wishes deleted successfully from database',
            'action' => $action
        ]);
        exit;
    }

    if ($action === 'delete_batch') {
        if (empty($ids)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No wish IDs provided for batch delete']);
            exit;
        }
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $db->prepare("DELETE FROM wishes WHERE id IN ($placeholders)");
        $stmt->execute($ids);
        $count = count($ids);
        logAdminActivity($adminSession['admin_id'], $adminSession['username'], 'delete_batch_wishes', "Batch deleted {$count} wishes from database");
        echo json_encode([
            'success' => true,
            'message' => "Successfully deleted {$count} selected wishes",
            'count' => $count,
            'action' => $action
        ]);
        exit;
    }

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid wish ID']);
        exit;
    }

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

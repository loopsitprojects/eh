<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/auth.php';

$adminSession = requireAuth();
$db = Database::getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT id, username, name, role, created_at, last_login FROM admins ORDER BY id ASC");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'users' => $users
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');
    $name = trim($input['name'] ?? '');
    $role = trim($input['role'] ?? 'admin');

    if (empty($username) || empty($password) || empty($name)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Username, password, and name are required']);
        exit;
    }

    try {
        // Check duplicate username
        $check = $db->prepare("SELECT id FROM admins WHERE username = ?");
        $check->execute([$username]);
        if ($check->fetch()) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Username already exists']);
            exit;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO admins (username, password_hash, name, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $hash, $name, $role]);
        $newId = $db->lastInsertId();

        logAdminActivity($adminSession['admin_id'], $adminSession['username'], 'create_user', "Created admin user '{$username}' ({$name})");

        echo json_encode([
            'success' => true,
            'message' => "User '{$username}' created successfully",
            'id' => $newId
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? $_GET['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
        exit;
    }

    if ($id == $adminSession['admin_id']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'You cannot delete your own admin account']);
        exit;
    }

    try {
        // Get target username
        $check = $db->prepare("SELECT username FROM admins WHERE id = ?");
        $check->execute([$id]);
        $target = $check->fetch(PDO::FETCH_ASSOC);

        if (!$target) {
            http_response_code(44);
            echo json_encode(['success' => false, 'error' => 'User not found']);
            exit;
        }

        $stmt = $db->prepare("DELETE FROM admins WHERE id = ?");
        $stmt->execute([$id]);

        logAdminActivity($adminSession['admin_id'], $adminSession['username'], 'delete_user', "Deleted admin user '{$target['username']}' (#{$id})");

        echo json_encode([
            'success' => true,
            'message' => "User #{$id} deleted successfully"
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

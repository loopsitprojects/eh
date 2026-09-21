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

$input = json_decode(file_get_contents('php://input'), true);

$username = trim($input['username'] ?? $_POST['username'] ?? '');
$password = trim($input['password'] ?? $_POST['password'] ?? '');

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Username and password are required'
    ]);
    exit;
}

try {
    $db = Database::getConnection();

    // Look up admin by username
    $stmt = $db->prepare("SELECT * FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid username or password'
        ]);
        exit;
    }

    // Generate secure 64-char token
    $token = bin2hex(random_bytes(32));
    
    // Set 24 hour expiration
    $expires_at = date('Y-m-d H:i:s', strtotime('+24 hours'));
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $user_agent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

    // Insert session into admin_sessions
    $session_stmt = $db->prepare("INSERT INTO admin_sessions (admin_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)");
    $session_stmt->execute([$admin['id'], $token, $ip_address, $user_agent, $expires_at]);

    // Update last_login timestamp
    $update_stmt = $db->prepare("UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?");
    $update_stmt->execute([$admin['id']]);

    logAdminActivity($admin['id'], $admin['username'], 'login', 'Logged in to admin portal');

    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'token' => $token,
        'expires_at' => $expires_at,
        'admin' => [
            'id' => (int)$admin['id'],
            'username' => $admin['username'],
            'name' => $admin['name'],
            'role' => $admin['role']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Login error: ' . $e->getMessage()
    ]);
}

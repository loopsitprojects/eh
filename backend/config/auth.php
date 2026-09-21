<?php
require_once __DIR__ . '/database.php';

function getBearerToken() {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } else if (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
            return $matches[1];
        }
    }
    
    return $_GET['token'] ?? $_POST['token'] ?? null;
}

function requireAuth() {
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Authentication token required'
        ]);
        exit;
    }

    try {
        $db = Database::getConnection();
        
        $stmt = $db->prepare("SELECT s.*, a.id as admin_id, a.username, a.name, a.role 
                              FROM admin_sessions s
                              JOIN admins a ON s.admin_id = a.id
                              WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP");
        $stmt->execute([$token]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$session) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Invalid or expired session token'
            ]);
            exit;
        }

        return $session;

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Authentication error: ' . $e->getMessage()
        ]);
        exit;
    }
}

function logAdminActivity($adminId, $username, $actionType, $description) {
    try {
        $db = Database::getConnection();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $db->prepare("INSERT INTO activity_logs (admin_id, admin_username, action_type, description, ip_address) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$adminId, $username, $actionType, $description, $ip]);
    } catch (Exception $e) {
        // Silently ignore logging failures to not disrupt primary flow
    }
}

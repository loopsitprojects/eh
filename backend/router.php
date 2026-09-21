<?php
// PHP Built-in server router script for CORS and routing

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uri = decode_uri($_SERVER['REQUEST_URI']);
$path = parse_url($uri, PHP_URL_PATH);

function decode_uri($uri) {
    return rawurldecode($uri);
}

// Serve uploaded static files if requested
if (strpos($path, '/uploads/') === 0) {
    $file = __DIR__ . $path;
    if (file_exists($file) && !is_dir($file)) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $mimetypes = [
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml'
        ];
        if (isset($mimetypes[$ext])) {
            header('Content-Type: ' . $mimetypes[$ext]);
        }
        readfile($file);
        return true;
    }
}

// Route API endpoints
if (strpos($path, '/api/') === 0) {
    $api_script = __DIR__ . $path;
    if (file_exists($api_script) && is_file($api_script)) {
        require $api_script;
        return true;
    }
}

// Serve admin login redirect when accessed via browser
if ($path === '/admin' || $path === '/admin/') {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    if (strpos($accept, 'text/html') !== false || strpos($_SERVER['HTTP_USER_AGENT'] ?? '', 'Mozilla') !== false) {
        header('Location: http://localhost:5173/admin');
        echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=http://localhost:5173/admin">
    <title>Redirecting to Admin Portal...</title>
    <script>window.location.href = "http://localhost:5173/admin";</script>
</head>
<body style="background:#0F172A;color:#FFF;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
    <p>Redirecting to Admin Portal...</p>
</body>
</html>';
        exit;
    }

    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'online',
        'message' => 'Wonder Wishes PHP API Backend is running successfully.',
        'admin_login' => 'http://localhost:5173/admin'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    return true;
}

// Fallback response for missing paths
return false;

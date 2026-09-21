<?php
/**
 * Submit Wish API Endpoint
 * POST /api/submit_wish.php
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    $db = Database::getConnection();

    // Support both FormData multipart/form-data AND raw JSON with base64 image data
    $wish_title = $_POST['wish_title'] ?? '';
    $wish_story = $_POST['wish_story'] ?? '';
    $submitter_name = $_POST['submitter_name'] ?? '';
    $submitter_phone = $_POST['submitter_phone'] ?? '';
    $submitter_email = $_POST['submitter_email'] ?? '';
    $city_region = $_POST['city_region'] ?? 'Colombo';
    $lang = $_POST['lang'] ?? 'en';
    $base64_stick_canvas = $_POST['stick_canvas_data'] ?? '';

    // If input was JSON
    if (empty($wish_title)) {
        $raw_input = file_get_contents('php://input');
        $json_data = json_decode($raw_input, true);
        if ($json_data) {
            $wish_title = $json_data['wish_title'] ?? '';
            $wish_story = $json_data['wish_story'] ?? '';
            $submitter_name = $json_data['submitter_name'] ?? '';
            $submitter_phone = $json_data['submitter_phone'] ?? '';
            $submitter_email = $json_data['submitter_email'] ?? '';
            $city_region = $json_data['city_region'] ?? 'Colombo';
            $lang = $json_data['lang'] ?? $lang;
            $base64_stick_canvas = $json_data['stick_canvas_data'] ?? '';
        }
    }

    if (empty($wish_title) || empty($submitter_name) || empty($submitter_phone)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Please fill in all required fields (Wish title, Name, Phone number).']);
        exit;
    }

    // Ensure uploads directory exists
    $upload_dir = __DIR__ . '/../uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $image_relative_path = 'uploads/sample_stick1.png'; // default fallback image

    // 1. Handle uploaded file if present
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $file_tmp = $_FILES['image']['tmp_name'];
        $file_name = $_FILES['image']['name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        
        $allowed_exts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (in_array($file_ext, $allowed_exts)) {
            $new_filename = 'wish_' . time() . '_' . uniqid() . '.' . $file_ext;
            $destination = $upload_dir . $new_filename;
            if (move_uploaded_file($file_tmp, $destination)) {
                $image_relative_path = 'uploads/' . $new_filename;
            }
        }
    } 
    // 2. Handle base64 stick canvas generated on frontend
    else if (!empty($base64_stick_canvas)) {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64_stick_canvas, $type)) {
            $data = substr($base64_stick_canvas, strpos($base64_stick_canvas, ',') + 1);
            $type = strtolower($type[1]);
            $data = base64_decode($data);
            if ($data !== false) {
                $new_filename = 'generated_stick_' . time() . '_' . uniqid() . '.' . ($type === 'jpeg' ? 'jpg' : $type);
                $destination = $upload_dir . $new_filename;
                file_put_contents($destination, $data);
                $image_relative_path = 'uploads/' . $new_filename;
            }
        }
    }

    // Insert into MySQL Database via PDO
    $stmt = $db->prepare("INSERT INTO wishes (wish_title, wish_story, submitter_name, submitter_phone, submitter_email, city_region, image_path, likes_count, lang, status) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 'approved')");
    $stmt->execute([
        $wish_title,
        $wish_story ?: $wish_title,
        $submitter_name,
        $submitter_phone,
        $submitter_email,
        $city_region,
        $image_relative_path,
        $lang
    ]);

    $new_id = $db->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Your wish has been submitted successfully! Thank you for spreading joy.',
        'wish' => [
            'id' => (int)$new_id,
            'wish_title' => $wish_title,
            'wish_story' => $wish_story ?: $wish_title,
            'submitter_name' => $submitter_name,
            'city_region' => $city_region,
            'image_path' => $image_relative_path,
            'likes_count' => 0,
            'lang' => $lang,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

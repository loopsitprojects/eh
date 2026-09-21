<?php
/**
 * Get Wishes API Endpoint
 * GET /api/get_wishes.php
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

try {
    $db = Database::getConnection();

    $search = isset($_GET['q']) ? trim($_GET['q']) : '';
    $city = isset($_GET['city']) ? trim($_GET['city']) : '';
    $sort = isset($_GET['sort']) ? trim($_GET['sort']) : 'latest'; // latest | popular
    $lang = isset($_GET['lang']) ? trim($_GET['lang']) : 'all';

    $sql = "SELECT id, wish_title, wish_story, submitter_name, city_region, image_path, likes_count, lang, created_at FROM wishes WHERE status = 'approved'";
    $params = [];

    if (!empty($lang) && $lang !== 'all') {
        $sql .= " AND lang = ?";
        $params[] = $lang;
    }

    if (!empty($search)) {
        $sql .= " AND (wish_title LIKE ? OR wish_story LIKE ? OR submitter_name LIKE ?)";
        $search_param = '%' . $search . '%';
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
    }

    if (!empty($city) && $city !== 'All') {
        $sql .= " AND city_region = ?";
        $params[] = $city;
    }

    if ($sort === 'popular') {
        $sql .= " ORDER BY likes_count DESC, id DESC";
    } else {
        $sql .= " ORDER BY id DESC";
    }

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $wishes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'count' => count($wishes),
        'wishes' => $wishes
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to fetch wishes: ' . $e->getMessage()]);
}

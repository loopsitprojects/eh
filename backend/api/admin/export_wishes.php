<?php
/**
 * Export Wishes Endpoint (CSV / Excel Compatible)
 * GET /api/admin/export_wishes.php?format=csv|excel&status=all|pending|approved|rejected&lang=all|en|si|ta&q=search
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/auth.php';

// Require valid admin authentication
$adminSession = requireAuth();

try {
    $db = Database::getConnection();

    $filter_status = $_GET['status'] ?? 'all';
    $filter_lang = $_GET['lang'] ?? 'all';
    $search = trim($_GET['q'] ?? '');
    $format = strtolower($_GET['format'] ?? 'csv');

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

    $ids_param = $_GET['ids'] ?? $_POST['ids'] ?? '';
    if (!empty($ids_param)) {
        $ids_arr = [];
        if (is_string($ids_param)) {
            $ids_arr = array_filter(array_map('intval', explode(',', $ids_param)));
        } else if (is_array($ids_param)) {
            $ids_arr = array_filter(array_map('intval', $ids_param));
        }

        if (!empty($ids_arr)) {
            $in_clause = implode(',', array_fill(0, count($ids_arr), '?'));
            $sql .= " AND id IN ($in_clause)";
            foreach ($ids_arr as $id_val) {
                $params[] = $id_val;
            }
        }
    }

    $sql .= " ORDER BY id DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $wishes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $filename = "wonder_wishes_export_" . date('Y-m-d_His');

    logAdminActivity($adminSession['admin_id'], $adminSession['username'], 'export', "Exported " . count($wishes) . " records to " . strtoupper($format));

    if ($format === 'excel') {
        header('Content-Type: application/vnd.ms-excel; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '.xls"');
        header('Cache-Control: max-age=0');
        
        // Output UTF-8 BOM
        echo "\xEF\xBB\xBF";
        echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>table{border-collapse:collapse;}th{background:#E6007E;color:#FFF;padding:8px;border:1px solid #CCC;}td{padding:8px;border:1px solid #EEE;}</style></head><body>';
        echo '<table><thead><tr>';
        echo '<th>ID</th><th>Submitter Name</th><th>Phone Number</th><th>Email</th><th>Wish Title</th><th>Wish Story</th><th>District / Region</th><th>Language</th><th>Likes Count</th><th>Status</th><th>Submitted Date</th><th>Image Path</th>';
        echo '</tr></thead><tbody>';
        foreach ($wishes as $row) {
            echo '<tr>';
            echo '<td>' . htmlspecialchars($row['id'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars($row['submitter_name'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars($row['submitter_phone'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars($row['submitter_email'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars($row['wish_title'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars($row['wish_story'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars($row['city_region'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars(strtoupper($row['lang'] ?? 'EN')) . '</td>';
            echo '<td>' . htmlspecialchars($row['likes_count'] ?? 0) . '</td>';
            echo '<td>' . htmlspecialchars(strtoupper($row['status'] ?? 'PENDING')) . '</td>';
            echo '<td>' . htmlspecialchars($row['created_at'] ?? '') . '</td>';
            echo '<td>' . htmlspecialchars($row['image_path'] ?? '') . '</td>';
            echo '</tr>';
        }
        echo '</tbody></table></body></html>';
        exit;
    } else {
        // Standard CSV with UTF-8 BOM
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '.csv"');
        header('Cache-Control: max-age=0');

        $output = fopen('php://output', 'w');
        // Output UTF-8 BOM for Excel UTF-8 compatibility
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

        fputcsv($output, [
            'ID',
            'Submitter Name',
            'Phone Number',
            'Email',
            'Wish Title',
            'Wish Story',
            'District / Region',
            'Language',
            'Likes Count',
            'Status',
            'Submitted Date',
            'Image Path'
        ]);

        foreach ($wishes as $row) {
            fputcsv($output, [
                $row['id'] ?? '',
                $row['submitter_name'] ?? '',
                $row['submitter_phone'] ?? '',
                $row['submitter_email'] ?? '',
                $row['wish_title'] ?? '',
                $row['wish_story'] ?? '',
                $row['city_region'] ?? '',
                strtoupper($row['lang'] ?? 'EN'),
                $row['likes_count'] ?? 0,
                strtoupper($row['status'] ?? 'PENDING'),
                $row['created_at'] ?? '',
                $row['image_path'] ?? ''
            ]);
        }
        fclose($output);
        exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Export failed: ' . $e->getMessage()]);
}

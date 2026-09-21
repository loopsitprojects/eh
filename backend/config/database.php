<?php
/**
 * Database connection handler with MySQL PDO implementation
 * Fallback auto-provisioning for development environments
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

class Database {
    private static $host = '127.0.0.1';
    private static $db_name = 'wonder_wishes';
    private static $username = 'root';
    private static $password = '';
    private static $conn = null;
    private static $use_sqlite_fallback = false;
    private static $sqlite_file = __DIR__ . '/../database/wonder_wishes.sqlite';

    public static function getConnection() {
        if (self::$conn !== null) {
            return self::$conn;
        }

        // Try MySQL First
        try {
            // First connect without DB selected to ensure database exists
            $pdo_init = new PDO("mysql:host=" . self::$host . ";charset=utf8mb4", self::$username, self::$password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 2
            ]);
            $pdo_init->exec("CREATE DATABASE IF NOT EXISTS `" . self::$db_name . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            
            // Connect to actual database
            self::$conn = new PDO("mysql:host=" . self::$host . ";dbname=" . self::$db_name . ";charset=utf8mb4", self::$username, self::$password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            self::ensureMySQLTables(self::$conn);
            return self::$conn;

        } catch (PDOException $e) {
            // If MySQL fails (e.g. server not running locally), seamlessly fallback to SQLite so dev experience is 100% smooth
            self::$use_sqlite_fallback = true;
            return self::getSQLiteConnection();
        }
    }

    private static function ensureMySQLTables($pdo) {
        $sql = "CREATE TABLE IF NOT EXISTS `wishes` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `wish_title` VARCHAR(255) NOT NULL,
            `wish_story` TEXT NOT NULL,
            `submitter_name` VARCHAR(100) NOT NULL,
            `submitter_phone` VARCHAR(30) NOT NULL,
            `submitter_email` VARCHAR(150),
            `city_region` VARCHAR(100) DEFAULT 'Colombo',
            `image_path` VARCHAR(255) NOT NULL,
            `likes_count` INT DEFAULT 0,
            `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
            `lang` VARCHAR(10) DEFAULT 'en',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        $pdo->exec($sql);

        // Admins table
        $sql_admin = "CREATE TABLE IF NOT EXISTS `admins` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(50) UNIQUE NOT NULL,
            `password_hash` VARCHAR(255) NOT NULL,
            `name` VARCHAR(100) NOT NULL,
            `role` VARCHAR(20) DEFAULT 'admin',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `last_login` TIMESTAMP NULL DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        $pdo->exec($sql_admin);

        // Admin Sessions table
        $sql_sessions = "CREATE TABLE IF NOT EXISTS `admin_sessions` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `admin_id` INT NOT NULL,
            `token` VARCHAR(64) UNIQUE NOT NULL,
            `ip_address` VARCHAR(45),
            `user_agent` VARCHAR(255),
            `expires_at` TIMESTAMP NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        $pdo->exec($sql_sessions);

        // Activity Logs table
        $sql_logs = "CREATE TABLE IF NOT EXISTS `activity_logs` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `admin_id` INT NULL,
            `admin_username` VARCHAR(50) NOT NULL,
            `action_type` VARCHAR(50) NOT NULL,
            `description` TEXT NOT NULL,
            `ip_address` VARCHAR(45),
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        $pdo->exec($sql_logs);

        // Auto-migration: ensure lang column exists if table was already created
        try {
            $pdo->exec("ALTER TABLE `wishes` ADD COLUMN `lang` VARCHAR(10) DEFAULT 'en'");
        } catch (Exception $e) {
            // Column already exists
        }

        // Seed initial sample wishes if empty
        $stmt = $pdo->query("SELECT COUNT(*) FROM `wishes`");
        if ($stmt->fetchColumn() == 0) {
            self::seedSampleData($pdo);
        }

        // Seed default admin if empty
        self::ensureDefaultAdmin($pdo);
    }

    private static function getSQLiteConnection() {
        $db_dir = dirname(self::$sqlite_file);
        if (!is_dir($db_dir)) {
            mkdir($db_dir, 0777, true);
        }

        self::$conn = new PDO("sqlite:" . self::$sqlite_file, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        $sql = "CREATE TABLE IF NOT EXISTS wishes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wish_title TEXT NOT NULL,
            wish_story TEXT NOT NULL,
            submitter_name TEXT NOT NULL,
            submitter_phone TEXT NOT NULL,
            submitter_email TEXT,
            city_region TEXT DEFAULT 'Colombo',
            image_path TEXT NOT NULL,
            likes_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'approved',
            lang TEXT DEFAULT 'en',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );";
        self::$conn->exec($sql);

        $sql_admin = "CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        );";
        self::$conn->exec($sql_admin);

        $sql_sessions = "CREATE TABLE IF NOT EXISTS admin_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );";
        self::$conn->exec($sql_sessions);

        $sql_logs = "CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_id INTEGER,
            admin_username TEXT NOT NULL,
            action_type TEXT NOT NULL,
            description TEXT NOT NULL,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );";
        self::$conn->exec($sql_logs);

        // Auto-migration for SQLite
        try {
            self::$conn->exec("ALTER TABLE wishes ADD COLUMN lang TEXT DEFAULT 'en'");
        } catch (Exception $e) {
            // Column already exists
        }

        $stmt = self::$conn->query("SELECT COUNT(*) FROM wishes");
        if ($stmt->fetchColumn() == 0) {
            self::seedSampleData(self::$conn);
        }

        self::ensureDefaultAdmin(self::$conn);

        return self::$conn;
    }

    private static function ensureDefaultAdmin($pdo) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM admins");
        if ($stmt->fetchColumn() == 0) {
            $default_user = 'admin';
            $default_pass = 'admin123';
            $hash = password_hash($default_pass, PASSWORD_BCRYPT);
            
            $stmt = $pdo->prepare("INSERT INTO admins (username, password_hash, name, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([$default_user, $hash, 'Wonder Campaign Administrator', 'superadmin']);
        }
    }

    private static function seedSampleData($pdo) {
        $sample_wishes = [
            [
                'wish_title' => 'A Dream Bicycle for Nimal',
                'wish_story' => 'I wish a child in rural Matara could get their dream bicycle to ride to school safely every day.',
                'submitter_name' => 'Kasun Perera',
                'submitter_phone' => '0771234567',
                'submitter_email' => 'kasun@example.com',
                'city_region' => 'Matara',
                'image_path' => 'uploads/sample_stick1.png',
                'likes_count' => 42,
                'lang' => 'en'
            ],
            [
                'wish_title' => 'පාසල් ළමයින් සඳහා පොත් සහ බෑග්',
                'wish_story' => 'අනුරාධපුර ප්‍රාථමික පාසලේ ළමුන් 50 දෙනෙකුට අලුත් කතන්දර පොත්, ලිපිද්‍රව්‍ය සහ පාසල් බෑග් ලැබේවායි ප්‍රාර්ථනා කරමි.',
                'submitter_name' => 'දිලිනි ප්‍රනාන්දු',
                'submitter_phone' => '0719876543',
                'submitter_email' => 'dilini@example.com',
                'city_region' => 'Anuradhapura',
                'image_path' => 'uploads/sample_stick2.png',
                'likes_count' => 89,
                'lang' => 'si'
            ],
            [
                'wish_title' => 'மாணவர்களுக்கான சூரிய சக்தி விளக்குகள்',
                'wish_story' => 'மின்சாரம் இல்லாத கிராமங்களில் உள்ள குழந்தைகள் இரவில் வசதியாகப் படிக்க சூரிய சக்தியால் இயங்கும் விளக்குகள் கிடைக்க விரும்புகிறேன்.',
                'submitter_name' => 'செல்வம் ஜெயசிங்க',
                'submitter_phone' => '0754443322',
                'submitter_email' => 'selvam@example.com',
                'city_region' => 'Kandy',
                'image_path' => 'uploads/sample_stick3.png',
                'likes_count' => 128,
                'lang' => 'ta'
            ],
            [
                'wish_title' => 'Art & Painting Kits',
                'wish_story' => 'I wish young aspiring artists in Jaffna children home get paint sets, canvases, and drawing tools to spark creative joy.',
                'submitter_name' => 'Nimanthi Silva',
                'submitter_phone' => '0781112233',
                'submitter_email' => 'nimanthi@example.com',
                'city_region' => 'Jaffna',
                'image_path' => 'uploads/sample_stick4.png',
                'likes_count' => 64,
                'lang' => 'en'
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO wishes (wish_title, wish_story, submitter_name, submitter_phone, submitter_email, city_region, image_path, likes_count, lang, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')");
        foreach ($sample_wishes as $w) {
            $stmt->execute([
                $w['wish_title'],
                $w['wish_story'],
                $w['submitter_name'],
                $w['submitter_phone'],
                $w['submitter_email'],
                $w['city_region'],
                $w['image_path'],
                $w['likes_count'],
                $w['lang'] ?? 'en'
            ]);
        }
    }
}

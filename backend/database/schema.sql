-- MySQL Database Schema for Elephant House Wonder - "Write a Wish" Campaign
-- Database: wonder_wishes

CREATE DATABASE IF NOT EXISTS `wonder_wishes` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wonder_wishes`;

-- Table structure for `wishes`
CREATE TABLE IF NOT EXISTS `wishes` (
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
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample initial wishes data
INSERT INTO `wishes` (`wish_title`, `wish_story`, `submitter_name`, `submitter_phone`, `submitter_email`, `city_region`, `image_path`, `likes_count`, `status`) VALUES
('A Dream Bicycle for Nimal', 'I wish a child in rural Matara could get their dream bicycle to ride to school safely.', 'Kasun Perera', '0771234567', 'kasun@example.com', 'Matara', 'uploads/sample_stick1.png', 42, 'approved'),
('Warm Books & School Bags', 'I wish 50 children in Anuradhapura primary school get new books, stationery and bright school bags.', 'Dilini Fernando', '0719876543', 'dilini@example.com', 'Anuradhapura', 'uploads/sample_stick2.png', 89, 'approved'),
('Solar Lamp for Night Studying', 'I wish children in off-grid villages get solar powered lamps so they can read and study at night.', 'Saman Jayasinghe', '0754443322', 'saman@example.com', 'Kandy', 'uploads/sample_stick3.png', 128, 'approved');

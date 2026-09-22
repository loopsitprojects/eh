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

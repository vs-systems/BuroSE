-- Database Schema for BuroSE
-- Version: 1.0.0

-- 1. Users (Socios del Gremio)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cuit` VARCHAR(11) NOT NULL UNIQUE,
    `business_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'BLOCKED') DEFAULT 'PENDING',
    `role` ENUM('USER', 'ADMIN') DEFAULT 'USER',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Debtors (Personas Físicas o Jurídicas con incidentes)
CREATE TABLE IF NOT EXISTS `debtors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cuit_dni` VARCHAR(11) NOT NULL UNIQUE,
    `full_name` VARCHAR(255) NOT NULL,
    `total_debt_consolidated` DECIMAL(12,2) DEFAULT 0.00,
    `bcra_max_situation` INT DEFAULT 1,
    `last_bcra_check` TIMESTAMP NULL,
    `last_update` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Reports (Incidentes cargados por Socios)
CREATE TABLE IF NOT EXISTS `reports` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `debtor_id` INT NOT NULL,
    `reporter_id` INT NOT NULL,
    `amount` DECIMAL(12,2) NOT NULL,
    `incident_date` DATE NOT NULL,
    `type` ENUM('FACTURA', 'CHEQUE', 'SALDO', 'CONTRATO', 'OTRO') DEFAULT 'FACTURA',
    `description` TEXT,
    `evidence_path` VARCHAR(512), -- URL o path al archivo de backup
    `status` ENUM('PENDING', 'APPROVED', 'CANCELLED', 'PAID') DEFAULT 'PENDING',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`debtor_id`) REFERENCES `debtors`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Logs (Auditoría de búsquedas y accesos)
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `target_cuit` VARCHAR(11),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

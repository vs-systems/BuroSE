-- Script de creación de base de datos para BuroSE
-- Compatible con MySQL (Hostinger)

CREATE TABLE IF NOT EXISTS membership_companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    razon_social VARCHAR(255) NOT NULL,
    cuit VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    rubro VARCHAR(100),
    localidad VARCHAR(100),
    password_hash VARCHAR(255),
    estado ENUM('pendiente', 'validado', 'suspendido') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    cuit_denunciado VARCHAR(20) NOT NULL,
    nombre_denunciado VARCHAR(255) NOT NULL,
    monto DECIMAL(15, 2) NOT NULL,
    descripcion TEXT,
    evidencia_url VARCHAR(255),
    estado ENUM('pendiente', 'validado', 'rechazado') DEFAULT 'pendiente',
    validado_por VARCHAR(100),
    fecha_denuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES membership_companies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_social VARCHAR(255) NOT NULL,
    cuit VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    preferencia_contacto ENUM('telefono', 'whatsapp', 'email'),
    rubro VARCHAR(100),
    localidad VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS replica_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_sujeto VARCHAR(255) NOT NULL,
    cuit_dni VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    descargo TEXT,
    report_id INT,
    estado ENUM('recibido', 'en_revision', 'publicado') DEFAULT 'recibido',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS search_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    search_query VARCHAR(20) NOT NULL,
    found_internal BOOLEAN DEFAULT FALSE,
    found_bcra BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES membership_companies(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bcra_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cuit VARCHAR(20) NOT NULL UNIQUE,
    data_json LONGTEXT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

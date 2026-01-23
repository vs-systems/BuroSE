-- SQL para la gestión de logos de empresas colaboradoras
CREATE TABLE IF NOT EXISTS brand_logos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255) NOT NULL,
    website_url VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos placeholders iniciales (opcional)
-- INSERT INTO brand_logos (name, logo_url, website_url) VALUES ('Seguridad Global', 'logo1.png', 'https://example.com');

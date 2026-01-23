-- SQL para actualizar la tabla membership_companies y agregar el campo password
-- Ejecutar este comando en la pestaña SQL de phpMyAdmin en Hostinger

ALTER TABLE membership_companies 
ADD COLUMN password VARCHAR(255) AFTER email;

-- Nota: Por defecto el campo será NULL. 
-- Deberás asignar una contraseña (hash o texto plano inicialmente para pruebas) 
-- a las empresas que quieras habilitar.

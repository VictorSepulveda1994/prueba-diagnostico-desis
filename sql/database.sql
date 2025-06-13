-- sql/database.sql (Versión para MySQL/MariaDB)

-- Crear la base de datos (opcional, también se puede hacer desde phpMyAdmin)
CREATE DATABASE IF NOT EXISTS `desis_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `desis_db`;

-- Tabla para Bodegas
CREATE TABLE `bodegas` (
  `id_bodega` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_bodega` VARCHAR(100) NOT NULL
);

-- Tabla para Sucursales
CREATE TABLE `sucursales` (
  `id_sucursal` INT AUTO_INCREMENT PRIMARY KEY,
  `id_bodega` INT NOT NULL,
  `nombre_sucursal` VARCHAR(100) NOT NULL,
  FOREIGN KEY (`id_bodega`) REFERENCES `bodegas`(`id_bodega`)
);

-- Tabla para Monedas
CREATE TABLE `monedas` (
  `id_moneda` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_moneda` VARCHAR(50) NOT NULL,
  `simbolo_moneda` VARCHAR(5)
);

-- Tabla para los Materiales
CREATE TABLE `materiales` (
  `id_material` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_material` VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla principal de Productos
CREATE TABLE `productos` (
  `id_producto` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo_producto` VARCHAR(15) NOT NULL UNIQUE,
  `nombre_producto` VARCHAR(50) NOT NULL,
  `id_sucursal` INT NOT NULL,
  `id_moneda` INT NOT NULL,
  `precio` DECIMAL(10, 2) NOT NULL,
  `descripcion` TEXT,
  FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales`(`id_sucursal`),
  FOREIGN KEY (`id_moneda`) REFERENCES `monedas`(`id_moneda`)
);

-- Tabla intermedia para producto_materiales
CREATE TABLE `producto_materiales` (
  `id_producto` INT NOT NULL,
  `id_material` INT NOT NULL,
  PRIMARY KEY (`id_producto`, `id_material`),
  FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`),
  FOREIGN KEY (`id_material`) REFERENCES `materiales`(`id_material`)
);

-- Insertar datos de ejemplo
INSERT INTO `bodegas` (`nombre_bodega`) VALUES ('Bodega 1'), ('Bodega 2');
INSERT INTO `sucursales` (`id_bodega`, `nombre_sucursal`) VALUES (1, 'Sucursal 1A'), (1, 'Sucursal 1B'), (2, 'Sucursal 2A');
INSERT INTO `monedas` (`nombre_moneda`) VALUES ('DÓLAR'), ('PESO'), ('EURO');
INSERT INTO `materiales` (`nombre_material`) VALUES ('Plástico'), ('Metal'), ('Madera'), ('Vidrio'), ('Textil');

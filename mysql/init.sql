CREATE DATABASE IF NOT EXISTS ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecom_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Còn hàng'
);

-- Tài khoản quản trị mặc định (Mật khẩu: Admin@123)
INSERT IGNORE INTO users (fullname, email, password, role) VALUES 
('Đồng Anh Tuấn', 'admin@ictu.edu.vn', '$2a$10$wNqV9N/zEpmvL2U1d1FqU.ZqZ5eDk5JjFf2n4jZ6s6lP8F/FmC5uC', 'admin');

-- Dữ liệu sản phẩm mẫu
INSERT IGNORE INTO products (code, name, category, price, stock, status) VALUES
('SP-01', 'Acer Nitro 5 Gaming AN515', 'Laptop', 18490000, 15, 'Còn hàng'),
('SP-02', 'Màn hình ASUS TUF VG259Q3A 180Hz', 'Màn hình', 3850000, 28, 'Còn hàng'),
('SP-03', 'Chuột VGN Dragonfly R1 SE+ Wireless', 'Phụ kiện', 590000, 50, 'Còn hàng'),
('SP-04', 'Tai nghe HyperX Cloud II Gaming Headset', 'Âm thanh', 1690000, 12, 'Còn hàng');

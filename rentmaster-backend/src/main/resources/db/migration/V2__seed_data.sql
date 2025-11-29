-- Seed default admin user (password: admin123)
INSERT INTO users (username, password, full_name, email, role, active, created_at)
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO', 'Administrator', 'admin@rentmaster.com', 'ADMIN', true, NOW());

-- Seed default services
INSERT INTO services (name, type, pricing_model, unit_price, unit_name, active)
VALUES 
    ('Tiền phòng', 'RENT', 'FIXED', 0, NULL, true),
    ('Điện', 'ELECTRICITY', 'PER_UNIT', 3000, 'kWh', true),
    ('Nước', 'WATER', 'PER_UNIT', 25000, 'm³', true),
    ('Internet', 'INTERNET', 'FIXED', 200000, NULL, true),
    ('Gửi xe', 'PARKING', 'FIXED', 100000, NULL, true);


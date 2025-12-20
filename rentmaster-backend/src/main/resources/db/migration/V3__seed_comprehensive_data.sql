-- Comprehensive Seed Data for RentMaster
-- Reset sequences to ensure deterministic IDs for hardcoded foreign keys
ALTER SEQUENCE properties_id_seq RESTART WITH 1;
ALTER SEQUENCE rooms_id_seq RESTART WITH 1;
ALTER SEQUENCE tenants_id_seq RESTART WITH 1;
ALTER SEQUENCE contracts_id_seq RESTART WITH 1;

-- This file contains realistic sample data for testing and demonstration

-- Additional Users
INSERT INTO users (username, password, full_name, email, role, active, created_at)
VALUES 
    ('manager1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO', 'John Manager', 'manager1@rentmaster.com', 'STAFF', true, NOW() - INTERVAL '30 days'),
    ('staff1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO', 'Sarah Johnson', 'sarah@rentmaster.com', 'STAFF', true, NOW() - INTERVAL '15 days'),
    ('staff2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO', 'Mike Wilson', 'mike@rentmaster.com', 'STAFF', false, NOW() - INTERVAL '10 days');

-- Properties
INSERT INTO properties (name, address, description, created_at)
VALUES 
    ('Sunset Heights', '123 Sunset Boulevard, Ho Chi Minh City', 'Modern apartment complex with 8 units, located in District 1', NOW() - INTERVAL '180 days'),
    ('Urban Lofts', '45 Downtown Ave, Ho Chi Minh City', 'Contemporary loft-style apartments in the heart of the city', NOW() - INTERVAL '120 days'),
    ('Garden Villas', '88 Garden Row, Ho Chi Minh City', 'Luxury villas with garden views, perfect for families', NOW() - INTERVAL '90 days'),
    ('Riverside Apartments', '200 River Road, Ho Chi Minh City', 'Waterfront apartments with stunning river views', NOW() - INTERVAL '60 days'),
    ('City Center Complex', '500 Main Street, Ho Chi Minh City', 'High-rise complex in the business district', NOW() - INTERVAL '45 days'),
    ('Green Valley Residences', '789 Valley Drive, Ho Chi Minh City', 'Eco-friendly residential complex', NOW() - INTERVAL '30 days');

-- Rooms for Sunset Heights (Property ID from properties table by name)
INSERT INTO rooms (property_id, code, floor, type, size_m2, status, base_rent, capacity, notes)
SELECT 
    (SELECT id FROM properties WHERE name = 'Sunset Heights' LIMIT 1),
    code, floor, type, size_m2, status, base_rent, capacity, notes
FROM (VALUES 
    ('101', '1', 'Studio', 25.0, 'OCCUPIED', 5000000, 1, 'Corner unit with balcony'),
    ('102', '1', '1 Bedroom', 35.0, 'OCCUPIED', 7000000, 2, 'Fully furnished'),
    ('201', '2', '1 Bedroom', 35.0, 'OCCUPIED', 7000000, 2, 'City view'),
    ('202', '2', '2 Bedroom', 50.0, 'OCCUPIED', 10000000, 3, 'Spacious with balcony'),
    ('301', '3', 'Studio', 25.0, 'OCCUPIED', 5000000, 1, 'Top floor'),
    ('302', '3', '1 Bedroom', 35.0, 'OCCUPIED', 7000000, 2, 'Renovated'),
    ('401', '4', '2 Bedroom', 50.0, 'OCCUPIED', 10000000, 3, 'Premium unit'),
    ('402', '4', '1 Bedroom', 35.0, 'AVAILABLE', 7000000, 2, 'Available immediately')
) AS v(code, floor, type, size_m2, status, base_rent, capacity, notes);

-- Rooms for Urban Lofts (Property ID from properties table by name)
INSERT INTO rooms (property_id, code, floor, type, size_m2, status, base_rent, capacity, notes)
SELECT 
    (SELECT id FROM properties WHERE name = 'Urban Lofts' LIMIT 1),
    code, floor, type, size_m2, status, base_rent, capacity, notes
FROM (VALUES 
    ('1A', '1', 'Master Suite', 60.0, 'OCCUPIED', 12000000, 2, 'Luxury loft with high ceilings'),
    ('1B', '1', 'Studio', 30.0, 'OCCUPIED', 6000000, 1, 'Modern design'),
    ('2A', '2', '1 Bedroom', 40.0, 'OCCUPIED', 8000000, 2, 'Industrial style'),
    ('2B', '2', 'Studio', 30.0, 'AVAILABLE', 6000000, 1, 'Ready to move in')
) AS v(code, floor, type, size_m2, status, base_rent, capacity, notes);

-- Rooms for Garden Villas (Property ID from properties table by name)
INSERT INTO rooms (property_id, code, floor, type, size_m2, status, base_rent, capacity, notes)
SELECT 
    (SELECT id FROM properties WHERE name = 'Garden Villas' LIMIT 1),
    code, floor, type, size_m2, status, base_rent, capacity, notes
FROM (VALUES 
    ('Villa-1', '1', '3 Bedroom Villa', 120.0, 'MAINTENANCE', 20000000, 5, 'Under renovation')
) AS v(code, floor, type, size_m2, status, base_rent, capacity, notes);

-- Rooms for Riverside Apartments (Property ID from properties table by name)
INSERT INTO rooms (property_id, code, floor, type, size_m2, status, base_rent, capacity, notes)
SELECT 
    (SELECT id FROM properties WHERE name = 'Riverside Apartments' LIMIT 1),
    code, floor, type, size_m2, status, base_rent, capacity, notes
FROM (VALUES 
    ('R101', '1', '1 Bedroom', 35.0, 'OCCUPIED', 7500000, 2, 'River view'),
    ('R102', '1', 'Studio', 28.0, 'OCCUPIED', 5500000, 1, 'Waterfront'),
    ('R201', '2', '2 Bedroom', 55.0, 'OCCUPIED', 11000000, 3, 'Panoramic view'),
    ('R202', '2', '1 Bedroom', 35.0, 'AVAILABLE', 7500000, 2, 'Available now')
) AS v(code, floor, type, size_m2, status, base_rent, capacity, notes);

-- Rooms for City Center Complex (Property ID from properties table by name)
INSERT INTO rooms (property_id, code, floor, type, size_m2, status, base_rent, capacity, notes)
SELECT 
    (SELECT id FROM properties WHERE name = 'City Center Complex' LIMIT 1),
    code, floor, type, size_m2, status, base_rent, capacity, notes
FROM (VALUES 
    ('CC101', '1', 'Studio', 25.0, 'OCCUPIED', 6000000, 1, 'Business district'),
    ('CC102', '1', '1 Bedroom', 35.0, 'OCCUPIED', 8000000, 2, 'Near metro'),
    ('CC201', '2', '1 Bedroom', 35.0, 'OCCUPIED', 8000000, 2, 'High floor'),
    ('CC202', '2', '2 Bedroom', 50.0, 'OCCUPIED', 12000000, 3, 'Executive suite')
) AS v(code, floor, type, size_m2, status, base_rent, capacity, notes);

-- Tenants
INSERT INTO tenants (full_name, phone, email, id_number, address, emergency_contact, created_at)
VALUES 
    ('Nguyen Van A', '0901234567', 'nguyenvana@email.com', '001234567890', '123 Main St, HCMC', '0901234568 - Wife', NOW() - INTERVAL '150 days'),
    ('Tran Thi B', '0902345678', 'tranthib@email.com', '001234567891', '456 Oak Ave, HCMC', '0902345679 - Brother', NOW() - INTERVAL '140 days'),
    ('Le Van C', '0903456789', 'levanc@email.com', '001234567892', '789 Pine Rd, HCMC', '0903456790 - Sister', NOW() - INTERVAL '130 days'),
    ('Pham Thi D', '0904567890', 'phamthid@email.com', '001234567893', '321 Elm St, HCMC', '0904567891 - Mother', NOW() - INTERVAL '120 days'),
    ('Hoang Van E', '0905678901', 'hoangvane@email.com', '001234567894', '654 Maple Dr, HCMC', '0905678902 - Father', NOW() - INTERVAL '110 days'),
    ('Vu Thi F', '0906789012', 'vuthif@email.com', '001234567895', '987 Cedar Ln, HCMC', '0906789013 - Husband', NOW() - INTERVAL '100 days'),
    ('Dang Van G', '0907890123', 'dangvang@email.com', '001234567896', '147 Birch Way, HCMC', '0907890124 - Wife', NOW() - INTERVAL '90 days'),
    ('Bui Thi H', '0908901234', 'buithih@email.com', '001234567897', '258 Spruce Ct, HCMC', '0908901235 - Son', NOW() - INTERVAL '80 days'),
    ('Sarah Jenkins', '0912345678', 'sarah.jenkins@email.com', '001234567898', '45 Downtown Ave, HCMC', '0912345679 - John Jenkins', NOW() - INTERVAL '100 days'),
    ('Michael Chen', '0913456789', 'michael.chen@email.com', '001234567899', '200 River Road, HCMC', '0913456790 - Lisa Chen', NOW() - INTERVAL '50 days'),
    ('Emily Davis', '0914567890', 'emily.davis@email.com', '001234567900', '500 Main Street, HCMC', '0914567891 - Robert Davis', NOW() - INTERVAL '45 days'),
    ('David Wilson', '0915678901', 'david.wilson@email.com', '001234567901', '789 Valley Drive, HCMC', '0915678902 - Mary Wilson', NOW() - INTERVAL '30 days'),
    ('Lisa Anderson', '0916789012', 'lisa.anderson@email.com', '001234567902', '123 Sunset Boulevard, HCMC', '0916789013 - Tom Anderson', NOW() - INTERVAL '25 days'),
    ('James Brown', '0917890123', 'james.brown@email.com', '001234567903', '88 Garden Row, HCMC', '0917890124 - Jane Brown', NOW() - INTERVAL '20 days'),
    ('Maria Garcia', '0918901234', 'maria.garcia@email.com', '001234567904', '200 River Road, HCMC', '0918901235 - Carlos Garcia', NOW() - INTERVAL '15 days');

-- Contracts
INSERT INTO contracts (code, room_id, primary_tenant_id, start_date, end_date, rent_amount, deposit_amount, billing_cycle, status, created_at)
VALUES 
    ('CT-2024-001', 1, 1, CURRENT_DATE - INTERVAL '150 days', CURRENT_DATE + INTERVAL '215 days', 5000000, 10000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '150 days'),
    ('CT-2024-002', 2, 2, CURRENT_DATE - INTERVAL '140 days', CURRENT_DATE + INTERVAL '225 days', 7000000, 14000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '140 days'),
    ('CT-2024-003', 3, 3, CURRENT_DATE - INTERVAL '130 days', CURRENT_DATE + INTERVAL '235 days', 7000000, 14000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '130 days'),
    ('CT-2024-004', 4, 4, CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE + INTERVAL '245 days', 10000000, 20000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '120 days'),
    ('CT-2024-005', 5, 5, CURRENT_DATE - INTERVAL '110 days', CURRENT_DATE + INTERVAL '255 days', 5000000, 10000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '110 days'),
    ('CT-2024-006', 6, 6, CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE + INTERVAL '265 days', 7000000, 14000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '100 days'),
    ('CT-2024-007', 7, 7, CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', 10000000, 20000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '90 days'),
    ('CT-2024-008', 9, 9, CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE + INTERVAL '265 days', 12000000, 24000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '100 days'),
    ('CT-2024-009', 10, 10, CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', 6000000, 12000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '90 days'),
    ('CT-2024-010', 11, 11, CURRENT_DATE - INTERVAL '80 days', CURRENT_DATE + INTERVAL '285 days', 8000000, 16000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '80 days'),
    ('CT-2024-011', 13, 12, CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE + INTERVAL '315 days', 7500000, 15000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '50 days'),
    ('CT-2024-012', 14, 13, CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '320 days', 5500000, 11000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '45 days'),
    ('CT-2024-013', 15, 14, CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE + INTERVAL '325 days', 11000000, 22000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '40 days'),
    ('CT-2024-014', 17, 15, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days', 6000000, 12000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '30 days'),
    ('CT-2024-015', 18, 1, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE + INTERVAL '340 days', 8000000, 16000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '25 days'),
    ('CT-2024-016', 19, 2, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '345 days', 8000000, 16000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '20 days'),
    ('CT-2024-017', 20, 3, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '350 days', 12000000, 24000000, 'MONTHLY', 'ACTIVE', NOW() - INTERVAL '15 days');

-- Contract Tenants (Additional tenants for some contracts)
INSERT INTO contract_tenants (contract_id, tenant_id)
VALUES 
    (4, 5), -- Contract 4 has tenant 5 as additional
    (7, 8); -- Contract 7 has tenant 8 as additional

-- Contract Services (Add services to contracts with realistic data)
-- Add electricity and water to most contracts
INSERT INTO contract_services (contract_id, service_id, custom_price, active)
SELECT c.id, s.id, 
    CASE 
        WHEN s.type = 'ELECTRICITY' THEN 3000.0
        WHEN s.type = 'WATER' THEN 25000.0
        ELSE NULL
    END,
    true
FROM contracts c
CROSS JOIN services s
WHERE s.type IN ('ELECTRICITY', 'WATER')
AND c.status = 'ACTIVE'
AND c.id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17);

-- Add internet to some contracts
INSERT INTO contract_services (contract_id, service_id, custom_price, active)
SELECT c.id, s.id, 200000.0, true
FROM contracts c
CROSS JOIN services s
WHERE s.type = 'INTERNET'
AND c.status = 'ACTIVE'
AND c.id IN (1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17);

-- Add parking to some contracts with custom pricing
INSERT INTO contract_services (contract_id, service_id, custom_price, active)
SELECT c.id, s.id, 
    CASE 
        WHEN c.id IN (1, 2, 3) THEN 100000.0
        WHEN c.id IN (4, 5, 6) THEN 120000.0
        ELSE 100000.0
    END,
    true
FROM contracts c
CROSS JOIN services s
WHERE s.type = 'PARKING'
AND c.status = 'ACTIVE'
AND c.id IN (1, 2, 3, 4, 5, 6, 8, 9, 11, 13, 15);

-- Invoices (Generate invoices for active contracts for the last 3 months)
DO $$
DECLARE
    contract_rec RECORD;
    month_offset INTEGER;
    period_start DATE;
    period_end DATE;
    issue_date DATE;
    due_date DATE;
    total_amt NUMERIC;
    inv_status VARCHAR(50);
    invoice_id BIGINT;
    service_rec RECORD;
    item_amount NUMERIC;
BEGIN
    FOR contract_rec IN SELECT * FROM contracts WHERE status = 'ACTIVE' LOOP
        FOR month_offset IN 0..2 LOOP
            period_start := (DATE_TRUNC('month', CURRENT_DATE) - (month_offset || ' months')::interval)::date;
            period_end := ((DATE_TRUNC('month', CURRENT_DATE) - (month_offset || ' months')::interval) + INTERVAL '1 month - 1 day')::date;
            issue_date := period_start;
            due_date := period_start + INTERVAL '7 days';
            
            -- Calculate total amount
            SELECT COALESCE(SUM(cs.custom_price), 0) INTO total_amt
            FROM contract_services cs
            WHERE cs.contract_id = contract_rec.id AND cs.active = true;
            
            total_amt := contract_rec.rent_amount + total_amt + 200000 + 100000;
            
            IF due_date < CURRENT_DATE THEN
                inv_status := 'OVERDUE';
            ELSE
                inv_status := 'PENDING';
            END IF;
            
            INSERT INTO invoices (contract_id, period_start, period_end, issue_date, due_date, total_amount, status, created_at)
            VALUES (contract_rec.id, period_start, period_end, issue_date, due_date, total_amt, inv_status, NOW() - (month_offset || ' months')::interval)
            RETURNING id INTO invoice_id;
            
            -- Add rent item
            INSERT INTO invoice_items (invoice_id, service_id, description, quantity, unit_price, amount)
            SELECT invoice_id, s.id, s.name, 1.0, contract_rec.rent_amount, contract_rec.rent_amount
            FROM services s
            WHERE s.type = 'RENT'
            LIMIT 1;
            
            -- Add internet item
            INSERT INTO invoice_items (invoice_id, service_id, description, quantity, unit_price, amount)
            SELECT invoice_id, s.id, s.name, 1.0, 200000, 200000
            FROM services s
            WHERE s.type = 'INTERNET'
            LIMIT 1;
            
            -- Add parking item
            INSERT INTO invoice_items (invoice_id, service_id, description, quantity, unit_price, amount)
            SELECT invoice_id, s.id, s.name, 1.0, 100000, 100000
            FROM services s
            WHERE s.type = 'PARKING'
            LIMIT 1;
            
            -- Add contract services (electricity, water)
            FOR service_rec IN 
                SELECT s.*, cs.custom_price
                FROM services s
                JOIN contract_services cs ON cs.service_id = s.id
                WHERE cs.contract_id = contract_rec.id 
                AND cs.active = true
                AND s.type IN ('ELECTRICITY', 'WATER')
            LOOP
                item_amount := COALESCE(service_rec.custom_price, service_rec.unit_price);
                INSERT INTO invoice_items (invoice_id, service_id, description, quantity, unit_price, amount)
                VALUES (invoice_id, service_rec.id, service_rec.name, 1.0, item_amount, item_amount);
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- Invoice items are created in the DO block above

-- Add sample meter readings for electricity and water items
-- We set a simple previous/current index so the UI can display usage history.
UPDATE invoice_items ii
SET prev_index = 100.0,
    current_index = 101.0
FROM services s
WHERE ii.service_id = s.id
  AND s.type IN ('ELECTRICITY', 'WATER')
  AND ii.prev_index IS NULL
  AND ii.current_index IS NULL;

-- Sample invoices that simulate automated generation for demo purposes
-- These use past periods so they don't interfere with current runtime generation.
INSERT INTO invoices (contract_id, period_start, period_end, issue_date, due_date, total_amount, status, created_at)
VALUES
    (1, DATE '2024-01-01', DATE '2024-01-31', DATE '2024-02-01', DATE '2024-02-08', 5500000, 'PAID',    TIMESTAMP '2024-02-01 08:00:00'),
    (2, DATE '2024-01-01', DATE '2024-03-31', DATE '2024-04-01', DATE '2024-04-08', 16500000, 'PAID', TIMESTAMP '2024-04-01 08:00:00');

-- Items for the sample auto-like invoices (rent + internet)
INSERT INTO invoice_items (invoice_id, service_id, description, quantity, unit_price, amount)
SELECT i.id, s.id, 'Tiền phòng', 1.0, c.rent_amount, c.rent_amount
FROM invoices i
JOIN contracts c ON c.id = i.contract_id
JOIN services s ON s.type = 'RENT'
WHERE i.id IN (
    (SELECT MIN(id) FROM invoices WHERE contract_id = 1 AND period_start = DATE '2024-01-01'),
    (SELECT MIN(id) FROM invoices WHERE contract_id = 2 AND period_start = DATE '2024-01-01')
);

INSERT INTO invoice_items (invoice_id, service_id, description, quantity, unit_price, amount)
SELECT i.id, s.id, 'Internet', 1.0, 200000, 200000
FROM invoices i
JOIN services s ON s.type = 'INTERNET'
WHERE i.id IN (
    (SELECT MIN(id) FROM invoices WHERE contract_id = 1 AND period_start = DATE '2024-01-01'),
    (SELECT MIN(id) FROM invoices WHERE contract_id = 2 AND period_start = DATE '2024-01-01')
);

-- Payments (Some payments for invoices)
INSERT INTO payments (invoice_id, amount, paid_at, method, note)
SELECT 
    i.id,
    i.total_amount * 0.5, -- Partial payment
    i.issue_date + INTERVAL '3 days',
    'BANK_TRANSFER',
    'Partial payment'
FROM invoices i
WHERE i.status = 'OVERDUE'
ORDER BY random()
LIMIT 10;

INSERT INTO payments (invoice_id, amount, paid_at, method, note)
SELECT 
    i.id,
    i.total_amount, -- Full payment
    i.issue_date + INTERVAL '2 days',
    CASE (floor(random() * 3)::int)
        WHEN 0 THEN 'BANK_TRANSFER'
        WHEN 1 THEN 'CASH'
        ELSE 'CREDIT_CARD'
    END,
    'Full payment received'
FROM invoices i
WHERE i.status = 'PENDING'
ORDER BY random()
LIMIT 15;

-- Update invoice statuses based on payments
UPDATE invoices i
SET status = CASE
    WHEN COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id = i.id), 0) >= i.total_amount THEN 'PAID'
    WHEN COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.invoice_id = i.id), 0) > 0 THEN 'PARTIALLY_PAID'
    WHEN i.due_date < CURRENT_DATE THEN 'OVERDUE'
    ELSE 'PENDING'
END;


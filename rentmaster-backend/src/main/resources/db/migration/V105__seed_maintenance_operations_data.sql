-- Seed Data for Maintenance Operations
-- This file seeds data for Maintenance Requests, Work Orders, and Assets

-- ============================================
-- MAINTENANCE REQUESTS
-- ============================================
INSERT INTO maintenance_requests (property_id, room_id, tenant_id, title, description, category, priority, status, location, preferred_time, allow_entry, assigned_to, estimated_cost, actual_cost, submitted_at, created_at, updated_at)
SELECT 
    p.id,
    r.id,
    t.id,
    title,
    description,
    category,
    priority,
    status,
    location,
    preferred_time,
    allow_entry,
    vend.id,
    estimated_cost,
    actual_cost,
    submitted_at::TIMESTAMP,
    created_at::TIMESTAMP,
    updated_at::TIMESTAMP
FROM (
    VALUES 
        ('Leaky Faucet in Kitchen', 'The kitchen faucet has been dripping continuously for the past week. Water is being wasted.', 'PLUMBING', 'MEDIUM', 'SUBMITTED', 'Kitchen, Unit A101', 'Morning preferred', true, NULL, 500000.0, NULL, (NOW() - INTERVAL '5 days')::TIMESTAMP, (NOW() - INTERVAL '5 days')::TIMESTAMP, (NOW() - INTERVAL '5 days')::TIMESTAMP),
        ('AC Not Working', 'Air conditioning unit stopped working. Room temperature is very high.', 'HVAC', 'HIGH', 'ASSIGNED', 'Bedroom, Unit A102', 'ASAP', true, NULL, 1500000.0, NULL, (NOW() - INTERVAL '3 days')::TIMESTAMP, (NOW() - INTERVAL '3 days')::TIMESTAMP, (NOW() - INTERVAL '1 day')::TIMESTAMP),
        ('Broken Window', 'Window glass is cracked and needs replacement for safety.', 'GENERAL', 'URGENT', 'IN_PROGRESS', 'Living Room, Unit B201', 'Any time', false, NULL, 800000.0, NULL, (NOW() - INTERVAL '2 days')::TIMESTAMP, (NOW() - INTERVAL '2 days')::TIMESTAMP, NOW()::TIMESTAMP),
        ('Electrical Outlet Not Working', 'One of the electrical outlets in the living room is not providing power.', 'ELECTRICAL', 'MEDIUM', 'COMPLETED', 'Living Room, Unit A103', 'Afternoon', true, NULL, 600000.0, 550000.0, (NOW() - INTERVAL '10 days')::TIMESTAMP, (NOW() - INTERVAL '10 days')::TIMESTAMP, (NOW() - INTERVAL '7 days')::TIMESTAMP),
        ('Refrigerator Making Noise', 'Refrigerator is making loud noises and not cooling properly.', 'APPLIANCE', 'HIGH', 'SUBMITTED', 'Kitchen, Unit B202', 'Morning', true, NULL, 1200000.0, NULL, (NOW() - INTERVAL '1 day')::TIMESTAMP, (NOW() - INTERVAL '1 day')::TIMESTAMP, (NOW() - INTERVAL '1 day')::TIMESTAMP),
        ('Toilet Not Flushing', 'Toilet is not flushing properly. Water level is low.', 'PLUMBING', 'URGENT', 'ASSIGNED', 'Bathroom, Unit A104', 'ASAP', true, NULL, 700000.0, NULL, NOW()::TIMESTAMP, NOW()::TIMESTAMP, NOW()::TIMESTAMP),
        ('Door Lock Broken', 'Main door lock is jammed and cannot be opened from outside.', 'GENERAL', 'EMERGENCY', 'IN_PROGRESS', 'Main Entrance, Unit C301', 'Immediate', false, NULL, 400000.0, NULL, (NOW() - INTERVAL '4 hours')::TIMESTAMP, (NOW() - INTERVAL '4 hours')::TIMESTAMP, (NOW() - INTERVAL '2 hours')::TIMESTAMP),
        ('Water Heater Not Working', 'No hot water coming from the water heater.', 'PLUMBING', 'HIGH', 'SUBMITTED', 'Bathroom, Unit B203', 'Morning', true, NULL, 2000000.0, NULL, (NOW() - INTERVAL '6 hours')::TIMESTAMP, (NOW() - INTERVAL '6 hours')::TIMESTAMP, (NOW() - INTERVAL '6 hours')::TIMESTAMP)
) AS mr_data(title, description, category, priority, status, location, preferred_time, allow_entry, vendor_name, estimated_cost, actual_cost, submitted_at, created_at, updated_at)
CROSS JOIN LATERAL (
    -- Use the first property for all demo maintenance requests
    SELECT id FROM properties ORDER BY id LIMIT 1
) p
CROSS JOIN LATERAL (
    -- Use the first room of that property for location context
    SELECT id FROM rooms WHERE property_id = p.id ORDER BY id LIMIT 1
) r
CROSS JOIN LATERAL (
    -- Use the first tenant as the requester (for demo purposes)
    SELECT id FROM tenants ORDER BY id LIMIT 1
) t
LEFT JOIN LATERAL (
    SELECT id FROM vendors WHERE name = mr_data.vendor_name LIMIT 1
) vend ON mr_data.vendor_name IS NOT NULL;

-- Update assigned_to for some requests
UPDATE maintenance_requests 
SET assigned_to = (SELECT id FROM vendors WHERE name = 'TechFix Solutions' LIMIT 1)
WHERE title = 'AC Not Working';

UPDATE maintenance_requests 
SET assigned_to = (SELECT id FROM vendors WHERE name = 'PlumbPro Services' LIMIT 1)
WHERE title IN ('Leaky Faucet in Kitchen', 'Toilet Not Flushing', 'Water Heater Not Working');

UPDATE maintenance_requests 
SET assigned_to = (SELECT id FROM vendors WHERE name = 'General Maintenance Co.' LIMIT 1)
WHERE title IN ('Broken Window', 'Door Lock Broken');

-- ============================================
-- WORK ORDERS
-- ============================================
INSERT INTO work_orders (work_order_number, property_id, maintenance_request_id, vendor_id, title, description, work_type, priority, status, scheduled_date, estimated_duration, estimated_cost, actual_cost, location, completion_notes, created_at, updated_at)
SELECT 
    'WO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(ROW_NUMBER() OVER()::TEXT, 5, '0'),
    p.id,
    mr.id,
    vend.id,
    title,
    description,
    work_type,
    priority,
    status,
    scheduled_date::TIMESTAMP,
    estimated_duration,
    estimated_cost,
    actual_cost,
    location,
    completion_notes,
    created_at::TIMESTAMP,
    updated_at::TIMESTAMP
FROM (
    VALUES 
        ('Fix Leaky Faucet', 'Replace faucet cartridge and fix leak', 'REPAIR', 'MEDIUM', 'PENDING', (NOW() + INTERVAL '2 days')::TIMESTAMP, 60, 500000.0, NULL, 'Kitchen, Unit A101', NULL, (NOW() - INTERVAL '1 day')::TIMESTAMP, (NOW() - INTERVAL '1 day')::TIMESTAMP),
        ('AC Unit Repair', 'Diagnose and repair air conditioning unit', 'REPAIR', 'HIGH', 'ASSIGNED', (NOW() + INTERVAL '1 day')::TIMESTAMP, 120, 1500000.0, NULL, 'Bedroom, Unit A102', NULL, (NOW() - INTERVAL '2 days')::TIMESTAMP, (NOW() - INTERVAL '1 day')::TIMESTAMP),
        ('Window Replacement', 'Replace broken window glass', 'REPAIR', 'URGENT', 'IN_PROGRESS', NOW()::TIMESTAMP, 90, 800000.0, NULL, 'Living Room, Unit B201', NULL, (NOW() - INTERVAL '1 day')::TIMESTAMP, NOW()::TIMESTAMP),
        ('Electrical Outlet Repair', 'Fix electrical outlet wiring', 'REPAIR', 'MEDIUM', 'COMPLETED', (NOW() - INTERVAL '8 days')::TIMESTAMP, 45, 600000.0, 550000.0, 'Living Room, Unit A103', 'Outlet repaired successfully. Tested and working.', (NOW() - INTERVAL '9 days')::TIMESTAMP, (NOW() - INTERVAL '7 days')::TIMESTAMP),
        ('Refrigerator Service', 'Service and repair refrigerator', 'MAINTENANCE', 'HIGH', 'PENDING', (NOW() + INTERVAL '3 days')::TIMESTAMP, 90, 1200000.0, NULL, 'Kitchen, Unit B202', NULL, NOW()::TIMESTAMP, NOW()::TIMESTAMP),
        ('Toilet Repair', 'Fix toilet flushing mechanism', 'REPAIR', 'URGENT', 'ASSIGNED', (NOW() + INTERVAL '6 hours')::TIMESTAMP, 60, 700000.0, NULL, 'Bathroom, Unit A104', NULL, (NOW() - INTERVAL '2 hours')::TIMESTAMP, (NOW() - INTERVAL '1 hour')::TIMESTAMP),
        ('Door Lock Replacement', 'Replace jammed door lock', 'REPAIR', 'EMERGENCY', 'IN_PROGRESS', NOW()::TIMESTAMP, 30, 400000.0, NULL, 'Main Entrance, Unit C301', NULL, (NOW() - INTERVAL '3 hours')::TIMESTAMP, (NOW() - INTERVAL '1 hour')::TIMESTAMP)
) AS wo_data(title, description, work_type, priority, status, scheduled_date, estimated_duration, estimated_cost, actual_cost, location, completion_notes, created_at, updated_at)
CROSS JOIN LATERAL (
    -- Use the first property for all demo work orders
    SELECT id FROM properties ORDER BY id LIMIT 1
) p
CROSS JOIN LATERAL (
    -- Link to any existing maintenance request for that property
    SELECT id FROM maintenance_requests WHERE property_id = p.id ORDER BY id LIMIT 1
) mr
CROSS JOIN LATERAL (
    -- Use the first vendor as default (will be overridden by updates below)
    SELECT id FROM vendors ORDER BY id LIMIT 1
) vend;

-- Update vendor_id for specific work orders
UPDATE work_orders wo
SET vendor_id = (SELECT id FROM vendors WHERE name = 'PlumbPro Services' LIMIT 1)
WHERE wo.title IN ('Fix Leaky Faucet', 'Toilet Repair');

UPDATE work_orders wo
SET vendor_id = (SELECT id FROM vendors WHERE name = 'TechFix Solutions' LIMIT 1)
WHERE wo.title IN ('AC Unit Repair', 'Electrical Outlet Repair');

UPDATE work_orders wo
SET vendor_id = (SELECT id FROM vendors WHERE name = 'General Maintenance Co.' LIMIT 1)
WHERE wo.title IN ('Window Replacement', 'Door Lock Replacement');

-- ============================================
-- ASSETS
-- ============================================
INSERT INTO assets (property_id, room_id, asset_code, name, category, brand, model, serial_number, purchase_date, purchase_price, warranty_expiry_date, current_value, depreciation_rate, location, status, condition, last_maintenance_date, next_maintenance_date, maintenance_interval_days, notes, created_at, updated_at)
SELECT 
    p.id,
    r.id,
    asset_code,
    name,
    category,
    brand,
    model,
    serial_number,
    purchase_date::DATE,
    purchase_price,
    warranty_expiry_date::DATE,
    current_value,
    depreciation_rate,
    location,
    status,
    condition,
    last_maintenance_date::DATE,
    next_maintenance_date::DATE,
    maintenance_interval_days,
    notes,
    created_at::TIMESTAMP,
    updated_at::TIMESTAMP
FROM (
    VALUES 
        ('AC-001', 'Air Conditioner Unit', 'HVAC', 'Daikin', 'FTXS35LVMA', 'DK-2023-001', (NOW() - INTERVAL '6 months')::DATE, 15000000.0, (NOW() + INTERVAL '18 months')::DATE, 13500000.0, 10.0, 'Living Room, Unit A101', 'ACTIVE', 'EXCELLENT', (NOW() - INTERVAL '2 months')::DATE, (NOW() + INTERVAL '4 months')::DATE, 180, 'Regular maintenance required', (NOW() - INTERVAL '6 months')::TIMESTAMP, (NOW() - INTERVAL '2 months')::TIMESTAMP),
        ('FR-001', 'Refrigerator', 'APPLIANCE', 'Samsung', 'RT32K5030S8', 'SAM-2023-002', (NOW() - INTERVAL '8 months')::DATE, 12000000.0, (NOW() + INTERVAL '16 months')::DATE, 10800000.0, 10.0, 'Kitchen, Unit A102', 'ACTIVE', 'GOOD', (NOW() - INTERVAL '3 months')::DATE, (NOW() + INTERVAL '3 months')::DATE, 180, NULL, (NOW() - INTERVAL '8 months')::TIMESTAMP, (NOW() - INTERVAL '3 months')::TIMESTAMP),
        ('WH-001', 'Water Heater', 'PLUMBING', 'Ariston', 'ANDRIS LUX 1.5', 'AR-2023-003', (NOW() - INTERVAL '1 year')::DATE, 8000000.0, (NOW() + INTERVAL '1 year')::DATE, 7200000.0, 10.0, 'Bathroom, Unit B201', 'ACTIVE', 'GOOD', (NOW() - INTERVAL '4 months')::DATE, (NOW() + INTERVAL '2 months')::DATE, 180, NULL, (NOW() - INTERVAL '1 year')::TIMESTAMP, (NOW() - INTERVAL '4 months')::TIMESTAMP),
        ('WM-001', 'Washing Machine', 'APPLIANCE', 'LG', 'WM3900HWA', 'LG-2023-004', (NOW() - INTERVAL '10 months')::DATE, 10000000.0, (NOW() + INTERVAL '14 months')::DATE, 9000000.0, 10.0, 'Laundry Area, Unit B202', 'ACTIVE', 'GOOD', (NOW() - INTERVAL '2 months')::DATE, (NOW() + INTERVAL '4 months')::DATE, 180, NULL, (NOW() - INTERVAL '10 months')::TIMESTAMP, (NOW() - INTERVAL '2 months')::TIMESTAMP),
        ('TV-001', 'Smart TV', 'APPLIANCE', 'Sony', 'KD-55X80K', 'SONY-2023-005', (NOW() - INTERVAL '4 months')::DATE, 18000000.0, (NOW() + INTERVAL '20 months')::DATE, 17280000.0, 10.0, 'Living Room, Unit C301', 'ACTIVE', 'EXCELLENT', NULL, (NOW() + INTERVAL '8 months')::DATE, 365, NULL, (NOW() - INTERVAL '4 months')::TIMESTAMP, (NOW() - INTERVAL '4 months')::TIMESTAMP),
        ('EL-001', 'Elevator System', 'HVAC', 'Otis', 'Gen2', 'OTIS-2022-001', (NOW() - INTERVAL '2 years')::DATE, 500000000.0, (NOW() + INTERVAL '1 year')::DATE, 400000000.0, 10.0, 'Building Lobby', 'ACTIVE', 'GOOD', (NOW() - INTERVAL '1 month')::DATE, (NOW() + INTERVAL '5 months')::DATE, 180, 'Regular elevator maintenance', (NOW() - INTERVAL '2 years')::TIMESTAMP, (NOW() - INTERVAL '1 month')::TIMESTAMP),
        ('AC-002', 'Air Conditioner Unit', 'HVAC', 'Mitsubishi', 'MSZ-AP25VG', 'MIT-2023-006', (NOW() - INTERVAL '5 months')::DATE, 14000000.0, (NOW() + INTERVAL '19 months')::DATE, 12600000.0, 10.0, 'Bedroom, Unit A103', 'MAINTENANCE', 'FAIR', (NOW() - INTERVAL '1 month')::DATE, (NOW() + INTERVAL '5 months')::DATE, 180, 'Needs servicing', (NOW() - INTERVAL '5 months')::TIMESTAMP, (NOW() - INTERVAL '1 month')::TIMESTAMP),
        ('FR-002', 'Refrigerator', 'APPLIANCE', 'Panasonic', 'NR-BL277PSL', 'PAN-2022-007', (NOW() - INTERVAL '18 months')::DATE, 11000000.0, NULL, 8800000.0, 10.0, 'Kitchen, Unit A104', 'REPAIR', 'POOR', (NOW() - INTERVAL '6 months')::DATE, NULL, 180, 'Warranty expired, needs repair', (NOW() - INTERVAL '18 months')::TIMESTAMP, (NOW() - INTERVAL '6 months')::TIMESTAMP),
        ('WH-002', 'Water Heater', 'PLUMBING', 'Ferroli', 'REX 1.5', 'FER-2022-008', (NOW() - INTERVAL '20 months')::DATE, 7500000.0, NULL, 6000000.0, 10.0, 'Bathroom, Unit B203', 'ACTIVE', 'GOOD', (NOW() - INTERVAL '3 months')::DATE, (NOW() + INTERVAL '3 months')::DATE, 180, NULL, (NOW() - INTERVAL '20 months')::TIMESTAMP, (NOW() - INTERVAL '3 months')::TIMESTAMP),
        ('SEC-001', 'Security Camera System', 'SECURITY', 'Hikvision', 'DS-2CD2T47G1-L', 'HIK-2023-009', (NOW() - INTERVAL '3 months')::DATE, 25000000.0, (NOW() + INTERVAL '21 months')::DATE, 24000000.0, 10.0, 'Building Entrance', 'ACTIVE', 'EXCELLENT', NULL, (NOW() + INTERVAL '9 months')::DATE, 365, '4K security camera system', (NOW() - INTERVAL '3 months')::TIMESTAMP, (NOW() - INTERVAL '3 months')::TIMESTAMP)
) AS asset_data(asset_code, name, category, brand, model, serial_number, purchase_date, purchase_price, warranty_expiry_date, current_value, depreciation_rate, location, status, condition, last_maintenance_date, next_maintenance_date, maintenance_interval_days, notes, created_at, updated_at)
CROSS JOIN LATERAL (
    -- Use the first property for all demo assets
    SELECT id FROM properties ORDER BY id LIMIT 1
) p
LEFT JOIN LATERAL (
    -- For unit-specific assets, pick the first room of the property; building-level assets keep room_id NULL
    SELECT id FROM rooms 
    WHERE property_id = p.id 
      AND asset_data.location NOT LIKE '%Building%' 
      AND asset_data.location NOT LIKE '%Lobby%' 
      AND asset_data.location NOT LIKE '%Entrance%' 
    ORDER BY id LIMIT 1
) r ON true;

-- For assets without rooms (building-level assets)
UPDATE assets 
SET room_id = NULL 
WHERE location LIKE '%Building%' OR location LIKE '%Lobby%' OR location LIKE '%Entrance%';


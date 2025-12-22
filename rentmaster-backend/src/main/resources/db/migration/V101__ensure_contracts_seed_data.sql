-- Ensure Contracts Seed Data
-- This migration ensures contracts are properly seeded with organization references
-- It uses subqueries to reference existing data dynamically

-- First, ensure all existing contracts have organization_id set
UPDATE contracts c
SET organization_id = p.organization_id
FROM rooms r
JOIN properties p ON r.property_id = p.id
WHERE c.room_id = r.id
AND (c.organization_id IS NULL OR c.organization_id != p.organization_id);

-- Insert contracts for occupied rooms that don't have active contracts
-- Use a simpler approach with a CTE to assign tenants sequentially
WITH available_rooms AS (
    SELECT 
        r.id AS room_id,
        r.base_rent,
        p.organization_id,
        ROW_NUMBER() OVER (ORDER BY r.id) AS rn
    FROM rooms r
    JOIN properties p ON r.property_id = p.id
    WHERE r.status = 'OCCUPIED'
    AND p.organization_id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM contracts c 
        WHERE c.room_id = r.id 
        AND c.status = 'ACTIVE'
    )
),
available_tenants AS (
    SELECT 
        t.id AS tenant_id,
        ROW_NUMBER() OVER (ORDER BY t.id) AS rn
    FROM tenants t
    WHERE t.id NOT IN (
        SELECT DISTINCT primary_tenant_id 
        FROM contracts 
        WHERE primary_tenant_id IS NOT NULL
    )
    OR t.id IN (
        SELECT id FROM tenants 
        ORDER BY id 
        LIMIT (SELECT COUNT(*) FROM available_rooms)
    )
)
INSERT INTO contracts (
    code, 
    room_id, 
    primary_tenant_id, 
    organization_id,
    start_date, 
    end_date, 
    rent_amount, 
    deposit_amount, 
    billing_cycle, 
    status, 
    created_at
)
SELECT 
    'CT-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(
        ((SELECT COALESCE(MAX(
            CAST(SUBSTRING(code FROM '[0-9]+$') AS INTEGER)
        ), 0) 
          FROM contracts 
          WHERE code LIKE 'CT-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-%') + 
         ar.rn)::TEXT, 3, '0'),
    ar.room_id,
    COALESCE(at.tenant_id, (SELECT id FROM tenants ORDER BY id LIMIT 1 OFFSET (ar.rn - 1) % GREATEST((SELECT COUNT(*) FROM tenants), 1))),
    ar.organization_id,
    (CURRENT_DATE - (90 + (ar.rn % 60))::INTEGER)::DATE,
    (CURRENT_DATE + (180 + (ar.rn % 180))::INTEGER)::DATE,
    ar.base_rent,
    ar.base_rent * 2.0,
    'MONTHLY',
    'ACTIVE',
    (NOW() - (90 + (ar.rn % 60))::INTEGER * INTERVAL '1 day')::TIMESTAMP
FROM available_rooms ar
LEFT JOIN available_tenants at ON ar.rn = at.rn
LIMIT 30
ON CONFLICT (code) DO NOTHING;


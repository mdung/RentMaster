-- Direct Contracts Seed Data
-- This migration creates contracts directly for existing rooms and tenants
-- It's simpler and more reliable than V101

-- First, ensure we have at least one organization
DO $$
DECLARE
    org_id BIGINT;
BEGIN
    -- Get the first organization or create a default one
    SELECT id INTO org_id FROM organizations LIMIT 1;
    
    IF org_id IS NULL THEN
        INSERT INTO organizations (name, code, active, created_at)
        VALUES ('Default Organization', 'DEFAULT', true, NOW())
        RETURNING id INTO org_id;
    END IF;

    -- Insert contracts for rooms that have tenants
    -- Use a simpler approach: just create contracts for the first few rooms
    WITH room_numbers AS (
        SELECT 
            r.id AS room_id,
            r.base_rent,
            p.organization_id,
            ROW_NUMBER() OVER (ORDER BY r.id) AS rn
        FROM rooms r
        JOIN properties p ON r.property_id = p.id
        WHERE r.status = 'OCCUPIED'
          AND NOT EXISTS (
              SELECT 1 FROM contracts c 
              WHERE c.room_id = r.id 
              AND c.status = 'ACTIVE'
          )
    ),
    tenant_count AS (
        SELECT GREATEST(COUNT(*), 1) AS cnt FROM tenants
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
            ((SELECT COALESCE(MAX(CAST(SUBSTRING(code FROM '[0-9]+$') AS INTEGER)), 0) 
              FROM contracts 
              WHERE code LIKE 'CT-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-%') + 
             rn)::TEXT, 3, '0') AS code,
        rn.room_id,
        COALESCE(
            (SELECT t.id FROM tenants t ORDER BY t.id LIMIT 1 OFFSET ((rn.rn - 1) % tc.cnt)),
            (SELECT id FROM tenants ORDER BY id LIMIT 1)
        ) AS primary_tenant_id,
        COALESCE(rn.organization_id, org_id) AS organization_id,
        (CURRENT_DATE - INTERVAL '30 days')::DATE AS start_date,
        (CURRENT_DATE + INTERVAL '335 days')::DATE AS end_date,
        COALESCE(rn.base_rent, 5000000.0) AS rent_amount,
        COALESCE(rn.base_rent * 2.0, 10000000.0) AS deposit_amount,
        'MONTHLY' AS billing_cycle,
        'ACTIVE' AS status,
        (NOW() - INTERVAL '30 days')::TIMESTAMP AS created_at
    FROM room_numbers rn
    CROSS JOIN tenant_count tc
    WHERE EXISTS (SELECT 1 FROM tenants LIMIT 1) -- Ensure we have at least one tenant
    LIMIT 20
    ON CONFLICT (code) DO NOTHING;

    -- If no contracts were created (no occupied rooms), create contracts for available rooms too
    IF NOT EXISTS (SELECT 1 FROM contracts LIMIT 1) THEN
        WITH room_numbers AS (
            SELECT 
                r.id AS room_id,
                r.base_rent,
                p.organization_id,
                ROW_NUMBER() OVER (ORDER BY r.id) AS rn
            FROM rooms r
            JOIN properties p ON r.property_id = p.id
            WHERE NOT EXISTS (
                SELECT 1 FROM contracts c 
                WHERE c.room_id = r.id 
                AND c.status = 'ACTIVE'
            )
        ),
        tenant_count AS (
            SELECT GREATEST(COUNT(*), 1) AS cnt FROM tenants
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
                ((SELECT COALESCE(MAX(CAST(SUBSTRING(code FROM '[0-9]+$') AS INTEGER)), 0) 
                  FROM contracts 
                  WHERE code LIKE 'CT-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-%') + 
                 rn.rn)::TEXT, 3, '0') AS code,
            rn.room_id,
            (SELECT id FROM tenants ORDER BY id LIMIT 1 OFFSET ((rn.rn - 1) % tc.cnt)) AS primary_tenant_id,
            COALESCE(rn.organization_id, org_id) AS organization_id,
            (CURRENT_DATE - INTERVAL '30 days')::DATE AS start_date,
            (CURRENT_DATE + INTERVAL '335 days')::DATE AS end_date,
            COALESCE(rn.base_rent, 5000000.0) AS rent_amount,
            COALESCE(rn.base_rent * 2.0, 10000000.0) AS deposit_amount,
            'MONTHLY' AS billing_cycle,
            'ACTIVE' AS status,
            (NOW() - INTERVAL '30 days')::TIMESTAMP AS created_at
        FROM room_numbers rn
        CROSS JOIN tenant_count tc
        WHERE EXISTS (SELECT 1 FROM tenants LIMIT 1)
        LIMIT 10
        ON CONFLICT (code) DO NOTHING;
    END IF;
END $$;


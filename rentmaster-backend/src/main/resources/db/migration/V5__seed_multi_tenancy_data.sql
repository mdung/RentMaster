-- Seed data for multi-tenancy
-- Create multiple organizations
INSERT INTO organizations (code, name, display_name, description, type, status, contact_email, contact_phone, subscription_plan, primary_color, secondary_color, created_at, updated_at)
VALUES
    ('ORG001', 'Premier Properties', 'Premier Properties Management', 'Leading property management company in the city', 'PROPERTY_MANAGEMENT_COMPANY', 'ACTIVE', 'contact@premierproperties.com', '+1-555-0101', 'PROFESSIONAL', '#3b82f6', '#60a5fa', NOW(), NOW()),
    ('ORG002', 'Sunset Realty', 'Sunset Realty Group', 'Family-owned real estate agency specializing in residential properties', 'REAL_ESTATE_AGENCY', 'ACTIVE', 'info@sunsetrealty.com', '+1-555-0102', 'BASIC', '#f59e0b', '#fbbf24', NOW(), NOW()),
    ('ORG003', 'Green Valley Housing', 'Green Valley Housing Authority', 'Government housing authority managing affordable housing units', 'GOVERNMENT_HOUSING', 'ACTIVE', 'admin@greenvalley.gov', '+1-555-0103', 'ENTERPRISE', '#10b981', '#34d399', NOW(), NOW()),
    ('ORG004', 'Metro Apartments', 'Metro Apartments LLC', 'Individual landlord managing multiple apartment buildings', 'INDIVIDUAL_LANDLORD', 'ACTIVE', 'owner@metroapts.com', '+1-555-0104', 'BASIC', '#8b5cf6', '#a78bfa', NOW(), NOW()),
    ('ORG005', 'Community Housing Co-op', 'Community Housing Cooperative', 'Non-profit organization providing affordable housing', 'NON_PROFIT', 'ACTIVE', 'contact@communitycoop.org', '+1-555-0105', 'BASIC', '#ef4444', '#f87171', NOW(), NOW());

-- Update existing users to belong to organizations
UPDATE users SET organization_id = (SELECT id FROM organizations WHERE code = 'ORG001' LIMIT 1), default_organization_id = (SELECT id FROM organizations WHERE code = 'ORG001' LIMIT 1) WHERE username = 'admin';

-- Create additional users for different organizations
INSERT INTO users (username, password, full_name, email, role, active, organization_id, default_organization_id, created_at)
VALUES
    ('manager1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Manager', 'manager1@premierproperties.com', 'ADMIN', true, (SELECT id FROM organizations WHERE code = 'ORG001' LIMIT 1), (SELECT id FROM organizations WHERE code = 'ORG001' LIMIT 1), NOW()),
    ('staff1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Staff', 'staff1@premierproperties.com', 'STAFF', true, (SELECT id FROM organizations WHERE code = 'ORG001' LIMIT 1), (SELECT id FROM organizations WHERE code = 'ORG001' LIMIT 1), NOW()),
    ('realtor1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bob Realtor', 'bob@sunsetrealty.com', 'ADMIN', true, (SELECT id FROM organizations WHERE code = 'ORG002' LIMIT 1), (SELECT id FROM organizations WHERE code = 'ORG002' LIMIT 1), NOW()),
    ('admin2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin Two', 'admin@greenvalley.gov', 'ADMIN', true, (SELECT id FROM organizations WHERE code = 'ORG003' LIMIT 1), (SELECT id FROM organizations WHERE code = 'ORG003' LIMIT 1), NOW())
ON CONFLICT (username) DO UPDATE SET 
    organization_id = EXCLUDED.organization_id,
    default_organization_id = EXCLUDED.default_organization_id;

-- Create user_organizations relationships
INSERT INTO user_organizations (user_id, organization_id, role, is_default, assigned_at)
SELECT u.id, o.id, 'ADMIN', true, NOW()
FROM users u
CROSS JOIN organizations o
WHERE u.organization_id = o.id;

-- Update existing properties to belong to organizations
UPDATE properties SET organization_id = (SELECT id FROM organizations WHERE code = 'ORG001' LIMIT 1) WHERE id IN (1, 2, 3);
UPDATE properties SET organization_id = (SELECT id FROM organizations WHERE code = 'ORG002' LIMIT 1) WHERE id IN (4, 5);

-- Create additional properties for other organizations
INSERT INTO properties (name, address, description, organization_id, created_at)
VALUES
    ('Green Valley Complex', '123 Housing Ave', 'Affordable housing complex', (SELECT id FROM organizations WHERE code = 'ORG003' LIMIT 1), NOW()),
    ('Metro Tower', '456 Metro St', 'High-rise apartment building', (SELECT id FROM organizations WHERE code = 'ORG004' LIMIT 1), NOW()),
    ('Community Gardens', '789 Community Way', 'Cooperative housing community', (SELECT id FROM organizations WHERE code = 'ORG005' LIMIT 1), NOW());

-- Update existing tenants to belong to organizations
UPDATE tenants SET organization_id = (SELECT id FROM organizations WHERE code = 'ORG001' LIMIT 1) WHERE id <= 5;
UPDATE tenants SET organization_id = (SELECT id FROM organizations WHERE code = 'ORG002' LIMIT 1) WHERE id > 5 AND id <= 10;

-- Create additional tenants for other organizations
INSERT INTO tenants (full_name, phone, email, id_number, address, organization_id, created_at)
VALUES
    ('Sarah Tenant', '+1-555-2001', 'sarah@example.com', 'ID2001', '123 Green Valley', (SELECT id FROM organizations WHERE code = 'ORG003' LIMIT 1), NOW()),
    ('Mike Tenant', '+1-555-2002', 'mike@example.com', 'ID2002', '456 Metro St', (SELECT id FROM organizations WHERE code = 'ORG004' LIMIT 1), NOW()),
    ('Lisa Tenant', '+1-555-2003', 'lisa@example.com', 'ID2003', '789 Community Way', (SELECT id FROM organizations WHERE code = 'ORG005' LIMIT 1), NOW());

-- Update existing services to belong to organizations
UPDATE services SET organization_id = (SELECT id FROM organizations WHERE code = 'ORG001' LIMIT 1) WHERE id <= 3;
UPDATE services SET organization_id = (SELECT id FROM organizations WHERE code = 'ORG002' LIMIT 1) WHERE id > 3;

-- Create additional services for other organizations
INSERT INTO services (name, type, pricing_model, unit_price, unit_name, active, organization_id)
VALUES
    ('Water Service', 'UTILITY', 'PER_UNIT', 2.50, 'm³', true, (SELECT id FROM organizations WHERE code = 'ORG003' LIMIT 1)),
    ('Parking Fee', 'OTHER', 'FIXED', 50.00, 'month', true, (SELECT id FROM organizations WHERE code = 'ORG004' LIMIT 1)),
    ('Community Fee', 'OTHER', 'FIXED', 25.00, 'month', true, (SELECT id FROM organizations WHERE code = 'ORG005' LIMIT 1));

-- Update contracts to belong to organizations (inherited from properties)
UPDATE contracts c
SET organization_id = p.organization_id
FROM rooms r
JOIN properties p ON r.property_id = p.id
WHERE c.room_id = r.id;

-- Update invoices to belong to organizations (inherited from contracts)
UPDATE invoices i
SET organization_id = c.organization_id
FROM contracts c
WHERE i.contract_id = c.id;

-- Create default roles and permissions (simplified)
INSERT INTO permissions (code, name, description, category, type, resource, action, is_system_permission, is_active, created_at, updated_at)
VALUES
    ('PROPERTY_READ', 'View Properties', 'View property information', 'PROPERTY_MANAGEMENT', 'READ', 'property', 'read', true, true, NOW(), NOW()),
    ('PROPERTY_WRITE', 'Manage Properties', 'Create and update properties', 'PROPERTY_MANAGEMENT', 'CREATE', 'property', 'write', true, true, NOW(), NOW()),
    ('TENANT_READ', 'View Tenants', 'View tenant information', 'TENANT_MANAGEMENT', 'READ', 'tenant', 'read', true, true, NOW(), NOW()),
    ('TENANT_WRITE', 'Manage Tenants', 'Create and update tenants', 'TENANT_MANAGEMENT', 'CREATE', 'tenant', 'write', true, true, NOW(), NOW()),
    ('CONTRACT_READ', 'View Contracts', 'View contract information', 'CONTRACT_MANAGEMENT', 'READ', 'contract', 'read', true, true, NOW(), NOW()),
    ('CONTRACT_WRITE', 'Manage Contracts', 'Create and update contracts', 'CONTRACT_MANAGEMENT', 'CREATE', 'contract', 'write', true, true, NOW(), NOW()),
    ('INVOICE_READ', 'View Invoices', 'View invoice information', 'FINANCIAL_MANAGEMENT', 'READ', 'invoice', 'read', true, true, NOW(), NOW()),
    ('INVOICE_WRITE', 'Manage Invoices', 'Create and update invoices', 'FINANCIAL_MANAGEMENT', 'CREATE', 'invoice', 'write', true, true, NOW(), NOW()),
    ('ORG_MANAGE', 'Manage Organization', 'Manage organization settings', 'ORGANIZATION_MANAGEMENT', 'UPDATE', 'organization', 'manage', true, true, NOW(), NOW());

-- Create default roles
INSERT INTO roles (name, code, description, type, scope, is_system_role, is_default, is_active, created_at, updated_at)
VALUES
    ('Organization Admin', 'ORG_ADMIN', 'Full access to organization', 'ORGANIZATION_ADMIN', 'ORGANIZATION', true, true, true, NOW(), NOW()),
    ('Property Manager', 'PROPERTY_MANAGER', 'Manage properties and tenants', 'PROPERTY_MANAGER', 'ORGANIZATION', true, true, true, NOW(), NOW()),
    ('Staff', 'STAFF', 'Limited access for staff members', 'VIEWER', 'ORGANIZATION', true, true, true, NOW(), NOW());

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id, grant_type, is_active, granted_at)
SELECT r.id, p.id, 'ALLOW', true, NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'ORG_ADMIN';

INSERT INTO role_permissions (role_id, permission_id, grant_type, is_active, granted_at)
SELECT r.id, p.id, 'ALLOW', true, NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'PROPERTY_MANAGER' AND p.code IN ('PROPERTY_READ', 'PROPERTY_WRITE', 'TENANT_READ', 'TENANT_WRITE', 'CONTRACT_READ', 'CONTRACT_WRITE', 'INVOICE_READ', 'INVOICE_WRITE');

INSERT INTO role_permissions (role_id, permission_id, grant_type, is_active, granted_at)
SELECT r.id, p.id, 'ALLOW', true, NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'STAFF' AND (p.code LIKE '%_READ' OR p.code = 'PROPERTY_READ' OR p.code = 'TENANT_READ' OR p.code = 'CONTRACT_READ' OR p.code = 'INVOICE_READ');


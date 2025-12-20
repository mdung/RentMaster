-- Multi-tenancy schema migration
-- Add organizations table
CREATE TABLE organizations (
    id                  BIGSERIAL PRIMARY KEY,
    code                VARCHAR(100) UNIQUE NOT NULL,
    name                VARCHAR(255) NOT NULL,
    display_name        VARCHAR(255),
    description         TEXT,
    type                VARCHAR(50) NOT NULL,
    status              VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    contact_email       VARCHAR(200),
    contact_phone       VARCHAR(50),
    website_url         VARCHAR(500),
    address             TEXT,
    city                VARCHAR(100),
    state               VARCHAR(100),
    postal_code         VARCHAR(20),
    country             VARCHAR(100),
    tax_id              VARCHAR(100),
    business_license    VARCHAR(100),
    registration_number VARCHAR(100),
    subscription_plan   VARCHAR(50),
    subscription_start_date TIMESTAMP,
    subscription_end_date TIMESTAMP,
    trial_end_date      TIMESTAMP,
    is_trial            BOOLEAN DEFAULT FALSE,
    max_properties      INT,
    max_users           INT,
    max_tenants         INT,
    max_storage_gb       INT,
    features_enabled     TEXT,
    custom_domain       VARCHAR(255),
    logo_url            VARCHAR(500),
    favicon_url         VARCHAR(500),
    primary_color       VARCHAR(20),
    secondary_color     VARCHAR(20),
    custom_css          TEXT,
    database_schema     VARCHAR(100),
    database_prefix     VARCHAR(50),
    parent_organization_id BIGINT REFERENCES organizations(id),
    created_by          BIGINT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by          BIGINT,
    updated_at          TIMESTAMP,
    deleted_at          TIMESTAMP
);

-- Add organization_id to users table
ALTER TABLE users ADD COLUMN organization_id BIGINT REFERENCES organizations(id);
ALTER TABLE users ADD COLUMN default_organization_id BIGINT REFERENCES organizations(id);

-- Create user_organizations join table (many-to-many)
CREATE TABLE user_organizations (
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role            VARCHAR(50) NOT NULL DEFAULT 'STAFF',
    is_default      BOOLEAN DEFAULT FALSE,
    assigned_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    assigned_by     BIGINT,
    PRIMARY KEY (user_id, organization_id)
);

-- Add organization_id to all tenant-related tables
ALTER TABLE properties ADD COLUMN organization_id BIGINT REFERENCES organizations(id);
ALTER TABLE tenants ADD COLUMN organization_id BIGINT REFERENCES organizations(id);
ALTER TABLE services ADD COLUMN organization_id BIGINT REFERENCES organizations(id);

-- Add organization_id to contracts (inherited from property/tenant)
ALTER TABLE contracts ADD COLUMN organization_id BIGINT REFERENCES organizations(id);

-- Add organization_id to invoices (inherited from contract)
ALTER TABLE invoices ADD COLUMN organization_id BIGINT REFERENCES organizations(id);

-- Create permissions table
CREATE TABLE permissions (
    id                  BIGSERIAL PRIMARY KEY,
    code                VARCHAR(100) UNIQUE NOT NULL,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    category            VARCHAR(50) NOT NULL,
    type                VARCHAR(50) NOT NULL,
    resource            VARCHAR(100) NOT NULL,
    action              VARCHAR(50) NOT NULL,
    parent_permission_id BIGINT REFERENCES permissions(id),
    is_system_permission BOOLEAN DEFAULT FALSE,
    is_active           BOOLEAN DEFAULT TRUE,
    priority_level      INT DEFAULT 0,
    conditions          TEXT,
    constraints         TEXT,
    requires_feature    VARCHAR(100),
    subscription_level  VARCHAR(50),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP
);

-- Create roles table
CREATE TABLE roles (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    code                VARCHAR(100) UNIQUE NOT NULL,
    description         TEXT,
    type                VARCHAR(50) NOT NULL,
    scope               VARCHAR(50) NOT NULL,
    organization_id     BIGINT REFERENCES organizations(id),
    parent_role_id      BIGINT REFERENCES roles(id),
    is_system_role      BOOLEAN DEFAULT FALSE,
    is_default          BOOLEAN DEFAULT FALSE,
    is_active           BOOLEAN DEFAULT TRUE,
    priority_level      INT DEFAULT 0,
    max_users           INT,
    created_by          BIGINT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by          BIGINT,
    updated_at          TIMESTAMP
);

-- Create role_permissions table
CREATE TABLE role_permissions (
    id                  BIGSERIAL PRIMARY KEY,
    role_id             BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id       BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    grant_type          VARCHAR(50) NOT NULL DEFAULT 'ALLOW',
    scope_type          VARCHAR(50),
    scope_id            BIGINT,
    conditions          TEXT,
    valid_from          TIMESTAMP,
    valid_until         TIMESTAMP,
    is_active           BOOLEAN DEFAULT TRUE,
    granted_by          BIGINT,
    granted_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_by          BIGINT,
    revoked_at          TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Create user_roles table (for granular role assignment)
CREATE TABLE user_roles (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id             BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    organization_id    BIGINT REFERENCES organizations(id),
    scope_type          VARCHAR(50),
    scope_id            BIGINT,
    valid_from          TIMESTAMP,
    valid_until         TIMESTAMP,
    is_active           BOOLEAN DEFAULT TRUE,
    is_primary          BOOLEAN DEFAULT FALSE,
    delegated_by        BIGINT,
    delegation_reason   TEXT,
    assigned_by         BIGINT,
    assigned_at         TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_by          BIGINT,
    revoked_at          TIMESTAMP,
    revocation_reason   TEXT
);

-- Create indexes for performance
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_properties_organization_id ON properties(organization_id);
CREATE INDEX idx_tenants_organization_id ON tenants(organization_id);
CREATE INDEX idx_services_organization_id ON services(organization_id);
CREATE INDEX idx_contracts_organization_id ON contracts(organization_id);
CREATE INDEX idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX idx_user_organizations_user_id ON user_organizations(user_id);
CREATE INDEX idx_user_organizations_org_id ON user_organizations(organization_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_org_id ON user_roles(organization_id);


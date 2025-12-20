-- Data Isolation Policies
CREATE TABLE data_isolation_policies (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    entity_type VARCHAR(100) NOT NULL,
    isolation_level VARCHAR(50) NOT NULL,
    access_control VARCHAR(50) NOT NULL,
    allow_cross_org_access BOOLEAN DEFAULT FALSE,
    shared_with_parent BOOLEAN DEFAULT FALSE,
    shared_with_children BOOLEAN DEFAULT FALSE,
    retention_days INTEGER,
    auto_delete_expired BOOLEAN DEFAULT FALSE,
    encryption_required BOOLEAN DEFAULT FALSE,
    encryption_algorithm VARCHAR(100),
    audit_required BOOLEAN DEFAULT TRUE,
    compliance_tags TEXT,
    backup_required BOOLEAN DEFAULT TRUE,
    backup_frequency VARCHAR(50),
    geo_restriction VARCHAR(200),
    custom_rules TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by BIGINT,
    updated_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_data_isolation_policies_organization_id ON data_isolation_policies(organization_id);
CREATE INDEX idx_data_isolation_policies_entity_type ON data_isolation_policies(entity_type);
CREATE INDEX idx_data_isolation_policies_is_active ON data_isolation_policies(is_active);


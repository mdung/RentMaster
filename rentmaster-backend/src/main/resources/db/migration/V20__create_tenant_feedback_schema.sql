-- Tenant Feedback Schema

-- Tenant Feedback
CREATE TABLE tenant_feedback (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    tenant_name VARCHAR(255) NOT NULL,
    property_id BIGINT NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    contract_id BIGINT,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    allow_follow_up BOOLEAN NOT NULL DEFAULT TRUE,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    acknowledged_at TIMESTAMP,
    acknowledged_by BIGINT,
    acknowledged_by_name VARCHAR(255),
    resolved_at TIMESTAMP,
    resolved_by BIGINT,
    resolved_by_name VARCHAR(255),
    response TEXT,
    responded_at TIMESTAMP,
    responded_by BIGINT,
    responded_by_name VARCHAR(255),
    resolution_notes TEXT,
    internal_notes TEXT,
    satisfaction_rating INTEGER,
    satisfaction_comment TEXT,
    requires_action BOOLEAN NOT NULL DEFAULT FALSE,
    action_due_date TIMESTAMP,
    assigned_to BIGINT,
    assigned_to_name VARCHAR(255),
    action_plan TEXT,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Feedback Attachments (collection table)
CREATE TABLE feedback_attachments (
    feedback_id BIGINT NOT NULL REFERENCES tenant_feedback(id) ON DELETE CASCADE,
    attachment_url VARCHAR(500) NOT NULL
);

-- Feedback Tags (collection table)
CREATE TABLE feedback_tags (
    feedback_id BIGINT NOT NULL REFERENCES tenant_feedback(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_tenant_feedback_tenant_id ON tenant_feedback(tenant_id);
CREATE INDEX idx_tenant_feedback_property_id ON tenant_feedback(property_id);
CREATE INDEX idx_tenant_feedback_contract_id ON tenant_feedback(contract_id);
CREATE INDEX idx_tenant_feedback_type ON tenant_feedback(type);
CREATE INDEX idx_tenant_feedback_category ON tenant_feedback(category);
CREATE INDEX idx_tenant_feedback_status ON tenant_feedback(status);
CREATE INDEX idx_tenant_feedback_priority ON tenant_feedback(priority);
CREATE INDEX idx_tenant_feedback_created_at ON tenant_feedback(created_at);
CREATE INDEX idx_tenant_feedback_assigned_to ON tenant_feedback(assigned_to);
CREATE INDEX idx_feedback_attachments_feedback_id ON feedback_attachments(feedback_id);
CREATE INDEX idx_feedback_tags_feedback_id ON feedback_tags(feedback_id);


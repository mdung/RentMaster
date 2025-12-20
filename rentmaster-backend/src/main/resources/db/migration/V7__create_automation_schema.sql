CREATE TABLE automation_rules (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(255) NOT NULL,
    trigger_conditions TEXT,
    actions TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_executed TIMESTAMP,
    execution_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by BIGINT
);

-- Indexes for performance
CREATE INDEX idx_automation_rules_trigger_type ON automation_rules(trigger_type);
CREATE INDEX idx_automation_rules_active ON automation_rules(active);

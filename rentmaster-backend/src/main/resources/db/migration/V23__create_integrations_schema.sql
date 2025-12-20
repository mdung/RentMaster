-- Integrations Schema

-- Integrations
CREATE TABLE integrations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    auto_sync BOOLEAN DEFAULT FALSE,
    sync_frequency_minutes INTEGER DEFAULT 60,
    last_sync_at TIMESTAMP,
    next_sync_at TIMESTAMP,
    sync_status VARCHAR(50) DEFAULT 'IDLE',
    success_count BIGINT DEFAULT 0,
    error_count BIGINT DEFAULT 0,
    last_error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Integration Configuration (collection table for Map<String, String>)
CREATE TABLE integration_configuration (
    integration_id BIGINT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    config_key VARCHAR(255) NOT NULL,
    config_value TEXT,
    PRIMARY KEY (integration_id, config_key)
);

-- Indexes for performance
CREATE INDEX idx_integrations_type ON integrations(type);
CREATE INDEX idx_integrations_is_active ON integrations(is_active);
CREATE INDEX idx_integrations_sync_status ON integrations(sync_status);
CREATE INDEX idx_integrations_next_sync_at ON integrations(next_sync_at);
CREATE INDEX idx_integration_configuration_integration_id ON integration_configuration(integration_id);


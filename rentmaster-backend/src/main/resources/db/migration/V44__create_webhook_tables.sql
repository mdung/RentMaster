-- Webhook Configurations Table
CREATE TABLE webhook_configurations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL DEFAULT 'POST',
    secret_key VARCHAR(255),
    signature_header VARCHAR(100) DEFAULT 'X-Webhook-Signature',
    is_active BOOLEAN DEFAULT TRUE,
    retry_attempts INTEGER DEFAULT 3,
    retry_delay_seconds INTEGER DEFAULT 60,
    timeout_seconds INTEGER DEFAULT 30,
    verify_ssl BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    last_triggered_at TIMESTAMP,
    success_count BIGINT DEFAULT 0,
    failure_count BIGINT DEFAULT 0
);

-- Webhook Event Types (collection table)
CREATE TABLE webhook_event_types (
    webhook_id BIGINT NOT NULL REFERENCES webhook_configurations(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL
);

-- Webhook Headers (collection table)
CREATE TABLE webhook_headers (
    webhook_id BIGINT NOT NULL REFERENCES webhook_configurations(id) ON DELETE CASCADE,
    header_name VARCHAR(255) NOT NULL,
    header_value VARCHAR(500),
    PRIMARY KEY (webhook_id, header_name)
);

-- Webhook Events Table
CREATE TABLE webhook_events (
    id BIGSERIAL PRIMARY KEY,
    configuration_id BIGINT NOT NULL REFERENCES webhook_configurations(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_id VARCHAR(255),
    payload TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    http_status_code INTEGER,
    response TEXT,
    error_message TEXT,
    attempt_count INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    sent_at TIMESTAMP,
    completed_at TIMESTAMP,
    processing_time_ms BIGINT
);

-- Webhook Event Headers (collection table)
CREATE TABLE webhook_event_headers (
    event_id BIGINT NOT NULL REFERENCES webhook_events(id) ON DELETE CASCADE,
    header_name VARCHAR(255) NOT NULL,
    header_value VARCHAR(500),
    PRIMARY KEY (event_id, header_name)
);

-- Indexes for performance
CREATE INDEX idx_webhook_configurations_is_active ON webhook_configurations(is_active);
CREATE INDEX idx_webhook_configurations_url ON webhook_configurations(url);
CREATE INDEX idx_webhook_event_types_webhook_id ON webhook_event_types(webhook_id);
CREATE INDEX idx_webhook_headers_webhook_id ON webhook_headers(webhook_id);
CREATE INDEX idx_webhook_events_configuration_id ON webhook_events(configuration_id);
CREATE INDEX idx_webhook_events_status ON webhook_events(status);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at);
CREATE INDEX idx_webhook_event_headers_event_id ON webhook_event_headers(event_id);


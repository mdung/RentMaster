-- Bulk Communications
CREATE TABLE bulk_communications (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(255) NOT NULL,
    template_id BIGINT,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    scheduled_at TIMESTAMP,
    status VARCHAR(255) NOT NULL,
    total_recipients INTEGER NOT NULL DEFAULT 0,
    sent_count INTEGER NOT NULL DEFAULT 0,
    delivered_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMP
);

CREATE TABLE bulk_communication_recipients (
    bulk_id BIGINT NOT NULL REFERENCES bulk_communications(id) ON DELETE CASCADE,
    recipient_id BIGINT NOT NULL
);

CREATE TABLE bulk_communication_channels (
    bulk_id BIGINT NOT NULL REFERENCES bulk_communications(id) ON DELETE CASCADE,
    channel VARCHAR(255) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_bulk_communications_status ON bulk_communications(status);
CREATE INDEX idx_bulk_communications_scheduled_at ON bulk_communications(scheduled_at);

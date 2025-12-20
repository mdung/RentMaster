-- Payment Intents Table

CREATE TABLE payment_intents (
    id VARCHAR(255) PRIMARY KEY,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_method_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    client_secret VARCHAR(500),
    error_message TEXT,
    metadata TEXT,
    gateway_id BIGINT,
    tenant_id BIGINT,
    invoice_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_payment_intents_status ON payment_intents(status);
CREATE INDEX idx_payment_intents_payment_method_id ON payment_intents(payment_method_id);
CREATE INDEX idx_payment_intents_gateway_id ON payment_intents(gateway_id);
CREATE INDEX idx_payment_intents_tenant_id ON payment_intents(tenant_id);
CREATE INDEX idx_payment_intents_invoice_id ON payment_intents(invoice_id);
CREATE INDEX idx_payment_intents_created_at ON payment_intents(created_at);
CREATE INDEX idx_payment_intents_status_created_at ON payment_intents(status, created_at);
CREATE INDEX idx_payment_intents_currency_status ON payment_intents(currency, status);


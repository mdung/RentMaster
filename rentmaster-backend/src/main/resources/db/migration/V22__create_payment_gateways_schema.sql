-- Payment Gateways Schema

-- Payment Gateways
CREATE TABLE payment_gateways (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    processing_fee DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    fee_type VARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE',
    min_amount DOUBLE PRECISION,
    max_amount DOUBLE PRECISION,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    configuration TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Gateway Supported Methods (collection table)
CREATE TABLE gateway_supported_methods (
    gateway_id BIGINT NOT NULL REFERENCES payment_gateways(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_payment_gateways_type ON payment_gateways(type);
CREATE INDEX idx_payment_gateways_is_active ON payment_gateways(is_active);
CREATE INDEX idx_gateway_supported_methods_gateway_id ON gateway_supported_methods(gateway_id);


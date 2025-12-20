-- Financial Tables Schema

-- Deposits
CREATE TABLE deposits (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    contract_code VARCHAR(100) NOT NULL,
    tenant_name VARCHAR(255) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    deposit_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'HELD',
    refund_date DATE,
    refund_amount DOUBLE PRECISION,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Expenses
CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT,
    property_name VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    expense_date DATE NOT NULL,
    vendor VARCHAR(255),
    receipt_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by BIGINT,
    updated_at TIMESTAMP
);

-- Payment Plans
CREATE TABLE payment_plans (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    invoice_number VARCHAR(100) NOT NULL,
    tenant_name VARCHAR(255) NOT NULL,
    total_amount DOUBLE PRECISION NOT NULL,
    installments INTEGER NOT NULL,
    installment_amount DOUBLE PRECISION NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    paid_installments INTEGER NOT NULL DEFAULT 0,
    remaining_amount DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_deposits_contract_id ON deposits(contract_id);
CREATE INDEX idx_deposits_status ON deposits(status);
CREATE INDEX idx_deposits_deposit_date ON deposits(deposit_date);
CREATE INDEX idx_expenses_property_id ON expenses(property_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_payment_plans_invoice_id ON payment_plans(invoice_id);
CREATE INDEX idx_payment_plans_status ON payment_plans(status);
CREATE INDEX idx_payment_plans_start_date ON payment_plans(start_date);


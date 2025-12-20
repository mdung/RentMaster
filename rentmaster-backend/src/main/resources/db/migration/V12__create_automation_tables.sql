-- Additional Automation Tables

-- Recurring Invoices
CREATE TABLE recurring_invoices (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    contract_code VARCHAR(100) NOT NULL,
    tenant_name VARCHAR(255) NOT NULL,
    room_code VARCHAR(100) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    day_of_month INTEGER,
    day_of_week INTEGER,
    next_generation_date DATE NOT NULL,
    last_generated_date DATE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    auto_send BOOLEAN NOT NULL DEFAULT FALSE,
    include_rent BOOLEAN NOT NULL DEFAULT TRUE,
    include_services BOOLEAN NOT NULL DEFAULT FALSE,
    service_ids TEXT,
    custom_items TEXT,
    days_until_due INTEGER NOT NULL DEFAULT 30,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Contract Renewal Reminders
CREATE TABLE contract_renewal_reminders (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL REFERENCES contracts(id),
    reminder_date DATE NOT NULL,
    days_before INTEGER NOT NULL,
    reminder_type VARCHAR(50) NOT NULL,
    sent BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP,
    auto_renewal BOOLEAN NOT NULL DEFAULT FALSE,
    extension_months INTEGER,
    new_rent_amount NUMERIC(15, 2),
    rent_increase NUMERIC(15, 2),
    rent_increase_type VARCHAR(50),
    require_tenant_approval BOOLEAN NOT NULL DEFAULT TRUE,
    approval_deadline_days INTEGER NOT NULL DEFAULT 30,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_recurring_invoices_contract_id ON recurring_invoices(contract_id);
CREATE INDEX idx_recurring_invoices_active ON recurring_invoices(active);
CREATE INDEX idx_recurring_invoices_next_generation_date ON recurring_invoices(next_generation_date);
CREATE INDEX idx_contract_renewal_reminders_contract_id ON contract_renewal_reminders(contract_id);
CREATE INDEX idx_contract_renewal_reminders_active ON contract_renewal_reminders(active);
CREATE INDEX idx_contract_renewal_reminders_reminder_date ON contract_renewal_reminders(reminder_date);
CREATE INDEX idx_contract_renewal_reminders_sent ON contract_renewal_reminders(sent);


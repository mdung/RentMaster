CREATE TABLE IF NOT EXISTS contract_services_backup AS SELECT * FROM contract_services;

/* Contract Services */
ALTER TABLE contract_services ALTER COLUMN custom_price TYPE NUMERIC(12, 4) USING custom_price::numeric;

/* Services */
ALTER TABLE services ALTER COLUMN unit_price TYPE NUMERIC(12, 4) USING unit_price::numeric;

/* Contracts */
ALTER TABLE contracts ALTER COLUMN rent_amount TYPE NUMERIC(12, 2) USING rent_amount::numeric;
ALTER TABLE contracts ALTER COLUMN deposit_amount TYPE NUMERIC(12, 2) USING deposit_amount::numeric;

/* Invoices */
ALTER TABLE invoices ALTER COLUMN total_amount TYPE NUMERIC(12, 2) USING total_amount::numeric;

/* Invoice Items */
ALTER TABLE invoice_items ALTER COLUMN quantity TYPE NUMERIC(12, 3) USING quantity::numeric;
ALTER TABLE invoice_items ALTER COLUMN unit_price TYPE NUMERIC(12, 4) USING unit_price::numeric;
ALTER TABLE invoice_items ALTER COLUMN amount TYPE NUMERIC(12, 2) USING amount::numeric;
ALTER TABLE invoice_items ALTER COLUMN prev_index TYPE NUMERIC(12, 3) USING prev_index::numeric;
ALTER TABLE invoice_items ALTER COLUMN current_index TYPE NUMERIC(12, 3) USING current_index::numeric;

/* Payments */
ALTER TABLE payments ALTER COLUMN amount TYPE NUMERIC(12, 2) USING amount::numeric;

/* Rooms */
ALTER TABLE rooms ALTER COLUMN base_rent TYPE NUMERIC(12, 2) USING base_rent::numeric;
ALTER TABLE rooms ALTER COLUMN size_m2 TYPE NUMERIC(10, 2) USING size_m2::numeric;

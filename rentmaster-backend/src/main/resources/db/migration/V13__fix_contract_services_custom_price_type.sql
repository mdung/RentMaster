-- Fix column types to match entity (Double -> DOUBLE PRECISION)

-- Fix contract_services.custom_price
ALTER TABLE contract_services 
ALTER COLUMN custom_price TYPE DOUBLE PRECISION;

-- Fix contracts.rent_amount
ALTER TABLE contracts 
ALTER COLUMN rent_amount TYPE DOUBLE PRECISION;

-- Fix contracts.deposit_amount
ALTER TABLE contracts 
ALTER COLUMN deposit_amount TYPE DOUBLE PRECISION;


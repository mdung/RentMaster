-- Maintenance Operations Tables

-- Maintenance Requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    room_id BIGINT,
    tenant_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    location VARCHAR(255),
    preferred_time VARCHAR(100),
    allow_entry BOOLEAN DEFAULT FALSE,
    assigned_to BIGINT,
    work_order_id BIGINT,
    estimated_cost DOUBLE PRECISION,
    actual_cost DOUBLE PRECISION,
    completed_date TIMESTAMP,
    completion_notes TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Maintenance Request Photos
CREATE TABLE IF NOT EXISTS maintenance_request_photos (
    request_id BIGINT NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    PRIMARY KEY (request_id, photo_url)
);

-- Work Orders
CREATE TABLE IF NOT EXISTS work_orders (
    id BIGSERIAL PRIMARY KEY,
    work_order_number VARCHAR(100) UNIQUE NOT NULL,
    property_id BIGINT NOT NULL,
    maintenance_request_id BIGINT,
    vendor_id BIGINT,
    assigned_to BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    work_type VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    scheduled_date TIMESTAMP,
    started_date TIMESTAMP,
    completed_date TIMESTAMP,
    estimated_duration INTEGER,
    actual_duration INTEGER,
    estimated_cost DOUBLE PRECISION,
    actual_cost DOUBLE PRECISION,
    location VARCHAR(255),
    special_instructions TEXT,
    completion_notes TEXT,
    tenant_satisfaction_rating INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by BIGINT
);

-- Work Order Materials
CREATE TABLE IF NOT EXISTS work_order_materials (
    work_order_id BIGINT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    material VARCHAR(255) NOT NULL,
    PRIMARY KEY (work_order_id, material)
);

-- Work Order Photos
CREATE TABLE IF NOT EXISTS work_order_photos (
    work_order_id BIGINT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    PRIMARY KEY (work_order_id, photo_url)
);

-- Assets
CREATE TABLE IF NOT EXISTS assets (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    room_id BIGINT,
    asset_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    purchase_date DATE,
    purchase_price DOUBLE PRECISION,
    warranty_expiry_date DATE,
    current_value DOUBLE PRECISION,
    depreciation_rate DOUBLE PRECISION,
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    condition VARCHAR(50) DEFAULT 'GOOD',
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    maintenance_interval_days INTEGER,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_maintenance_requests_property_id ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_requests_tenant_id ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_requests_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_requests_priority ON maintenance_requests(priority);
CREATE INDEX idx_maintenance_requests_category ON maintenance_requests(category);
CREATE INDEX idx_maintenance_requests_assigned_to ON maintenance_requests(assigned_to);

CREATE INDEX idx_work_orders_property_id ON work_orders(property_id);
CREATE INDEX idx_work_orders_vendor_id ON work_orders(vendor_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_maintenance_request_id ON work_orders(maintenance_request_id);
CREATE INDEX idx_work_orders_work_order_number ON work_orders(work_order_number);

CREATE INDEX idx_assets_property_id ON assets(property_id);
CREATE INDEX idx_assets_room_id ON assets(room_id);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_asset_code ON assets(asset_code);
CREATE INDEX idx_assets_next_maintenance_date ON assets(next_maintenance_date);


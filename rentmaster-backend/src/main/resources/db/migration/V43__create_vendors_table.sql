-- Vendors Table
CREATE TABLE vendors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    website VARCHAR(500),
    license_number VARCHAR(255),
    insurance_info VARCHAR(500),
    tax_id VARCHAR(100),
    rating DOUBLE PRECISION,
    hourly_rate DOUBLE PRECISION,
    emergency_contact VARCHAR(500),
    availability VARCHAR(255),
    total_jobs INTEGER DEFAULT 0,
    average_cost DOUBLE PRECISION DEFAULT 0.0,
    notes TEXT,
    is_preferred BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Vendor Specialties (collection table)
CREATE TABLE vendor_specialties (
    vendor_id BIGINT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    specialty VARCHAR(50) NOT NULL
);

-- Vendor Service Areas (collection table)
CREATE TABLE vendor_service_areas (
    vendor_id BIGINT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    service_area VARCHAR(255) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_vendors_name ON vendors(name);
CREATE INDEX idx_vendors_is_active ON vendors(is_active);
CREATE INDEX idx_vendors_is_preferred ON vendors(is_preferred);
CREATE INDEX idx_vendors_rating ON vendors(rating);
CREATE INDEX idx_vendor_specialties_vendor_id ON vendor_specialties(vendor_id);
CREATE INDEX idx_vendor_service_areas_vendor_id ON vendor_service_areas(vendor_id);


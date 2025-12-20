-- Floor Plans Table

CREATE TABLE floor_plans (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    floor_number INTEGER,
    total_area DOUBLE PRECISION,
    area_unit VARCHAR(20) DEFAULT 'sqft',
    bedrooms INTEGER,
    bathrooms INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    width INTEGER,
    height INTEGER,
    scale_ratio VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    uploaded_by VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for performance
CREATE INDEX idx_floor_plans_property_id ON floor_plans(property_id);
CREATE INDEX idx_floor_plans_is_active ON floor_plans(is_active);
CREATE INDEX idx_floor_plans_is_primary ON floor_plans(is_primary);
CREATE INDEX idx_floor_plans_floor_number ON floor_plans(floor_number);
CREATE INDEX idx_floor_plans_display_order ON floor_plans(display_order);
CREATE INDEX idx_floor_plans_uploaded_at ON floor_plans(uploaded_at);


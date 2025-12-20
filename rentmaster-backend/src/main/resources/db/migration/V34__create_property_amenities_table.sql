-- Property Amenities Table

CREATE TABLE property_amenities (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    icon VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    additional_cost DOUBLE PRECISION DEFAULT 0.0,
    cost_frequency VARCHAR(50),
    location VARCHAR(255),
    operating_hours VARCHAR(255),
    capacity INTEGER,
    booking_required BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for performance
CREATE INDEX idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX idx_property_amenities_category ON property_amenities(category);
CREATE INDEX idx_property_amenities_is_active ON property_amenities(is_active);
CREATE INDEX idx_property_amenities_is_available ON property_amenities(is_available);
CREATE INDEX idx_property_amenities_display_order ON property_amenities(display_order);
CREATE INDEX idx_property_amenities_booking_required ON property_amenities(booking_required);
CREATE INDEX idx_property_amenities_property_active ON property_amenities(property_id, is_active);
CREATE INDEX idx_property_amenities_property_category_active ON property_amenities(property_id, category, is_active);
CREATE INDEX idx_property_amenities_property_available_active ON property_amenities(property_id, is_available, is_active);
CREATE INDEX idx_property_amenities_category_display_order ON property_amenities(category, display_order);


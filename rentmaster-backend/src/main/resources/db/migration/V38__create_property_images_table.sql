-- Property Images Table
CREATE TABLE property_images (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    image_type VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    caption VARCHAR(500),
    alt_text VARCHAR(500),
    width INTEGER,
    height INTEGER,
    uploaded_at TIMESTAMP,
    uploaded_by VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for performance
CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_property_images_is_primary ON property_images(is_primary);
CREATE INDEX idx_property_images_is_active ON property_images(is_active);
CREATE INDEX idx_property_images_display_order ON property_images(display_order);


-- Mobile Analytics Schema

-- Mobile Analytics
CREATE TABLE mobile_analytics (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    device_id VARCHAR(255),
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    screen_name VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    app_version VARCHAR(50),
    platform VARCHAR(50),
    device_model VARCHAR(255),
    os_version VARCHAR(50),
    network_type VARCHAR(50),
    battery_level INTEGER,
    memory_usage BIGINT,
    cpu_usage DOUBLE PRECISION,
    location_latitude DOUBLE PRECISION,
    location_longitude DOUBLE PRECISION,
    duration_ms BIGINT
);

-- Mobile Analytics Data (collection table for Map<String, Object> eventData)
CREATE TABLE mobile_analytics_data (
    analytics_id BIGINT NOT NULL REFERENCES mobile_analytics(id) ON DELETE CASCADE,
    data_key VARCHAR(255) NOT NULL,
    data_value TEXT,
    PRIMARY KEY (analytics_id, data_key)
);

-- Indexes for performance
CREATE INDEX idx_mobile_analytics_user_id ON mobile_analytics(user_id);
CREATE INDEX idx_mobile_analytics_device_id ON mobile_analytics(device_id);
CREATE INDEX idx_mobile_analytics_session_id ON mobile_analytics(session_id);
CREATE INDEX idx_mobile_analytics_event_type ON mobile_analytics(event_type);
CREATE INDEX idx_mobile_analytics_event_name ON mobile_analytics(event_name);
CREATE INDEX idx_mobile_analytics_screen_name ON mobile_analytics(screen_name);
CREATE INDEX idx_mobile_analytics_timestamp ON mobile_analytics(timestamp);
CREATE INDEX idx_mobile_analytics_platform ON mobile_analytics(platform);
CREATE INDEX idx_mobile_analytics_app_version ON mobile_analytics(app_version);
CREATE INDEX idx_mobile_analytics_user_event_type ON mobile_analytics(user_id, event_type);
CREATE INDEX idx_mobile_analytics_user_timestamp ON mobile_analytics(user_id, timestamp);
CREATE INDEX idx_mobile_analytics_timestamp_range ON mobile_analytics(timestamp);
CREATE INDEX idx_mobile_analytics_data_analytics_id ON mobile_analytics_data(analytics_id);


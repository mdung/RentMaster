-- Mobile Devices Table

CREATE TABLE mobile_devices (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    device_token VARCHAR(500) NOT NULL UNIQUE,
    platform VARCHAR(50) NOT NULL,
    device_model VARCHAR(255),
    device_os_version VARCHAR(50),
    app_version VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    push_notifications_enabled BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMP DEFAULT NOW(),
    registered_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    supports_biometric BOOLEAN DEFAULT FALSE,
    supports_nfc BOOLEAN DEFAULT FALSE,
    supports_camera BOOLEAN DEFAULT TRUE,
    supports_location BOOLEAN DEFAULT FALSE,
    notification_sound VARCHAR(100) DEFAULT 'default',
    notification_vibration BOOLEAN DEFAULT TRUE,
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start VARCHAR(10) DEFAULT '22:00',
    quiet_hours_end VARCHAR(10) DEFAULT '08:00'
);

-- Indexes for performance
CREATE INDEX idx_mobile_devices_user_id ON mobile_devices(user_id);
CREATE INDEX idx_mobile_devices_platform ON mobile_devices(platform);
CREATE INDEX idx_mobile_devices_is_active ON mobile_devices(is_active);
CREATE INDEX idx_mobile_devices_push_notifications_enabled ON mobile_devices(push_notifications_enabled);
CREATE INDEX idx_mobile_devices_last_active_at ON mobile_devices(last_active_at);
CREATE INDEX idx_mobile_devices_user_active ON mobile_devices(user_id, is_active);
CREATE INDEX idx_mobile_devices_user_push_enabled ON mobile_devices(user_id, push_notifications_enabled);


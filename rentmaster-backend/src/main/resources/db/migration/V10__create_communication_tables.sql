-- Communication Logs
CREATE TABLE communication_logs (
    id BIGSERIAL PRIMARY KEY,
    recipient_type VARCHAR(50) NOT NULL,
    recipient_id BIGINT NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    template_id BIGINT,
    template_name VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    error_message VARCHAR(500),
    related_entity_type VARCHAR(100),
    related_entity_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Notification Channels
CREATE TABLE notification_channels (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Notification Channel Configuration (collection table)
CREATE TABLE notification_channel_config (
    channel_id BIGINT NOT NULL REFERENCES notification_channels(id) ON DELETE CASCADE,
    config_key VARCHAR(255) NOT NULL,
    config_value TEXT,
    PRIMARY KEY (channel_id, config_key)
);

-- Notification Preferences
CREATE TABLE notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    frequency VARCHAR(50) NOT NULL DEFAULT 'IMMEDIATE',
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start VARCHAR(10),
    quiet_hours_end VARCHAR(10)
);

-- Notification Preference Channels (collection table)
CREATE TABLE notification_preference_channels (
    preference_id BIGINT NOT NULL REFERENCES notification_preferences(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL
);

-- Email Templates
CREATE TABLE email_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Email Template Variables (collection table)
CREATE TABLE email_template_variables (
    template_id BIGINT NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
    variable_name VARCHAR(255) NOT NULL
);

-- SMS Templates
CREATE TABLE sms_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    message VARCHAR(1600) NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- SMS Template Variables (collection table)
CREATE TABLE sms_template_variables (
    template_id BIGINT NOT NULL REFERENCES sms_templates(id) ON DELETE CASCADE,
    variable_name VARCHAR(255) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_communication_logs_channel ON communication_logs(channel);
CREATE INDEX idx_communication_logs_status ON communication_logs(status);
CREATE INDEX idx_communication_logs_recipient_type ON communication_logs(recipient_type);
CREATE INDEX idx_communication_logs_recipient_id ON communication_logs(recipient_id);
CREATE INDEX idx_communication_logs_created_at ON communication_logs(created_at);
CREATE INDEX idx_notification_channels_type ON notification_channels(type);
CREATE INDEX idx_notification_channels_active ON notification_channels(active);
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX idx_notification_preferences_notification_type ON notification_preferences(notification_type);
CREATE INDEX idx_email_templates_template_type ON email_templates(template_type);
CREATE INDEX idx_email_templates_active ON email_templates(active);
CREATE INDEX idx_sms_templates_template_type ON sms_templates(template_type);
CREATE INDEX idx_sms_templates_active ON sms_templates(active);


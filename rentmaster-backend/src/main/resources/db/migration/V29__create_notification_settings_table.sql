-- Notification Settings Table

CREATE TABLE notification_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    sms_notifications BOOLEAN NOT NULL DEFAULT FALSE,
    in_app_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    invoice_due_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    payment_received_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    contract_expiring_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    maintenance_request_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_days_before INTEGER NOT NULL DEFAULT 3
);

-- Indexes for performance
CREATE INDEX idx_notification_settings_user_id ON notification_settings(user_id);


-- Offline Actions Schema

-- Offline Actions
CREATE TABLE offline_actions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    error_message TEXT,
    device_id VARCHAR(255),
    sync_priority INTEGER DEFAULT 1
);

-- Offline Action Data (collection table for Map<String, Object> actionData)
CREATE TABLE offline_action_data (
    action_id BIGINT NOT NULL REFERENCES offline_actions(id) ON DELETE CASCADE,
    data_key VARCHAR(255) NOT NULL,
    data_value TEXT,
    PRIMARY KEY (action_id, data_key)
);

-- Indexes for performance
CREATE INDEX idx_offline_actions_user_id ON offline_actions(user_id);
CREATE INDEX idx_offline_actions_status ON offline_actions(status);
CREATE INDEX idx_offline_actions_action_type ON offline_actions(action_type);
CREATE INDEX idx_offline_actions_device_id ON offline_actions(device_id);
CREATE INDEX idx_offline_actions_created_at ON offline_actions(created_at);
CREATE INDEX idx_offline_actions_sync_priority ON offline_actions(sync_priority);
CREATE INDEX idx_offline_actions_user_status ON offline_actions(user_id, status);
CREATE INDEX idx_offline_actions_status_priority_created ON offline_actions(status, sync_priority, created_at);
CREATE INDEX idx_offline_actions_status_retry ON offline_actions(status, retry_count, max_retries);
CREATE INDEX idx_offline_actions_device_status ON offline_actions(device_id, status);
CREATE INDEX idx_offline_action_data_action_id ON offline_action_data(action_id);


-- Maintenance Schedules Table

CREATE TABLE maintenance_schedules (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    vendor_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    maintenance_type VARCHAR(50),
    priority VARCHAR(50),
    status VARCHAR(50),
    scheduled_date DATE,
    estimated_duration INTEGER,
    estimated_cost DOUBLE PRECISION,
    actual_cost DOUBLE PRECISION,
    recurrence_type VARCHAR(50),
    recurrence_interval INTEGER,
    next_due_date DATE,
    location VARCHAR(255),
    special_instructions TEXT,
    tenant_notification_required BOOLEAN DEFAULT FALSE,
    access_required BOOLEAN DEFAULT FALSE,
    completed_date TIMESTAMP,
    completed_by VARCHAR(255),
    completion_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- Indexes for performance
CREATE INDEX idx_maintenance_schedules_property_id ON maintenance_schedules(property_id);
CREATE INDEX idx_maintenance_schedules_vendor_id ON maintenance_schedules(vendor_id);
CREATE INDEX idx_maintenance_schedules_status ON maintenance_schedules(status);
CREATE INDEX idx_maintenance_schedules_maintenance_type ON maintenance_schedules(maintenance_type);
CREATE INDEX idx_maintenance_schedules_priority ON maintenance_schedules(priority);
CREATE INDEX idx_maintenance_schedules_scheduled_date ON maintenance_schedules(scheduled_date);
CREATE INDEX idx_maintenance_schedules_next_due_date ON maintenance_schedules(next_due_date);
CREATE INDEX idx_maintenance_schedules_property_status ON maintenance_schedules(property_id, status);
CREATE INDEX idx_maintenance_schedules_scheduled_date_range ON maintenance_schedules(scheduled_date);
CREATE INDEX idx_maintenance_schedules_next_due_date_range ON maintenance_schedules(next_due_date);
CREATE INDEX idx_maintenance_schedules_property_scheduled_date ON maintenance_schedules(property_id, scheduled_date);
CREATE INDEX idx_maintenance_schedules_status_scheduled_date ON maintenance_schedules(status, scheduled_date);
CREATE INDEX idx_maintenance_schedules_recurrence_next_due ON maintenance_schedules(recurrence_type, next_due_date);
CREATE INDEX idx_maintenance_schedules_tenant_notification ON maintenance_schedules(tenant_notification_required, status);
CREATE INDEX idx_maintenance_schedules_access_required ON maintenance_schedules(access_required, status);


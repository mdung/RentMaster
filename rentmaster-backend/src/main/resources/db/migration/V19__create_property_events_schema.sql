-- Property Events Schema

-- Property Events
CREATE TABLE property_events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    location_details VARCHAR(500),
    property_id BIGINT NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    organizer_id BIGINT NOT NULL,
    organizer_name VARCHAR(255) NOT NULL,
    organizer_type VARCHAR(50) NOT NULL,
    max_attendees INTEGER,
    current_attendees INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    requires_rsvp BOOLEAN NOT NULL DEFAULT FALSE,
    allow_guest_invites BOOLEAN NOT NULL DEFAULT FALSE,
    rsvp_deadline TIMESTAMP,
    notes TEXT,
    requirements TEXT,
    agenda TEXT,
    contact_info VARCHAR(500),
    send_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_hours INTEGER DEFAULT 24,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Event Attendees (collection table)
CREATE TABLE event_attendees (
    event_id BIGINT NOT NULL REFERENCES property_events(id) ON DELETE CASCADE,
    attendee_id BIGINT NOT NULL
);

-- Event Invited (collection table)
CREATE TABLE event_invited (
    event_id BIGINT NOT NULL REFERENCES property_events(id) ON DELETE CASCADE,
    invited_id BIGINT NOT NULL
);

-- Event Declined (collection table)
CREATE TABLE event_declined (
    event_id BIGINT NOT NULL REFERENCES property_events(id) ON DELETE CASCADE,
    declined_id BIGINT NOT NULL
);

-- Event Attachments (collection table)
CREATE TABLE event_attachments (
    event_id BIGINT NOT NULL REFERENCES property_events(id) ON DELETE CASCADE,
    attachment_url VARCHAR(500) NOT NULL
);

-- Event Tags (collection table)
CREATE TABLE event_tags (
    event_id BIGINT NOT NULL REFERENCES property_events(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_property_events_property_id ON property_events(property_id);
CREATE INDEX idx_property_events_organizer_id ON property_events(organizer_id);
CREATE INDEX idx_property_events_type ON property_events(type);
CREATE INDEX idx_property_events_status ON property_events(status);
CREATE INDEX idx_property_events_start_date_time ON property_events(start_date_time);
CREATE INDEX idx_property_events_end_date_time ON property_events(end_date_time);
CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_invited_event_id ON event_invited(event_id);
CREATE INDEX idx_event_declined_event_id ON event_declined(event_id);


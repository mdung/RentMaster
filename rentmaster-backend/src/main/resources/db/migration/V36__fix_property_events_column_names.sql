-- Fix Property Events Column Names
-- Hibernate expects requiresrsvp (no underscore) instead of requires_rsvp
-- This happens because Hibernate converts camelCase with acronyms differently

ALTER TABLE property_events RENAME COLUMN requires_rsvp TO requiresrsvp;
ALTER TABLE property_events RENAME COLUMN allow_guest_invites TO allowguestinvites;


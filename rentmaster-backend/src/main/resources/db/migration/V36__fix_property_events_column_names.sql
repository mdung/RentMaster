-- Fix Property Events Column Names
-- Hibernate expects requiresrsvp (no underscore) instead of requires_rsvp
-- This happens because Hibernate converts camelCase with acronyms (RSVP) differently

ALTER TABLE property_events RENAME COLUMN requires_rsvp TO requiresrsvp;


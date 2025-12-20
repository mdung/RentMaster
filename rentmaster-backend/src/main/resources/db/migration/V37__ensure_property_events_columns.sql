-- Ensure Property Events Columns Exist
-- This migration ensures all required columns exist, in case V19 wasn't applied or columns were missing

-- Add allow_guest_invites if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'property_events' 
        AND column_name = 'allow_guest_invites'
    ) THEN
        ALTER TABLE property_events ADD COLUMN allow_guest_invites BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END $$;


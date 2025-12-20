-- Fix user_organizations table to add id column
-- The entity expects an id column as primary key, but the original migration created a composite key

-- Add id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_organizations' 
        AND column_name = 'id'
    ) THEN
        -- Drop the existing composite primary key constraint
        ALTER TABLE user_organizations DROP CONSTRAINT IF EXISTS user_organizations_pkey;
        
        -- Add id column with sequence
        ALTER TABLE user_organizations ADD COLUMN id BIGSERIAL;
        
        -- Populate id for existing rows (if any)
        -- The sequence will automatically continue from the max id
        
        -- Set id as primary key
        ALTER TABLE user_organizations ADD PRIMARY KEY (id);
        
        -- Add unique constraint on (user_id, organization_id) to prevent duplicates
        ALTER TABLE user_organizations ADD CONSTRAINT uk_user_organizations_user_org UNIQUE (user_id, organization_id);
    END IF;
END $$;


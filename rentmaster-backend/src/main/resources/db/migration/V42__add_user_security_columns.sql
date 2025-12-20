-- Add missing security-related columns to users table
-- These columns are expected by the User entity but missing from the initial migration

-- Add last_login column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'last_login'
    ) THEN
        ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
    END IF;
END $$;

-- Add failed_login_attempts column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'failed_login_attempts'
    ) THEN
        ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Add account_locked_until column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'account_locked_until'
    ) THEN
        ALTER TABLE users ADD COLUMN account_locked_until TIMESTAMP;
    END IF;
END $$;

-- Add password_changed_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'password_changed_at'
    ) THEN
        ALTER TABLE users ADD COLUMN password_changed_at TIMESTAMP;
    END IF;
END $$;


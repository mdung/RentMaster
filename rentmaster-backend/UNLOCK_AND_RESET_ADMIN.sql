-- ============================================
-- UNLOCK AND RESET ADMIN ACCOUNT
-- ============================================
-- This script will:
-- 1. Reset the password to admin123
-- 2. Unlock the account
-- 3. Reset failed login attempts
-- ============================================

-- Fix admin account completely
UPDATE users 
SET 
    password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO',  -- Password: admin123
    failed_login_attempts = 0,
    account_locked_until = NULL,
    active = true
WHERE username = 'admin';

-- Verify the fix
SELECT 
    username,
    active,
    failed_login_attempts,
    account_locked_until,
    CASE 
        WHEN account_locked_until IS NULL THEN 'Account is UNLOCKED ✓'
        ELSE 'Account is LOCKED until: ' || account_locked_until::text
    END as lock_status,
    CASE 
        WHEN password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO' 
        THEN 'Password is set to admin123 ✓' 
        ELSE 'Password hash does not match!' 
    END as password_status
FROM users 
WHERE username = 'admin';

-- Expected result:
-- username: admin
-- active: true
-- failed_login_attempts: 0
-- account_locked_until: NULL
-- lock_status: Account is UNLOCKED ✓
-- password_status: Password is set to admin123 ✓


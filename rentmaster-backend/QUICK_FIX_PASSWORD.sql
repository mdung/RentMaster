-- ============================================
-- QUICK FIX: Reset Admin Password
-- ============================================
-- Run this SQL in your database to fix the password issue
-- ============================================

-- Reset admin password to admin123
UPDATE users 
SET 
    password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO',
    failed_login_attempts = 0,
    account_locked_until = NULL,
    active = true
WHERE username = 'admin';

-- Verify the password was updated
SELECT 
    username,
    active,
    failed_login_attempts,
    account_locked_until,
    CASE 
        WHEN password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO' 
        THEN 'Password is set to admin123 ✓' 
        ELSE 'Password hash does not match!' 
    END as password_status
FROM users 
WHERE username = 'admin';


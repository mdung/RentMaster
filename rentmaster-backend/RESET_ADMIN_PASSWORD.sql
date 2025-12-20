-- ============================================
-- RESET ADMIN PASSWORD - RUN THIS IN YOUR DATABASE
-- ============================================
-- 
-- This script resets the admin user password to a known value
-- 
-- LOGIN CREDENTIALS:
--   Username: admin
--   Password: admin123
--
-- ============================================

-- Reset admin password and unlock account
UPDATE users 
SET 
    password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO',
    failed_login_attempts = 0,
    account_locked_until = NULL,
    active = true
WHERE username = 'admin';

-- Verify the admin user exists and is active
SELECT 
    id,
    username,
    full_name,
    email,
    role,
    active,
    failed_login_attempts,
    account_locked_until,
    created_at
FROM users 
WHERE username = 'admin';

-- Expected result:
-- id: 1
-- username: admin
-- full_name: Administrator
-- email: admin@rentmaster.com
-- role: ADMIN
-- active: true
-- failed_login_attempts: 0
-- account_locked_until: NULL


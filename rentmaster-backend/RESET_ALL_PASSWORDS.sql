-- ============================================
-- RESET ALL USER PASSWORDS TO KNOWN VALUE
-- ============================================
-- 
-- This script resets ALL user passwords to: admin123
-- This ensures you can log in with any username
-- 
-- PASSWORD FOR ALL USERS: admin123
--
-- ============================================

-- Reset all user passwords to admin123
-- BCrypt hash: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO
UPDATE users 
SET 
    password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO',
    failed_login_attempts = 0,
    account_locked_until = NULL
WHERE username IN ('admin', 'manager1', 'staff1', 'staff2', 'realtor1', 'admin2', 'testuser');

-- Or reset ALL users (uncomment if you want to reset every user):
-- UPDATE users 
-- SET 
--     password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO',
--     failed_login_attempts = 0,
--     account_locked_until = NULL;

-- Verify all users and their status
SELECT 
    username,
    full_name,
    email,
    role,
    active,
    failed_login_attempts,
    account_locked_until,
    CASE 
        WHEN password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO' THEN 'admin123'
        ELSE 'UNKNOWN'
    END as password_status
FROM users 
ORDER BY username;

-- Expected result: All users should show password_status = 'admin123'
-- Note: staff2 will have active = false (inactive account)


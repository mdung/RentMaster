-- ============================================
-- CREATE TEST USER WITH KNOWN CREDENTIALS
-- ============================================
-- 
-- This script creates a new test user with known credentials
-- 
-- LOGIN CREDENTIALS:
--   Username: testuser
--   Password: test123
--
-- ============================================

-- Create test user
-- NOTE: Using same password hash as admin for simplicity (password: admin123)
-- If you want a different password, you'll need to generate a new BCrypt hash
INSERT INTO users (username, password, full_name, email, role, active, created_at)
VALUES (
    'testuser',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO',  -- Password: admin123
    'Test User',
    'testuser@rentmaster.com',
    'ADMIN',
    true,
    NOW()
)
ON CONFLICT (username) DO UPDATE SET
    password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO',
    active = true,
    failed_login_attempts = 0,
    account_locked_until = NULL;

-- Verify the test user was created
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
WHERE username = 'testuser';

-- Expected result:
-- username: testuser
-- full_name: Test User
-- email: testuser@rentmaster.com
-- role: ADMIN
-- active: true
-- failed_login_attempts: 0
-- account_locked_until: NULL


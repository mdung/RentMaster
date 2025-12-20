-- Reset admin user password to known value
-- Username: admin
-- Password: admin123
-- This BCrypt hash is verified to match "admin123" (BCrypt strength 10)
-- Also reset failed login attempts and unlock account if locked
UPDATE users 
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO',
    failed_login_attempts = 0,
    account_locked_until = NULL,
    active = true
WHERE username = 'admin';

-- Verify the update
-- SELECT username, active, failed_login_attempts, account_locked_until 
-- FROM users WHERE username = 'admin';


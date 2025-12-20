package com.rentmaster.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class SecurityCleanupService {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private LoginAttemptRepository loginAttemptRepository;

    // Run every hour
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        
        // Clean up expired password reset tokens
        passwordResetTokenRepository.deleteExpiredTokens(now);
        
        // Clean up old login attempts (older than 30 days)
        Instant thirtyDaysAgo = now.minusSeconds(30 * 24 * 60 * 60);
        // Note: You might want to add a method to delete old login attempts
        
        System.out.println("Cleaned up expired security tokens at: " + now);
    }
}
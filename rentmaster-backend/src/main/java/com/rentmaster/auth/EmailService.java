package com.rentmaster.auth;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendPasswordResetEmail(String email, String resetToken) {
        // TODO: Implement email sending functionality
        // For now, just log the reset link
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        System.out.println("Password reset link for " + email + ": " + resetLink);
        
        // In a real implementation, you would:
        // 1. Use a mail service like SendGrid, AWS SES, or SMTP
        // 2. Create an HTML email template
        // 3. Send the email with the reset link
    }

    public void sendLoginNotification(String email, String ipAddress, String userAgent) {
        // TODO: Implement login notification email
        System.out.println("Login notification for " + email + " from IP: " + ipAddress);
    }
}
package com.rentmaster.notification;

import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    public void sendNotificationEmail(String email, String title, String message) {
        // TODO: Implement actual email sending
        // For now, just log the email
        System.out.println("=== EMAIL NOTIFICATION ===");
        System.out.println("To: " + email);
        System.out.println("Subject: " + title);
        System.out.println("Message: " + message);
        System.out.println("==========================");
        
        // In a real implementation, you would:
        // 1. Use Spring Mail or a service like SendGrid
        // 2. Create HTML email templates
        // 3. Handle email delivery failures
        // 4. Add email queuing for better performance
    }

    public void sendInvoiceDueEmail(String email, String invoiceNumber, String dueDate, double amount) {
        String title = "Invoice Due Reminder - " + invoiceNumber;
        String message = String.format(
            "Your invoice %s is due on %s. Amount: $%.2f. Please make payment to avoid late fees.",
            invoiceNumber, dueDate, amount
        );
        sendNotificationEmail(email, title, message);
    }

    public void sendPaymentReceivedEmail(String email, String invoiceNumber, double amount) {
        String title = "Payment Received - " + invoiceNumber;
        String message = String.format(
            "We have received your payment of $%.2f for invoice %s. Thank you!",
            amount, invoiceNumber
        );
        sendNotificationEmail(email, title, message);
    }

    public void sendContractExpiringEmail(String email, String contractCode, String expiryDate) {
        String title = "Contract Expiring Soon - " + contractCode;
        String message = String.format(
            "Your contract %s is expiring on %s. Please contact us to renew or discuss next steps.",
            contractCode, expiryDate
        );
        sendNotificationEmail(email, title, message);
    }
}
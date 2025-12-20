package com.rentmaster.tenant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TenantPortalService {
    
    @Autowired
    private TenantRepository tenantRepository;
    
    // Mock current tenant ID - in real implementation, get from security context
    private Long getCurrentTenantId(Long providedTenantId) {
        return providedTenantId != null ? providedTenantId : 1L; // Default to tenant 1 for demo
    }
    
    /**
     * Get complete tenant dashboard data
     */
    public Map<String, Object> getTenantDashboard(Long tenantId) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("profile", getTenantProfile(currentTenantId));
        dashboard.put("currentContract", getCurrentContract(currentTenantId));
        dashboard.put("upcomingPayments", getTenantInvoices(currentTenantId, "PENDING", 5));
        dashboard.put("recentPayments", getPaymentHistory(currentTenantId, 5));
        dashboard.put("maintenanceRequests", getMaintenanceRequests(currentTenantId, 5));
        dashboard.put("documents", getTenantDocuments(currentTenantId));
        dashboard.put("notifications", getTenantNotifications(currentTenantId, false, 10));
        dashboard.put("paymentMethods", getPaymentMethods(currentTenantId));
        dashboard.put("stats", getTenantStats(currentTenantId));
        
        return dashboard;
    }
    
    /**
     * Get tenant profile information
     */
    public Map<String, Object> getTenantProfile(Long tenantId) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", currentTenantId);
        profile.put("userId", currentTenantId);
        profile.put("fullName", "John Doe");
        profile.put("email", "john.doe@email.com");
        profile.put("phone", "+1-555-0123");
        profile.put("idNumber", "ID123456789");
        profile.put("dateOfBirth", "1990-05-15");
        profile.put("address", "123 Main St, City, State 12345");
        profile.put("emergencyContactName", "Jane Doe");
        profile.put("emergencyContactPhone", "+1-555-0124");
        profile.put("emergencyContactRelation", "Spouse");
        profile.put("occupation", "Software Engineer");
        profile.put("employer", "Tech Corp");
        profile.put("monthlyIncome", 5000.0);
        profile.put("profilePicture", null);
        profile.put("preferredLanguage", "en");
        profile.put("timezone", "America/New_York");
        profile.put("createdAt", LocalDateTime.now().minusMonths(6).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        profile.put("updatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        // Notification preferences
        Map<String, Object> notificationPreferences = new HashMap<>();
        notificationPreferences.put("emailNotifications", true);
        notificationPreferences.put("smsNotifications", true);
        notificationPreferences.put("pushNotifications", true);
        notificationPreferences.put("invoiceReminders", true);
        notificationPreferences.put("paymentConfirmations", true);
        notificationPreferences.put("maintenanceUpdates", true);
        notificationPreferences.put("contractNotifications", true);
        notificationPreferences.put("marketingEmails", false);
        notificationPreferences.put("reminderDaysBefore", 3);
        profile.put("notificationPreferences", notificationPreferences);
        
        return profile;
    }
    
    /**
     * Update tenant profile
     */
    public Map<String, Object> updateTenantProfile(Long tenantId, Map<String, Object> profileData) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        // In real implementation, update the database
        Map<String, Object> updatedProfile = getTenantProfile(currentTenantId);
        updatedProfile.put("updatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        // Update fields from profileData
        profileData.forEach((key, value) -> {
            if (!key.equals("id") && !key.equals("userId") && !key.equals("createdAt")) {
                updatedProfile.put(key, value);
            }
        });
        
        return updatedProfile;
    }
    
    /**
     * Get tenant's current contract
     */
    public Map<String, Object> getCurrentContract(Long tenantId) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        Map<String, Object> contract = new HashMap<>();
        contract.put("id", 1L);
        contract.put("contractCode", "CON-2024-001");
        
        // Property information
        Map<String, Object> property = new HashMap<>();
        property.put("id", 1L);
        property.put("name", "Sunset Apartments");
        property.put("address", "456 Oak Street, Downtown, City 12345");
        contract.put("property", property);
        
        // Room information
        Map<String, Object> room = new HashMap<>();
        room.put("id", 1L);
        room.put("code", "A101");
        room.put("floor", "1st Floor");
        room.put("type", "Studio");
        contract.put("room", room);
        
        contract.put("startDate", "2024-01-01");
        contract.put("endDate", "2024-12-31");
        contract.put("monthlyRent", 1200.0);
        contract.put("securityDeposit", 1200.0);
        contract.put("status", "ACTIVE");
        contract.put("renewalEligible", true);
        contract.put("daysUntilExpiry", 45);
        contract.put("autoRenewal", false);
        contract.put("nextRentDue", "2024-12-01");
        contract.put("totalPaid", 13200.0);
        contract.put("totalOutstanding", 1200.0);
        
        return contract;
    }
    
    /**
     * Get tenant's invoices
     */
    public List<Map<String, Object>> getTenantInvoices(Long tenantId, String status, int limit) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        List<Map<String, Object>> invoices = new ArrayList<>();
        
        // Sample invoices
        for (int i = 1; i <= Math.min(limit, 3); i++) {
            Map<String, Object> invoice = new HashMap<>();
            invoice.put("id", (long) i);
            invoice.put("invoiceNumber", "INV-2024-" + String.format("%03d", i));
            invoice.put("issueDate", LocalDateTime.now().minusDays(i * 5).format(DateTimeFormatter.ISO_LOCAL_DATE));
            invoice.put("dueDate", LocalDateTime.now().plusDays(30 - (i * 5)).format(DateTimeFormatter.ISO_LOCAL_DATE));
            invoice.put("periodStart", LocalDateTime.now().minusDays(i * 30).format(DateTimeFormatter.ISO_LOCAL_DATE));
            invoice.put("periodEnd", LocalDateTime.now().minusDays((i - 1) * 30).format(DateTimeFormatter.ISO_LOCAL_DATE));
            invoice.put("totalAmount", 1200.0);
            invoice.put("paidAmount", i == 1 ? 0.0 : 1200.0);
            invoice.put("remainingAmount", i == 1 ? 1200.0 : 0.0);
            invoice.put("status", i == 1 ? "PENDING" : "PAID");
            invoice.put("canPay", i == 1);
            invoice.put("lateFee", i == 1 ? 50.0 : 0.0);
            invoice.put("daysOverdue", i == 1 ? 5 : 0);
            
            // Invoice items
            List<Map<String, Object>> items = new ArrayList<>();
            Map<String, Object> rentItem = new HashMap<>();
            rentItem.put("id", 1L);
            rentItem.put("description", "Monthly Rent - Room A101");
            rentItem.put("quantity", 1);
            rentItem.put("unitPrice", 1200.0);
            rentItem.put("amount", 1200.0);
            rentItem.put("type", "RENT");
            rentItem.put("period", invoice.get("periodStart") + " - " + invoice.get("periodEnd"));
            items.add(rentItem);
            invoice.put("items", items);
            
            // Payment history for this invoice
            List<Map<String, Object>> paymentHistory = new ArrayList<>();
            if (!invoice.get("status").equals("PENDING")) {
                Map<String, Object> payment = new HashMap<>();
                payment.put("id", (long) i);
                payment.put("amount", 1200.0);
                payment.put("paymentDate", LocalDateTime.now().minusDays(i * 5 - 2).format(DateTimeFormatter.ISO_LOCAL_DATE));
                payment.put("paymentMethod", "Credit Card");
                payment.put("status", "COMPLETED");
                paymentHistory.add(payment);
            }
            invoice.put("paymentHistory", paymentHistory);
            
            invoices.add(invoice);
        }
        
        return invoices.stream()
                .filter(inv -> status.equals("ALL") || inv.get("status").equals(status))
                .collect(Collectors.toList());
    }
    
    /**
     * Get tenant's payment history
     */
    public List<Map<String, Object>> getPaymentHistory(Long tenantId, int limit) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        List<Map<String, Object>> payments = new ArrayList<>();
        
        for (int i = 1; i <= Math.min(limit, 5); i++) {
            Map<String, Object> payment = new HashMap<>();
            payment.put("id", (long) i);
            payment.put("invoiceId", (long) i);
            payment.put("invoiceNumber", "INV-2024-" + String.format("%03d", i));
            payment.put("amount", 1200.0);
            payment.put("paymentDate", LocalDateTime.now().minusDays(i * 30).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            payment.put("paymentMethod", i % 2 == 0 ? "Credit Card" : "Bank Transfer");
            payment.put("transactionId", "TXN-" + (1000 + i));
            payment.put("status", "COMPLETED");
            payment.put("description", "Monthly Rent Payment");
            payment.put("receiptUrl", "/api/tenant-portal/payments/" + i + "/receipt");
            payment.put("processingFee", 2.50);
            payments.add(payment);
        }
        
        return payments;
    }
    
    /**
     * Submit maintenance request
     */
    public Map<String, Object> submitMaintenanceRequest(Long tenantId, Map<String, Object> requestData) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        Map<String, Object> request = new HashMap<>();
        request.put("id", System.currentTimeMillis()); // Generate unique ID
        request.put("title", requestData.get("title"));
        request.put("description", requestData.get("description"));
        request.put("category", requestData.getOrDefault("category", "OTHER"));
        request.put("priority", requestData.getOrDefault("priority", "MEDIUM"));
        request.put("status", "SUBMITTED");
        request.put("location", requestData.get("location"));
        request.put("preferredTime", requestData.get("preferredTime"));
        request.put("allowEntry", requestData.getOrDefault("allowEntry", true));
        request.put("photos", requestData.getOrDefault("photos", new ArrayList<>()));
        request.put("submittedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        request.put("updates", new ArrayList<>());
        
        return request;
    }
    
    /**
     * Get tenant's maintenance requests
     */
    public List<Map<String, Object>> getMaintenanceRequests(Long tenantId, int limit) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        List<Map<String, Object>> requests = new ArrayList<>();
        
        String[] titles = {"Leaky Faucet", "Broken AC", "Electrical Issue"};
        String[] categories = {"PLUMBING", "HVAC", "ELECTRICAL"};
        String[] statuses = {"COMPLETED", "IN_PROGRESS", "SUBMITTED"};
        String[] priorities = {"MEDIUM", "HIGH", "LOW"};
        
        for (int i = 0; i < Math.min(limit, 3); i++) {
            Map<String, Object> request = new HashMap<>();
            request.put("id", (long) (i + 1));
            request.put("title", titles[i]);
            request.put("description", "Description for " + titles[i]);
            request.put("category", categories[i]);
            request.put("priority", priorities[i]);
            request.put("status", statuses[i]);
            request.put("location", "Room A101");
            request.put("preferredTime", "Morning");
            request.put("allowEntry", true);
            request.put("photos", new ArrayList<>());
            request.put("submittedAt", LocalDateTime.now().minusDays(i * 7).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            if (i < 2) {
                request.put("acknowledgedAt", LocalDateTime.now().minusDays(i * 7 - 1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                request.put("assignedTechnician", "Mike Johnson");
                request.put("technicianPhone", "+1-555-0199");
            }
            
            if (i == 0) {
                request.put("completedAt", LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                request.put("actualCost", 150.0);
                request.put("workDescription", "Replaced faucet cartridge and seals");
                request.put("tenantRating", 5);
                request.put("tenantFeedback", "Excellent work, very professional");
            }
            
            // Updates
            List<Map<String, Object>> updates = new ArrayList<>();
            Map<String, Object> update = new HashMap<>();
            update.put("id", 1L);
            update.put("message", "Request received and assigned to technician");
            update.put("type", "STATUS_CHANGE");
            update.put("createdAt", LocalDateTime.now().minusDays(i * 7 - 1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            update.put("createdBy", "System");
            updates.add(update);
            request.put("updates", updates);
            
            requests.add(request);
        }
        
        return requests;
    }
    
    /**
     * Get tenant's documents
     */
    public List<Map<String, Object>> getTenantDocuments(Long tenantId) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        List<Map<String, Object>> documents = new ArrayList<>();
        
        String[] names = {"Lease Agreement", "Move-in Inspection", "Rent Receipt - November"};
        String[] types = {"LEASE_AGREEMENT", "INVOICE", "RECEIPT"};
        
        for (int i = 0; i < 3; i++) {
            Map<String, Object> document = new HashMap<>();
            document.put("id", (long) (i + 1));
            document.put("name", names[i]);
            document.put("type", types[i]);
            document.put("description", "Document description for " + names[i]);
            document.put("fileSize", 1024 * (i + 1) * 100); // Different file sizes
            document.put("uploadDate", LocalDateTime.now().minusDays(i * 30).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            document.put("downloadUrl", "/api/tenant-portal/documents/" + (i + 1) + "/download");
            document.put("isImportant", i == 0);
            document.put("requiresAction", false);
            document.put("category", "TENANT_DOCUMENTS");
            documents.add(document);
        }
        
        return documents;
    }
    
    /**
     * Get tenant notifications
     */
    public List<Map<String, Object>> getTenantNotifications(Long tenantId, boolean unreadOnly, int limit) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        List<Map<String, Object>> notifications = new ArrayList<>();
        
        String[] titles = {"Rent Due Reminder", "Maintenance Update", "New Document Available"};
        String[] messages = {
                "Your rent payment of $1,200 is due on December 1st",
                "Your maintenance request has been completed",
                "Your lease renewal document is now available"
        };
        String[] types = {"INVOICE", "MAINTENANCE", "GENERAL"};
        boolean[] readStatuses = {false, true, false};
        
        for (int i = 0; i < Math.min(limit, 3); i++) {
            if (unreadOnly && readStatuses[i]) continue;
            
            Map<String, Object> notification = new HashMap<>();
            notification.put("id", (long) (i + 1));
            notification.put("type", types[i]);
            notification.put("title", titles[i]);
            notification.put("message", messages[i]);
            notification.put("priority", "MEDIUM");
            notification.put("read", readStatuses[i]);
            notification.put("actionRequired", i == 0);
            notification.put("actionUrl", i == 0 ? "/tenant-portal?tab=payments" : null);
            notification.put("actionText", i == 0 ? "Pay Now" : null);
            notification.put("createdAt", LocalDateTime.now().minusDays(i + 1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            notification.put("readAt", readStatuses[i] ? LocalDateTime.now().minusHours(i + 1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
            notification.put("relatedEntityId", (long) (i + 1));
            notification.put("relatedEntityType", types[i]);
            notifications.add(notification);
        }
        
        return notifications;
    }
    
    /**
     * Mark notification as read
     */
    public void markNotificationAsRead(Long notificationId, Long tenantId) {
        // In real implementation, update the database
        // For now, just log the action
        System.out.println("Marking notification " + notificationId + " as read for tenant " + getCurrentTenantId(tenantId));
    }
    
    /**
     * Get tenant statistics
     */
    public Map<String, Object> getTenantStats(Long tenantId) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPaid", 13200.0);
        stats.put("totalOutstanding", 1200.0);
        stats.put("onTimePayments", 11);
        stats.put("latePayments", 1);
        stats.put("averagePaymentTime", 2.5); // days
        stats.put("contractDuration", 365); // days
        stats.put("maintenanceRequests", 3);
        stats.put("resolvedRequests", 2);
        stats.put("averageResolutionTime", 3.5); // days
        
        // Payment history for chart
        List<Map<String, Object>> paymentHistory = new ArrayList<>();
        String[] months = {"Oct 2024", "Nov 2024", "Dec 2024"};
        double[] amounts = {1200.0, 1200.0, 1200.0};
        boolean[] onTime = {true, false, true};
        
        for (int i = 0; i < 3; i++) {
            Map<String, Object> payment = new HashMap<>();
            payment.put("month", months[i]);
            payment.put("amount", amounts[i]);
            payment.put("onTime", onTime[i]);
            paymentHistory.add(payment);
        }
        stats.put("paymentHistory", paymentHistory);
        
        return stats;
    }
    
    /**
     * Get payment methods
     */
    public List<Map<String, Object>> getPaymentMethods(Long tenantId) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        List<Map<String, Object>> paymentMethods = new ArrayList<>();
        
        Map<String, Object> creditCard = new HashMap<>();
        creditCard.put("id", 1L);
        creditCard.put("type", "CREDIT_CARD");
        creditCard.put("name", "Visa ending in 4242");
        creditCard.put("lastFour", "4242");
        creditCard.put("expiryDate", "12/25");
        creditCard.put("isDefault", true);
        creditCard.put("isActive", true);
        creditCard.put("provider", "Stripe");
        creditCard.put("createdAt", LocalDateTime.now().minusMonths(3).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        paymentMethods.add(creditCard);
        
        Map<String, Object> bankAccount = new HashMap<>();
        bankAccount.put("id", 2L);
        bankAccount.put("type", "BANK_ACCOUNT");
        bankAccount.put("name", "Checking account ending in 1234");
        bankAccount.put("lastFour", "1234");
        bankAccount.put("isDefault", false);
        bankAccount.put("isActive", true);
        bankAccount.put("provider", "ACH");
        bankAccount.put("createdAt", LocalDateTime.now().minusMonths(1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        paymentMethods.add(bankAccount);
        
        return paymentMethods;
    }
    
    /**
     * Add payment method
     */
    public Map<String, Object> addPaymentMethod(Long tenantId, Map<String, Object> paymentMethodData) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        Map<String, Object> paymentMethod = new HashMap<>();
        paymentMethod.put("id", System.currentTimeMillis());
        paymentMethod.put("type", paymentMethodData.get("type"));
        paymentMethod.put("name", paymentMethodData.get("name"));
        paymentMethod.put("lastFour", paymentMethodData.get("lastFour"));
        paymentMethod.put("expiryDate", paymentMethodData.get("expiryDate"));
        paymentMethod.put("isDefault", paymentMethodData.getOrDefault("isDefault", false));
        paymentMethod.put("isActive", true);
        paymentMethod.put("provider", paymentMethodData.getOrDefault("provider", "Stripe"));
        paymentMethod.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        return paymentMethod;
    }
    
    /**
     * Process payment
     */
    public Map<String, Object> processPayment(Long tenantId, Map<String, Object> paymentData) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        Map<String, Object> payment = new HashMap<>();
        payment.put("id", System.currentTimeMillis());
        payment.put("invoiceId", paymentData.get("invoiceId"));
        payment.put("amount", paymentData.get("amount"));
        payment.put("paymentDate", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        payment.put("paymentMethod", paymentData.get("paymentMethod"));
        payment.put("transactionId", "TXN-" + System.currentTimeMillis());
        payment.put("status", "COMPLETED");
        payment.put("description", "Online Payment");
        payment.put("processingFee", 2.50);
        
        return payment;
    }
    
    /**
     * Download document
     */
    public byte[] downloadDocument(Long documentId, Long tenantId) {
        Long currentTenantId = getCurrentTenantId(tenantId);
        
        // In real implementation, retrieve file from storage
        // For now, return sample PDF content
        String sampleContent = "Sample document content for document ID: " + documentId;
        return sampleContent.getBytes();
    }
}
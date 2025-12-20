package com.rentmaster.tenant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tenant-portal")
@CrossOrigin(origins = "*")
public class TenantPortalController {
    
    @Autowired
    private TenantPortalService tenantPortalService;
    
    /**
     * Get tenant dashboard data
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getTenantDashboard(
            @RequestParam(required = false) Long tenantId) {
        try {
            Map<String, Object> dashboard = tenantPortalService.getTenantDashboard(tenantId);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get tenant profile
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getTenantProfile(
            @RequestParam(required = false) Long tenantId) {
        try {
            Map<String, Object> profile = tenantPortalService.getTenantProfile(tenantId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update tenant profile
     */
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateTenantProfile(
            @RequestBody Map<String, Object> profileData,
            @RequestParam(required = false) Long tenantId) {
        try {
            Map<String, Object> updatedProfile = tenantPortalService.updateTenantProfile(tenantId, profileData);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get tenant's current contract
     */
    @GetMapping("/contract")
    public ResponseEntity<Map<String, Object>> getCurrentContract(
            @RequestParam(required = false) Long tenantId) {
        try {
            Map<String, Object> contract = tenantPortalService.getCurrentContract(tenantId);
            return ResponseEntity.ok(contract);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get tenant's invoices
     */
    @GetMapping("/invoices")
    public ResponseEntity<List<Map<String, Object>>> getTenantInvoices(
            @RequestParam(required = false) Long tenantId,
            @RequestParam(defaultValue = "PENDING") String status,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> invoices = tenantPortalService.getTenantInvoices(tenantId, status, limit);
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get tenant's payment history
     */
    @GetMapping("/payments")
    public ResponseEntity<List<Map<String, Object>>> getPaymentHistory(
            @RequestParam(required = false) Long tenantId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> payments = tenantPortalService.getPaymentHistory(tenantId, limit);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Submit maintenance request
     */
    @PostMapping("/maintenance-requests")
    public ResponseEntity<Map<String, Object>> submitMaintenanceRequest(
            @RequestBody Map<String, Object> requestData,
            @RequestParam(required = false) Long tenantId) {
        try {
            Map<String, Object> request = tenantPortalService.submitMaintenanceRequest(tenantId, requestData);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get tenant's maintenance requests
     */
    @GetMapping("/maintenance-requests")
    public ResponseEntity<List<Map<String, Object>>> getMaintenanceRequests(
            @RequestParam(required = false) Long tenantId,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> requests = tenantPortalService.getMaintenanceRequests(tenantId, limit);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get tenant's documents
     */
    @GetMapping("/documents")
    public ResponseEntity<List<Map<String, Object>>> getTenantDocuments(
            @RequestParam(required = false) Long tenantId) {
        try {
            List<Map<String, Object>> documents = tenantPortalService.getTenantDocuments(tenantId);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get tenant notifications
     */
    @GetMapping("/notifications")
    public ResponseEntity<List<Map<String, Object>>> getTenantNotifications(
            @RequestParam(required = false) Long tenantId,
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Map<String, Object>> notifications = tenantPortalService.getTenantNotifications(tenantId, unreadOnly, limit);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Mark notification as read
     */
    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(
            @PathVariable Long notificationId,
            @RequestParam(required = false) Long tenantId) {
        try {
            tenantPortalService.markNotificationAsRead(notificationId, tenantId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get tenant statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTenantStats(
            @RequestParam(required = false) Long tenantId) {
        try {
            Map<String, Object> stats = tenantPortalService.getTenantStats(tenantId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get payment methods
     */
    @GetMapping("/payment-methods")
    public ResponseEntity<List<Map<String, Object>>> getPaymentMethods(
            @RequestParam(required = false) Long tenantId) {
        try {
            List<Map<String, Object>> paymentMethods = tenantPortalService.getPaymentMethods(tenantId);
            return ResponseEntity.ok(paymentMethods);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Add payment method
     */
    @PostMapping("/payment-methods")
    public ResponseEntity<Map<String, Object>> addPaymentMethod(
            @RequestBody Map<String, Object> paymentMethodData,
            @RequestParam(required = false) Long tenantId) {
        try {
            Map<String, Object> paymentMethod = tenantPortalService.addPaymentMethod(tenantId, paymentMethodData);
            return ResponseEntity.ok(paymentMethod);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Process payment
     */
    @PostMapping("/payments")
    public ResponseEntity<Map<String, Object>> processPayment(
            @RequestBody Map<String, Object> paymentData,
            @RequestParam(required = false) Long tenantId) {
        try {
            Map<String, Object> payment = tenantPortalService.processPayment(tenantId, paymentData);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Download document
     */
    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable Long documentId,
            @RequestParam(required = false) Long tenantId) {
        try {
            byte[] documentData = tenantPortalService.downloadDocument(documentId, tenantId);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/octet-stream")
                    .header("Content-Disposition", "attachment; filename=document.pdf")
                    .body(documentData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
package com.rentmaster.mobile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mobile")
@CrossOrigin(origins = "*")
public class MobileController {

    @Autowired
    private MobileService mobileService;

    // Mobile Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getMobileDashboard(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String userType) {
        Map<String, Object> dashboard = mobileService.getMobileDashboard(userId, userType);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/dashboard/widgets")
    public ResponseEntity<List<Map<String, Object>>> getDashboardWidgets(
            @RequestParam Long userId,
            @RequestParam String userType) {
        List<Map<String, Object>> widgets = mobileService.getDashboardWidgets(userId, userType);
        return ResponseEntity.ok(widgets);
    }

    @PostMapping("/dashboard/widgets/reorder")
    public ResponseEntity<Map<String, Object>> reorderDashboardWidgets(
            @RequestParam Long userId,
            @RequestBody List<Map<String, Object>> widgetOrder) {
        Map<String, Object> result = mobileService.reorderDashboardWidgets(userId, widgetOrder);
        return ResponseEntity.ok(result);
    }

    // Mobile Payments
    @GetMapping("/payments/methods")
    public ResponseEntity<List<Map<String, Object>>> getMobilePaymentMethods(@RequestParam Long tenantId) {
        List<Map<String, Object>> methods = mobileService.getMobilePaymentMethods(tenantId);
        return ResponseEntity.ok(methods);
    }

    @PostMapping("/payments/process")
    public ResponseEntity<Map<String, Object>> processMobilePayment(@RequestBody Map<String, Object> paymentData) {
        Map<String, Object> result = mobileService.processMobilePayment(paymentData);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/payments/apple-pay")
    public ResponseEntity<Map<String, Object>> processApplePayPayment(@RequestBody Map<String, Object> paymentData) {
        Map<String, Object> result = mobileService.processApplePayPayment(paymentData);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/payments/google-pay")
    public ResponseEntity<Map<String, Object>> processGooglePayPayment(@RequestBody Map<String, Object> paymentData) {
        Map<String, Object> result = mobileService.processGooglePayPayment(paymentData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/payments/history")
    public ResponseEntity<List<Map<String, Object>>> getMobilePaymentHistory(
            @RequestParam Long tenantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Map<String, Object>> history = mobileService.getMobilePaymentHistory(tenantId, page, size);
        return ResponseEntity.ok(history);
    }

    // QR Code Functionality
    @PostMapping("/qr/generate")
    public ResponseEntity<Map<String, Object>> generateQRCode(@RequestBody Map<String, Object> qrData) {
        Map<String, Object> result = mobileService.generateQRCode(qrData);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/qr/scan")
    public ResponseEntity<Map<String, Object>> processQRCodeScan(@RequestBody Map<String, Object> scanData) {
        Map<String, Object> result = mobileService.processQRCodeScan(scanData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/qr/actions")
    public ResponseEntity<List<Map<String, Object>>> getQRCodeActions() {
        List<Map<String, Object>> actions = mobileService.getQRCodeActions();
        return ResponseEntity.ok(actions);
    }

    @PostMapping("/qr/property/{propertyId}/checkin")
    public ResponseEntity<Map<String, Object>> propertyCheckIn(
            @PathVariable Long propertyId,
            @RequestBody Map<String, Object> checkInData) {
        Map<String, Object> result = mobileService.propertyCheckIn(propertyId, checkInData);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/qr/maintenance/{requestId}/update")
    public ResponseEntity<Map<String, Object>> updateMaintenanceViaQR(
            @PathVariable Long requestId,
            @RequestBody Map<String, Object> updateData) {
        Map<String, Object> result = mobileService.updateMaintenanceViaQR(requestId, updateData);
        return ResponseEntity.ok(result);
    }

    // Offline Mode Support
    @GetMapping("/offline/sync-data")
    public ResponseEntity<Map<String, Object>> getSyncData(
            @RequestParam Long userId,
            @RequestParam String userType,
            @RequestParam(required = false) String lastSyncTimestamp) {
        Map<String, Object> syncData = mobileService.getSyncData(userId, userType, lastSyncTimestamp);
        return ResponseEntity.ok(syncData);
    }

    @PostMapping("/offline/sync-upload")
    public ResponseEntity<Map<String, Object>> uploadOfflineData(@RequestBody Map<String, Object> offlineData) {
        Map<String, Object> result = mobileService.uploadOfflineData(offlineData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/offline/essential-data")
    public ResponseEntity<Map<String, Object>> getEssentialOfflineData(
            @RequestParam Long userId,
            @RequestParam String userType) {
        Map<String, Object> essentialData = mobileService.getEssentialOfflineData(userId, userType);
        return ResponseEntity.ok(essentialData);
    }

    @PostMapping("/offline/queue-action")
    public ResponseEntity<Map<String, Object>> queueOfflineAction(@RequestBody Map<String, Object> actionData) {
        Map<String, Object> result = mobileService.queueOfflineAction(actionData);
        return ResponseEntity.ok(result);
    }

    // Mobile Notifications
    @PostMapping("/notifications/register-device")
    public ResponseEntity<Map<String, Object>> registerMobileDevice(@RequestBody Map<String, Object> deviceData) {
        Map<String, Object> result = mobileService.registerMobileDevice(deviceData);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/notifications/send-push")
    public ResponseEntity<Map<String, Object>> sendPushNotification(@RequestBody Map<String, Object> notificationData) {
        Map<String, Object> result = mobileService.sendPushNotification(notificationData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/notifications/history")
    public ResponseEntity<List<Map<String, Object>>> getMobileNotificationHistory(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<Map<String, Object>> history = mobileService.getMobileNotificationHistory(userId, page, size);
        return ResponseEntity.ok(history);
    }

    // Mobile-specific Features
    @PostMapping("/camera/upload")
    public ResponseEntity<Map<String, Object>> uploadCameraImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam("relatedId") Long relatedId) {
        Map<String, Object> result = mobileService.uploadCameraImage(file, type, relatedId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/location/update")
    public ResponseEntity<Map<String, Object>> updateUserLocation(@RequestBody Map<String, Object> locationData) {
        Map<String, Object> result = mobileService.updateUserLocation(locationData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/nearby/properties")
    public ResponseEntity<List<Map<String, Object>>> getNearbyProperties(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double radiusKm) {
        List<Map<String, Object>> properties = mobileService.getNearbyProperties(latitude, longitude, radiusKm);
        return ResponseEntity.ok(properties);
    }

    // Mobile App Configuration
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getMobileAppConfig(
            @RequestParam String platform,
            @RequestParam String version) {
        Map<String, Object> config = mobileService.getMobileAppConfig(platform, version);
        return ResponseEntity.ok(config);
    }

    @GetMapping("/version-check")
    public ResponseEntity<Map<String, Object>> checkAppVersion(
            @RequestParam String platform,
            @RequestParam String currentVersion) {
        Map<String, Object> versionInfo = mobileService.checkAppVersion(platform, currentVersion);
        return ResponseEntity.ok(versionInfo);
    }

    // Mobile Analytics
    @PostMapping("/analytics/track-event")
    public ResponseEntity<Map<String, Object>> trackMobileEvent(@RequestBody Map<String, Object> eventData) {
        Map<String, Object> result = mobileService.trackMobileEvent(eventData);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/analytics/track-screen")
    public ResponseEntity<Map<String, Object>> trackScreenView(@RequestBody Map<String, Object> screenData) {
        Map<String, Object> result = mobileService.trackScreenView(screenData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/analytics/usage-stats")
    public ResponseEntity<Map<String, Object>> getMobileUsageStats(
            @RequestParam Long userId,
            @RequestParam(required = false) String period) {
        Map<String, Object> stats = mobileService.getMobileUsageStats(userId, period);
        return ResponseEntity.ok(stats);
    }

    // Emergency Features
    @PostMapping("/emergency/alert")
    public ResponseEntity<Map<String, Object>> sendEmergencyAlert(@RequestBody Map<String, Object> alertData) {
        Map<String, Object> result = mobileService.sendEmergencyAlert(alertData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/emergency/contacts")
    public ResponseEntity<List<Map<String, Object>>> getEmergencyContacts(@RequestParam Long propertyId) {
        List<Map<String, Object>> contacts = mobileService.getEmergencyContacts(propertyId);
        return ResponseEntity.ok(contacts);
    }
}
package com.rentmaster.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean read,
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        String username = authentication.getName();
        NotificationType notificationType = type != null ? NotificationType.valueOf(type.toUpperCase()) : null;
        NotificationPriority notificationPriority = priority != null ? NotificationPriority.valueOf(priority.toUpperCase()) : null;
        
        Page<Notification> notifications = notificationService.getNotifications(
            username, notificationType, read, notificationPriority, page, size
        );

        Map<String, Object> response = Map.of(
            "items", notifications.getContent(),
            "total", notifications.getTotalElements(),
            "page", notifications.getNumber(),
            "size", notifications.getSize()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        String username = authentication.getName();
        long count = notificationService.getUnreadCount(username);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        notificationService.markAsRead(username, id);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        String username = authentication.getName();
        notificationService.markAllAsRead(username);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        notificationService.deleteNotification(username, id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }

    @GetMapping("/settings")
    public ResponseEntity<NotificationSettings> getSettings(Authentication authentication) {
        String username = authentication.getName();
        NotificationSettings settings = notificationService.getSettings(username);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings")
    public ResponseEntity<NotificationSettings> updateSettings(
            @RequestBody NotificationSettings settings,
            Authentication authentication) {
        String username = authentication.getName();
        NotificationSettings updatedSettings = notificationService.updateSettings(username, settings);
        return ResponseEntity.ok(updatedSettings);
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> testNotification(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        String username = authentication.getName();
        String type = request.get("type");
        notificationService.testNotification(username, type);
        return ResponseEntity.ok(Map.of("message", "Test notification sent"));
    }
}
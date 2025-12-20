package com.rentmaster.notification;

import com.rentmaster.user.User;
import com.rentmaster.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationSettingsRepository settingsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailNotificationService emailNotificationService;

    public Page<Notification> getNotifications(String username, NotificationType type, Boolean read, 
                                             NotificationPriority priority, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size);

        if (type != null) {
            return notificationRepository.findByUserAndTypeOrderByCreatedAtDesc(user, type, pageable);
        } else if (read != null) {
            return notificationRepository.findByUserAndReadOrderByCreatedAtDesc(user, read, pageable);
        } else if (priority != null) {
            return notificationRepository.findByUserAndPriorityOrderByCreatedAtDesc(user, priority, pageable);
        } else {
            return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        }
    }

    public long getUnreadCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countUnreadByUser(user);
    }

    @Transactional
    public void markAsRead(String username, Long notificationId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationRepository.markAllAsReadByUser(user);
    }

    @Transactional
    public void deleteNotification(String username, Long notificationId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        notificationRepository.delete(notification);
    }

    @Transactional
    public void createNotification(User user, NotificationType type, String title, String message, 
                                 NotificationPriority priority, String relatedEntityType, Long relatedEntityId) {
        // Check user's notification settings
        NotificationSettings settings = getOrCreateSettings(user);
        
        if (!settings.isInAppNotifications()) {
            return; // User has disabled in-app notifications
        }

        // Check specific notification type settings
        if (!isNotificationTypeEnabled(settings, type)) {
            return;
        }

        Notification notification = new Notification(user, type, title, message, priority);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setRelatedEntityId(relatedEntityId);
        
        notificationRepository.save(notification);

        // Send email notification if enabled
        if (settings.isEmailNotifications() && user.getEmail() != null) {
            emailNotificationService.sendNotificationEmail(user.getEmail(), title, message);
        }
    }

    public void createNotificationForAllUsers(NotificationType type, String title, String message, 
                                            NotificationPriority priority) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            createNotification(user, type, title, message, priority, null, null);
        }
    }

    public NotificationSettings getSettings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getOrCreateSettings(user);
    }

    @Transactional
    public NotificationSettings updateSettings(String username, NotificationSettings newSettings) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NotificationSettings settings = getOrCreateSettings(user);
        
        settings.setEmailNotifications(newSettings.isEmailNotifications());
        settings.setSmsNotifications(newSettings.isSmsNotifications());
        settings.setInAppNotifications(newSettings.isInAppNotifications());
        settings.setInvoiceDueReminders(newSettings.isInvoiceDueReminders());
        settings.setPaymentReceivedNotifications(newSettings.isPaymentReceivedNotifications());
        settings.setContractExpiringReminders(newSettings.isContractExpiringReminders());
        settings.setMaintenanceRequestNotifications(newSettings.isMaintenanceRequestNotifications());
        settings.setReminderDaysBefore(newSettings.getReminderDaysBefore());

        return settingsRepository.save(settings);
    }

    public void testNotification(String username, String type) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NotificationType notificationType = NotificationType.valueOf(type.toUpperCase());
        String title = "Test " + type.toLowerCase().replace("_", " ") + " notification";
        String message = "This is a test notification to verify your notification settings are working correctly.";
        
        createNotification(user, notificationType, title, message, NotificationPriority.LOW, null, null);
    }

    private NotificationSettings getOrCreateSettings(User user) {
        return settingsRepository.findByUser(user)
                .orElseGet(() -> {
                    NotificationSettings settings = new NotificationSettings(user);
                    return settingsRepository.save(settings);
                });
    }

    private boolean isNotificationTypeEnabled(NotificationSettings settings, NotificationType type) {
        switch (type) {
            case INVOICE_DUE:
                return settings.isInvoiceDueReminders();
            case PAYMENT_RECEIVED:
                return settings.isPaymentReceivedNotifications();
            case CONTRACT_EXPIRING:
                return settings.isContractExpiringReminders();
            case MAINTENANCE_REQUEST:
                return settings.isMaintenanceRequestNotifications();
            case SYSTEM:
            case REMINDER:
            default:
                return true; // Always allow system and reminder notifications
        }
    }
}
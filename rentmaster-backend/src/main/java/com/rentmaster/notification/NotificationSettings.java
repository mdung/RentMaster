package com.rentmaster.notification;

import com.rentmaster.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "notification_settings")
public class NotificationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "email_notifications", nullable = false)
    private boolean emailNotifications = true;

    @Column(name = "sms_notifications", nullable = false)
    private boolean smsNotifications = false;

    @Column(name = "in_app_notifications", nullable = false)
    private boolean inAppNotifications = true;

    @Column(name = "invoice_due_reminders", nullable = false)
    private boolean invoiceDueReminders = true;

    @Column(name = "payment_received_notifications", nullable = false)
    private boolean paymentReceivedNotifications = true;

    @Column(name = "contract_expiring_reminders", nullable = false)
    private boolean contractExpiringReminders = true;

    @Column(name = "maintenance_request_notifications", nullable = false)
    private boolean maintenanceRequestNotifications = true;

    @Column(name = "reminder_days_before", nullable = false)
    private int reminderDaysBefore = 3;

    public NotificationSettings() {}

    public NotificationSettings(User user) {
        this.user = user;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public boolean isSmsNotifications() {
        return smsNotifications;
    }

    public void setSmsNotifications(boolean smsNotifications) {
        this.smsNotifications = smsNotifications;
    }

    public boolean isInAppNotifications() {
        return inAppNotifications;
    }

    public void setInAppNotifications(boolean inAppNotifications) {
        this.inAppNotifications = inAppNotifications;
    }

    public boolean isInvoiceDueReminders() {
        return invoiceDueReminders;
    }

    public void setInvoiceDueReminders(boolean invoiceDueReminders) {
        this.invoiceDueReminders = invoiceDueReminders;
    }

    public boolean isPaymentReceivedNotifications() {
        return paymentReceivedNotifications;
    }

    public void setPaymentReceivedNotifications(boolean paymentReceivedNotifications) {
        this.paymentReceivedNotifications = paymentReceivedNotifications;
    }

    public boolean isContractExpiringReminders() {
        return contractExpiringReminders;
    }

    public void setContractExpiringReminders(boolean contractExpiringReminders) {
        this.contractExpiringReminders = contractExpiringReminders;
    }

    public boolean isMaintenanceRequestNotifications() {
        return maintenanceRequestNotifications;
    }

    public void setMaintenanceRequestNotifications(boolean maintenanceRequestNotifications) {
        this.maintenanceRequestNotifications = maintenanceRequestNotifications;
    }

    public int getReminderDaysBefore() {
        return reminderDaysBefore;
    }

    public void setReminderDaysBefore(int reminderDaysBefore) {
        this.reminderDaysBefore = reminderDaysBefore;
    }
}
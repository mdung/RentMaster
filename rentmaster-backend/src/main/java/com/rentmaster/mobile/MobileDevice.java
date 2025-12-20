package com.rentmaster.mobile;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mobile_devices")
public class MobileDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "device_token", nullable = false, unique = true)
    private String deviceToken;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Platform platform;

    @Column(name = "device_model")
    private String deviceModel;

    @Column(name = "device_os_version")
    private String deviceOsVersion;

    @Column(name = "app_version")
    private String appVersion;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "push_notifications_enabled")
    private Boolean pushNotificationsEnabled = true;

    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Device capabilities
    @Column(name = "supports_biometric")
    private Boolean supportsBiometric = false;

    @Column(name = "supports_nfc")
    private Boolean supportsNfc = false;

    @Column(name = "supports_camera")
    private Boolean supportsCamera = true;

    @Column(name = "supports_location")
    private Boolean supportsLocation = false;

    // Notification preferences
    @Column(name = "notification_sound")
    private String notificationSound = "default";

    @Column(name = "notification_vibration")
    private Boolean notificationVibration = true;

    @Column(name = "quiet_hours_enabled")
    private Boolean quietHoursEnabled = false;

    @Column(name = "quiet_hours_start")
    private String quietHoursStart = "22:00";

    @Column(name = "quiet_hours_end")
    private String quietHoursEnd = "08:00";

    public enum Platform {
        IOS,
        ANDROID,
        HYBRID
    }

    // Constructors
    public MobileDevice() {
        this.registeredAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.lastActiveAt = LocalDateTime.now();
    }

    public MobileDevice(Long userId, String deviceToken, Platform platform) {
        this();
        this.userId = userId;
        this.deviceToken = deviceToken;
        this.platform = platform;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getDeviceToken() {
        return deviceToken;
    }

    public void setDeviceToken(String deviceToken) {
        this.deviceToken = deviceToken;
    }

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public String getDeviceModel() {
        return deviceModel;
    }

    public void setDeviceModel(String deviceModel) {
        this.deviceModel = deviceModel;
    }

    public String getDeviceOsVersion() {
        return deviceOsVersion;
    }

    public void setDeviceOsVersion(String deviceOsVersion) {
        this.deviceOsVersion = deviceOsVersion;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getPushNotificationsEnabled() {
        return pushNotificationsEnabled;
    }

    public void setPushNotificationsEnabled(Boolean pushNotificationsEnabled) {
        this.pushNotificationsEnabled = pushNotificationsEnabled;
    }

    public LocalDateTime getLastActiveAt() {
        return lastActiveAt;
    }

    public void setLastActiveAt(LocalDateTime lastActiveAt) {
        this.lastActiveAt = lastActiveAt;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getSupportsBiometric() {
        return supportsBiometric;
    }

    public void setSupportsBiometric(Boolean supportsBiometric) {
        this.supportsBiometric = supportsBiometric;
    }

    public Boolean getSupportsNfc() {
        return supportsNfc;
    }

    public void setSupportsNfc(Boolean supportsNfc) {
        this.supportsNfc = supportsNfc;
    }

    public Boolean getSupportsCamera() {
        return supportsCamera;
    }

    public void setSupportsCamera(Boolean supportsCamera) {
        this.supportsCamera = supportsCamera;
    }

    public Boolean getSupportsLocation() {
        return supportsLocation;
    }

    public void setSupportsLocation(Boolean supportsLocation) {
        this.supportsLocation = supportsLocation;
    }

    public String getNotificationSound() {
        return notificationSound;
    }

    public void setNotificationSound(String notificationSound) {
        this.notificationSound = notificationSound;
    }

    public Boolean getNotificationVibration() {
        return notificationVibration;
    }

    public void setNotificationVibration(Boolean notificationVibration) {
        this.notificationVibration = notificationVibration;
    }

    public Boolean getQuietHoursEnabled() {
        return quietHoursEnabled;
    }

    public void setQuietHoursEnabled(Boolean quietHoursEnabled) {
        this.quietHoursEnabled = quietHoursEnabled;
    }

    public String getQuietHoursStart() {
        return quietHoursStart;
    }

    public void setQuietHoursStart(String quietHoursStart) {
        this.quietHoursStart = quietHoursStart;
    }

    public String getQuietHoursEnd() {
        return quietHoursEnd;
    }

    public void setQuietHoursEnd(String quietHoursEnd) {
        this.quietHoursEnd = quietHoursEnd;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateLastActive() {
        this.lastActiveAt = LocalDateTime.now();
    }
}
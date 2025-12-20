package com.rentmaster.communication;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "notification_preferences")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class NotificationPreference {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false)
    private NotificationType notificationType;
    
    @ElementCollection
    @CollectionTable(name = "notification_preference_channels", joinColumns = @JoinColumn(name = "preference_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "channel")
    private List<ChannelType> channels;
    
    @Column(name = "enabled", nullable = false)
    private Boolean enabled = true;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "frequency", nullable = false)
    private Frequency frequency = Frequency.IMMEDIATE;
    
    @Embedded
    private QuietHours quietHours;
    
    public enum NotificationType {
        INVOICE_DUE,
        PAYMENT_RECEIVED,
        CONTRACT_EXPIRING,
        MAINTENANCE_REQUEST,
        SYSTEM,
        MARKETING
    }
    
    public enum ChannelType {
        EMAIL,
        SMS,
        PUSH,
        WHATSAPP,
        IN_APP
    }
    
    public enum Frequency {
        IMMEDIATE,
        DAILY_DIGEST,
        WEEKLY_DIGEST,
        NEVER
    }
    
    @Embeddable
    public static class QuietHours {
        @Column(name = "quiet_hours_enabled")
        private Boolean enabled = false;
        
        @Column(name = "quiet_hours_start")
        private String startTime;
        
        @Column(name = "quiet_hours_end")
        private String endTime;
        
        // Constructors
        public QuietHours() {}
        
        public QuietHours(Boolean enabled, String startTime, String endTime) {
            this.enabled = enabled;
            this.startTime = startTime;
            this.endTime = endTime;
        }
        
        // Getters and Setters
        public Boolean getEnabled() {
            return enabled;
        }
        
        public void setEnabled(Boolean enabled) {
            this.enabled = enabled;
        }
        
        public String getStartTime() {
            return startTime;
        }
        
        public void setStartTime(String startTime) {
            this.startTime = startTime;
        }
        
        public String getEndTime() {
            return endTime;
        }
        
        public void setEndTime(String endTime) {
            this.endTime = endTime;
        }
    }
    
    // Constructors
    public NotificationPreference() {}
    
    public NotificationPreference(Long userId, NotificationType notificationType, List<ChannelType> channels) {
        this.userId = userId;
        this.notificationType = notificationType;
        this.channels = channels;
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
    
    public NotificationType getNotificationType() {
        return notificationType;
    }
    
    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }
    
    public List<ChannelType> getChannels() {
        return channels;
    }
    
    public void setChannels(List<ChannelType> channels) {
        this.channels = channels;
    }
    
    public Boolean getEnabled() {
        return enabled;
    }
    
    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
    
    public Frequency getFrequency() {
        return frequency;
    }
    
    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }
    
    public QuietHours getQuietHours() {
        return quietHours;
    }
    
    public void setQuietHours(QuietHours quietHours) {
        this.quietHours = quietHours;
    }
}
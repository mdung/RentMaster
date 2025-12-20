package com.rentmaster.integration;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "integrations")
public class Integration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IntegrationType type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "integration_configuration", joinColumns = @JoinColumn(name = "integration_id"))
    @MapKeyColumn(name = "config_key")
    @Column(name = "config_value", columnDefinition = "TEXT")
    private Map<String, String> configuration;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "auto_sync")
    private Boolean autoSync = false;

    @Column(name = "sync_frequency_minutes")
    private Integer syncFrequencyMinutes = 60;

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "next_sync_at")
    private LocalDateTime nextSyncAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "sync_status")
    private SyncStatus syncStatus = SyncStatus.IDLE;

    @Column(name = "success_count")
    private Long successCount = 0L;

    @Column(name = "error_count")
    private Long errorCount = 0L;

    @Column(name = "last_error_message", columnDefinition = "TEXT")
    private String lastErrorMessage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum IntegrationType {
        QUICKBOOKS,
        XERO,
        BANK_PLAID,
        BANK_YODLEE,
        GOOGLE_CALENDAR,
        OUTLOOK_CALENDAR,
        STRIPE,
        PAYPAL,
        SQUARE,
        MAILCHIMP,
        SENDGRID,
        TWILIO,
        SLACK,
        ZAPIER,
        CUSTOM_WEBHOOK
    }

    public enum SyncStatus {
        IDLE,
        SYNCING,
        SUCCESS,
        ERROR,
        CANCELLED
    }

    // Constructors
    public Integration() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Integration(String name, IntegrationType type) {
        this();
        this.name = name;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public IntegrationType getType() {
        return type;
    }

    public void setType(IntegrationType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Map<String, String> getConfiguration() {
        return configuration;
    }

    public void setConfiguration(Map<String, String> configuration) {
        this.configuration = configuration;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getAutoSync() {
        return autoSync;
    }

    public void setAutoSync(Boolean autoSync) {
        this.autoSync = autoSync;
    }

    public Integer getSyncFrequencyMinutes() {
        return syncFrequencyMinutes;
    }

    public void setSyncFrequencyMinutes(Integer syncFrequencyMinutes) {
        this.syncFrequencyMinutes = syncFrequencyMinutes;
    }

    public LocalDateTime getLastSyncAt() {
        return lastSyncAt;
    }

    public void setLastSyncAt(LocalDateTime lastSyncAt) {
        this.lastSyncAt = lastSyncAt;
    }

    public LocalDateTime getNextSyncAt() {
        return nextSyncAt;
    }

    public void setNextSyncAt(LocalDateTime nextSyncAt) {
        this.nextSyncAt = nextSyncAt;
    }

    public SyncStatus getSyncStatus() {
        return syncStatus;
    }

    public void setSyncStatus(SyncStatus syncStatus) {
        this.syncStatus = syncStatus;
    }

    public Long getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(Long successCount) {
        this.successCount = successCount;
    }

    public Long getErrorCount() {
        return errorCount;
    }

    public void setErrorCount(Long errorCount) {
        this.errorCount = errorCount;
    }

    public String getLastErrorMessage() {
        return lastErrorMessage;
    }

    public void setLastErrorMessage(String lastErrorMessage) {
        this.lastErrorMessage = lastErrorMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Helper Methods
    public void incrementSuccessCount() {
        this.successCount++;
        this.lastSyncAt = LocalDateTime.now();
        this.syncStatus = SyncStatus.SUCCESS;
        calculateNextSyncTime();
    }

    public void incrementErrorCount(String errorMessage) {
        this.errorCount++;
        this.lastErrorMessage = errorMessage;
        this.syncStatus = SyncStatus.ERROR;
        calculateNextSyncTime();
    }

    private void calculateNextSyncTime() {
        if (this.autoSync && this.syncFrequencyMinutes != null) {
            this.nextSyncAt = LocalDateTime.now().plusMinutes(this.syncFrequencyMinutes);
        }
    }

    public boolean isReadyForSync() {
        return this.isActive && this.autoSync && 
               this.nextSyncAt != null && 
               LocalDateTime.now().isAfter(this.nextSyncAt) &&
               this.syncStatus != SyncStatus.SYNCING;
    }
}
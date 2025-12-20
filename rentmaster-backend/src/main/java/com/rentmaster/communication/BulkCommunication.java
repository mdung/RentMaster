package com.rentmaster.communication;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bulk_communications")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BulkCommunication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "recipient_type", nullable = false)
    private RecipientType recipientType;
    
    @ElementCollection
    @CollectionTable(name = "bulk_communication_recipients", joinColumns = @JoinColumn(name = "bulk_id"))
    @Column(name = "recipient_id")
    private List<Long> recipientIds;
    
    @ElementCollection
    @CollectionTable(name = "bulk_communication_channels", joinColumns = @JoinColumn(name = "bulk_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "channel")
    private List<NotificationChannel.ChannelType> channels;
    
    @Column(name = "template_id")
    private Long templateId;
    
    @Column(name = "subject")
    private String subject;
    
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BulkStatus status;
    
    @Column(name = "total_recipients", nullable = false)
    private Integer totalRecipients = 0;
    
    @Column(name = "sent_count", nullable = false)
    private Integer sentCount = 0;
    
    @Column(name = "delivered_count", nullable = false)
    private Integer deliveredCount = 0;
    
    @Column(name = "failed_count", nullable = false)
    private Integer failedCount = 0;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    public enum RecipientType {
        ALL_TENANTS,
        ACTIVE_TENANTS,
        OVERDUE_TENANTS,
        EXPIRING_CONTRACTS,
        CUSTOM
    }
    
    public enum BulkStatus {
        DRAFT,
        SCHEDULED,
        SENDING,
        COMPLETED,
        FAILED
    }
    
    // Constructors
    public BulkCommunication() {
        this.createdAt = LocalDateTime.now();
        this.status = BulkStatus.DRAFT;
    }
    
    public BulkCommunication(String name, RecipientType recipientType, String message) {
        this();
        this.name = name;
        this.recipientType = recipientType;
        this.message = message;
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
    
    public RecipientType getRecipientType() {
        return recipientType;
    }
    
    public void setRecipientType(RecipientType recipientType) {
        this.recipientType = recipientType;
    }
    
    public List<Long> getRecipientIds() {
        return recipientIds;
    }
    
    public void setRecipientIds(List<Long> recipientIds) {
        this.recipientIds = recipientIds;
    }
    
    public List<NotificationChannel.ChannelType> getChannels() {
        return channels;
    }
    
    public void setChannels(List<NotificationChannel.ChannelType> channels) {
        this.channels = channels;
    }
    
    public Long getTemplateId() {
        return templateId;
    }
    
    public void setTemplateId(Long templateId) {
        this.templateId = templateId;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }
    
    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }
    
    public BulkStatus getStatus() {
        return status;
    }
    
    public void setStatus(BulkStatus status) {
        this.status = status;
    }
    
    public Integer getTotalRecipients() {
        return totalRecipients;
    }
    
    public void setTotalRecipients(Integer totalRecipients) {
        this.totalRecipients = totalRecipients;
    }
    
    public Integer getSentCount() {
        return sentCount;
    }
    
    public void setSentCount(Integer sentCount) {
        this.sentCount = sentCount;
    }
    
    public Integer getDeliveredCount() {
        return deliveredCount;
    }
    
    public void setDeliveredCount(Integer deliveredCount) {
        this.deliveredCount = deliveredCount;
    }
    
    public Integer getFailedCount() {
        return failedCount;
    }
    
    public void setFailedCount(Integer failedCount) {
        this.failedCount = failedCount;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
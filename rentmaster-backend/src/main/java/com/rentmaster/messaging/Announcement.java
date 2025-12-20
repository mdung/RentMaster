package com.rentmaster.messaging;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "announcements")
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(nullable = false)
    private String type; // GENERAL, MAINTENANCE, POLICY, EVENT, EMERGENCY, SYSTEM
    
    @Column(nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    
    @Column(nullable = false)
    private String targetAudience; // ALL_TENANTS, PROPERTY_TENANTS, SPECIFIC_TENANTS, LANDLORDS
    
    @ElementCollection
    @CollectionTable(name = "announcement_property_ids", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "property_id")
    private List<Long> propertyIds;
    
    @ElementCollection
    @CollectionTable(name = "announcement_tenant_ids", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "tenant_id")
    private List<Long> tenantIds;
    
    @Column(nullable = false)
    private Long authorId;
    
    @Column(nullable = false)
    private String authorName;
    
    @Column(nullable = false)
    private String authorType; // LANDLORD, ADMIN, SYSTEM
    
    @Column(nullable = false)
    private LocalDateTime publishDate;
    
    private LocalDateTime expiryDate;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private Boolean isPinned = false;
    
    @Column(nullable = false)
    private Boolean requiresAcknowledgment = false;
    
    @ElementCollection
    @CollectionTable(name = "announcement_read_by", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "user_id")
    private List<Long> readBy;
    
    @ElementCollection
    @CollectionTable(name = "announcement_acknowledged_by", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "user_id")
    private List<Long> acknowledgedBy;
    
    @ElementCollection
    @CollectionTable(name = "announcement_attachments", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "attachment_url")
    private List<String> attachments;
    
    @ElementCollection
    @CollectionTable(name = "announcement_tags", joinColumns = @JoinColumn(name = "announcement_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @Column(nullable = false)
    private Integer viewCount = 0;
    
    @Column(nullable = false)
    private Integer acknowledgmentCount = 0;
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON for additional data
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public Announcement() {}
    
    public Announcement(String title, String content, String type, String targetAudience,
                       Long authorId, String authorName, String authorType) {
        this.title = title;
        this.content = content;
        this.type = type;
        this.targetAudience = targetAudience;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorType = authorType;
        this.priority = "MEDIUM";
        this.publishDate = LocalDateTime.now();
        this.isActive = true;
        this.isPinned = false;
        this.requiresAcknowledgment = false;
        this.viewCount = 0;
        this.acknowledgmentCount = 0;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    
    public List<Long> getPropertyIds() { return propertyIds; }
    public void setPropertyIds(List<Long> propertyIds) { this.propertyIds = propertyIds; }
    
    public List<Long> getTenantIds() { return tenantIds; }
    public void setTenantIds(List<Long> tenantIds) { this.tenantIds = tenantIds; }
    
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    
    public String getAuthorType() { return authorType; }
    public void setAuthorType(String authorType) { this.authorType = authorType; }
    
    public LocalDateTime getPublishDate() { return publishDate; }
    public void setPublishDate(LocalDateTime publishDate) { this.publishDate = publishDate; }
    
    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Boolean getIsPinned() { return isPinned; }
    public void setIsPinned(Boolean isPinned) { this.isPinned = isPinned; }
    
    public Boolean getRequiresAcknowledgment() { return requiresAcknowledgment; }
    public void setRequiresAcknowledgment(Boolean requiresAcknowledgment) { this.requiresAcknowledgment = requiresAcknowledgment; }
    
    public List<Long> getReadBy() { return readBy; }
    public void setReadBy(List<Long> readBy) { this.readBy = readBy; }
    
    public List<Long> getAcknowledgedBy() { return acknowledgedBy; }
    public void setAcknowledgedBy(List<Long> acknowledgedBy) { this.acknowledgedBy = acknowledgedBy; }
    
    public List<String> getAttachments() { return attachments; }
    public void setAttachments(List<String> attachments) { this.attachments = attachments; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    
    public Integer getAcknowledgmentCount() { return acknowledgmentCount; }
    public void setAcknowledgmentCount(Integer acknowledgmentCount) { this.acknowledgmentCount = acknowledgmentCount; }
    
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
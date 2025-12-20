package com.rentmaster.messaging;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tenant_feedback")
public class TenantFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long tenantId;
    
    @Column(nullable = false)
    private String tenantName;
    
    @Column(nullable = false)
    private Long propertyId;
    
    @Column(nullable = false)
    private String propertyName;
    
    private Long contractId;
    
    @Column(nullable = false)
    private String type; // MAINTENANCE, PAYMENT, GENERAL, SUGGESTION, COMPLAINT, SERVICE, PROPERTY
    
    @Column(nullable = false)
    private String category; // URGENT, IMPROVEMENT, COMPLIMENT, ISSUE, FEATURE_REQUEST
    
    @Column(nullable = false)
    private String subject;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    private Integer rating; // 1-5 star rating
    
    @Column(nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    
    @Column(nullable = false)
    private String status; // SUBMITTED, ACKNOWLEDGED, IN_REVIEW, RESOLVED, CLOSED, REJECTED
    
    @ElementCollection
    @CollectionTable(name = "feedback_attachments", joinColumns = @JoinColumn(name = "feedback_id"))
    @Column(name = "attachment_url")
    private List<String> attachments;
    
    @ElementCollection
    @CollectionTable(name = "feedback_tags", joinColumns = @JoinColumn(name = "feedback_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @Column(nullable = false)
    private Boolean isAnonymous = false;
    
    @Column(nullable = false)
    private Boolean allowFollowUp = true;
    
    @Column(nullable = false)
    private Boolean isPublic = false; // Can be shared with other tenants
    
    private LocalDateTime acknowledgedAt;
    
    private Long acknowledgedBy;
    
    private String acknowledgedByName;
    
    private LocalDateTime resolvedAt;
    
    private Long resolvedBy;
    
    private String resolvedByName;
    
    @Column(columnDefinition = "TEXT")
    private String response;
    
    private LocalDateTime respondedAt;
    
    private Long respondedBy;
    
    private String respondedByName;
    
    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;
    
    @Column(columnDefinition = "TEXT")
    private String internalNotes; // Not visible to tenant
    
    private Integer satisfactionRating; // 1-5 rating for resolution
    
    @Column(columnDefinition = "TEXT")
    private String satisfactionComment;
    
    @Column(nullable = false)
    private Boolean requiresAction = false;
    
    private LocalDateTime actionDueDate;
    
    private Long assignedTo;
    
    private String assignedToName;
    
    @Column(columnDefinition = "TEXT")
    private String actionPlan;
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON for additional data
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public TenantFeedback() {}
    
    public TenantFeedback(Long tenantId, String tenantName, Long propertyId, String propertyName,
                         String type, String subject, String message) {
        this.tenantId = tenantId;
        this.tenantName = tenantName;
        this.propertyId = propertyId;
        this.propertyName = propertyName;
        this.type = type;
        this.subject = subject;
        this.message = message;
        this.category = "GENERAL";
        this.priority = "MEDIUM";
        this.status = "SUBMITTED";
        this.isAnonymous = false;
        this.allowFollowUp = true;
        this.isPublic = false;
        this.requiresAction = false;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }
    
    public String getTenantName() { return tenantName; }
    public void setTenantName(String tenantName) { this.tenantName = tenantName; }
    
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
    
    public String getPropertyName() { return propertyName; }
    public void setPropertyName(String propertyName) { this.propertyName = propertyName; }
    
    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public List<String> getAttachments() { return attachments; }
    public void setAttachments(List<String> attachments) { this.attachments = attachments; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }
    
    public Boolean getAllowFollowUp() { return allowFollowUp; }
    public void setAllowFollowUp(Boolean allowFollowUp) { this.allowFollowUp = allowFollowUp; }
    
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    
    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }
    
    public Long getAcknowledgedBy() { return acknowledgedBy; }
    public void setAcknowledgedBy(Long acknowledgedBy) { this.acknowledgedBy = acknowledgedBy; }
    
    public String getAcknowledgedByName() { return acknowledgedByName; }
    public void setAcknowledgedByName(String acknowledgedByName) { this.acknowledgedByName = acknowledgedByName; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public Long getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(Long resolvedBy) { this.resolvedBy = resolvedBy; }
    
    public String getResolvedByName() { return resolvedByName; }
    public void setResolvedByName(String resolvedByName) { this.resolvedByName = resolvedByName; }
    
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    
    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
    
    public Long getRespondedBy() { return respondedBy; }
    public void setRespondedBy(Long respondedBy) { this.respondedBy = respondedBy; }
    
    public String getRespondedByName() { return respondedByName; }
    public void setRespondedByName(String respondedByName) { this.respondedByName = respondedByName; }
    
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
    
    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }
    
    public Integer getSatisfactionRating() { return satisfactionRating; }
    public void setSatisfactionRating(Integer satisfactionRating) { this.satisfactionRating = satisfactionRating; }
    
    public String getSatisfactionComment() { return satisfactionComment; }
    public void setSatisfactionComment(String satisfactionComment) { this.satisfactionComment = satisfactionComment; }
    
    public Boolean getRequiresAction() { return requiresAction; }
    public void setRequiresAction(Boolean requiresAction) { this.requiresAction = requiresAction; }
    
    public LocalDateTime getActionDueDate() { return actionDueDate; }
    public void setActionDueDate(LocalDateTime actionDueDate) { this.actionDueDate = actionDueDate; }
    
    public Long getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Long assignedTo) { this.assignedTo = assignedTo; }
    
    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }
    
    public String getActionPlan() { return actionPlan; }
    public void setActionPlan(String actionPlan) { this.actionPlan = actionPlan; }
    
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
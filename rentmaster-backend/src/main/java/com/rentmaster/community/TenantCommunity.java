package com.rentmaster.community;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tenant_communities")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TenantCommunity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CommunityType type;
    
    @Column(name = "member_count", nullable = false)
    private Integer memberCount = 0;
    
    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = true;
    
    @ElementCollection
    @CollectionTable(name = "community_rules", joinColumns = @JoinColumn(name = "community_id"))
    @Column(name = "rule")
    private List<String> rules;
    
    @ElementCollection
    @CollectionTable(name = "community_moderators", joinColumns = @JoinColumn(name = "community_id"))
    @Column(name = "moderator_name")
    private List<String> moderators;
    
    @Column(name = "property_id")
    private Long propertyId;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    public enum CommunityType {
        PROPERTY,
        BUILDING,
        NEIGHBORHOOD
    }
    
    // Constructors
    public TenantCommunity() {
        this.createdAt = LocalDateTime.now();
    }
    
    public TenantCommunity(String name, String description, CommunityType type) {
        this();
        this.name = name;
        this.description = description;
        this.type = type;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public CommunityType getType() { return type; }
    public void setType(CommunityType type) { this.type = type; }
    
    public Integer getMemberCount() { return memberCount; }
    public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }
    
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    
    public List<String> getRules() { return rules; }
    public void setRules(List<String> rules) { this.rules = rules; }
    
    public List<String> getModerators() { return moderators; }
    public void setModerators(List<String> moderators) { this.moderators = moderators; }
    
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}
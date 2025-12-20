package com.rentmaster.multitenancy;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "permissions")
public class Permission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionType type;
    
    // Resource and Action
    @Column(nullable = false)
    private String resource;
    
    @Column(nullable = false)
    private String action;
    
    // Permission hierarchy
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_permission_id")
    private Permission parentPermission;
    
    @OneToMany(mappedBy = "parentPermission", cascade = CascadeType.ALL)
    private List<Permission> childPermissions;
    
    // Permission properties
    @Column(name = "is_system_permission")
    private Boolean isSystemPermission = false;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "priority_level")
    private Integer priorityLevel = 0;
    
    // Conditions and constraints
    @Column(name = "conditions", columnDefinition = "TEXT")
    private String conditions; // JSON string for complex conditions
    
    @Column(name = "constraints", columnDefinition = "TEXT")
    private String constraints; // JSON string for constraints
    
    // Feature flags
    @Column(name = "requires_feature")
    private String requiresFeature;
    
    @Column(name = "subscription_level")
    private String subscriptionLevel;
    
    // Audit Fields
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Permission() {}
    
    public Permission(String code, String name, PermissionCategory category, 
                     PermissionType type, String resource, String action) {
        this.code = code;
        this.name = name;
        this.category = category;
        this.type = type;
        this.resource = resource;
        this.action = action;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public PermissionCategory getCategory() { return category; }
    public void setCategory(PermissionCategory category) { this.category = category; }
    
    public PermissionType getType() { return type; }
    public void setType(PermissionType type) { this.type = type; }
    
    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public Permission getParentPermission() { return parentPermission; }
    public void setParentPermission(Permission parentPermission) { this.parentPermission = parentPermission; }
    
    public List<Permission> getChildPermissions() { return childPermissions; }
    public void setChildPermissions(List<Permission> childPermissions) { this.childPermissions = childPermissions; }
    
    public Boolean getIsSystemPermission() { return isSystemPermission; }
    public void setIsSystemPermission(Boolean isSystemPermission) { this.isSystemPermission = isSystemPermission; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Integer getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(Integer priorityLevel) { this.priorityLevel = priorityLevel; }
    
    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }
    
    public String getConstraints() { return constraints; }
    public void setConstraints(String constraints) { this.constraints = constraints; }
    
    public String getRequiresFeature() { return requiresFeature; }
    public void setRequiresFeature(String requiresFeature) { this.requiresFeature = requiresFeature; }
    
    public String getSubscriptionLevel() { return subscriptionLevel; }
    public void setSubscriptionLevel(String subscriptionLevel) { this.subscriptionLevel = subscriptionLevel; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Enums
    public enum PermissionCategory {
        SYSTEM_ADMINISTRATION,
        ORGANIZATION_MANAGEMENT,
        USER_MANAGEMENT,
        PROPERTY_MANAGEMENT,
        TENANT_MANAGEMENT,
        CONTRACT_MANAGEMENT,
        FINANCIAL_MANAGEMENT,
        DOCUMENT_MANAGEMENT,
        COMMUNICATION,
        REPORTING,
        ANALYTICS,
        MAINTENANCE,
        INTEGRATION,
        SECURITY,
        AUDIT
    }
    
    public enum PermissionType {
        CREATE,
        READ,
        UPDATE,
        DELETE,
        EXECUTE,
        APPROVE,
        REJECT,
        ASSIGN,
        UNASSIGN,
        EXPORT,
        IMPORT,
        CONFIGURE,
        MONITOR,
        AUDIT
    }
}
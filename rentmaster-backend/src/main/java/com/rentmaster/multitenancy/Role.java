package com.rentmaster.multitenancy;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleScope scope;
    
    // Organization context (null for system-wide roles)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;
    
    // Role hierarchy
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_role_id")
    private Role parentRole;
    
    @OneToMany(mappedBy = "parentRole", cascade = CascadeType.ALL)
    private List<Role> childRoles;
    
    // Role permissions
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RolePermission> rolePermissions;
    
    // Role properties
    @Column(name = "is_system_role")
    private Boolean isSystemRole = false;
    
    @Column(name = "is_default")
    private Boolean isDefault = false;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "priority_level")
    private Integer priorityLevel = 0;
    
    @Column(name = "max_users")
    private Integer maxUsers;
    
    // Audit Fields
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Role() {}
    
    public Role(String name, String code, RoleType type, RoleScope scope) {
        this.name = name;
        this.code = code;
        this.type = type;
        this.scope = scope;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public RoleType getType() { return type; }
    public void setType(RoleType type) { this.type = type; }
    
    public RoleScope getScope() { return scope; }
    public void setScope(RoleScope scope) { this.scope = scope; }
    
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    
    public Role getParentRole() { return parentRole; }
    public void setParentRole(Role parentRole) { this.parentRole = parentRole; }
    
    public List<Role> getChildRoles() { return childRoles; }
    public void setChildRoles(List<Role> childRoles) { this.childRoles = childRoles; }
    
    public List<RolePermission> getRolePermissions() { return rolePermissions; }
    public void setRolePermissions(List<RolePermission> rolePermissions) { this.rolePermissions = rolePermissions; }
    
    public Boolean getIsSystemRole() { return isSystemRole; }
    public void setIsSystemRole(Boolean isSystemRole) { this.isSystemRole = isSystemRole; }
    
    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Integer getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(Integer priorityLevel) { this.priorityLevel = priorityLevel; }
    
    public Integer getMaxUsers() { return maxUsers; }
    public void setMaxUsers(Integer maxUsers) { this.maxUsers = maxUsers; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Enums
    public enum RoleType {
        SYSTEM_ADMIN,
        ORGANIZATION_ADMIN,
        PROPERTY_MANAGER,
        LANDLORD,
        TENANT,
        MAINTENANCE_STAFF,
        ACCOUNTANT,
        VIEWER,
        CUSTOM
    }
    
    public enum RoleScope {
        GLOBAL,           // System-wide access
        ORGANIZATION,     // Organization-wide access
        PROPERTY,         // Property-specific access
        TENANT,           // Tenant-specific access
        DEPARTMENT,       // Department-specific access
        CUSTOM            // Custom scope definition
    }
}
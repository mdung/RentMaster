package com.rentmaster.multitenancy;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "role_permissions")
public class RolePermission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrantType grantType;
    
    // Scope and context
    @Column(name = "scope_type")
    private String scopeType; // GLOBAL, ORGANIZATION, PROPERTY, etc.
    
    @Column(name = "scope_id")
    private Long scopeId; // ID of the scoped entity
    
    // Conditions
    @Column(name = "conditions", columnDefinition = "TEXT")
    private String conditions; // JSON string for complex conditions
    
    // Time-based restrictions
    @Column(name = "valid_from")
    private LocalDateTime validFrom;
    
    @Column(name = "valid_until")
    private LocalDateTime validUntil;
    
    // Status
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    // Audit Fields
    @Column(name = "granted_by")
    private Long grantedBy;
    
    @Column(name = "granted_at", nullable = false)
    private LocalDateTime grantedAt;
    
    @Column(name = "revoked_by")
    private Long revokedBy;
    
    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;
    
    // Constructors
    public RolePermission() {}
    
    public RolePermission(Role role, Permission permission, GrantType grantType) {
        this.role = role;
        this.permission = permission;
        this.grantType = grantType;
        this.grantedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    
    public Permission getPermission() { return permission; }
    public void setPermission(Permission permission) { this.permission = permission; }
    
    public GrantType getGrantType() { return grantType; }
    public void setGrantType(GrantType grantType) { this.grantType = grantType; }
    
    public String getScopeType() { return scopeType; }
    public void setScopeType(String scopeType) { this.scopeType = scopeType; }
    
    public Long getScopeId() { return scopeId; }
    public void setScopeId(Long scopeId) { this.scopeId = scopeId; }
    
    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }
    
    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }
    
    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Long getGrantedBy() { return grantedBy; }
    public void setGrantedBy(Long grantedBy) { this.grantedBy = grantedBy; }
    
    public LocalDateTime getGrantedAt() { return grantedAt; }
    public void setGrantedAt(LocalDateTime grantedAt) { this.grantedAt = grantedAt; }
    
    public Long getRevokedBy() { return revokedBy; }
    public void setRevokedBy(Long revokedBy) { this.revokedBy = revokedBy; }
    
    public LocalDateTime getRevokedAt() { return revokedAt; }
    public void setRevokedAt(LocalDateTime revokedAt) { this.revokedAt = revokedAt; }
    
    // Enum
    public enum GrantType {
        ALLOW,
        DENY,
        CONDITIONAL
    }
}
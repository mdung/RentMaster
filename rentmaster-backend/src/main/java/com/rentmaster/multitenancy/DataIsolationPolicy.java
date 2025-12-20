package com.rentmaster.multitenancy;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "data_isolation_policies")
public class DataIsolationPolicy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    
    @Column(name = "entity_type", nullable = false)
    private String entityType; // Property, Tenant, Contract, etc.
    
    @Enumerated(EnumType.STRING)
    @Column(name = "isolation_level", nullable = false)
    private IsolationLevel isolationLevel;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "access_control", nullable = false)
    private AccessControl accessControl;
    
    // Sharing rules
    @Column(name = "allow_cross_org_access")
    private Boolean allowCrossOrgAccess = false;
    
    @Column(name = "shared_with_parent")
    private Boolean sharedWithParent = false;
    
    @Column(name = "shared_with_children")
    private Boolean sharedWithChildren = false;
    
    // Data retention
    @Column(name = "retention_days")
    private Integer retentionDays;
    
    @Column(name = "auto_delete_expired")
    private Boolean autoDeleteExpired = false;
    
    // Encryption
    @Column(name = "encryption_required")
    private Boolean encryptionRequired = false;
    
    @Column(name = "encryption_algorithm")
    private String encryptionAlgorithm;
    
    // Audit and compliance
    @Column(name = "audit_required")
    private Boolean auditRequired = true;
    
    @Column(name = "compliance_tags", columnDefinition = "TEXT")
    private String complianceTags; // JSON array of compliance requirements
    
    // Backup and recovery
    @Column(name = "backup_required")
    private Boolean backupRequired = true;
    
    @Column(name = "backup_frequency")
    private String backupFrequency; // DAILY, WEEKLY, MONTHLY
    
    @Column(name = "geo_restriction")
    private String geoRestriction; // Country/region restrictions
    
    // Custom rules
    @Column(name = "custom_rules", columnDefinition = "TEXT")
    private String customRules; // JSON string for custom isolation rules
    
    // Status
    @Column(name = "is_active")
    private Boolean isActive = true;
    
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
    public DataIsolationPolicy() {}
    
    public DataIsolationPolicy(Organization organization, String entityType, 
                              IsolationLevel isolationLevel, AccessControl accessControl) {
        this.organization = organization;
        this.entityType = entityType;
        this.isolationLevel = isolationLevel;
        this.accessControl = accessControl;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public IsolationLevel getIsolationLevel() { return isolationLevel; }
    public void setIsolationLevel(IsolationLevel isolationLevel) { this.isolationLevel = isolationLevel; }
    
    public AccessControl getAccessControl() { return accessControl; }
    public void setAccessControl(AccessControl accessControl) { this.accessControl = accessControl; }
    
    public Boolean getAllowCrossOrgAccess() { return allowCrossOrgAccess; }
    public void setAllowCrossOrgAccess(Boolean allowCrossOrgAccess) { this.allowCrossOrgAccess = allowCrossOrgAccess; }
    
    public Boolean getSharedWithParent() { return sharedWithParent; }
    public void setSharedWithParent(Boolean sharedWithParent) { this.sharedWithParent = sharedWithParent; }
    
    public Boolean getSharedWithChildren() { return sharedWithChildren; }
    public void setSharedWithChildren(Boolean sharedWithChildren) { this.sharedWithChildren = sharedWithChildren; }
    
    public Integer getRetentionDays() { return retentionDays; }
    public void setRetentionDays(Integer retentionDays) { this.retentionDays = retentionDays; }
    
    public Boolean getAutoDeleteExpired() { return autoDeleteExpired; }
    public void setAutoDeleteExpired(Boolean autoDeleteExpired) { this.autoDeleteExpired = autoDeleteExpired; }
    
    public Boolean getEncryptionRequired() { return encryptionRequired; }
    public void setEncryptionRequired(Boolean encryptionRequired) { this.encryptionRequired = encryptionRequired; }
    
    public String getEncryptionAlgorithm() { return encryptionAlgorithm; }
    public void setEncryptionAlgorithm(String encryptionAlgorithm) { this.encryptionAlgorithm = encryptionAlgorithm; }
    
    public Boolean getAuditRequired() { return auditRequired; }
    public void setAuditRequired(Boolean auditRequired) { this.auditRequired = auditRequired; }
    
    public String getComplianceTags() { return complianceTags; }
    public void setComplianceTags(String complianceTags) { this.complianceTags = complianceTags; }
    
    public Boolean getBackupRequired() { return backupRequired; }
    public void setBackupRequired(Boolean backupRequired) { this.backupRequired = backupRequired; }
    
    public String getBackupFrequency() { return backupFrequency; }
    public void setBackupFrequency(String backupFrequency) { this.backupFrequency = backupFrequency; }
    
    public String getGeoRestriction() { return geoRestriction; }
    public void setGeoRestriction(String geoRestriction) { this.geoRestriction = geoRestriction; }
    
    public String getCustomRules() { return customRules; }
    public void setCustomRules(String customRules) { this.customRules = customRules; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Enums
    public enum IsolationLevel {
        STRICT,           // Complete isolation, no sharing
        MODERATE,         // Limited sharing with explicit permissions
        RELAXED,          // Sharing allowed with same organization
        HIERARCHICAL,     // Sharing based on organization hierarchy
        CUSTOM            // Custom isolation rules
    }
    
    public enum AccessControl {
        ROLE_BASED,       // Access based on user roles
        ATTRIBUTE_BASED,  // Access based on user/resource attributes
        DISCRETIONARY,    // Owner-controlled access
        MANDATORY,        // System-enforced access
        HYBRID            // Combination of multiple controls
    }
}
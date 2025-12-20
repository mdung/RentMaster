package com.rentmaster.multitenancy;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "organizations")
public class Organization {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "display_name")
    private String displayName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationStatus status;
    
    // Contact Information
    @Column(name = "contact_email")
    private String contactEmail;
    
    @Column(name = "contact_phone")
    private String contactPhone;
    
    @Column(name = "website_url")
    private String websiteUrl;
    
    // Address Information
    @Column(columnDefinition = "TEXT")
    private String address;
    
    private String city;
    
    private String state;
    
    @Column(name = "postal_code")
    private String postalCode;
    
    private String country;
    
    // Business Information
    @Column(name = "tax_id")
    private String taxId;
    
    @Column(name = "business_license")
    private String businessLicense;
    
    @Column(name = "registration_number")
    private String registrationNumber;
    
    // Subscription Information
    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_plan")
    private SubscriptionPlan subscriptionPlan;
    
    @Column(name = "subscription_start_date")
    private LocalDateTime subscriptionStartDate;
    
    @Column(name = "subscription_end_date")
    private LocalDateTime subscriptionEndDate;
    
    @Column(name = "trial_end_date")
    private LocalDateTime trialEndDate;
    
    @Column(name = "is_trial")
    private Boolean isTrial = false;
    
    // Limits and Quotas
    @Column(name = "max_properties")
    private Integer maxProperties;
    
    @Column(name = "max_users")
    private Integer maxUsers;
    
    @Column(name = "max_tenants")
    private Integer maxTenants;
    
    @Column(name = "max_storage_gb")
    private Integer maxStorageGb;
    
    // Feature Flags
    @Column(name = "features_enabled", columnDefinition = "TEXT")
    private String featuresEnabled; // JSON string of enabled features
    
    // White-labeling
    @Column(name = "custom_domain")
    private String customDomain;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    @Column(name = "favicon_url")
    private String faviconUrl;
    
    @Column(name = "primary_color")
    private String primaryColor;
    
    @Column(name = "secondary_color")
    private String secondaryColor;
    
    @Column(name = "custom_css", columnDefinition = "TEXT")
    private String customCss;
    
    // Database Configuration
    @Column(name = "database_schema")
    private String databaseSchema;
    
    @Column(name = "database_prefix")
    private String databasePrefix;
    
    // Parent Organization (for hierarchical organizations)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_organization_id")
    private Organization parentOrganization;
    
    @OneToMany(mappedBy = "parentOrganization", cascade = CascadeType.ALL)
    private List<Organization> childOrganizations;
    
    // Audit Fields
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    // Constructors
    public Organization() {}
    
    public Organization(String code, String name, OrganizationType type) {
        this.code = code;
        this.name = name;
        this.type = type;
        this.status = OrganizationStatus.ACTIVE;
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
    
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public OrganizationType getType() { return type; }
    public void setType(OrganizationType type) { this.type = type; }
    
    public OrganizationStatus getStatus() { return status; }
    public void setStatus(OrganizationStatus status) { this.status = status; }
    
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }
    
    public String getBusinessLicense() { return businessLicense; }
    public void setBusinessLicense(String businessLicense) { this.businessLicense = businessLicense; }
    
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    
    public SubscriptionPlan getSubscriptionPlan() { return subscriptionPlan; }
    public void setSubscriptionPlan(SubscriptionPlan subscriptionPlan) { this.subscriptionPlan = subscriptionPlan; }
    
    public LocalDateTime getSubscriptionStartDate() { return subscriptionStartDate; }
    public void setSubscriptionStartDate(LocalDateTime subscriptionStartDate) { this.subscriptionStartDate = subscriptionStartDate; }
    
    public LocalDateTime getSubscriptionEndDate() { return subscriptionEndDate; }
    public void setSubscriptionEndDate(LocalDateTime subscriptionEndDate) { this.subscriptionEndDate = subscriptionEndDate; }
    
    public LocalDateTime getTrialEndDate() { return trialEndDate; }
    public void setTrialEndDate(LocalDateTime trialEndDate) { this.trialEndDate = trialEndDate; }
    
    public Boolean getIsTrial() { return isTrial; }
    public void setIsTrial(Boolean isTrial) { this.isTrial = isTrial; }
    
    public Integer getMaxProperties() { return maxProperties; }
    public void setMaxProperties(Integer maxProperties) { this.maxProperties = maxProperties; }
    
    public Integer getMaxUsers() { return maxUsers; }
    public void setMaxUsers(Integer maxUsers) { this.maxUsers = maxUsers; }
    
    public Integer getMaxTenants() { return maxTenants; }
    public void setMaxTenants(Integer maxTenants) { this.maxTenants = maxTenants; }
    
    public Integer getMaxStorageGb() { return maxStorageGb; }
    public void setMaxStorageGb(Integer maxStorageGb) { this.maxStorageGb = maxStorageGb; }
    
    public String getFeaturesEnabled() { return featuresEnabled; }
    public void setFeaturesEnabled(String featuresEnabled) { this.featuresEnabled = featuresEnabled; }
    
    public String getCustomDomain() { return customDomain; }
    public void setCustomDomain(String customDomain) { this.customDomain = customDomain; }
    
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    
    public String getFaviconUrl() { return faviconUrl; }
    public void setFaviconUrl(String faviconUrl) { this.faviconUrl = faviconUrl; }
    
    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }
    
    public String getSecondaryColor() { return secondaryColor; }
    public void setSecondaryColor(String secondaryColor) { this.secondaryColor = secondaryColor; }
    
    public String getCustomCss() { return customCss; }
    public void setCustomCss(String customCss) { this.customCss = customCss; }
    
    public String getDatabaseSchema() { return databaseSchema; }
    public void setDatabaseSchema(String databaseSchema) { this.databaseSchema = databaseSchema; }
    
    public String getDatabasePrefix() { return databasePrefix; }
    public void setDatabasePrefix(String databasePrefix) { this.databasePrefix = databasePrefix; }
    
    public Organization getParentOrganization() { return parentOrganization; }
    public void setParentOrganization(Organization parentOrganization) { this.parentOrganization = parentOrganization; }
    
    public List<Organization> getChildOrganizations() { return childOrganizations; }
    public void setChildOrganizations(List<Organization> childOrganizations) { this.childOrganizations = childOrganizations; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
    
    // Enums
    public enum OrganizationType {
        ENTERPRISE,
        PROPERTY_MANAGEMENT_COMPANY,
        INDIVIDUAL_LANDLORD,
        REAL_ESTATE_AGENCY,
        GOVERNMENT_HOUSING,
        NON_PROFIT,
        CORPORATE_HOUSING
    }
    
    public enum OrganizationStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        TRIAL,
        EXPIRED,
        PENDING_APPROVAL
    }
    
    public enum SubscriptionPlan {
        FREE,
        BASIC,
        PROFESSIONAL,
        ENTERPRISE,
        CUSTOM
    }
}
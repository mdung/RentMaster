package com.rentmaster.multitenancy.dto;

import com.rentmaster.multitenancy.Organization;

import java.time.LocalDateTime;

public class OrganizationDTO {
    private Long id;
    private String code;
    private String name;
    private String displayName;
    private String description;
    private Organization.OrganizationType type;
    private Organization.OrganizationStatus status;
    private String contactEmail;
    private String contactPhone;
    private String websiteUrl;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Organization.SubscriptionPlan subscriptionPlan;
    private Boolean isTrial;
    private Integer maxProperties;
    private Integer maxUsers;
    private Integer maxTenants;
    // White-labeling
    private String logoUrl;
    private String faviconUrl;
    private String primaryColor;
    private String secondaryColor;
    private LocalDateTime createdAt;

    public OrganizationDTO() {}

    public OrganizationDTO(Organization org) {
        this.id = org.getId();
        this.code = org.getCode();
        this.name = org.getName();
        this.displayName = org.getDisplayName();
        this.description = org.getDescription();
        this.type = org.getType();
        this.status = org.getStatus();
        this.contactEmail = org.getContactEmail();
        this.contactPhone = org.getContactPhone();
        this.websiteUrl = org.getWebsiteUrl();
        this.address = org.getAddress();
        this.city = org.getCity();
        this.state = org.getState();
        this.postalCode = org.getPostalCode();
        this.country = org.getCountry();
        this.subscriptionPlan = org.getSubscriptionPlan();
        this.isTrial = org.getIsTrial();
        this.maxProperties = org.getMaxProperties();
        this.maxUsers = org.getMaxUsers();
        this.maxTenants = org.getMaxTenants();
        this.logoUrl = org.getLogoUrl();
        this.faviconUrl = org.getFaviconUrl();
        this.primaryColor = org.getPrimaryColor();
        this.secondaryColor = org.getSecondaryColor();
        this.createdAt = org.getCreatedAt();
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

    public Organization.OrganizationType getType() { return type; }
    public void setType(Organization.OrganizationType type) { this.type = type; }

    public Organization.OrganizationStatus getStatus() { return status; }
    public void setStatus(Organization.OrganizationStatus status) { this.status = status; }

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

    public Organization.SubscriptionPlan getSubscriptionPlan() { return subscriptionPlan; }
    public void setSubscriptionPlan(Organization.SubscriptionPlan subscriptionPlan) { this.subscriptionPlan = subscriptionPlan; }

    public Boolean getIsTrial() { return isTrial; }
    public void setIsTrial(Boolean isTrial) { this.isTrial = isTrial; }

    public Integer getMaxProperties() { return maxProperties; }
    public void setMaxProperties(Integer maxProperties) { this.maxProperties = maxProperties; }

    public Integer getMaxUsers() { return maxUsers; }
    public void setMaxUsers(Integer maxUsers) { this.maxUsers = maxUsers; }

    public Integer getMaxTenants() { return maxTenants; }
    public void setMaxTenants(Integer maxTenants) { this.maxTenants = maxTenants; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getFaviconUrl() { return faviconUrl; }
    public void setFaviconUrl(String faviconUrl) { this.faviconUrl = faviconUrl; }

    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

    public String getSecondaryColor() { return secondaryColor; }
    public void setSecondaryColor(String secondaryColor) { this.secondaryColor = secondaryColor; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}



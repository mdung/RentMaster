package com.rentmaster.multitenancy.dto;

import com.rentmaster.multitenancy.Organization;

public class OrganizationCreateDTO {
    private String code;
    private String name;
    private String displayName;
    private String description;
    private Organization.OrganizationType type;
    private String contactEmail;
    private String contactPhone;
    private String websiteUrl;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Organization.SubscriptionPlan subscriptionPlan;
    private Integer maxProperties;
    private Integer maxUsers;
    private Integer maxTenants;
    // White-labeling
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;

    // Getters and Setters
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

    public Integer getMaxProperties() { return maxProperties; }
    public void setMaxProperties(Integer maxProperties) { this.maxProperties = maxProperties; }

    public Integer getMaxUsers() { return maxUsers; }
    public void setMaxUsers(Integer maxUsers) { this.maxUsers = maxUsers; }

    public Integer getMaxTenants() { return maxTenants; }
    public void setMaxTenants(Integer maxTenants) { this.maxTenants = maxTenants; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

    public String getSecondaryColor() { return secondaryColor; }
    public void setSecondaryColor(String secondaryColor) { this.secondaryColor = secondaryColor; }
}



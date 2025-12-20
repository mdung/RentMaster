package com.rentmaster.localization;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "regional_compliance")
public class RegionalCompliance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "country_code", unique = true, nullable = false, length = 10)
    private String countryCode; // e.g., "US", "VN"
    
    @Column(name = "country_name", nullable = false, length = 100)
    private String countryName; // e.g., "United States", "Vietnam"
    
    @Column(name = "tax_id_format", length = 100)
    private String taxIdFormat; // Regex pattern for tax ID validation
    
    @Column(name = "tax_id_label", length = 50)
    private String taxIdLabel; // e.g., "SSN", "Tax ID", "Mã số thuế"
    
    @Column(name = "phone_format", length = 100)
    private String phoneFormat; // Regex pattern for phone number validation
    
    @Column(name = "postal_code_format", length = 100)
    private String postalCodeFormat; // Regex pattern for postal code validation
    
    @Column(name = "postal_code_label", length = 50)
    private String postalCodeLabel; // e.g., "ZIP Code", "Postal Code", "Mã bưu điện"
    
    @Column(name = "address_format", columnDefinition = "TEXT")
    private String addressFormat; // Template for address formatting
    
    @Column(name = "legal_requirements", columnDefinition = "TEXT")
    private String legalRequirements; // JSON array of legal requirements
    
    @Column(name = "data_protection_rules", columnDefinition = "TEXT")
    private String dataProtectionRules; // JSON array of data protection rules
    
    @Column(name = "contract_requirements", columnDefinition = "TEXT")
    private String contractRequirements; // JSON array of contract requirements
    
    @Column(name = "tenant_rights", columnDefinition = "TEXT")
    private String tenantRights; // JSON array of tenant rights
    
    @Column(name = "landlord_obligations", columnDefinition = "TEXT")
    private String landlordObligations; // JSON array of landlord obligations
    
    @Column(name = "eviction_rules", columnDefinition = "TEXT")
    private String evictionRules; // JSON array of eviction rules
    
    @Column(name = "deposit_regulations", columnDefinition = "TEXT")
    private String depositRegulations; // JSON array of deposit regulations
    
    @Column(name = "rent_control_rules", columnDefinition = "TEXT")
    private String rentControlRules; // JSON array of rent control rules
    
    @Column(name = "notice_periods", columnDefinition = "TEXT")
    private String noticePeriods; // JSON object with different notice periods
    
    @Column(name = "required_documents", columnDefinition = "TEXT")
    private String requiredDocuments; // JSON array of required documents
    
    @Column(name = "tax_rates", columnDefinition = "TEXT")
    private String taxRates; // JSON object with different tax rates
    
    @Column(name = "currency_code", length = 10)
    private String currencyCode; // Default currency for this country
    
    @Column(name = "language_codes", length = 100)
    private String languageCodes; // Comma-separated official language codes
    
    @Column(name = "business_hours", length = 100)
    private String businessHours; // Standard business hours
    
    @Column(name = "public_holidays", columnDefinition = "TEXT")
    private String publicHolidays; // JSON array of public holidays
    
    @Column(name = "emergency_contacts", columnDefinition = "TEXT")
    private String emergencyContacts; // JSON array of emergency contact numbers
    
    @Column(name = "active")
    private boolean active = true;
    
    @Column(name = "compliance_version", length = 20)
    private String complianceVersion = "1.0";
    
    @Column(name = "last_reviewed_at")
    private LocalDateTime lastReviewedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;

    // Constructors
    public RegionalCompliance() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public RegionalCompliance(String countryCode, String countryName) {
        this();
        this.countryCode = countryCode;
        this.countryName = countryName;
    }

    // Lifecycle callbacks
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public String getTaxIdFormat() {
        return taxIdFormat;
    }

    public void setTaxIdFormat(String taxIdFormat) {
        this.taxIdFormat = taxIdFormat;
    }

    public String getTaxIdLabel() {
        return taxIdLabel;
    }

    public void setTaxIdLabel(String taxIdLabel) {
        this.taxIdLabel = taxIdLabel;
    }

    public String getPhoneFormat() {
        return phoneFormat;
    }

    public void setPhoneFormat(String phoneFormat) {
        this.phoneFormat = phoneFormat;
    }

    public String getPostalCodeFormat() {
        return postalCodeFormat;
    }

    public void setPostalCodeFormat(String postalCodeFormat) {
        this.postalCodeFormat = postalCodeFormat;
    }

    public String getPostalCodeLabel() {
        return postalCodeLabel;
    }

    public void setPostalCodeLabel(String postalCodeLabel) {
        this.postalCodeLabel = postalCodeLabel;
    }

    public String getAddressFormat() {
        return addressFormat;
    }

    public void setAddressFormat(String addressFormat) {
        this.addressFormat = addressFormat;
    }

    public String getLegalRequirements() {
        return legalRequirements;
    }

    public void setLegalRequirements(String legalRequirements) {
        this.legalRequirements = legalRequirements;
    }

    public String getDataProtectionRules() {
        return dataProtectionRules;
    }

    public void setDataProtectionRules(String dataProtectionRules) {
        this.dataProtectionRules = dataProtectionRules;
    }

    public String getContractRequirements() {
        return contractRequirements;
    }

    public void setContractRequirements(String contractRequirements) {
        this.contractRequirements = contractRequirements;
    }

    public String getTenantRights() {
        return tenantRights;
    }

    public void setTenantRights(String tenantRights) {
        this.tenantRights = tenantRights;
    }

    public String getLandlordObligations() {
        return landlordObligations;
    }

    public void setLandlordObligations(String landlordObligations) {
        this.landlordObligations = landlordObligations;
    }

    public String getEvictionRules() {
        return evictionRules;
    }

    public void setEvictionRules(String evictionRules) {
        this.evictionRules = evictionRules;
    }

    public String getDepositRegulations() {
        return depositRegulations;
    }

    public void setDepositRegulations(String depositRegulations) {
        this.depositRegulations = depositRegulations;
    }

    public String getRentControlRules() {
        return rentControlRules;
    }

    public void setRentControlRules(String rentControlRules) {
        this.rentControlRules = rentControlRules;
    }

    public String getNoticePeriods() {
        return noticePeriods;
    }

    public void setNoticePeriods(String noticePeriods) {
        this.noticePeriods = noticePeriods;
    }

    public String getRequiredDocuments() {
        return requiredDocuments;
    }

    public void setRequiredDocuments(String requiredDocuments) {
        this.requiredDocuments = requiredDocuments;
    }

    public String getTaxRates() {
        return taxRates;
    }

    public void setTaxRates(String taxRates) {
        this.taxRates = taxRates;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getLanguageCodes() {
        return languageCodes;
    }

    public void setLanguageCodes(String languageCodes) {
        this.languageCodes = languageCodes;
    }

    public String getBusinessHours() {
        return businessHours;
    }

    public void setBusinessHours(String businessHours) {
        this.businessHours = businessHours;
    }

    public String getPublicHolidays() {
        return publicHolidays;
    }

    public void setPublicHolidays(String publicHolidays) {
        this.publicHolidays = publicHolidays;
    }

    public String getEmergencyContacts() {
        return emergencyContacts;
    }

    public void setEmergencyContacts(String emergencyContacts) {
        this.emergencyContacts = emergencyContacts;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getComplianceVersion() {
        return complianceVersion;
    }

    public void setComplianceVersion(String complianceVersion) {
        this.complianceVersion = complianceVersion;
    }

    public LocalDateTime getLastReviewedAt() {
        return lastReviewedAt;
    }

    public void setLastReviewedAt(LocalDateTime lastReviewedAt) {
        this.lastReviewedAt = lastReviewedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    @Override
    public String toString() {
        return "RegionalCompliance{" +
                "id=" + id +
                ", countryCode='" + countryCode + '\'' +
                ", countryName='" + countryName + '\'' +
                '}';
    }
}
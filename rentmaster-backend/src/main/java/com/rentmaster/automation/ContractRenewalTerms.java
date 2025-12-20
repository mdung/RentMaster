package com.rentmaster.automation;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Embeddable
public class ContractRenewalTerms {
    @Column(name = "extension_months", nullable = false)
    private Integer extensionMonths;

    @Column(name = "new_rent_amount", precision = 15, scale = 2)
    private BigDecimal newRentAmount;

    @Column(name = "rent_increase", precision = 15, scale = 2)
    private BigDecimal rentIncrease;

    @Enumerated(EnumType.STRING)
    @Column(name = "rent_increase_type")
    private RentIncreaseType rentIncreaseType;

    @Column(name = "require_tenant_approval", nullable = false)
    private Boolean requireTenantApproval = true;

    @Column(name = "approval_deadline_days", nullable = false)
    private Integer approvalDeadlineDays = 30;

    public enum RentIncreaseType {
        FIXED, PERCENTAGE
    }

    // Constructors
    public ContractRenewalTerms() {}

    public ContractRenewalTerms(Integer extensionMonths, Boolean requireTenantApproval, Integer approvalDeadlineDays) {
        this.extensionMonths = extensionMonths;
        this.requireTenantApproval = requireTenantApproval;
        this.approvalDeadlineDays = approvalDeadlineDays;
    }

    // Getters and Setters
    public Integer getExtensionMonths() {
        return extensionMonths;
    }

    public void setExtensionMonths(Integer extensionMonths) {
        this.extensionMonths = extensionMonths;
    }

    public BigDecimal getNewRentAmount() {
        return newRentAmount;
    }

    public void setNewRentAmount(BigDecimal newRentAmount) {
        this.newRentAmount = newRentAmount;
    }

    public BigDecimal getRentIncrease() {
        return rentIncrease;
    }

    public void setRentIncrease(BigDecimal rentIncrease) {
        this.rentIncrease = rentIncrease;
    }

    public RentIncreaseType getRentIncreaseType() {
        return rentIncreaseType;
    }

    public void setRentIncreaseType(RentIncreaseType rentIncreaseType) {
        this.rentIncreaseType = rentIncreaseType;
    }

    public Boolean getRequireTenantApproval() {
        return requireTenantApproval;
    }

    public void setRequireTenantApproval(Boolean requireTenantApproval) {
        this.requireTenantApproval = requireTenantApproval;
    }

    public Integer getApprovalDeadlineDays() {
        return approvalDeadlineDays;
    }

    public void setApprovalDeadlineDays(Integer approvalDeadlineDays) {
        this.approvalDeadlineDays = approvalDeadlineDays;
    }
}
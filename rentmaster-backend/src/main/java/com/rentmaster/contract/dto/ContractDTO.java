package com.rentmaster.contract.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class ContractDTO {
    private Long id;
    private String code;
    private Long roomId;
    private String roomCode;
    private String propertyName;
    private Long primaryTenantId;
    private String primaryTenantName;
    private List<Long> tenantIds;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double rentAmount;
    private Double depositAmount;
    private String billingCycle;
    private String status;
    private Instant createdAt;

    public ContractDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public Long getPrimaryTenantId() {
        return primaryTenantId;
    }

    public void setPrimaryTenantId(Long primaryTenantId) {
        this.primaryTenantId = primaryTenantId;
    }

    public String getPrimaryTenantName() {
        return primaryTenantName;
    }

    public void setPrimaryTenantName(String primaryTenantName) {
        this.primaryTenantName = primaryTenantName;
    }

    public List<Long> getTenantIds() {
        return tenantIds;
    }

    public void setTenantIds(List<Long> tenantIds) {
        this.tenantIds = tenantIds;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(Double rentAmount) {
        this.rentAmount = rentAmount;
    }

    public Double getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(Double depositAmount) {
        this.depositAmount = depositAmount;
    }

    public String getBillingCycle() {
        return billingCycle;
    }

    public void setBillingCycle(String billingCycle) {
        this.billingCycle = billingCycle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}


package com.rentmaster.billing.dto;

import java.math.BigDecimal;

public class ContractServiceCreateDTO {
    private Long contractId;
    private Long serviceId;
    private BigDecimal customPrice;
    private boolean active = true;

    public ContractServiceCreateDTO() {
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public BigDecimal getCustomPrice() {
        return customPrice;
    }

    public void setCustomPrice(BigDecimal customPrice) {
        this.customPrice = customPrice;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

package com.rentmaster.billing.dto;

public class InvoiceItemDTO {
    private Long id;
    private Long serviceId;
    private String serviceName;
    private String description;
    private Double quantity;
    private Double unitPrice;
    private Double amount;
    private Double prevIndex;
    private Double currentIndex;

    public InvoiceItemDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getPrevIndex() {
        return prevIndex;
    }

    public void setPrevIndex(Double prevIndex) {
        this.prevIndex = prevIndex;
    }

    public Double getCurrentIndex() {
        return currentIndex;
    }

    public void setCurrentIndex(Double currentIndex) {
        this.currentIndex = currentIndex;
    }
}


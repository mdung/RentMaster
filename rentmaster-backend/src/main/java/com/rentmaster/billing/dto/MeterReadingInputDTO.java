package com.rentmaster.billing.dto;

import java.math.BigDecimal;

public class MeterReadingInputDTO {

    private Long serviceId;
    private BigDecimal currentIndex;

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public BigDecimal getCurrentIndex() {
        return currentIndex;
    }

    public void setCurrentIndex(BigDecimal currentIndex) {
        this.currentIndex = currentIndex;
    }
}

package com.rentmaster.billing.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class InvoiceGenerateDTO {
    @NotNull
    private Long contractId;

    @NotNull
    private LocalDate periodStart;

    @NotNull
    private LocalDate periodEnd;

    private LocalDate issueDate;
    private LocalDate dueDate;

    // Optional meter readings for per-unit services (e.g., electricity, water)
    private List<MeterReadingInputDTO> meterReadings;

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public LocalDate getPeriodStart() {
        return periodStart;
    }

    public void setPeriodStart(LocalDate periodStart) {
        this.periodStart = periodStart;
    }

    public LocalDate getPeriodEnd() {
        return periodEnd;
    }

    public void setPeriodEnd(LocalDate periodEnd) {
        this.periodEnd = periodEnd;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public List<MeterReadingInputDTO> getMeterReadings() {
        return meterReadings;
    }

    public void setMeterReadings(List<MeterReadingInputDTO> meterReadings) {
        this.meterReadings = meterReadings;
    }
}


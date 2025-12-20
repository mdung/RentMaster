package com.rentmaster.financial;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_plans")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PaymentPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "invoice_id", nullable = false)
    private Long invoiceId;
    
    @Column(name = "invoice_number", nullable = false)
    private String invoiceNumber;
    
    @Column(name = "tenant_name", nullable = false)
    private String tenantName;
    
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
    
    @Column(name = "installments", nullable = false)
    private Integer installments;
    
    @Column(name = "installment_amount", nullable = false)
    private Double installmentAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "frequency", nullable = false)
    private PaymentFrequency frequency;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentPlanStatus status = PaymentPlanStatus.ACTIVE;
    
    @Column(name = "paid_installments", nullable = false)
    private Integer paidInstallments = 0;
    
    @Column(name = "remaining_amount", nullable = false)
    private Double remainingAmount;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum PaymentFrequency {
        WEEKLY,
        BIWEEKLY,
        MONTHLY
    }
    
    public enum PaymentPlanStatus {
        ACTIVE,
        COMPLETED,
        DEFAULTED
    }
    
    // Constructors
    public PaymentPlan() {
        this.createdAt = LocalDateTime.now();
        this.startDate = LocalDate.now();
    }
    
    public PaymentPlan(Long invoiceId, String invoiceNumber, String tenantName, 
                      Double totalAmount, Integer installments, PaymentFrequency frequency) {
        this();
        this.invoiceId = invoiceId;
        this.invoiceNumber = invoiceNumber;
        this.tenantName = tenantName;
        this.totalAmount = totalAmount;
        this.installments = installments;
        this.frequency = frequency;
        this.installmentAmount = totalAmount / installments;
        this.remainingAmount = totalAmount;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }
    
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public String getTenantName() { return tenantName; }
    public void setTenantName(String tenantName) { this.tenantName = tenantName; }
    
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    
    public Integer getInstallments() { return installments; }
    public void setInstallments(Integer installments) { this.installments = installments; }
    
    public Double getInstallmentAmount() { return installmentAmount; }
    public void setInstallmentAmount(Double installmentAmount) { this.installmentAmount = installmentAmount; }
    
    public PaymentFrequency getFrequency() { return frequency; }
    public void setFrequency(PaymentFrequency frequency) { this.frequency = frequency; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public PaymentPlanStatus getStatus() { return status; }
    public void setStatus(PaymentPlanStatus status) { this.status = status; }
    
    public Integer getPaidInstallments() { return paidInstallments; }
    public void setPaidInstallments(Integer paidInstallments) { this.paidInstallments = paidInstallments; }
    
    public Double getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(Double remainingAmount) { this.remainingAmount = remainingAmount; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
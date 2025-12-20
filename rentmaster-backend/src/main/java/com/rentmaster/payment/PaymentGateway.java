package com.rentmaster.payment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "payment_gateways")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PaymentGateway {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private GatewayType type;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "gateway_supported_methods", joinColumns = @JoinColumn(name = "gateway_id"))
    @Column(name = "payment_method")
    private List<PaymentMethodType> supportedMethods;
    
    @Column(name = "processing_fee", nullable = false)
    private Double processingFee = 0.0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "fee_type", nullable = false)
    private FeeType feeType = FeeType.PERCENTAGE;
    
    @Column(name = "min_amount")
    private Double minAmount;
    
    @Column(name = "max_amount")
    private Double maxAmount;
    
    @Column(name = "currency", nullable = false)
    private String currency = "USD";
    
    @Column(name = "configuration", columnDefinition = "TEXT")
    private String configuration; // JSON configuration
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum GatewayType {
        STRIPE,
        PAYPAL,
        SQUARE,
        BANK_TRANSFER,
        CRYPTO
    }
    
    public enum PaymentMethodType {
        CREDIT_CARD,
        DEBIT_CARD,
        BANK_ACCOUNT,
        DIGITAL_WALLET
    }
    
    public enum FeeType {
        FIXED,
        PERCENTAGE
    }
    
    // Constructors
    public PaymentGateway() {
        this.createdAt = LocalDateTime.now();
    }
    
    public PaymentGateway(String name, GatewayType type, Double processingFee, FeeType feeType) {
        this();
        this.name = name;
        this.type = type;
        this.processingFee = processingFee;
        this.feeType = feeType;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public GatewayType getType() { return type; }
    public void setType(GatewayType type) { this.type = type; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public List<PaymentMethodType> getSupportedMethods() { return supportedMethods; }
    public void setSupportedMethods(List<PaymentMethodType> supportedMethods) { this.supportedMethods = supportedMethods; }
    
    public Double getProcessingFee() { return processingFee; }
    public void setProcessingFee(Double processingFee) { this.processingFee = processingFee; }
    
    public FeeType getFeeType() { return feeType; }
    public void setFeeType(FeeType feeType) { this.feeType = feeType; }
    
    public Double getMinAmount() { return minAmount; }
    public void setMinAmount(Double minAmount) { this.minAmount = minAmount; }
    
    public Double getMaxAmount() { return maxAmount; }
    public void setMaxAmount(Double maxAmount) { this.maxAmount = maxAmount; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public String getConfiguration() { return configuration; }
    public void setConfiguration(String configuration) { this.configuration = configuration; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
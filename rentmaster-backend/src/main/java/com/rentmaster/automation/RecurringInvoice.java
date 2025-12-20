package com.rentmaster.automation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recurring_invoices")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RecurringInvoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "contract_id", nullable = false)
    private Long contractId;
    
    @Column(name = "contract_code", nullable = false)
    private String contractCode;
    
    @Column(name = "tenant_name", nullable = false)
    private String tenantName;
    
    @Column(name = "room_code", nullable = false)
    private String roomCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "frequency", nullable = false)
    private InvoiceFrequency frequency;
    
    @Column(name = "day_of_month")
    private Integer dayOfMonth;
    
    @Column(name = "day_of_week")
    private Integer dayOfWeek;
    
    @Column(name = "next_generation_date", nullable = false)
    private LocalDate nextGenerationDate;
    
    @Column(name = "last_generated_date")
    private LocalDate lastGeneratedDate;
    
    @Column(name = "active", nullable = false)
    private Boolean active = true;
    
    @Column(name = "auto_send", nullable = false)
    private Boolean autoSend = false;
    
    @Column(name = "include_rent", nullable = false)
    private Boolean includeRent = true;
    
    @Column(name = "include_services", nullable = false)
    private Boolean includeServices = false;
    
    @Column(name = "service_ids", columnDefinition = "TEXT")
    private String serviceIds; // JSON array of service IDs
    
    @Column(name = "custom_items", columnDefinition = "TEXT")
    private String customItems; // JSON array of custom items
    
    @Column(name = "days_until_due", nullable = false)
    private Integer daysUntilDue = 30;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum InvoiceFrequency {
        WEEKLY,
        MONTHLY,
        QUARTERLY,
        YEARLY
    }
    
    // Constructors
    public RecurringInvoice() {
        this.createdAt = LocalDateTime.now();
        this.nextGenerationDate = LocalDate.now().plusMonths(1);
    }
    
    public RecurringInvoice(Long contractId, String contractCode, String tenantName, 
                           String roomCode, InvoiceFrequency frequency) {
        this();
        this.contractId = contractId;
        this.contractCode = contractCode;
        this.tenantName = tenantName;
        this.roomCode = roomCode;
        this.frequency = frequency;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }
    
    public String getContractCode() { return contractCode; }
    public void setContractCode(String contractCode) { this.contractCode = contractCode; }
    
    public String getTenantName() { return tenantName; }
    public void setTenantName(String tenantName) { this.tenantName = tenantName; }
    
    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }
    
    public InvoiceFrequency getFrequency() { return frequency; }
    public void setFrequency(InvoiceFrequency frequency) { this.frequency = frequency; }
    
    public Integer getDayOfMonth() { return dayOfMonth; }
    public void setDayOfMonth(Integer dayOfMonth) { this.dayOfMonth = dayOfMonth; }
    
    public Integer getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    
    public LocalDate getNextGenerationDate() { return nextGenerationDate; }
    public void setNextGenerationDate(LocalDate nextGenerationDate) { this.nextGenerationDate = nextGenerationDate; }
    
    public LocalDate getLastGeneratedDate() { return lastGeneratedDate; }
    public void setLastGeneratedDate(LocalDate lastGeneratedDate) { this.lastGeneratedDate = lastGeneratedDate; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public Boolean getAutoSend() { return autoSend; }
    public void setAutoSend(Boolean autoSend) { this.autoSend = autoSend; }
    
    public Boolean getIncludeRent() { return includeRent; }
    public void setIncludeRent(Boolean includeRent) { this.includeRent = includeRent; }
    
    public Boolean getIncludeServices() { return includeServices; }
    public void setIncludeServices(Boolean includeServices) { this.includeServices = includeServices; }
    
    public String getServiceIds() { return serviceIds; }
    public void setServiceIds(String serviceIds) { this.serviceIds = serviceIds; }
    
    public String getCustomItems() { return customItems; }
    public void setCustomItems(String customItems) { this.customItems = customItems; }
    
    public Integer getDaysUntilDue() { return daysUntilDue; }
    public void setDaysUntilDue(Integer daysUntilDue) { this.daysUntilDue = daysUntilDue; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
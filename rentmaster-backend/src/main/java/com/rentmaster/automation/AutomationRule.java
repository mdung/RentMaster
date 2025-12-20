package com.rentmaster.automation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "automation_rules")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AutomationRule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "trigger_type", nullable = false)
    private TriggerType triggerType;
    
    @Column(name = "trigger_conditions", columnDefinition = "TEXT")
    private String triggerConditions; // JSON object
    
    @Column(name = "actions", columnDefinition = "TEXT")
    private String actions; // JSON array of actions
    
    @Column(name = "active", nullable = false)
    private Boolean active = true;
    
    @Column(name = "last_executed")
    private LocalDateTime lastExecuted;
    
    @Column(name = "execution_count", nullable = false)
    private Integer executionCount = 0;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    public enum TriggerType {
        INVOICE_OVERDUE,
        CONTRACT_EXPIRING,
        PAYMENT_RECEIVED,
        SCHEDULED,
        MANUAL,
        MAINTENANCE_REQUEST,
        TENANT_REGISTRATION,
        PROPERTY_VACANT
    }
    
    // Constructors
    public AutomationRule() {
        this.createdAt = LocalDateTime.now();
    }
    
    public AutomationRule(String name, String description, TriggerType triggerType) {
        this();
        this.name = name;
        this.description = description;
        this.triggerType = triggerType;
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
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public TriggerType getTriggerType() { return triggerType; }
    public void setTriggerType(TriggerType triggerType) { this.triggerType = triggerType; }
    
    public String getTriggerConditions() { return triggerConditions; }
    public void setTriggerConditions(String triggerConditions) { this.triggerConditions = triggerConditions; }
    
    public String getActions() { return actions; }
    public void setActions(String actions) { this.actions = actions; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public LocalDateTime getLastExecuted() { return lastExecuted; }
    public void setLastExecuted(LocalDateTime lastExecuted) { this.lastExecuted = lastExecuted; }
    
    public Integer getExecutionCount() { return executionCount; }
    public void setExecutionCount(Integer executionCount) { this.executionCount = executionCount; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}
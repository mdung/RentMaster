package com.rentmaster.communication;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sms_templates")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SMSTemplate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "message", nullable = false, length = 1600)
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "template_type", nullable = false)
    private TemplateType templateType;
    
    @ElementCollection
    @CollectionTable(name = "sms_template_variables", joinColumns = @JoinColumn(name = "template_id"))
    @Column(name = "variable_name")
    private List<String> variables;
    
    @Column(name = "active", nullable = false)
    private Boolean active = true;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    public enum TemplateType {
        INVOICE_DUE,
        PAYMENT_RECEIVED,
        CONTRACT_EXPIRING,
        REMINDER,
        CUSTOM
    }
    
    // Constructors
    public SMSTemplate() {
        this.createdAt = LocalDateTime.now();
    }
    
    public SMSTemplate(String name, String message, TemplateType templateType) {
        this();
        this.name = name;
        this.message = message;
        this.templateType = templateType;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public TemplateType getTemplateType() {
        return templateType;
    }
    
    public void setTemplateType(TemplateType templateType) {
        this.templateType = templateType;
    }
    
    public List<String> getVariables() {
        return variables;
    }
    
    public void setVariables(List<String> variables) {
        this.variables = variables;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
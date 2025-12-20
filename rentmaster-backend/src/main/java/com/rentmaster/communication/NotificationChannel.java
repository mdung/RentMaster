package com.rentmaster.communication;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "notification_channels")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class NotificationChannel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ChannelType type;
    
    @ElementCollection
    @CollectionTable(name = "notification_channel_config", joinColumns = @JoinColumn(name = "channel_id"))
    @MapKeyColumn(name = "config_key")
    @Column(name = "config_value")
    private Map<String, String> configuration;
    
    @Column(name = "active", nullable = false)
    private Boolean active = true;
    
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    public enum ChannelType {
        EMAIL,
        SMS,
        PUSH,
        WHATSAPP
    }
    
    // Constructors
    public NotificationChannel() {
        this.createdAt = LocalDateTime.now();
    }
    
    public NotificationChannel(String name, ChannelType type, Map<String, String> configuration) {
        this();
        this.name = name;
        this.type = type;
        this.configuration = configuration;
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
    
    public ChannelType getType() {
        return type;
    }
    
    public void setType(ChannelType type) {
        this.type = type;
    }
    
    public Map<String, String> getConfiguration() {
        return configuration;
    }
    
    public void setConfiguration(Map<String, String> configuration) {
        this.configuration = configuration;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
    
    public Boolean getIsDefault() {
        return isDefault;
    }
    
    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
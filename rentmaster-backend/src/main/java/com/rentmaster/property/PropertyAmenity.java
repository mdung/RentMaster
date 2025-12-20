package com.rentmaster.property;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_amenities")
public class PropertyAmenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private AmenityCategory category;

    @Column(name = "icon")
    private String icon;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "additional_cost")
    private Double additionalCost = 0.0;

    @Column(name = "cost_frequency")
    @Enumerated(EnumType.STRING)
    private CostFrequency costFrequency;

    @Column(name = "location")
    private String location;

    @Column(name = "operating_hours")
    private String operatingHours;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "booking_required")
    private Boolean bookingRequired = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public enum AmenityCategory {
        FITNESS, RECREATION, BUSINESS, PARKING, SECURITY, 
        UTILITIES, OUTDOOR, INDOOR, KITCHEN, LAUNDRY, 
        PET_FRIENDLY, ACCESSIBILITY, OTHER
    }

    public enum CostFrequency {
        ONE_TIME, DAILY, WEEKLY, MONTHLY, YEARLY
    }

    // Constructors
    public PropertyAmenity() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public PropertyAmenity(Long propertyId, String name, AmenityCategory category) {
        this();
        this.propertyId = propertyId;
        this.name = name;
        this.category = category;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AmenityCategory getCategory() { return category; }
    public void setCategory(AmenityCategory category) { this.category = category; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Double getAdditionalCost() { return additionalCost; }
    public void setAdditionalCost(Double additionalCost) { this.additionalCost = additionalCost; }

    public CostFrequency getCostFrequency() { return costFrequency; }
    public void setCostFrequency(CostFrequency costFrequency) { this.costFrequency = costFrequency; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Boolean getBookingRequired() { return bookingRequired; }
    public void setBookingRequired(Boolean bookingRequired) { this.bookingRequired = bookingRequired; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
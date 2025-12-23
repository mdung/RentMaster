package com.rentmaster.maintenance;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "work_orders")
public class WorkOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "work_order_number", unique = true, nullable = false)
    private String workOrderNumber;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(name = "maintenance_request_id")
    private Long maintenanceRequestId;

    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(name = "assigned_to")
    private Long assignedTo; // Staff member ID

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "work_type", nullable = false)
    private String workType; // MAINTENANCE, REPAIR, INSPECTION, INSTALLATION, etc.

    @Column(name = "priority", nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, URGENT, EMERGENCY

    @Column(name = "status", nullable = false)
    private String status; // PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "started_date")
    private LocalDateTime startedDate;

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    @Column(name = "estimated_duration")
    private Integer estimatedDuration; // in minutes

    @Column(name = "actual_duration")
    private Integer actualDuration; // in minutes

    @Column(name = "estimated_cost")
    private Double estimatedCost;

    @Column(name = "actual_cost")
    private Double actualCost;

    @Column(name = "location")
    private String location;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @ElementCollection
    @CollectionTable(name = "work_order_materials", joinColumns = @JoinColumn(name = "work_order_id"))
    @Column(name = "material")
    private List<String> materials;

    @ElementCollection
    @CollectionTable(name = "work_order_photos", joinColumns = @JoinColumn(name = "work_order_id"))
    @Column(name = "photo_url")
    private List<String> photos;

    @Column(name = "completion_notes", columnDefinition = "TEXT")
    private String completionNotes;

    @Column(name = "tenant_satisfaction_rating")
    private Integer tenantSatisfactionRating; // 1-5

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy;

    public WorkOrder() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "PENDING";
        this.priority = "MEDIUM";
        this.workOrderNumber = generateWorkOrderNumber();
    }

    private String generateWorkOrderNumber() {
        return "WO-" + System.currentTimeMillis();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWorkOrderNumber() { return workOrderNumber; }
    public void setWorkOrderNumber(String workOrderNumber) { this.workOrderNumber = workOrderNumber; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public Long getMaintenanceRequestId() { return maintenanceRequestId; }
    public void setMaintenanceRequestId(Long maintenanceRequestId) { this.maintenanceRequestId = maintenanceRequestId; }

    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }

    public Long getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Long assignedTo) { this.assignedTo = assignedTo; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getWorkType() { return workType; }
    public void setWorkType(String workType) { this.workType = workType; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDateTime getStartedDate() { return startedDate; }
    public void setStartedDate(LocalDateTime startedDate) { this.startedDate = startedDate; }

    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }

    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public Integer getActualDuration() { return actualDuration; }
    public void setActualDuration(Integer actualDuration) { this.actualDuration = actualDuration; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public Double getActualCost() { return actualCost; }
    public void setActualCost(Double actualCost) { this.actualCost = actualCost; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public List<String> getMaterials() { return materials; }
    public void setMaterials(List<String> materials) { this.materials = materials; }

    public List<String> getPhotos() { return photos; }
    public void setPhotos(List<String> photos) { this.photos = photos; }

    public String getCompletionNotes() { return completionNotes; }
    public void setCompletionNotes(String completionNotes) { this.completionNotes = completionNotes; }

    public Integer getTenantSatisfactionRating() { return tenantSatisfactionRating; }
    public void setTenantSatisfactionRating(Integer tenantSatisfactionRating) { this.tenantSatisfactionRating = tenantSatisfactionRating; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}


package com.rentmaster.messaging;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "property_events")
public class PropertyEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String type; // MAINTENANCE, INSPECTION, SOCIAL, MEETING, EMERGENCY, COMMUNITY, OTHER
    
    @Column(nullable = false)
    private String category; // MANDATORY, OPTIONAL, INFORMATIONAL
    
    @Column(nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    
    @Column(nullable = false)
    private LocalDateTime startDateTime;
    
    @Column(nullable = false)
    private LocalDateTime endDateTime;
    
    @Column(nullable = false)
    private String location;
    
    private String locationDetails;
    
    @Column(nullable = false)
    private Long propertyId;
    
    @Column(nullable = false)
    private String propertyName;
    
    @Column(nullable = false)
    private Long organizerId;
    
    @Column(nullable = false)
    private String organizerName;
    
    @Column(nullable = false)
    private String organizerType; // LANDLORD, ADMIN, TENANT, VENDOR
    
    private Integer maxAttendees;
    
    @Column(nullable = false)
    private Integer currentAttendees = 0;
    
    @ElementCollection
    @CollectionTable(name = "event_attendees", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "attendee_id")
    private List<Long> attendeeIds;
    
    @ElementCollection
    @CollectionTable(name = "event_invited", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "invited_id")
    private List<Long> invitedIds;
    
    @ElementCollection
    @CollectionTable(name = "event_declined", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "declined_id")
    private List<Long> declinedIds;
    
    @Column(nullable = false)
    private String status; // SCHEDULED, ONGOING, COMPLETED, CANCELLED, POSTPONED
    
    @Column(nullable = false)
    private Boolean isPublic = true;
    
    @Column(nullable = false)
    private Boolean requiresRSVP = false;
    
    @Column(nullable = false)
    private Boolean allowGuestInvites = false;
    
    private LocalDateTime rsvpDeadline;
    
    @ElementCollection
    @CollectionTable(name = "event_attachments", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "attachment_url")
    private List<String> attachments;
    
    @ElementCollection
    @CollectionTable(name = "event_tags", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(columnDefinition = "TEXT")
    private String requirements; // What attendees need to bring/prepare
    
    @Column(columnDefinition = "TEXT")
    private String agenda; // Event agenda or schedule
    
    private String contactInfo; // Contact information for questions
    
    @Column(nullable = false)
    private Boolean sendReminders = true;
    
    private Integer reminderHours = 24; // Hours before event to send reminder
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON for additional data
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public PropertyEvent() {}
    
    public PropertyEvent(String title, String type, LocalDateTime startDateTime, LocalDateTime endDateTime,
                        String location, Long propertyId, String propertyName,
                        Long organizerId, String organizerName, String organizerType) {
        this.title = title;
        this.type = type;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.location = location;
        this.propertyId = propertyId;
        this.propertyName = propertyName;
        this.organizerId = organizerId;
        this.organizerName = organizerName;
        this.organizerType = organizerType;
        this.category = "OPTIONAL";
        this.priority = "MEDIUM";
        this.status = "SCHEDULED";
        this.isPublic = true;
        this.requiresRSVP = false;
        this.allowGuestInvites = false;
        this.currentAttendees = 0;
        this.sendReminders = true;
        this.reminderHours = 24;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public LocalDateTime getStartDateTime() { return startDateTime; }
    public void setStartDateTime(LocalDateTime startDateTime) { this.startDateTime = startDateTime; }
    
    public LocalDateTime getEndDateTime() { return endDateTime; }
    public void setEndDateTime(LocalDateTime endDateTime) { this.endDateTime = endDateTime; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getLocationDetails() { return locationDetails; }
    public void setLocationDetails(String locationDetails) { this.locationDetails = locationDetails; }
    
    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }
    
    public String getPropertyName() { return propertyName; }
    public void setPropertyName(String propertyName) { this.propertyName = propertyName; }
    
    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }
    
    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
    
    public String getOrganizerType() { return organizerType; }
    public void setOrganizerType(String organizerType) { this.organizerType = organizerType; }
    
    public Integer getMaxAttendees() { return maxAttendees; }
    public void setMaxAttendees(Integer maxAttendees) { this.maxAttendees = maxAttendees; }
    
    public Integer getCurrentAttendees() { return currentAttendees; }
    public void setCurrentAttendees(Integer currentAttendees) { this.currentAttendees = currentAttendees; }
    
    public List<Long> getAttendeeIds() { return attendeeIds; }
    public void setAttendeeIds(List<Long> attendeeIds) { this.attendeeIds = attendeeIds; }
    
    public List<Long> getInvitedIds() { return invitedIds; }
    public void setInvitedIds(List<Long> invitedIds) { this.invitedIds = invitedIds; }
    
    public List<Long> getDeclinedIds() { return declinedIds; }
    public void setDeclinedIds(List<Long> declinedIds) { this.declinedIds = declinedIds; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    
    public Boolean getRequiresRSVP() { return requiresRSVP; }
    public void setRequiresRSVP(Boolean requiresRSVP) { this.requiresRSVP = requiresRSVP; }
    
    public Boolean getAllowGuestInvites() { return allowGuestInvites; }
    public void setAllowGuestInvites(Boolean allowGuestInvites) { this.allowGuestInvites = allowGuestInvites; }
    
    public LocalDateTime getRsvpDeadline() { return rsvpDeadline; }
    public void setRsvpDeadline(LocalDateTime rsvpDeadline) { this.rsvpDeadline = rsvpDeadline; }
    
    public List<String> getAttachments() { return attachments; }
    public void setAttachments(List<String> attachments) { this.attachments = attachments; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }
    
    public String getAgenda() { return agenda; }
    public void setAgenda(String agenda) { this.agenda = agenda; }
    
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    
    public Boolean getSendReminders() { return sendReminders; }
    public void setSendReminders(Boolean sendReminders) { this.sendReminders = sendReminders; }
    
    public Integer getReminderHours() { return reminderHours; }
    public void setReminderHours(Integer reminderHours) { this.reminderHours = reminderHours; }
    
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
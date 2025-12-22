package com.rentmaster.messaging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessagingService {

    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    @Autowired
    private PropertyEventRepository propertyEventRepository;
    
    @Autowired
    private TenantFeedbackRepository tenantFeedbackRepository;

    // Message Management
    public List<Message> getMessages(Long userId, String type, Boolean unreadOnly) {
        if (unreadOnly != null && unreadOnly) {
            return messageRepository.findByRecipientIdAndIsReadFalseAndIsDeletedFalseOrderByCreatedAtDesc(userId);
        } else if (type != null) {
            return messageRepository.findByMessageTypeAndIsDeletedFalseOrderByCreatedAtDesc(type)
                .stream()
                .filter(m -> m.getRecipientId().equals(userId) || m.getSenderId().equals(userId))
                .collect(Collectors.toList());
        } else {
            return messageRepository.findByRecipientIdAndIsDeletedFalseOrderByCreatedAtDesc(userId);
        }
    }

    public List<Message> getConversation(Long userId1, Long userId2) {
        return messageRepository.findConversation(userId1, userId2);
    }

    public Message sendMessage(Message message) {
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        
        // Generate thread ID if not provided
        if (message.getThreadId() == null) {
            message.setThreadId(System.currentTimeMillis());
        }
        
        return messageRepository.save(message);
    }

    public Message replyToMessage(Long parentMessageId, Message reply) {
        Message parentMessage = messageRepository.findById(parentMessageId)
            .orElseThrow(() -> new RuntimeException("Parent message not found"));
        
        reply.setParentMessageId(parentMessageId);
        reply.setThreadId(parentMessage.getThreadId());
        reply.setPropertyId(parentMessage.getPropertyId());
        reply.setContractId(parentMessage.getContractId());
        
        return sendMessage(reply);
    }

    public Message markAsRead(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getRecipientId().equals(userId)) {
            throw new RuntimeException("Unauthorized to mark this message as read");
        }
        
        message.setIsRead(true);
        message.setReadAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        
        return messageRepository.save(message);
    }

    public Message archiveMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getRecipientId().equals(userId) && !message.getSenderId().equals(userId)) {
            throw new RuntimeException("Unauthorized to archive this message");
        }
        
        message.setIsArchived(true);
        message.setArchivedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        
        return messageRepository.save(message);
    }

    public void deleteMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getRecipientId().equals(userId) && !message.getSenderId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this message");
        }
        
        message.setIsDeleted(true);
        message.setDeletedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());
        
        messageRepository.save(message);
    }

    public List<Message> searchMessages(String searchTerm, Long userId) {
        List<Message> allResults = messageRepository.searchMessages(searchTerm);
        return allResults.stream()
            .filter(m -> m.getRecipientId().equals(userId) || m.getSenderId().equals(userId))
            .collect(Collectors.toList());
    }

    public long getUnreadMessageCount(Long userId) {
        return messageRepository.countByRecipientIdAndIsReadFalseAndIsDeletedFalse(userId);
    }

    // Announcement Management
    public List<Announcement> getAnnouncements(Long userId, Long propertyId, String type) {
        if (propertyId != null) {
            return announcementRepository.findAnnouncementsForProperty(propertyId);
        } else if (type != null) {
            return announcementRepository.findByTypeAndIsActiveTrueOrderByPublishDateDesc(type);
        } else {
            return announcementRepository.findByIsActiveTrueOrderByIsPinnedDescPublishDateDesc();
        }
    }

    public List<Announcement> getAnnouncementsForTenant(Long tenantId) {
        return announcementRepository.findAnnouncementsForTenant(tenantId);
    }

    public Announcement createAnnouncement(Announcement announcement) {
        announcement.setCreatedAt(LocalDateTime.now());
        announcement.setUpdatedAt(LocalDateTime.now());
        
        if (announcement.getPublishDate() == null) {
            announcement.setPublishDate(LocalDateTime.now());
        }
        
        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(Long id, Announcement announcement) {
        Announcement existing = announcementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        existing.setTitle(announcement.getTitle());
        existing.setContent(announcement.getContent());
        existing.setType(announcement.getType());
        existing.setPriority(announcement.getPriority());
        existing.setTargetAudience(announcement.getTargetAudience());
        existing.setPropertyIds(announcement.getPropertyIds());
        existing.setTenantIds(announcement.getTenantIds());
        existing.setExpiryDate(announcement.getExpiryDate());
        existing.setIsPinned(announcement.getIsPinned());
        existing.setRequiresAcknowledgment(announcement.getRequiresAcknowledgment());
        existing.setAttachments(announcement.getAttachments());
        existing.setTags(announcement.getTags());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return announcementRepository.save(existing);
    }

    public Announcement markAnnouncementAsRead(Long announcementId, Long userId) {
        Announcement announcement = announcementRepository.findById(announcementId)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        List<Long> readBy = announcement.getReadBy();
        if (readBy == null) {
            readBy = new ArrayList<>();
        }
        
        if (!readBy.contains(userId)) {
            readBy.add(userId);
            announcement.setReadBy(readBy);
            announcement.setViewCount(announcement.getViewCount() + 1);
            announcement.setUpdatedAt(LocalDateTime.now());
            
            return announcementRepository.save(announcement);
        }
        
        return announcement;
    }

    public Announcement acknowledgeAnnouncement(Long announcementId, Long userId) {
        Announcement announcement = announcementRepository.findById(announcementId)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        if (!announcement.getRequiresAcknowledgment()) {
            throw new RuntimeException("This announcement does not require acknowledgment");
        }
        
        List<Long> acknowledgedBy = announcement.getAcknowledgedBy();
        if (acknowledgedBy == null) {
            acknowledgedBy = new ArrayList<>();
        }
        
        if (!acknowledgedBy.contains(userId)) {
            acknowledgedBy.add(userId);
            announcement.setAcknowledgedBy(acknowledgedBy);
            announcement.setAcknowledgmentCount(announcement.getAcknowledgmentCount() + 1);
            announcement.setUpdatedAt(LocalDateTime.now());
            
            return announcementRepository.save(announcement);
        }
        
        return announcement;
    }

    public List<Announcement> searchAnnouncements(String searchTerm) {
        return announcementRepository.searchAnnouncements(searchTerm);
    }

    // Property Event Management
    public List<PropertyEvent> getEvents(Long propertyId, String type, String status, LocalDateTime startDate, LocalDateTime endDate) {
        if (propertyId != null && startDate != null && endDate != null) {
            return propertyEventRepository.findEventsByPropertyAndDateRange(propertyId, startDate, endDate);
        } else if (startDate != null && endDate != null) {
            return propertyEventRepository.findEventsByDateRange(startDate, endDate);
        } else if (propertyId != null) {
            return propertyEventRepository.findByPropertyIdOrderByStartDateTimeAsc(propertyId);
        } else if (type != null) {
            return propertyEventRepository.findByTypeOrderByStartDateTimeAsc(type);
        } else if (status != null) {
            return propertyEventRepository.findByStatusOrderByStartDateTimeAsc(status);
        } else {
            return propertyEventRepository.findUpcomingEvents(LocalDateTime.now());
        }
    }

    public List<PropertyEvent> getEventsForMonth(int year, int month) {
        return propertyEventRepository.findEventsForMonth(year, month);
    }

    public PropertyEvent createEvent(PropertyEvent event) {
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        
        // Check for conflicts
        List<PropertyEvent> conflicts = propertyEventRepository.findConflictingEvents(
            event.getPropertyId(), 0L, event.getStartDateTime(), event.getEndDateTime());
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Event conflicts with existing events: " + 
                conflicts.stream().map(PropertyEvent::getTitle).collect(Collectors.joining(", ")));
        }
        
        return propertyEventRepository.save(event);
    }

    public PropertyEvent updateEvent(Long id, PropertyEvent event) {
        PropertyEvent existing = propertyEventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check for conflicts (excluding current event)
        List<PropertyEvent> conflicts = propertyEventRepository.findConflictingEvents(
            event.getPropertyId(), id, event.getStartDateTime(), event.getEndDateTime());
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Event conflicts with existing events: " + 
                conflicts.stream().map(PropertyEvent::getTitle).collect(Collectors.joining(", ")));
        }
        
        existing.setTitle(event.getTitle());
        existing.setDescription(event.getDescription());
        existing.setType(event.getType());
        existing.setCategory(event.getCategory());
        existing.setPriority(event.getPriority());
        existing.setStartDateTime(event.getStartDateTime());
        existing.setEndDateTime(event.getEndDateTime());
        existing.setLocation(event.getLocation());
        existing.setLocationDetails(event.getLocationDetails());
        existing.setMaxAttendees(event.getMaxAttendees());
        existing.setIsPublic(event.getIsPublic());
        existing.setRequiresRSVP(event.getRequiresRSVP());
        existing.setRsvpDeadline(event.getRsvpDeadline());
        existing.setNotes(event.getNotes());
        existing.setRequirements(event.getRequirements());
        existing.setAgenda(event.getAgenda());
        existing.setContactInfo(event.getContactInfo());
        existing.setAttachments(event.getAttachments());
        existing.setTags(event.getTags());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return propertyEventRepository.save(existing);
    }

    public PropertyEvent rsvpToEvent(Long eventId, Long userId, boolean attending) {
        PropertyEvent event = propertyEventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        List<Long> attendeeIds = event.getAttendeeIds();
        List<Long> declinedIds = event.getDeclinedIds();
        
        if (attendeeIds == null) attendeeIds = new ArrayList<>();
        if (declinedIds == null) declinedIds = new ArrayList<>();
        
        // Remove from both lists first
        attendeeIds.remove(userId);
        declinedIds.remove(userId);
        
        if (attending) {
            // Check capacity
            if (event.getMaxAttendees() != null && attendeeIds.size() >= event.getMaxAttendees()) {
                throw new RuntimeException("Event is at maximum capacity");
            }
            
            attendeeIds.add(userId);
            event.setCurrentAttendees(attendeeIds.size());
        } else {
            declinedIds.add(userId);
        }
        
        event.setAttendeeIds(attendeeIds);
        event.setDeclinedIds(declinedIds);
        event.setUpdatedAt(LocalDateTime.now());
        
        return propertyEventRepository.save(event);
    }

    public List<PropertyEvent> getUserEvents(Long userId) {
        List<PropertyEvent> attending = propertyEventRepository.findEventsUserAttending(userId);
        List<PropertyEvent> invited = propertyEventRepository.findEventsUserInvitedTo(userId);
        
        Set<PropertyEvent> allEvents = new HashSet<>(attending);
        allEvents.addAll(invited);
        
        return allEvents.stream()
            .sorted(Comparator.comparing(PropertyEvent::getStartDateTime))
            .collect(Collectors.toList());
    }

    public List<PropertyEvent> searchEvents(String searchTerm) {
        return propertyEventRepository.searchEvents(searchTerm);
    }

    // Tenant Feedback Management
    public List<TenantFeedback> getFeedback(Long tenantId, Long propertyId, String status, String type) {
        if (tenantId != null) {
            return tenantFeedbackRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
        } else if (propertyId != null) {
            return tenantFeedbackRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId);
        } else if (status != null) {
            return tenantFeedbackRepository.findByStatusOrderByCreatedAtDesc(status);
        } else if (type != null) {
            return tenantFeedbackRepository.findByTypeOrderByCreatedAtDesc(type);
        } else {
            return tenantFeedbackRepository.findAll();
        }
    }

    public TenantFeedback submitFeedback(TenantFeedback feedback) {
        feedback.setCreatedAt(LocalDateTime.now());
        feedback.setUpdatedAt(LocalDateTime.now());
        
        return tenantFeedbackRepository.save(feedback);
    }

    public TenantFeedback updateFeedbackStatus(Long id, String status, Long userId, String userName) {
        TenantFeedback feedback = tenantFeedbackRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Feedback not found"));
        
        String oldStatus = feedback.getStatus();
        feedback.setStatus(status);
        feedback.setUpdatedAt(LocalDateTime.now());
        
        switch (status) {
            case "ACKNOWLEDGED":
                if (feedback.getAcknowledgedAt() == null) {
                    feedback.setAcknowledgedAt(LocalDateTime.now());
                    feedback.setAcknowledgedBy(userId);
                    feedback.setAcknowledgedByName(userName);
                }
                break;
            case "RESOLVED":
                if (feedback.getResolvedAt() == null) {
                    feedback.setResolvedAt(LocalDateTime.now());
                    feedback.setResolvedBy(userId);
                    feedback.setResolvedByName(userName);
                }
                break;
        }
        
        return tenantFeedbackRepository.save(feedback);
    }

    public TenantFeedback respondToFeedback(Long id, String response, Long userId, String userName) {
        TenantFeedback feedback = tenantFeedbackRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Feedback not found"));
        
        feedback.setResponse(response);
        feedback.setRespondedAt(LocalDateTime.now());
        feedback.setRespondedBy(userId);
        feedback.setRespondedByName(userName);
        feedback.setUpdatedAt(LocalDateTime.now());
        
        return tenantFeedbackRepository.save(feedback);
    }

    public TenantFeedback assignFeedback(Long id, Long assignedTo, String assignedToName) {
        TenantFeedback feedback = tenantFeedbackRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Feedback not found"));
        
        feedback.setAssignedTo(assignedTo);
        feedback.setAssignedToName(assignedToName);
        feedback.setUpdatedAt(LocalDateTime.now());
        
        return tenantFeedbackRepository.save(feedback);
    }

    public TenantFeedback rateSatisfaction(Long id, Integer rating, String comment, Long tenantId) {
        TenantFeedback feedback = tenantFeedbackRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Feedback not found"));
        
        if (!feedback.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized to rate this feedback");
        }
        
        feedback.setSatisfactionRating(rating);
        feedback.setSatisfactionComment(comment);
        feedback.setUpdatedAt(LocalDateTime.now());
        
        return tenantFeedbackRepository.save(feedback);
    }

    public List<TenantFeedback> searchFeedback(String searchTerm) {
        return tenantFeedbackRepository.searchFeedback(searchTerm);
    }

    // Statistics and Analytics
    public Map<String, Object> getMessagingStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Message statistics - calculate from actual data
            List<Message> allMessages = messageRepository.findAll();
            Map<String, Long> messageTypeStats = allMessages.stream()
                .filter(m -> !m.getIsDeleted())
                .collect(Collectors.groupingBy(Message::getMessageType, Collectors.counting()));
            
            Map<String, Long> messagePriorityStats = allMessages.stream()
                .filter(m -> !m.getIsDeleted())
                .collect(Collectors.groupingBy(Message::getPriority, Collectors.counting()));
            
            // Announcement statistics
            List<Announcement> allAnnouncements = announcementRepository.findAll();
            Map<String, Long> announcementTypeStats = allAnnouncements.stream()
                .filter(a -> a.getIsActive())
                .collect(Collectors.groupingBy(Announcement::getType, Collectors.counting()));
            
            // Event statistics
            List<PropertyEvent> allEvents = propertyEventRepository.findAll();
            Map<String, Long> eventTypeStats = allEvents.stream()
                .collect(Collectors.groupingBy(PropertyEvent::getType, Collectors.counting()));
            
            // Feedback statistics
            List<TenantFeedback> allFeedback = tenantFeedbackRepository.findAll();
            Map<String, Long> feedbackTypeStats = allFeedback.stream()
                .collect(Collectors.groupingBy(TenantFeedback::getType, Collectors.counting()));
            
            Double averageRating = allFeedback.stream()
                .filter(f -> f.getRating() != null)
                .mapToDouble(TenantFeedback::getRating)
                .average()
                .orElse(0.0);
            
            Double averageSatisfaction = allFeedback.stream()
                .filter(f -> f.getSatisfactionRating() != null)
                .mapToDouble(TenantFeedback::getSatisfactionRating)
                .average()
                .orElse(0.0);
            
            stats.put("messagesByType", messageTypeStats);
            stats.put("messagesByPriority", messagePriorityStats);
            stats.put("announcementsByType", announcementTypeStats);
            stats.put("eventsByType", eventTypeStats);
            stats.put("feedbackByType", feedbackTypeStats);
            stats.put("averageFeedbackRating", averageRating);
            stats.put("averageSatisfactionRating", averageSatisfaction);
        } catch (Exception e) {
            // Return empty stats if there's an error
            stats.put("messagesByType", new HashMap<>());
            stats.put("messagesByPriority", new HashMap<>());
            stats.put("announcementsByType", new HashMap<>());
            stats.put("eventsByType", new HashMap<>());
            stats.put("feedbackByType", new HashMap<>());
            stats.put("averageFeedbackRating", 0.0);
            stats.put("averageSatisfactionRating", 0.0);
        }
        
        return stats;
    }

    public Map<String, Object> getDashboardData(Long userId) {
        Map<String, Object> data = new HashMap<>();
        
        try {
            // Recent messages - get all and filter
            LocalDateTime since = LocalDateTime.now().minusDays(7);
            List<Message> allMessages = messageRepository.findByRecipientIdAndIsDeletedFalseOrderByCreatedAtDesc(userId);
            List<Message> recentMessages = allMessages.stream()
                .filter(m -> m.getCreatedAt() != null && m.getCreatedAt().isAfter(since))
                .limit(10)
                .collect(Collectors.toList());
            
            // Unread count
            long unreadCount = messageRepository.countByRecipientIdAndIsReadFalseAndIsDeletedFalse(userId);
            
            // Recent announcements
            List<Announcement> allAnnouncements = announcementRepository.findByIsActiveTrueOrderByIsPinnedDescPublishDateDesc();
            List<Announcement> recentAnnouncements = allAnnouncements.stream()
                .filter(a -> a.getPublishDate() != null && a.getPublishDate().isAfter(since))
                .limit(5)
                .collect(Collectors.toList());
            
            // Upcoming events
            List<PropertyEvent> allEvents = propertyEventRepository.findAll();
            List<PropertyEvent> upcomingEvents = allEvents.stream()
                .filter(e -> e.getStartDateTime() != null && e.getStartDateTime().isAfter(LocalDateTime.now()))
                .sorted(Comparator.comparing(PropertyEvent::getStartDateTime))
                .limit(5)
                .collect(Collectors.toList());
            
            // Recent feedback
            List<TenantFeedback> allFeedback = tenantFeedbackRepository.findAll();
            List<TenantFeedback> recentFeedback = allFeedback.stream()
                .filter(f -> f.getCreatedAt() != null && f.getCreatedAt().isAfter(since))
                .limit(5)
                .collect(Collectors.toList());
            
            data.put("recentMessages", recentMessages);
            data.put("unreadMessageCount", unreadCount);
            data.put("recentAnnouncements", recentAnnouncements);
            data.put("upcomingEvents", upcomingEvents);
            data.put("recentFeedback", recentFeedback);
        } catch (Exception e) {
            // Return empty data if there's an error
            data.put("recentMessages", new ArrayList<>());
            data.put("unreadMessageCount", 0L);
            data.put("recentAnnouncements", new ArrayList<>());
            data.put("upcomingEvents", new ArrayList<>());
            data.put("recentFeedback", new ArrayList<>());
        }
        
        return data;
    }
}
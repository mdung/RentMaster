package com.rentmaster.messaging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messaging")
@CrossOrigin(origins = "*")
public class MessagingController {

    @Autowired
    private MessagingService messagingService;

    // Message Endpoints
    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages(
            @RequestParam Long userId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean unreadOnly) {
        List<Message> messages = messagingService.getMessages(userId, type, unreadOnly);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/messages/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam Long userId1,
            @RequestParam Long userId2) {
        List<Message> conversation = messagingService.getConversation(userId1, userId2);
        return ResponseEntity.ok(conversation);
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        Message sentMessage = messagingService.sendMessage(message);
        return ResponseEntity.ok(sentMessage);
    }

    @PostMapping("/messages/{parentId}/reply")
    public ResponseEntity<Message> replyToMessage(
            @PathVariable Long parentId,
            @RequestBody Message reply) {
        Message sentReply = messagingService.replyToMessage(parentId, reply);
        return ResponseEntity.ok(sentReply);
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<Message> markAsRead(
            @PathVariable Long id,
            @RequestParam Long userId) {
        Message message = messagingService.markAsRead(id, userId);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/messages/{id}/archive")
    public ResponseEntity<Message> archiveMessage(
            @PathVariable Long id,
            @RequestParam Long userId) {
        Message message = messagingService.archiveMessage(id, userId);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long id,
            @RequestParam Long userId) {
        messagingService.deleteMessage(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/messages/search")
    public ResponseEntity<List<Message>> searchMessages(
            @RequestParam String query,
            @RequestParam Long userId) {
        List<Message> results = messagingService.searchMessages(query, userId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/messages/unread-count")
    public ResponseEntity<Long> getUnreadMessageCount(@RequestParam Long userId) {
        long count = messagingService.getUnreadMessageCount(userId);
        return ResponseEntity.ok(count);
    }

    // Announcement Endpoints
    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) String type) {
        List<Announcement> announcements = messagingService.getAnnouncements(userId, propertyId, type);
        return ResponseEntity.ok(announcements);
    }

    @GetMapping("/announcements/tenant/{tenantId}")
    public ResponseEntity<List<Announcement>> getAnnouncementsForTenant(@PathVariable Long tenantId) {
        List<Announcement> announcements = messagingService.getAnnouncementsForTenant(tenantId);
        return ResponseEntity.ok(announcements);
    }

    @PostMapping("/announcements")
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody Announcement announcement) {
        Announcement created = messagingService.createAnnouncement(announcement);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/announcements/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Announcement announcement) {
        Announcement updated = messagingService.updateAnnouncement(id, announcement);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/announcements/{id}/read")
    public ResponseEntity<Announcement> markAnnouncementAsRead(
            @PathVariable Long id,
            @RequestParam Long userId) {
        Announcement announcement = messagingService.markAnnouncementAsRead(id, userId);
        return ResponseEntity.ok(announcement);
    }

    @PutMapping("/announcements/{id}/acknowledge")
    public ResponseEntity<Announcement> acknowledgeAnnouncement(
            @PathVariable Long id,
            @RequestParam Long userId) {
        Announcement announcement = messagingService.acknowledgeAnnouncement(id, userId);
        return ResponseEntity.ok(announcement);
    }

    @GetMapping("/announcements/search")
    public ResponseEntity<List<Announcement>> searchAnnouncements(@RequestParam String query) {
        List<Announcement> results = messagingService.searchAnnouncements(query);
        return ResponseEntity.ok(results);
    }

    // Property Event Endpoints
    @GetMapping("/events")
    public ResponseEntity<List<PropertyEvent>> getEvents(
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime start = null;
        LocalDateTime end = null;
        
        if (startDate != null) {
            start = LocalDateTime.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }
        if (endDate != null) {
            end = LocalDateTime.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }
        
        List<PropertyEvent> events = messagingService.getEvents(propertyId, type, status, start, end);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/events/calendar")
    public ResponseEntity<List<PropertyEvent>> getEventsForMonth(
            @RequestParam int year,
            @RequestParam int month) {
        List<PropertyEvent> events = messagingService.getEventsForMonth(year, month);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/events/user/{userId}")
    public ResponseEntity<List<PropertyEvent>> getUserEvents(@PathVariable Long userId) {
        List<PropertyEvent> events = messagingService.getUserEvents(userId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/events")
    public ResponseEntity<PropertyEvent> createEvent(@RequestBody PropertyEvent event) {
        PropertyEvent created = messagingService.createEvent(event);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<PropertyEvent> updateEvent(
            @PathVariable Long id,
            @RequestBody PropertyEvent event) {
        PropertyEvent updated = messagingService.updateEvent(id, event);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/events/{id}/rsvp")
    public ResponseEntity<PropertyEvent> rsvpToEvent(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam boolean attending) {
        PropertyEvent event = messagingService.rsvpToEvent(id, userId, attending);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/events/search")
    public ResponseEntity<List<PropertyEvent>> searchEvents(@RequestParam String query) {
        List<PropertyEvent> results = messagingService.searchEvents(query);
        return ResponseEntity.ok(results);
    }

    // Tenant Feedback Endpoints
    @GetMapping("/feedback")
    public ResponseEntity<List<TenantFeedback>> getFeedback(
            @RequestParam(required = false) Long tenantId,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        List<TenantFeedback> feedback = messagingService.getFeedback(tenantId, propertyId, status, type);
        return ResponseEntity.ok(feedback);
    }

    @PostMapping("/feedback")
    public ResponseEntity<TenantFeedback> submitFeedback(@RequestBody TenantFeedback feedback) {
        TenantFeedback submitted = messagingService.submitFeedback(feedback);
        return ResponseEntity.ok(submitted);
    }

    @PutMapping("/feedback/{id}/status")
    public ResponseEntity<TenantFeedback> updateFeedbackStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam Long userId,
            @RequestParam String userName) {
        TenantFeedback updated = messagingService.updateFeedbackStatus(id, status, userId, userName);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/feedback/{id}/respond")
    public ResponseEntity<TenantFeedback> respondToFeedback(
            @PathVariable Long id,
            @RequestParam String response,
            @RequestParam Long userId,
            @RequestParam String userName) {
        TenantFeedback updated = messagingService.respondToFeedback(id, response, userId, userName);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/feedback/{id}/assign")
    public ResponseEntity<TenantFeedback> assignFeedback(
            @PathVariable Long id,
            @RequestParam Long assignedTo,
            @RequestParam String assignedToName) {
        TenantFeedback updated = messagingService.assignFeedback(id, assignedTo, assignedToName);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/feedback/{id}/satisfaction")
    public ResponseEntity<TenantFeedback> rateSatisfaction(
            @PathVariable Long id,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment,
            @RequestParam Long tenantId) {
        TenantFeedback updated = messagingService.rateSatisfaction(id, rating, comment, tenantId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/feedback/search")
    public ResponseEntity<List<TenantFeedback>> searchFeedback(@RequestParam String query) {
        List<TenantFeedback> results = messagingService.searchFeedback(query);
        return ResponseEntity.ok(results);
    }

    // Statistics and Analytics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getMessagingStatistics() {
        Map<String, Object> stats = messagingService.getMessagingStatistics();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(@RequestParam Long userId) {
        Map<String, Object> data = messagingService.getDashboardData(userId);
        return ResponseEntity.ok(data);
    }

    // Bulk Operations
    @PostMapping("/messages/bulk-send")
    public ResponseEntity<List<Message>> bulkSendMessages(@RequestBody Map<String, Object> request) {
        // Implementation for bulk message sending
        return ResponseEntity.ok().build();
    }

    @PutMapping("/messages/bulk-read")
    public ResponseEntity<Void> bulkMarkAsRead(@RequestBody Map<String, Object> request) {
        // Implementation for bulk mark as read
        return ResponseEntity.ok().build();
    }

    @PutMapping("/announcements/bulk-acknowledge")
    public ResponseEntity<Void> bulkAcknowledgeAnnouncements(@RequestBody Map<String, Object> request) {
        // Implementation for bulk acknowledgment
        return ResponseEntity.ok().build();
    }

    // Export Operations
    @GetMapping("/messages/export")
    public ResponseEntity<Map<String, Object>> exportMessages(
            @RequestParam Long userId,
            @RequestParam String format,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // Implementation for message export
        return ResponseEntity.ok().build();
    }

    @GetMapping("/feedback/export")
    public ResponseEntity<Map<String, Object>> exportFeedback(
            @RequestParam String format,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        // Implementation for feedback export
        return ResponseEntity.ok().build();
    }
}
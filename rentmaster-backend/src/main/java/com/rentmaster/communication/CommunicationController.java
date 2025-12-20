package com.rentmaster.communication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/communication")
@CrossOrigin(origins = "*")
public class CommunicationController {
    
    @Autowired
    private CommunicationService communicationService;
    
    // Email Templates Endpoints
    @GetMapping("/email-templates")
    public ResponseEntity<List<EmailTemplate>> getEmailTemplates() {
        return ResponseEntity.ok(communicationService.getAllEmailTemplates());
    }
    
    @GetMapping("/email-templates/{id}")
    public ResponseEntity<EmailTemplate> getEmailTemplate(@PathVariable Long id) {
        return communicationService.getEmailTemplateById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/email-templates")
    public ResponseEntity<EmailTemplate> createEmailTemplate(@RequestBody EmailTemplate template) {
        EmailTemplate created = communicationService.createEmailTemplate(template);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/email-templates/{id}")
    public ResponseEntity<EmailTemplate> updateEmailTemplate(@PathVariable Long id, @RequestBody EmailTemplate template) {
        EmailTemplate updated = communicationService.updateEmailTemplate(id, template);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/email-templates/{id}")
    public ResponseEntity<Void> deleteEmailTemplate(@PathVariable Long id) {
        communicationService.deleteEmailTemplate(id);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/email-templates/{id}/toggle")
    public ResponseEntity<EmailTemplate> toggleEmailTemplate(@PathVariable Long id) {
        EmailTemplate toggled = communicationService.toggleEmailTemplate(id);
        return ResponseEntity.ok(toggled);
    }
    
    @PostMapping("/email-templates/{id}/preview")
    public ResponseEntity<Map<String, String>> previewEmailTemplate(@PathVariable Long id, @RequestBody Map<String, Object> variables) {
        Map<String, String> preview = communicationService.previewEmailTemplate(id, variables);
        return ResponseEntity.ok(preview);
    }
    
    // SMS Templates Endpoints
    @GetMapping("/sms-templates")
    public ResponseEntity<List<SMSTemplate>> getSMSTemplates() {
        return ResponseEntity.ok(communicationService.getAllSMSTemplates());
    }
    
    @GetMapping("/sms-templates/{id}")
    public ResponseEntity<SMSTemplate> getSMSTemplate(@PathVariable Long id) {
        return communicationService.getSMSTemplateById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/sms-templates")
    public ResponseEntity<SMSTemplate> createSMSTemplate(@RequestBody SMSTemplate template) {
        SMSTemplate created = communicationService.createSMSTemplate(template);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/sms-templates/{id}")
    public ResponseEntity<SMSTemplate> updateSMSTemplate(@PathVariable Long id, @RequestBody SMSTemplate template) {
        SMSTemplate updated = communicationService.updateSMSTemplate(id, template);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/sms-templates/{id}")
    public ResponseEntity<Void> deleteSMSTemplate(@PathVariable Long id) {
        communicationService.deleteSMSTemplate(id);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/sms-templates/{id}/toggle")
    public ResponseEntity<SMSTemplate> toggleSMSTemplate(@PathVariable Long id) {
        SMSTemplate toggled = communicationService.toggleSMSTemplate(id);
        return ResponseEntity.ok(toggled);
    }
    
    // Notification Channels Endpoints
    @GetMapping("/channels")
    public ResponseEntity<List<NotificationChannel>> getChannels() {
        return ResponseEntity.ok(communicationService.getAllChannels());
    }
    
    @GetMapping("/channels/{id}")
    public ResponseEntity<NotificationChannel> getChannel(@PathVariable Long id) {
        return communicationService.getChannelById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/channels")
    public ResponseEntity<NotificationChannel> createChannel(@RequestBody NotificationChannel channel) {
        NotificationChannel created = communicationService.createChannel(channel);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/channels/{id}")
    public ResponseEntity<NotificationChannel> updateChannel(@PathVariable Long id, @RequestBody NotificationChannel channel) {
        NotificationChannel updated = communicationService.updateChannel(id, channel);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/channels/{id}")
    public ResponseEntity<Void> deleteChannel(@PathVariable Long id) {
        communicationService.deleteChannel(id);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/channels/{id}/toggle")
    public ResponseEntity<NotificationChannel> toggleChannel(@PathVariable Long id) {
        NotificationChannel toggled = communicationService.toggleChannel(id);
        return ResponseEntity.ok(toggled);
    }
    
    @PostMapping("/channels/{id}/test")
    public ResponseEntity<Void> testChannel(@PathVariable Long id, @RequestBody Map<String, Object> testData) {
        communicationService.testChannel(id, testData);
        return ResponseEntity.ok().build();
    }
    
    // Communication Logs Endpoints
    @GetMapping("/logs")
    public ResponseEntity<Page<CommunicationLog>> getCommunicationLogs(
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String recipientType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        NotificationChannel.ChannelType channelType = channel != null ? NotificationChannel.ChannelType.valueOf(channel) : null;
        CommunicationLog.CommunicationStatus statusEnum = status != null ? CommunicationLog.CommunicationStatus.valueOf(status) : null;
        CommunicationLog.RecipientType recipientTypeEnum = recipientType != null ? CommunicationLog.RecipientType.valueOf(recipientType) : null;
        
        Page<CommunicationLog> logs = communicationService.getCommunicationLogs(
            channelType, statusEnum, recipientTypeEnum, dateFrom, dateTo, pageable);
        
        return ResponseEntity.ok(logs);
    }
    
    @PostMapping("/logs/{id}/retry")
    public ResponseEntity<Void> retryCommunication(@PathVariable Long id) {
        communicationService.retryCommunication(id);
        return ResponseEntity.ok().build();
    }
    
    // Bulk Communications Endpoints
    @GetMapping("/bulk")
    public ResponseEntity<List<BulkCommunication>> getBulkCommunications() {
        return ResponseEntity.ok(communicationService.getAllBulkCommunications());
    }
    
    @GetMapping("/bulk/{id}")
    public ResponseEntity<BulkCommunication> getBulkCommunication(@PathVariable Long id) {
        return communicationService.getBulkCommunicationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/bulk")
    public ResponseEntity<BulkCommunication> createBulkCommunication(@RequestBody BulkCommunication bulkCommunication) {
        BulkCommunication created = communicationService.createBulkCommunication(bulkCommunication);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/bulk/{id}")
    public ResponseEntity<BulkCommunication> updateBulkCommunication(@PathVariable Long id, @RequestBody BulkCommunication bulkCommunication) {
        BulkCommunication updated = communicationService.updateBulkCommunication(id, bulkCommunication);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/bulk/{id}")
    public ResponseEntity<Void> deleteBulkCommunication(@PathVariable Long id) {
        communicationService.deleteBulkCommunication(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/bulk/{id}/send")
    public ResponseEntity<Void> sendBulkCommunication(@PathVariable Long id) {
        communicationService.sendBulkCommunication(id);
        return ResponseEntity.ok().build();
    }
    
    // Notification Preferences Endpoints
    @GetMapping("/preferences")
    public ResponseEntity<List<NotificationPreference>> getNotificationPreferences(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(communicationService.getNotificationPreferences(userId));
    }
    
    @PostMapping("/preferences")
    public ResponseEntity<NotificationPreference> createNotificationPreference(@RequestBody NotificationPreference preference) {
        NotificationPreference created = communicationService.createNotificationPreference(preference);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/preferences/{id}")
    public ResponseEntity<NotificationPreference> updateNotificationPreference(@PathVariable Long id, @RequestBody NotificationPreference preference) {
        NotificationPreference updated = communicationService.updateNotificationPreference(id, preference);
        return ResponseEntity.ok(updated);
    }
    
    // Statistics Endpoint
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCommunicationStats() {
        return ResponseEntity.ok(communicationService.getCommunicationStats());
    }
    
    // Individual Communication Endpoints
    @PostMapping("/send/email")
    public ResponseEntity<Void> sendEmail(@RequestBody Map<String, Object> request) {
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        Long templateId = request.get("templateId") != null ? Long.valueOf(request.get("templateId").toString()) : null;
        String subject = (String) request.get("subject");
        String body = (String) request.get("body");
        @SuppressWarnings("unchecked")
        Map<String, Object> variables = (Map<String, Object>) request.getOrDefault("variables", Map.of());
        
        communicationService.sendEmail(recipientId, templateId, subject, body, variables);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/send/sms")
    public ResponseEntity<Void> sendSMS(@RequestBody Map<String, Object> request) {
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        Long templateId = request.get("templateId") != null ? Long.valueOf(request.get("templateId").toString()) : null;
        String message = (String) request.get("message");
        @SuppressWarnings("unchecked")
        Map<String, Object> variables = (Map<String, Object>) request.getOrDefault("variables", Map.of());
        
        communicationService.sendSMS(recipientId, templateId, message, variables);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/send/whatsapp")
    public ResponseEntity<Void> sendWhatsApp(@RequestBody Map<String, Object> request) {
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String message = (String) request.get("message");
        @SuppressWarnings("unchecked")
        List<String> attachments = (List<String>) request.getOrDefault("attachments", List.of());
        
        communicationService.sendWhatsApp(recipientId, message, attachments);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/send/push")
    public ResponseEntity<Void> sendPushNotification(@RequestBody Map<String, Object> request) {
        Long recipientId = Long.valueOf(request.get("recipientId").toString());
        String title = (String) request.get("title");
        String message = (String) request.get("message");
        @SuppressWarnings("unchecked")
        Map<String, Object> data = (Map<String, Object>) request.getOrDefault("data", Map.of());
        
        communicationService.sendPushNotification(recipientId, title, message, data);
        return ResponseEntity.ok().build();
    }
}
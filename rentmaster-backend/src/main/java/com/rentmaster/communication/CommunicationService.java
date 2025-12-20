package com.rentmaster.communication;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class CommunicationService {
    
    private static final Logger log = LoggerFactory.getLogger(CommunicationService.class);
    
    @Autowired
    private EmailTemplateRepository emailTemplateRepository;
    
    @Autowired
    private SMSTemplateRepository smsTemplateRepository;
    
    @Autowired
    private NotificationChannelRepository channelRepository;
    
    @Autowired
    private CommunicationLogRepository communicationLogRepository;
    
    @Autowired
    private BulkCommunicationRepository bulkCommunicationRepository;
    
    @Autowired
    private NotificationPreferenceRepository preferenceRepository;
    
    // Email Template Methods
    public List<EmailTemplate> getAllEmailTemplates() {
        return emailTemplateRepository.findAll();
    }
    
    public List<EmailTemplate> getActiveEmailTemplates() {
        return emailTemplateRepository.findByActiveTrue();
    }
    
    public Optional<EmailTemplate> getEmailTemplateById(Long id) {
        return emailTemplateRepository.findById(id);
    }
    
    public EmailTemplate createEmailTemplate(EmailTemplate template) {
        // If setting as default, unset other defaults for this type
        if (template.getIsDefault()) {
            unsetDefaultEmailTemplate(template.getTemplateType());
        }
        
        // Extract variables from template content
        template.setVariables(extractVariables(template.getSubject() + " " + template.getBody()));
        
        return emailTemplateRepository.save(template);
    }
    
    public EmailTemplate updateEmailTemplate(Long id, EmailTemplate updatedTemplate) {
        EmailTemplate existing = emailTemplateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Email template not found"));
        
        // If setting as default, unset other defaults for this type
        if (updatedTemplate.getIsDefault() && !existing.getIsDefault()) {
            unsetDefaultEmailTemplate(updatedTemplate.getTemplateType());
        }
        
        existing.setName(updatedTemplate.getName());
        existing.setSubject(updatedTemplate.getSubject());
        existing.setBody(updatedTemplate.getBody());
        existing.setTemplateType(updatedTemplate.getTemplateType());
        existing.setIsDefault(updatedTemplate.getIsDefault());
        existing.setActive(updatedTemplate.getActive());
        existing.setVariables(extractVariables(existing.getSubject() + " " + existing.getBody()));
        
        return emailTemplateRepository.save(existing);
    }
    
    public void deleteEmailTemplate(Long id) {
        emailTemplateRepository.deleteById(id);
    }
    
    public EmailTemplate toggleEmailTemplate(Long id) {
        EmailTemplate template = emailTemplateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Email template not found"));
        
        template.setActive(!template.getActive());
        return emailTemplateRepository.save(template);
    }
    
    public Map<String, String> previewEmailTemplate(Long id, Map<String, Object> variables) {
        EmailTemplate template = emailTemplateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Email template not found"));
        
        String processedSubject = processTemplate(template.getSubject(), variables);
        String processedBody = processTemplate(template.getBody(), variables);
        
        Map<String, String> result = new HashMap<>();
        result.put("subject", processedSubject);
        result.put("body", processedBody);
        
        return result;
    }
    
    private void unsetDefaultEmailTemplate(EmailTemplate.TemplateType templateType) {
        emailTemplateRepository.findByTemplateTypeAndIsDefaultTrue(templateType)
            .ifPresent(template -> {
                template.setIsDefault(false);
                emailTemplateRepository.save(template);
            });
    }
    
    // SMS Template Methods
    public List<SMSTemplate> getAllSMSTemplates() {
        return smsTemplateRepository.findAll();
    }
    
    public List<SMSTemplate> getActiveSMSTemplates() {
        return smsTemplateRepository.findByActiveTrue();
    }
    
    public Optional<SMSTemplate> getSMSTemplateById(Long id) {
        return smsTemplateRepository.findById(id);
    }
    
    public SMSTemplate createSMSTemplate(SMSTemplate template) {
        // Extract variables from template content
        template.setVariables(extractVariables(template.getMessage()));
        return smsTemplateRepository.save(template);
    }
    
    public SMSTemplate updateSMSTemplate(Long id, SMSTemplate updatedTemplate) {
        SMSTemplate existing = smsTemplateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("SMS template not found"));
        
        existing.setName(updatedTemplate.getName());
        existing.setMessage(updatedTemplate.getMessage());
        existing.setTemplateType(updatedTemplate.getTemplateType());
        existing.setActive(updatedTemplate.getActive());
        existing.setVariables(extractVariables(existing.getMessage()));
        
        return smsTemplateRepository.save(existing);
    }
    
    public void deleteSMSTemplate(Long id) {
        smsTemplateRepository.deleteById(id);
    }
    
    public SMSTemplate toggleSMSTemplate(Long id) {
        SMSTemplate template = smsTemplateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("SMS template not found"));
        
        template.setActive(!template.getActive());
        return smsTemplateRepository.save(template);
    }
    
    // Notification Channel Methods
    public List<NotificationChannel> getAllChannels() {
        return channelRepository.findAll();
    }
    
    public List<NotificationChannel> getActiveChannels() {
        return channelRepository.findByActiveTrue();
    }
    
    public Optional<NotificationChannel> getChannelById(Long id) {
        return channelRepository.findById(id);
    }
    
    public NotificationChannel createChannel(NotificationChannel channel) {
        // If setting as default, unset other defaults for this type
        if (channel.getIsDefault()) {
            unsetDefaultChannel(channel.getType());
        }
        
        return channelRepository.save(channel);
    }
    
    public NotificationChannel updateChannel(Long id, NotificationChannel updatedChannel) {
        NotificationChannel existing = channelRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification channel not found"));
        
        // If setting as default, unset other defaults for this type
        if (updatedChannel.getIsDefault() && !existing.getIsDefault()) {
            unsetDefaultChannel(updatedChannel.getType());
        }
        
        existing.setName(updatedChannel.getName());
        existing.setType(updatedChannel.getType());
        existing.setConfiguration(updatedChannel.getConfiguration());
        existing.setActive(updatedChannel.getActive());
        existing.setIsDefault(updatedChannel.getIsDefault());
        
        return channelRepository.save(existing);
    }
    
    public void deleteChannel(Long id) {
        channelRepository.deleteById(id);
    }
    
    public NotificationChannel toggleChannel(Long id) {
        NotificationChannel channel = channelRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification channel not found"));
        
        channel.setActive(!channel.getActive());
        return channelRepository.save(channel);
    }
    
    public void testChannel(Long id, Map<String, Object> testData) {
        NotificationChannel channel = channelRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification channel not found"));
        
        // Create a test communication log
        CommunicationLog testLog = new CommunicationLog();
        testLog.setRecipientType(CommunicationLog.RecipientType.ADMIN);
        testLog.setRecipientId(1L);
        testLog.setRecipientName("Test User");
        testLog.setChannel(channel.getType());
        testLog.setSubject("Test Message");
        testLog.setMessage("This is a test message from RentMaster communication system.");
        testLog.setStatus(CommunicationLog.CommunicationStatus.SENT);
        testLog.setSentAt(LocalDateTime.now());
        
        communicationLogRepository.save(testLog);
        
        log.info("Test message sent via {} channel: {}", channel.getType(), channel.getName());
    }
    
    private void unsetDefaultChannel(NotificationChannel.ChannelType channelType) {
        channelRepository.findByTypeAndIsDefaultTrue(channelType)
            .ifPresent(channel -> {
                channel.setIsDefault(false);
                channelRepository.save(channel);
            });
    }
    
    // Communication Log Methods
    public Page<CommunicationLog> getCommunicationLogs(
            NotificationChannel.ChannelType channel,
            CommunicationLog.CommunicationStatus status,
            CommunicationLog.RecipientType recipientType,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {
        
        return communicationLogRepository.findWithFilters(channel, status, recipientType, startDate, endDate, pageable);
    }
    
    public void retryCommunication(Long id) {
        CommunicationLog log = communicationLogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Communication log not found"));
        
        if (log.getStatus() == CommunicationLog.CommunicationStatus.FAILED) {
            log.setStatus(CommunicationLog.CommunicationStatus.PENDING);
            log.setErrorMessage(null);
            communicationLogRepository.save(log);
            
            // Here you would trigger the actual retry logic
            this.log.info("Retrying communication for log ID: {}", id);
        }
    }
    
    // Bulk Communication Methods
    public List<BulkCommunication> getAllBulkCommunications() {
        return bulkCommunicationRepository.findAll();
    }
    
    public Optional<BulkCommunication> getBulkCommunicationById(Long id) {
        return bulkCommunicationRepository.findById(id);
    }
    
    public BulkCommunication createBulkCommunication(BulkCommunication bulkCommunication) {
        bulkCommunication.setTotalRecipients(bulkCommunication.getRecipientIds().size());
        return bulkCommunicationRepository.save(bulkCommunication);
    }
    
    public BulkCommunication updateBulkCommunication(Long id, BulkCommunication updatedBulk) {
        BulkCommunication existing = bulkCommunicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bulk communication not found"));
        
        existing.setName(updatedBulk.getName());
        existing.setRecipientType(updatedBulk.getRecipientType());
        existing.setRecipientIds(updatedBulk.getRecipientIds());
        existing.setChannels(updatedBulk.getChannels());
        existing.setTemplateId(updatedBulk.getTemplateId());
        existing.setSubject(updatedBulk.getSubject());
        existing.setMessage(updatedBulk.getMessage());
        existing.setScheduledAt(updatedBulk.getScheduledAt());
        existing.setTotalRecipients(updatedBulk.getRecipientIds().size());
        
        return bulkCommunicationRepository.save(existing);
    }
    
    public void deleteBulkCommunication(Long id) {
        bulkCommunicationRepository.deleteById(id);
    }
    
    public void sendBulkCommunication(Long id) {
        BulkCommunication bulk = bulkCommunicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bulk communication not found"));
        
        bulk.setStatus(BulkCommunication.BulkStatus.SENDING);
        bulk.setSentAt(LocalDateTime.now());
        bulkCommunicationRepository.save(bulk);
        
        // Here you would implement the actual bulk sending logic
        log.info("Starting bulk communication send for: {}", bulk.getName());
    }
    
    // Notification Preference Methods
    public List<NotificationPreference> getNotificationPreferences(Long userId) {
        if (userId != null) {
            return preferenceRepository.findByUserId(userId);
        }
        return preferenceRepository.findAll();
    }
    
    public NotificationPreference createNotificationPreference(NotificationPreference preference) {
        return preferenceRepository.save(preference);
    }
    
    public NotificationPreference updateNotificationPreference(Long id, NotificationPreference updatedPreference) {
        NotificationPreference existing = preferenceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification preference not found"));
        
        existing.setNotificationType(updatedPreference.getNotificationType());
        existing.setChannels(updatedPreference.getChannels());
        existing.setEnabled(updatedPreference.getEnabled());
        existing.setFrequency(updatedPreference.getFrequency());
        existing.setQuietHours(updatedPreference.getQuietHours());
        
        return preferenceRepository.save(existing);
    }
    
    // Statistics Methods
    public Map<String, Object> getCommunicationStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalEmailTemplates", emailTemplateRepository.countTotal());
        stats.put("activeEmailTemplates", emailTemplateRepository.countActive());
        stats.put("totalSMSTemplates", smsTemplateRepository.countTotal());
        stats.put("activeSMSTemplates", smsTemplateRepository.countActive());
        stats.put("totalChannels", channelRepository.countTotal());
        stats.put("activeChannels", channelRepository.countActive());
        stats.put("communicationsToday", communicationLogRepository.countTodaysCommunications());
        
        long totalCommunications = communicationLogRepository.countTotal();
        long deliveredCommunications = communicationLogRepository.countDelivered();
        long failedCommunications = communicationLogRepository.countFailed();
        
        double deliveryRate = totalCommunications > 0 ? (double) deliveredCommunications / totalCommunications * 100 : 0;
        double failureRate = totalCommunications > 0 ? (double) failedCommunications / totalCommunications * 100 : 0;
        
        stats.put("deliveryRate", Math.round(deliveryRate));
        stats.put("failureRate", Math.round(failureRate));
        
        return stats;
    }
    
    // Individual Communication Methods
    public void sendEmail(Long recipientId, Long templateId, String subject, String body, Map<String, Object> variables) {
        CommunicationLog log = new CommunicationLog();
        log.setRecipientType(CommunicationLog.RecipientType.TENANT); // Default, should be determined by context
        log.setRecipientId(recipientId);
        log.setRecipientName("Recipient " + recipientId); // Should be fetched from user/tenant service
        log.setChannel(NotificationChannel.ChannelType.EMAIL);
        log.setTemplateId(templateId);
        log.setSubject(subject);
        log.setMessage(body);
        log.setStatus(CommunicationLog.CommunicationStatus.SENT);
        log.setSentAt(LocalDateTime.now());
        
        communicationLogRepository.save(log);
        this.log.info("Email sent to recipient ID: {}", recipientId);
    }
    
    public void sendSMS(Long recipientId, Long templateId, String message, Map<String, Object> variables) {
        CommunicationLog log = new CommunicationLog();
        log.setRecipientType(CommunicationLog.RecipientType.TENANT);
        log.setRecipientId(recipientId);
        log.setRecipientName("Recipient " + recipientId);
        log.setChannel(NotificationChannel.ChannelType.SMS);
        log.setTemplateId(templateId);
        log.setMessage(message);
        log.setStatus(CommunicationLog.CommunicationStatus.SENT);
        log.setSentAt(LocalDateTime.now());
        
        communicationLogRepository.save(log);
        this.log.info("SMS sent to recipient ID: {}", recipientId);
    }
    
    public void sendWhatsApp(Long recipientId, String message, List<String> attachments) {
        CommunicationLog log = new CommunicationLog();
        log.setRecipientType(CommunicationLog.RecipientType.TENANT);
        log.setRecipientId(recipientId);
        log.setRecipientName("Recipient " + recipientId);
        log.setChannel(NotificationChannel.ChannelType.WHATSAPP);
        log.setMessage(message);
        log.setStatus(CommunicationLog.CommunicationStatus.SENT);
        log.setSentAt(LocalDateTime.now());
        
        communicationLogRepository.save(log);
        this.log.info("WhatsApp message sent to recipient ID: {}", recipientId);
    }
    
    public void sendPushNotification(Long recipientId, String title, String message, Map<String, Object> data) {
        CommunicationLog log = new CommunicationLog();
        log.setRecipientType(CommunicationLog.RecipientType.TENANT);
        log.setRecipientId(recipientId);
        log.setRecipientName("Recipient " + recipientId);
        log.setChannel(NotificationChannel.ChannelType.PUSH);
        log.setSubject(title);
        log.setMessage(message);
        log.setStatus(CommunicationLog.CommunicationStatus.SENT);
        log.setSentAt(LocalDateTime.now());
        
        communicationLogRepository.save(log);
        this.log.info("Push notification sent to recipient ID: {}", recipientId);
    }
    
    // Utility Methods
    private List<String> extractVariables(String content) {
        List<String> variables = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\{\\{([^}]+)\\}\\}");
        Matcher matcher = pattern.matcher(content);
        
        while (matcher.find()) {
            String variable = matcher.group(1).trim();
            if (!variables.contains(variable)) {
                variables.add(variable);
            }
        }
        
        return variables;
    }
    
    private String processTemplate(String template, Map<String, Object> variables) {
        String processed = template;
        
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            String value = entry.getValue() != null ? entry.getValue().toString() : "";
            processed = processed.replace(placeholder, value);
        }
        
        return processed;
    }
}
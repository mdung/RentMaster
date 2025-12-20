package com.rentmaster.communication;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class CommunicationDataInitializer implements CommandLineRunner {
    
    private static final Logger log = LoggerFactory.getLogger(CommunicationDataInitializer.class);
    
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
    
    @Override
    public void run(String... args) throws Exception {
        if (emailTemplateRepository.count() == 0) {
            initializeEmailTemplates();
        }
        
        if (smsTemplateRepository.count() == 0) {
            initializeSMSTemplates();
        }
        
        if (channelRepository.count() == 0) {
            initializeNotificationChannels();
        }
        
        if (communicationLogRepository.count() == 0) {
            initializeCommunicationLogs();
        }
        
        if (bulkCommunicationRepository.count() == 0) {
            initializeBulkCommunications();
        }
        
        if (preferenceRepository.count() == 0) {
            initializeNotificationPreferences();
        }
        
        log.info("Communication data initialization completed");
    }
    
    private void initializeEmailTemplates() {
        List<EmailTemplate> templates = Arrays.asList(
            createEmailTemplate(
                "Invoice Due Reminder",
                "Invoice Due - {{tenant_name}}",
                "Dear {{tenant_name}},\n\nThis is a friendly reminder that your rent payment of {{rent_amount}} is due on {{due_date}} for the property at {{property_address}}.\n\nInvoice Number: {{invoice_number}}\nDue Date: {{due_date}}\nAmount: {{rent_amount}}\n\nPlease ensure payment is made by the due date to avoid any late fees.\n\nIf you have already made the payment, please disregard this message.\n\nBest regards,\n{{landlord_name}}\n{{company_name}}",
                EmailTemplate.TemplateType.INVOICE_DUE,
                true
            ),
            
            createEmailTemplate(
                "Payment Received Confirmation",
                "Payment Received - Thank You {{tenant_name}}",
                "Dear {{tenant_name}},\n\nThank you for your payment! We have successfully received your rent payment.\n\nPayment Details:\n- Amount: {{payment_amount}}\n- Payment Date: {{payment_date}}\n- Property: {{property_address}}\n- Invoice Number: {{invoice_number}}\n\nYour account is now up to date. We appreciate your prompt payment.\n\nBest regards,\n{{landlord_name}}\n{{company_name}}",
                EmailTemplate.TemplateType.PAYMENT_RECEIVED,
                true
            ),
            
            createEmailTemplate(
                "Contract Expiring Notice",
                "Contract Expiring Soon - {{tenant_name}}",
                "Dear {{tenant_name}},\n\nWe hope this message finds you well. We wanted to inform you that your rental contract for {{property_address}} is set to expire on {{contract_end_date}}.\n\nWe would like to discuss renewal options with you. Please contact us at your earliest convenience to discuss:\n\n- Renewal terms\n- Any changes to the rental agreement\n- New rental rates (if applicable)\n\nWe value you as a tenant and hope to continue our rental relationship.\n\nPlease contact us by {{renewal_deadline}} to confirm your intentions.\n\nBest regards,\n{{landlord_name}}\n{{company_name}}",
                EmailTemplate.TemplateType.CONTRACT_EXPIRING,
                true
            ),
            
            createEmailTemplate(
                "Welcome New Tenant",
                "Welcome to Your New Home - {{tenant_name}}",
                "Dear {{tenant_name}},\n\nWelcome to your new home at {{property_address}}! We are excited to have you as our tenant.\n\nHere are some important details for your reference:\n\n- Move-in Date: {{move_in_date}}\n- Monthly Rent: {{rent_amount}}\n- Rent Due Date: {{rent_due_date}}\n- Security Deposit: {{security_deposit}}\n\nImportant Information:\n- Emergency Contact: {{emergency_contact}}\n- Property Manager: {{property_manager}}\n- Office Hours: {{office_hours}}\n\nWe have attached your lease agreement and property handbook for your records.\n\nIf you have any questions or concerns, please don't hesitate to contact us.\n\nWelcome home!\n\nBest regards,\n{{landlord_name}}\n{{company_name}}",
                EmailTemplate.TemplateType.WELCOME,
                true
            ),
            
            createEmailTemplate(
                "Maintenance Request Received",
                "Maintenance Request Received - {{tenant_name}}",
                "Dear {{tenant_name}},\n\nWe have received your maintenance request for {{property_address}}.\n\nRequest Details:\n- Request ID: {{request_id}}\n- Issue: {{maintenance_issue}}\n- Priority: {{priority_level}}\n- Submitted: {{request_date}}\n\nOur maintenance team will review your request and contact you within {{response_time}} to schedule the repair.\n\nFor urgent issues, please call our emergency line: {{emergency_phone}}\n\nThank you for reporting this issue promptly.\n\nBest regards,\n{{landlord_name}}\n{{company_name}}",
                EmailTemplate.TemplateType.MAINTENANCE_REQUEST,
                true
            )
        );
        
        emailTemplateRepository.saveAll(templates);
        log.info("Initialized {} email templates", templates.size());
    }
    
    private void initializeSMSTemplates() {
        List<SMSTemplate> templates = Arrays.asList(
            createSMSTemplate(
                "Rent Due SMS",
                "Hi {{tenant_name}}, your rent of {{rent_amount}} is due on {{due_date}}. Please make payment to avoid late fees. - {{company_name}}",
                SMSTemplate.TemplateType.INVOICE_DUE
            ),
            
            createSMSTemplate(
                "Payment Received SMS",
                "Hi {{tenant_name}}, we received your payment of {{payment_amount}} on {{payment_date}}. Thank you! - {{company_name}}",
                SMSTemplate.TemplateType.PAYMENT_RECEIVED
            ),
            
            createSMSTemplate(
                "Contract Expiring SMS",
                "Hi {{tenant_name}}, your lease expires on {{contract_end_date}}. Please contact us to discuss renewal. - {{company_name}}",
                SMSTemplate.TemplateType.CONTRACT_EXPIRING
            ),
            
            createSMSTemplate(
                "General Reminder",
                "Reminder: {{message}} - {{company_name}}",
                SMSTemplate.TemplateType.REMINDER
            ),
            
            createSMSTemplate(
                "Custom Message",
                "{{message}}",
                SMSTemplate.TemplateType.CUSTOM
            )
        );
        
        smsTemplateRepository.saveAll(templates);
        log.info("Initialized {} SMS templates", templates.size());
    }
    
    private void initializeNotificationChannels() {
        List<NotificationChannel> channels = Arrays.asList(
            createNotificationChannel(
                "Default Email (SMTP)",
                NotificationChannel.ChannelType.EMAIL,
                Map.of(
                    "smtp_host", "smtp.gmail.com",
                    "smtp_port", "587",
                    "smtp_username", "noreply@rentmaster.com",
                    "smtp_password", "your_app_password",
                    "smtp_tls", "true",
                    "from_email", "noreply@rentmaster.com",
                    "from_name", "RentMaster"
                ),
                true
            ),
            
            createNotificationChannel(
                "Twilio SMS",
                NotificationChannel.ChannelType.SMS,
                Map.of(
                    "account_sid", "your_twilio_account_sid",
                    "auth_token", "your_twilio_auth_token",
                    "from_number", "+1234567890",
                    "webhook_url", "https://your-domain.com/webhooks/sms"
                ),
                true
            ),
            
            createNotificationChannel(
                "Firebase Push Notifications",
                NotificationChannel.ChannelType.PUSH,
                Map.of(
                    "server_key", "your_firebase_server_key",
                    "project_id", "your_firebase_project_id",
                    "api_url", "https://fcm.googleapis.com/fcm/send"
                ),
                true
            ),
            
            createNotificationChannel(
                "WhatsApp Business API",
                NotificationChannel.ChannelType.WHATSAPP,
                Map.of(
                    "phone_number_id", "your_whatsapp_phone_number_id",
                    "access_token", "your_whatsapp_access_token",
                    "api_version", "v17.0",
                    "webhook_verify_token", "your_webhook_verify_token"
                ),
                true
            )
        );
        
        channelRepository.saveAll(channels);
        log.info("Initialized {} notification channels", channels.size());
    }
    
    private void initializeCommunicationLogs() {
        List<CommunicationLog> logs = Arrays.asList(
            createCommunicationLog(
                CommunicationLog.RecipientType.TENANT,
                1L,
                "John Doe",
                NotificationChannel.ChannelType.EMAIL,
                "Invoice Due - John Doe",
                "Your rent payment of $1,200 is due on March 15, 2024.",
                CommunicationLog.CommunicationStatus.DELIVERED,
                LocalDateTime.now().minusDays(2)
            ),
            
            createCommunicationLog(
                CommunicationLog.RecipientType.TENANT,
                2L,
                "Jane Smith",
                NotificationChannel.ChannelType.SMS,
                null,
                "Hi Jane, your rent of $1,500 is due on March 15. Please make payment to avoid late fees.",
                CommunicationLog.CommunicationStatus.SENT,
                LocalDateTime.now().minusDays(1)
            ),
            
            createCommunicationLog(
                CommunicationLog.RecipientType.TENANT,
                3L,
                "Mike Johnson",
                NotificationChannel.ChannelType.EMAIL,
                "Payment Received - Thank You Mike",
                "Thank you for your payment of $1,800 received on March 10, 2024.",
                CommunicationLog.CommunicationStatus.READ,
                LocalDateTime.now().minusDays(3)
            ),
            
            createCommunicationLog(
                CommunicationLog.RecipientType.TENANT,
                4L,
                "Sarah Wilson",
                NotificationChannel.ChannelType.WHATSAPP,
                null,
                "Hi Sarah, your lease expires on June 30, 2024. Please contact us to discuss renewal options.",
                CommunicationLog.CommunicationStatus.DELIVERED,
                LocalDateTime.now().minusHours(6)
            ),
            
            createCommunicationLog(
                CommunicationLog.RecipientType.TENANT,
                5L,
                "David Brown",
                NotificationChannel.ChannelType.PUSH,
                "Maintenance Update",
                "Your maintenance request #12345 has been scheduled for tomorrow at 2 PM.",
                CommunicationLog.CommunicationStatus.SENT,
                LocalDateTime.now().minusHours(2)
            )
        );
        
        communicationLogRepository.saveAll(logs);
        log.info("Initialized {} communication logs", logs.size());
    }
    
    private void initializeBulkCommunications() {
        List<BulkCommunication> bulkCommunications = Arrays.asList(
            createBulkCommunication(
                "Monthly Rent Reminder - March 2024",
                BulkCommunication.RecipientType.ACTIVE_TENANTS,
                Arrays.asList(1L, 2L, 3L, 4L, 5L),
                Arrays.asList(NotificationChannel.ChannelType.EMAIL, NotificationChannel.ChannelType.SMS),
                "Monthly Rent Reminder",
                "This is a friendly reminder that your rent payment is due on March 15, 2024. Please ensure timely payment to avoid late fees.",
                BulkCommunication.BulkStatus.COMPLETED,
                LocalDateTime.now().minusDays(5)
            ),
            
            createBulkCommunication(
                "Property Maintenance Notice",
                BulkCommunication.RecipientType.ALL_TENANTS,
                Arrays.asList(1L, 2L, 3L, 4L, 5L, 6L),
                Arrays.asList(NotificationChannel.ChannelType.EMAIL),
                "Scheduled Maintenance - Building A",
                "We will be conducting routine maintenance on the building's water system on March 20, 2024, from 9 AM to 3 PM. Water service may be temporarily interrupted.",
                BulkCommunication.BulkStatus.SCHEDULED,
                LocalDateTime.now().plusDays(2)
            ),
            
            createBulkCommunication(
                "Contract Renewal Reminders",
                BulkCommunication.RecipientType.EXPIRING_CONTRACTS,
                Arrays.asList(2L, 4L),
                Arrays.asList(NotificationChannel.ChannelType.EMAIL, NotificationChannel.ChannelType.WHATSAPP),
                "Contract Renewal Discussion",
                "Your rental contract is expiring soon. We would like to discuss renewal options with you. Please contact our office to schedule a meeting.",
                BulkCommunication.BulkStatus.DRAFT,
                null
            )
        );
        
        bulkCommunicationRepository.saveAll(bulkCommunications);
        log.info("Initialized {} bulk communications", bulkCommunications.size());
    }
    
    private void initializeNotificationPreferences() {
        List<NotificationPreference> preferences = Arrays.asList(
            createNotificationPreference(
                1L,
                NotificationPreference.NotificationType.INVOICE_DUE,
                Arrays.asList(NotificationPreference.ChannelType.EMAIL, NotificationPreference.ChannelType.SMS),
                NotificationPreference.Frequency.IMMEDIATE,
                true, "22:00", "08:00"
            ),
            
            createNotificationPreference(
                1L,
                NotificationPreference.NotificationType.PAYMENT_RECEIVED,
                Arrays.asList(NotificationPreference.ChannelType.EMAIL),
                NotificationPreference.Frequency.IMMEDIATE,
                false, null, null
            ),
            
            createNotificationPreference(
                2L,
                NotificationPreference.NotificationType.INVOICE_DUE,
                Arrays.asList(NotificationPreference.ChannelType.WHATSAPP, NotificationPreference.ChannelType.IN_APP),
                NotificationPreference.Frequency.IMMEDIATE,
                true, "23:00", "07:00"
            ),
            
            createNotificationPreference(
                2L,
                NotificationPreference.NotificationType.CONTRACT_EXPIRING,
                Arrays.asList(NotificationPreference.ChannelType.EMAIL, NotificationPreference.ChannelType.SMS),
                NotificationPreference.Frequency.WEEKLY_DIGEST,
                false, null, null
            ),
            
            createNotificationPreference(
                3L,
                NotificationPreference.NotificationType.MAINTENANCE_REQUEST,
                Arrays.asList(NotificationPreference.ChannelType.PUSH, NotificationPreference.ChannelType.EMAIL),
                NotificationPreference.Frequency.IMMEDIATE,
                false, null, null
            )
        );
        
        preferenceRepository.saveAll(preferences);
        log.info("Initialized {} notification preferences", preferences.size());
    }
    
    // Helper methods
    private EmailTemplate createEmailTemplate(String name, String subject, String body, EmailTemplate.TemplateType type, boolean isDefault) {
        EmailTemplate template = new EmailTemplate(name, subject, body, type);
        template.setIsDefault(isDefault);
        return template;
    }
    
    private SMSTemplate createSMSTemplate(String name, String message, SMSTemplate.TemplateType type) {
        return new SMSTemplate(name, message, type);
    }
    
    private NotificationChannel createNotificationChannel(String name, NotificationChannel.ChannelType type, Map<String, String> config, boolean isDefault) {
        NotificationChannel channel = new NotificationChannel(name, type, config);
        channel.setIsDefault(isDefault);
        return channel;
    }
    
    private CommunicationLog createCommunicationLog(CommunicationLog.RecipientType recipientType, Long recipientId, String recipientName,
                                                   NotificationChannel.ChannelType channel, String subject, String message,
                                                   CommunicationLog.CommunicationStatus status, LocalDateTime sentAt) {
        CommunicationLog log = new CommunicationLog(recipientType, recipientId, recipientName, channel, message);
        log.setSubject(subject);
        log.setStatus(status);
        log.setSentAt(sentAt);
        if (status == CommunicationLog.CommunicationStatus.DELIVERED || status == CommunicationLog.CommunicationStatus.READ) {
            log.setDeliveredAt(sentAt.plusMinutes(1));
        }
        if (status == CommunicationLog.CommunicationStatus.READ) {
            log.setReadAt(sentAt.plusMinutes(5));
        }
        return log;
    }
    
    private BulkCommunication createBulkCommunication(String name, BulkCommunication.RecipientType recipientType,
                                                     List<Long> recipientIds, List<NotificationChannel.ChannelType> channels,
                                                     String subject, String message, BulkCommunication.BulkStatus status,
                                                     LocalDateTime scheduledAt) {
        BulkCommunication bulk = new BulkCommunication(name, recipientType, message);
        bulk.setRecipientIds(recipientIds);
        bulk.setChannels(channels);
        bulk.setSubject(subject);
        bulk.setStatus(status);
        bulk.setScheduledAt(scheduledAt);
        bulk.setTotalRecipients(recipientIds.size());
        
        if (status == BulkCommunication.BulkStatus.COMPLETED) {
            bulk.setSentCount(recipientIds.size());
            bulk.setDeliveredCount(recipientIds.size() - 1);
            bulk.setFailedCount(1);
            bulk.setSentAt(scheduledAt);
        }
        
        return bulk;
    }
    
    private NotificationPreference createNotificationPreference(Long userId, NotificationPreference.NotificationType type,
                                                              List<NotificationPreference.ChannelType> channels,
                                                              NotificationPreference.Frequency frequency,
                                                              boolean quietHoursEnabled, String startTime, String endTime) {
        NotificationPreference preference = new NotificationPreference(userId, type, channels);
        preference.setFrequency(frequency);
        
        if (quietHoursEnabled) {
            NotificationPreference.QuietHours quietHours = new NotificationPreference.QuietHours(true, startTime, endTime);
            preference.setQuietHours(quietHours);
        }
        
        return preference;
    }
}
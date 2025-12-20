package com.rentmaster.messaging;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class MessagingDataInitializer implements CommandLineRunner {

    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    @Autowired
    private PropertyEventRepository propertyEventRepository;
    
    @Autowired
    private TenantFeedbackRepository tenantFeedbackRepository;

    @Override
    public void run(String... args) throws Exception {
        if (messageRepository.count() == 0) {
            initializeMessages();
        }
        
        if (announcementRepository.count() == 0) {
            initializeAnnouncements();
        }
        
        if (propertyEventRepository.count() == 0) {
            initializePropertyEvents();
        }
        
        if (tenantFeedbackRepository.count() == 0) {
            initializeTenantFeedback();
        }
    }

    private void initializeMessages() {
        // Sample messages between landlord and tenants
        Message message1 = new Message(
            1L, "John Smith", "LANDLORD",
            2L, "Alice Johnson", "TENANT",
            "Welcome to Sunset Apartments",
            "Welcome to your new home! Please let me know if you have any questions about the property or need assistance with anything.",
            "DIRECT"
        );
        message1.setPropertyId(1L);
        message1.setPriority("MEDIUM");
        message1.setThreadId(1001L);
        messageRepository.save(message1);

        Message message2 = new Message(
            2L, "Alice Johnson", "TENANT",
            1L, "John Smith", "LANDLORD",
            "Re: Welcome to Sunset Apartments",
            "Thank you for the warm welcome! I have a question about the parking arrangements. Could you please clarify the assigned parking spots?",
            "DIRECT"
        );
        message2.setPropertyId(1L);
        message2.setPriority("MEDIUM");
        message2.setThreadId(1001L);
        message2.setParentMessageId(message1.getId());
        messageRepository.save(message2);

        Message message3 = new Message(
            1L, "John Smith", "LANDLORD",
            3L, "Bob Wilson", "TENANT",
            "Maintenance Schedule Update",
            "Hi Bob, just wanted to inform you that the elevator maintenance has been rescheduled to next Tuesday from 9 AM to 2 PM. Please plan accordingly.",
            "DIRECT"
        );
        message3.setPropertyId(1L);
        message3.setPriority("HIGH");
        message3.setThreadId(1002L);
        messageRepository.save(message3);

        Message message4 = new Message(
            3L, "Bob Wilson", "TENANT",
            1L, "John Smith", "LANDLORD",
            "Rent Payment Confirmation",
            "Hi John, I've submitted my rent payment for this month through the online portal. Could you please confirm receipt?",
            "DIRECT"
        );
        message4.setPropertyId(1L);
        message4.setPriority("MEDIUM");
        message4.setThreadId(1003L);
        messageRepository.save(message4);

        Message message5 = new Message(
            4L, "Carol Davis", "TENANT",
            1L, "John Smith", "LANDLORD",
            "Noise Complaint",
            "Hello, I wanted to report excessive noise from the apartment above mine (Unit 3B) during late hours. This has been ongoing for the past week.",
            "DIRECT"
        );
        message5.setPropertyId(1L);
        message5.setPriority("HIGH");
        message5.setThreadId(1004L);
        message5.setTags(Arrays.asList("complaint", "noise", "urgent"));
        messageRepository.save(message5);

        Message message6 = new Message(
            5L, "David Brown", "TENANT",
            1L, "John Smith", "LANDLORD",
            "Lease Renewal Inquiry",
            "Hi John, my lease is expiring in two months. I'm interested in renewing for another year. Could we discuss the terms?",
            "DIRECT"
        );
        message6.setPropertyId(1L);
        message6.setPriority("MEDIUM");
        message6.setThreadId(1005L);
        message6.setTags(Arrays.asList("lease", "renewal"));
        messageRepository.save(message6);

        // Group messages
        Message groupMessage1 = new Message(
            1L, "John Smith", "LANDLORD",
            0L, "All Tenants", "GROUP",
            "Building Wi-Fi Upgrade",
            "Dear residents, we're upgrading the building's Wi-Fi infrastructure this weekend. There may be brief interruptions in service on Saturday between 10 AM and 4 PM.",
            "GROUP"
        );
        groupMessage1.setPropertyId(1L);
        groupMessage1.setPriority("MEDIUM");
        groupMessage1.setThreadId(1006L);
        messageRepository.save(groupMessage1);

        // System messages
        Message systemMessage1 = new Message(
            0L, "System", "SYSTEM",
            2L, "Alice Johnson", "TENANT",
            "Payment Reminder",
            "This is a friendly reminder that your rent payment is due in 3 days. Please ensure payment is submitted on time to avoid late fees.",
            "SYSTEM"
        );
        systemMessage1.setPriority("MEDIUM");
        systemMessage1.setThreadId(1007L);
        messageRepository.save(systemMessage1);
    }

    private void initializeAnnouncements() {
        // General announcements
        Announcement announcement1 = new Announcement(
            "Building Maintenance Schedule",
            "We will be conducting routine maintenance on the building's HVAC system next week. The work will be performed during business hours (9 AM - 5 PM) from Monday to Wednesday. There may be temporary disruptions to heating and cooling during this time. We apologize for any inconvenience and appreciate your patience.",
            "MAINTENANCE",
            "ALL_TENANTS",
            1L, "John Smith", "LANDLORD"
        );
        announcement1.setPriority("HIGH");
        announcement1.setIsPinned(true);
        announcement1.setRequiresAcknowledgment(true);
        announcement1.setTags(Arrays.asList("maintenance", "hvac", "schedule"));
        announcement1.setExpiryDate(LocalDateTime.now().plusDays(10));
        announcementRepository.save(announcement1);

        Announcement announcement2 = new Announcement(
            "New Recycling Guidelines",
            "Starting next month, we're implementing new recycling guidelines to help reduce our environmental impact. Please separate recyclables into the designated bins located on each floor. A detailed guide has been posted in the lobby and will be sent to your email.",
            "POLICY",
            "ALL_TENANTS",
            1L, "John Smith", "LANDLORD"
        );
        announcement2.setPriority("MEDIUM");
        announcement2.setTags(Arrays.asList("recycling", "environment", "policy"));
        announcementRepository.save(announcement2);

        Announcement announcement3 = new Announcement(
            "Holiday Office Hours",
            "Please note that the management office will have modified hours during the upcoming holiday season. We will be closed on December 25th and January 1st. For emergencies during these times, please contact our 24/7 emergency hotline at (555) 123-4567.",
            "GENERAL",
            "ALL_TENANTS",
            1L, "John Smith", "LANDLORD"
        );
        announcement3.setPriority("MEDIUM");
        announcement3.setTags(Arrays.asList("holidays", "office-hours", "emergency"));
        announcementRepository.save(announcement3);

        Announcement announcement4 = new Announcement(
            "Security System Upgrade",
            "We're pleased to announce that we're upgrading our building's security system. New key fobs will be distributed next week, and the old ones will be deactivated. Please visit the management office to collect your new key fob and return the old one.",
            "SYSTEM",
            "ALL_TENANTS",
            1L, "John Smith", "LANDLORD"
        );
        announcement4.setPriority("HIGH");
        announcement4.setRequiresAcknowledgment(true);
        announcement4.setTags(Arrays.asList("security", "key-fob", "upgrade"));
        announcementRepository.save(announcement4);

        Announcement announcement5 = new Announcement(
            "Community Garden Opening",
            "We're excited to announce the opening of our new community garden on the rooftop! Residents can reserve garden plots for a small monthly fee. Sign-up sheets are available in the lobby. Let's grow together!",
            "EVENT",
            "ALL_TENANTS",
            1L, "John Smith", "LANDLORD"
        );
        announcement5.setPriority("LOW");
        announcement5.setTags(Arrays.asList("community", "garden", "rooftop"));
        announcementRepository.save(announcement5);

        // Emergency announcement
        Announcement emergencyAnnouncement = new Announcement(
            "Water Service Interruption",
            "URGENT: Due to an unexpected pipe burst, water service will be temporarily interrupted today from 2 PM to 6 PM. We are working with emergency crews to restore service as quickly as possible. Bottled water is available in the lobby for residents who need it.",
            "EMERGENCY",
            "ALL_TENANTS",
            1L, "John Smith", "LANDLORD"
        );
        emergencyAnnouncement.setPriority("URGENT");
        emergencyAnnouncement.setIsPinned(true);
        emergencyAnnouncement.setRequiresAcknowledgment(true);
        emergencyAnnouncement.setTags(Arrays.asList("emergency", "water", "service-interruption"));
        announcementRepository.save(emergencyAnnouncement);
    }

    private void initializePropertyEvents() {
        // Maintenance events
        PropertyEvent maintenanceEvent1 = new PropertyEvent(
            "Elevator Maintenance",
            "MAINTENANCE",
            LocalDateTime.now().plusDays(3).withHour(9).withMinute(0),
            LocalDateTime.now().plusDays(3).withHour(17).withMinute(0),
            "Building Elevator Shaft",
            1L, "Sunset Apartments",
            1L, "John Smith", "LANDLORD"
        );
        maintenanceEvent1.setDescription("Annual elevator inspection and maintenance. Elevator will be out of service during this time.");
        maintenanceEvent1.setCategory("MANDATORY");
        maintenanceEvent1.setPriority("HIGH");
        maintenanceEvent1.setRequirements("Please use stairs during maintenance hours");
        maintenanceEvent1.setContactInfo("For questions, contact John Smith at (555) 123-4567");
        maintenanceEvent1.setTags(Arrays.asList("elevator", "maintenance", "inspection"));
        propertyEventRepository.save(maintenanceEvent1);

        PropertyEvent maintenanceEvent2 = new PropertyEvent(
            "Fire Safety Inspection",
            "INSPECTION",
            LocalDateTime.now().plusDays(7).withHour(10).withMinute(0),
            LocalDateTime.now().plusDays(7).withHour(16).withMinute(0),
            "All Building Areas",
            1L, "Sunset Apartments",
            1L, "John Smith", "LANDLORD"
        );
        maintenanceEvent2.setDescription("Annual fire safety inspection by city fire department. Inspectors will need access to all units.");
        maintenanceEvent2.setCategory("MANDATORY");
        maintenanceEvent2.setPriority("HIGH");
        maintenanceEvent2.setRequirements("Tenants must be available to provide access to their units");
        maintenanceEvent2.setTags(Arrays.asList("fire-safety", "inspection", "mandatory"));
        propertyEventRepository.save(maintenanceEvent2);

        // Social events
        PropertyEvent socialEvent1 = new PropertyEvent(
            "Resident Welcome Party",
            "SOCIAL",
            LocalDateTime.now().plusDays(14).withHour(18).withMinute(0),
            LocalDateTime.now().plusDays(14).withHour(21).withMinute(0),
            "Community Room",
            1L, "Sunset Apartments",
            1L, "John Smith", "LANDLORD"
        );
        socialEvent1.setDescription("Join us for a welcome party for new residents! Food, drinks, and great company await.");
        socialEvent1.setCategory("OPTIONAL");
        socialEvent1.setPriority("LOW");
        socialEvent1.setMaxAttendees(50);
        socialEvent1.setRequiresRSVP(true);
        socialEvent1.setRsvpDeadline(LocalDateTime.now().plusDays(12));
        socialEvent1.setRequirements("Please bring a side dish to share");
        socialEvent1.setTags(Arrays.asList("social", "welcome", "party"));
        propertyEventRepository.save(socialEvent1);

        PropertyEvent socialEvent2 = new PropertyEvent(
            "Movie Night: Classic Films",
            "SOCIAL",
            LocalDateTime.now().plusDays(21).withHour(19).withMinute(0),
            LocalDateTime.now().plusDays(21).withHour(22).withMinute(0),
            "Rooftop Terrace",
            1L, "Sunset Apartments",
            2L, "Alice Johnson", "TENANT"
        );
        socialEvent2.setDescription("Join us for a classic movie night under the stars! We'll be showing Casablanca. Popcorn and drinks provided.");
        socialEvent2.setCategory("OPTIONAL");
        socialEvent2.setPriority("LOW");
        socialEvent2.setMaxAttendees(30);
        socialEvent2.setRequiresRSVP(true);
        socialEvent2.setRsvpDeadline(LocalDateTime.now().plusDays(19));
        socialEvent2.setRequirements("Bring your own blanket or chair");
        socialEvent2.setTags(Arrays.asList("movie", "social", "rooftop"));
        propertyEventRepository.save(socialEvent2);

        // Community events
        PropertyEvent communityEvent1 = new PropertyEvent(
            "Building Safety Meeting",
            "MEETING",
            LocalDateTime.now().plusDays(10).withHour(19).withMinute(0),
            LocalDateTime.now().plusDays(10).withHour(20).withMinute(30),
            "Community Room",
            1L, "Sunset Apartments",
            1L, "John Smith", "LANDLORD"
        );
        communityEvent1.setDescription("Monthly building safety meeting to discuss security measures, emergency procedures, and resident concerns.");
        communityEvent1.setCategory("OPTIONAL");
        communityEvent1.setPriority("MEDIUM");
        communityEvent1.setAgenda("1. Security update\n2. Emergency procedures review\n3. Q&A session");
        communityEvent1.setTags(Arrays.asList("safety", "meeting", "security"));
        propertyEventRepository.save(communityEvent1);

        PropertyEvent communityEvent2 = new PropertyEvent(
            "Fitness Class: Yoga",
            "COMMUNITY",
            LocalDateTime.now().plusDays(5).withHour(7).withMinute(0),
            LocalDateTime.now().plusDays(5).withHour(8).withMinute(0),
            "Fitness Center",
            1L, "Sunset Apartments",
            3L, "Bob Wilson", "TENANT"
        );
        communityEvent2.setDescription("Start your day with a relaxing yoga session! All skill levels welcome. Mats provided.");
        communityEvent2.setCategory("OPTIONAL");
        communityEvent2.setPriority("LOW");
        communityEvent2.setMaxAttendees(15);
        communityEvent2.setRequiresRSVP(true);
        communityEvent2.setRsvpDeadline(LocalDateTime.now().plusDays(3));
        communityEvent2.setRequirements("Wear comfortable clothing and bring water");
        communityEvent2.setTags(Arrays.asList("fitness", "yoga", "wellness"));
        propertyEventRepository.save(communityEvent2);
    }

    private void initializeTenantFeedback() {
        // Maintenance feedback
        TenantFeedback feedback1 = new TenantFeedback(
            2L, "Alice Johnson",
            1L, "Sunset Apartments",
            "MAINTENANCE",
            "Excellent Plumbing Repair Service",
            "I want to commend the maintenance team for their quick response to my plumbing issue. The problem was fixed within 24 hours of reporting it, and the technician was professional and courteous."
        );
        feedback1.setRating(5);
        feedback1.setCategory("COMPLIMENT");
        feedback1.setPriority("LOW");
        feedback1.setStatus("RESOLVED");
        feedback1.setTags(Arrays.asList("maintenance", "plumbing", "excellent-service"));
        feedback1.setResolvedAt(LocalDateTime.now().minusDays(2));
        feedback1.setResolvedBy(1L);
        feedback1.setResolvedByName("John Smith");
        feedback1.setResponse("Thank you for the positive feedback! We'll make sure to pass this along to our maintenance team.");
        tenantFeedbackRepository.save(feedback1);

        TenantFeedback feedback2 = new TenantFeedback(
            3L, "Bob Wilson",
            1L, "Sunset Apartments",
            "MAINTENANCE",
            "Air Conditioning Not Working Properly",
            "The air conditioning in my unit (2A) has been making strange noises and not cooling effectively for the past three days. It's becoming quite uncomfortable, especially during the hot afternoons."
        );
        feedback2.setRating(2);
        feedback2.setCategory("ISSUE");
        feedback2.setPriority("HIGH");
        feedback2.setStatus("IN_REVIEW");
        feedback2.setRequiresAction(true);
        feedback2.setActionDueDate(LocalDateTime.now().plusDays(2));
        feedback2.setAssignedTo(6L);
        feedback2.setAssignedToName("Mike Johnson - Maintenance");
        feedback2.setTags(Arrays.asList("hvac", "air-conditioning", "urgent"));
        feedback2.setAcknowledgedAt(LocalDateTime.now().minusHours(4));
        feedback2.setAcknowledgedBy(1L);
        feedback2.setAcknowledgedByName("John Smith");
        tenantFeedbackRepository.save(feedback2);

        // General feedback
        TenantFeedback feedback3 = new TenantFeedback(
            4L, "Carol Davis",
            1L, "Sunset Apartments",
            "GENERAL",
            "Suggestion for Package Delivery System",
            "I'd like to suggest implementing a package locker system in the lobby. With the increase in online shopping, it would be very convenient for residents to have a secure place to receive packages when we're not home."
        );
        feedback3.setCategory("SUGGESTION");
        feedback3.setPriority("MEDIUM");
        feedback3.setStatus("ACKNOWLEDGED");
        feedback3.setTags(Arrays.asList("packages", "delivery", "improvement"));
        feedback3.setAcknowledgedAt(LocalDateTime.now().minusDays(1));
        feedback3.setAcknowledgedBy(1L);
        feedback3.setAcknowledgedByName("John Smith");
        feedback3.setResponse("Thank you for the suggestion! We're actually looking into package locker solutions and will keep residents updated on our progress.");
        tenantFeedbackRepository.save(feedback3);

        // Service feedback
        TenantFeedback feedback4 = new TenantFeedback(
            5L, "David Brown",
            1L, "Sunset Apartments",
            "SERVICE",
            "Gym Equipment Needs Maintenance",
            "Several pieces of equipment in the fitness center need attention. The treadmill #2 has been making loud noises, and the weight machine's cable seems frayed. For safety reasons, these should be checked soon."
        );
        feedback4.setRating(3);
        feedback4.setCategory("ISSUE");
        feedback4.setPriority("HIGH");
        feedback4.setStatus("SUBMITTED");
        feedback4.setRequiresAction(true);
        feedback4.setActionDueDate(LocalDateTime.now().plusDays(3));
        feedback4.setTags(Arrays.asList("fitness", "equipment", "safety"));
        tenantFeedbackRepository.save(feedback4);

        // Property feedback
        TenantFeedback feedback5 = new TenantFeedback(
            2L, "Alice Johnson",
            1L, "Sunset Apartments",
            "PROPERTY",
            "Love the New Landscaping!",
            "I wanted to express how much I appreciate the new landscaping around the building entrance. The flowers and plants really brighten up the area and make coming home more pleasant. Great job!"
        );
        feedback5.setRating(5);
        feedback5.setCategory("COMPLIMENT");
        feedback5.setPriority("LOW");
        feedback5.setStatus("ACKNOWLEDGED");
        feedback5.setIsPublic(true);
        feedback5.setTags(Arrays.asList("landscaping", "aesthetics", "appreciation"));
        feedback5.setAcknowledgedAt(LocalDateTime.now().minusHours(2));
        feedback5.setAcknowledgedBy(1L);
        feedback5.setAcknowledgedByName("John Smith");
        tenantFeedbackRepository.save(feedback5);

        // Complaint feedback
        TenantFeedback feedback6 = new TenantFeedback(
            3L, "Bob Wilson",
            1L, "Sunset Apartments",
            "COMPLAINT",
            "Parking Space Issues",
            "I've noticed that non-residents have been parking in our designated spots, particularly during weekends. This is causing inconvenience for residents who can't find parking when they return home. Could we implement better parking enforcement?"
        );
        feedback6.setRating(2);
        feedback6.setCategory("ISSUE");
        feedback6.setPriority("MEDIUM");
        feedback6.setStatus("IN_REVIEW");
        feedback6.setRequiresAction(true);
        feedback6.setActionDueDate(LocalDateTime.now().plusDays(7));
        feedback6.setTags(Arrays.asList("parking", "enforcement", "non-residents"));
        feedback6.setAcknowledgedAt(LocalDateTime.now().minusDays(1));
        feedback6.setAcknowledgedBy(1L);
        feedback6.setAcknowledgedByName("John Smith");
        tenantFeedbackRepository.save(feedback6);

        // Anonymous feedback
        TenantFeedback feedback7 = new TenantFeedback(
            4L, "Anonymous Resident",
            1L, "Sunset Apartments",
            "GENERAL",
            "Noise Levels in Common Areas",
            "I'd like to bring attention to noise levels in the lobby and hallways during evening hours. Some residents seem unaware that sound carries, and it can be disruptive to those trying to rest. Perhaps some gentle reminders about quiet hours would help."
        );
        feedback7.setCategory("ISSUE");
        feedback7.setPriority("MEDIUM");
        feedback7.setStatus("SUBMITTED");
        feedback7.setIsAnonymous(true);
        feedback7.setTags(Arrays.asList("noise", "common-areas", "quiet-hours"));
        tenantFeedbackRepository.save(feedback7);
    }
}
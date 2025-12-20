package com.rentmaster.automation;

import com.rentmaster.contract.Contract;
import com.rentmaster.contract.ContractRepository;

import com.rentmaster.billing.InvoiceService;
import com.rentmaster.billing.dto.InvoiceGenerateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class AutomationService {

    @Autowired
    private RecurringInvoiceRepository recurringInvoiceRepository;

    @Autowired
    private ContractRenewalReminderRepository renewalReminderRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private InvoiceService invoiceService;

    // Recurring Invoices
    public List<RecurringInvoice> getAllRecurringInvoices() {
        return recurringInvoiceRepository.findAll();
    }

    public Optional<RecurringInvoice> getRecurringInvoiceById(Long id) {
        return recurringInvoiceRepository.findById(id);
    }

    public RecurringInvoice createRecurringInvoice(RecurringInvoice recurringInvoice) {
        return recurringInvoiceRepository.save(recurringInvoice);
    }

    public RecurringInvoice updateRecurringInvoice(Long id, RecurringInvoice updatedInvoice) {
        return recurringInvoiceRepository.findById(id)
                .map(existing -> {
                    existing.setFrequency(updatedInvoice.getFrequency());
                    existing.setDayOfMonth(updatedInvoice.getDayOfMonth());
                    existing.setDayOfWeek(updatedInvoice.getDayOfWeek());
                    existing.setNextGenerationDate(updatedInvoice.getNextGenerationDate());
                    existing.setActive(updatedInvoice.getActive());
                    existing.setAutoSend(updatedInvoice.getAutoSend());
                    return recurringInvoiceRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Recurring invoice not found with id: " + id));
    }

    public void deleteRecurringInvoice(Long id) {
        recurringInvoiceRepository.deleteById(id);
    }

    public RecurringInvoice toggleRecurringInvoice(Long id) {
        return recurringInvoiceRepository.findById(id)
                .map(invoice -> {
                    invoice.setActive(!invoice.getActive());
                    return recurringInvoiceRepository.save(invoice);
                })
                .orElseThrow(() -> new RuntimeException("Recurring invoice not found with id: " + id));
    }

    public void generateRecurringInvoiceNow(Long id) {
        RecurringInvoice recurringInvoice = recurringInvoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring invoice not found with id: " + id));

        generateInvoiceFromRecurring(recurringInvoice);
        updateNextGenerationDate(recurringInvoice);
        recurringInvoice.setLastGeneratedDate(LocalDate.now());
        recurringInvoiceRepository.save(recurringInvoice);
    }

    // Contract Renewal Reminders
    public List<ContractRenewalReminder> getAllContractRenewalReminders() {
        return renewalReminderRepository.findAll();
    }

    public Optional<ContractRenewalReminder> getContractRenewalReminderById(Long id) {
        return renewalReminderRepository.findById(id);
    }

    public ContractRenewalReminder createContractRenewalReminder(ContractRenewalReminder reminder) {
        // Calculate reminder date based on contract end date and days before
        if (reminder.getContract().getEndDate() != null) {
            reminder.setReminderDate(reminder.getContract().getEndDate().minusDays(reminder.getDaysBefore()));
        }
        return renewalReminderRepository.save(reminder);
    }

    public ContractRenewalReminder updateContractRenewalReminder(Long id, ContractRenewalReminder updatedReminder) {
        return renewalReminderRepository.findById(id)
                .map(existing -> {
                    existing.setDaysBefore(updatedReminder.getDaysBefore());
                    existing.setReminderType(updatedReminder.getReminderType());
                    existing.setAutoRenewal(updatedReminder.getAutoRenewal());
                    existing.setRenewalTerms(updatedReminder.getRenewalTerms());
                    existing.setActive(updatedReminder.getActive());

                    // Recalculate reminder date
                    if (existing.getContract().getEndDate() != null) {
                        existing.setReminderDate(
                                existing.getContract().getEndDate().minusDays(existing.getDaysBefore()));
                    }

                    return renewalReminderRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Contract renewal reminder not found with id: " + id));
    }

    public void deleteContractRenewalReminder(Long id) {
        renewalReminderRepository.deleteById(id);
    }

    public ContractRenewalReminder toggleContractRenewalReminder(Long id) {
        return renewalReminderRepository.findById(id)
                .map(reminder -> {
                    reminder.setActive(!reminder.getActive());
                    return renewalReminderRepository.save(reminder);
                })
                .orElseThrow(() -> new RuntimeException("Contract renewal reminder not found with id: " + id));
    }

    // Automation Stats
    private AutomationStats getAutomationStatsInternal() {
        AutomationStats stats = new AutomationStats();

        stats.setTotalRecurringInvoices(recurringInvoiceRepository.countTotal());
        stats.setActiveRecurringInvoices(recurringInvoiceRepository.countActive());
        stats.setTotalRenewalReminders(renewalReminderRepository.countTotal());
        stats.setActiveRenewalReminders(renewalReminderRepository.countActive());

        // TODO: Add scheduled reports and automation rules counts when implemented
        stats.setTotalScheduledReports(0L);
        stats.setActiveScheduledReports(0L);
        stats.setTotalAutomationRules(0L);
        stats.setActiveAutomationRules(0L);
        stats.setExecutionsToday(0L);
        stats.setSuccessRate(100.0);

        return stats;
    }

    // Scheduled Processing Methods
    public void processRecurringInvoices() {
        List<RecurringInvoice> dueInvoices = recurringInvoiceRepository.findDueForGeneration(LocalDate.now());

        for (RecurringInvoice recurringInvoice : dueInvoices) {
            try {
                generateInvoiceFromRecurring(recurringInvoice);
                updateNextGenerationDate(recurringInvoice);
                recurringInvoice.setLastGeneratedDate(LocalDate.now());
                recurringInvoiceRepository.save(recurringInvoice);
            } catch (Exception e) {
                // Log error but continue processing other invoices
                System.err.println(
                        "Failed to generate recurring invoice " + recurringInvoice.getId() + ": " + e.getMessage());
            }
        }
    }

    public void processContractRenewalReminders() {
        List<ContractRenewalReminder> dueReminders = renewalReminderRepository.findDueForReminder(LocalDate.now());

        for (ContractRenewalReminder reminder : dueReminders) {
            try {
                sendRenewalReminder(reminder);
                reminder.setSent(true);
                reminder.setSentAt(LocalDateTime.now());
                renewalReminderRepository.save(reminder);
            } catch (Exception e) {
                // Log error but continue processing other reminders
                System.err.println("Failed to send renewal reminder " + reminder.getId() + ": " + e.getMessage());
            }
        }
    }

    // Private helper methods
    private void generateInvoiceFromRecurring(RecurringInvoice recurringInvoice) {
        // Create invoice generation request
        InvoiceGenerateDTO request = new InvoiceGenerateDTO();
        request.setContractId(recurringInvoice.getContractId());

        // Set period dates based on frequency
        LocalDate periodStart = LocalDate.now();
        LocalDate periodEnd = calculatePeriodEnd(periodStart, recurringInvoice.getFrequency());

        request.setPeriodStart(periodStart);
        request.setPeriodEnd(periodEnd);
        request.setIssueDate(LocalDate.now());
        request.setDueDate(LocalDate.now().plusDays(recurringInvoice.getDaysUntilDue()));

        // Generate the invoice
        invoiceService.generateInvoice(request);

        // Update last generated date
        recurringInvoice.setLastGeneratedDate(LocalDate.now());
        recurringInvoiceRepository.save(recurringInvoice);

        // TODO: If autoSend is true, send the invoice via email
        if (recurringInvoice.getAutoSend()) {
            // sendInvoiceByEmail(invoice);
        }
    }

    private LocalDate calculatePeriodEnd(LocalDate periodStart, RecurringInvoice.InvoiceFrequency frequency) {
        switch (frequency) {
            case WEEKLY:
                return periodStart.plusWeeks(1).minusDays(1);
            case MONTHLY:
                return periodStart.plusMonths(1).minusDays(1);
            case QUARTERLY:
                return periodStart.plusMonths(3).minusDays(1);
            case YEARLY:
                return periodStart.plusYears(1).minusDays(1);
            default:
                return periodStart.plusMonths(1).minusDays(1);
        }
    }

    private void updateNextGenerationDate(RecurringInvoice recurringInvoice) {
        LocalDate nextDate = recurringInvoice.getNextGenerationDate();

        switch (recurringInvoice.getFrequency()) {
            case WEEKLY:
                nextDate = nextDate.plusWeeks(1);
                break;
            case MONTHLY:
                nextDate = nextDate.plusMonths(1);
                break;
            case QUARTERLY:
                nextDate = nextDate.plusMonths(3);
                break;
            case YEARLY:
                nextDate = nextDate.plusYears(1);
                break;
        }

        recurringInvoice.setNextGenerationDate(nextDate);
    }

    private void sendRenewalReminder(ContractRenewalReminder reminder) {
        // TODO: Implement actual reminder sending logic
        // This could involve sending emails, SMS, or creating in-app notifications
        System.out.println("Sending renewal reminder for contract: " + reminder.getContract().getCode());

        // If auto-renewal is enabled, process the renewal
        if (reminder.getAutoRenewal() && reminder.getRenewalTerms() != null) {
            processAutoRenewal(reminder);
        }
    }

    private void processAutoRenewal(ContractRenewalReminder reminder) {
        // TODO: Implement auto-renewal logic
        Contract contract = reminder.getContract();
        ContractRenewalTerms terms = reminder.getRenewalTerms();

        System.out.println("Processing auto-renewal for contract: " + contract.getCode());

        // This would involve:
        // 1. Extending the contract end date
        // 2. Updating rent amount if specified
        // 3. Creating a new contract version or updating existing
        // 4. Notifying relevant parties
    }

    // Inner class for automation statistics
    public static class AutomationStats {
        private long totalRecurringInvoices;
        private long activeRecurringInvoices;
        private long totalRenewalReminders;
        private long activeRenewalReminders;
        private long totalScheduledReports;
        private long activeScheduledReports;
        private long totalAutomationRules;
        private long activeAutomationRules;
        private long executionsToday;
        private double successRate;

        // Getters and Setters
        public long getTotalRecurringInvoices() {
            return totalRecurringInvoices;
        }

        public void setTotalRecurringInvoices(long totalRecurringInvoices) {
            this.totalRecurringInvoices = totalRecurringInvoices;
        }

        public long getActiveRecurringInvoices() {
            return activeRecurringInvoices;
        }

        public void setActiveRecurringInvoices(long activeRecurringInvoices) {
            this.activeRecurringInvoices = activeRecurringInvoices;
        }

        public long getTotalRenewalReminders() {
            return totalRenewalReminders;
        }

        public void setTotalRenewalReminders(long totalRenewalReminders) {
            this.totalRenewalReminders = totalRenewalReminders;
        }

        public long getActiveRenewalReminders() {
            return activeRenewalReminders;
        }

        public void setActiveRenewalReminders(long activeRenewalReminders) {
            this.activeRenewalReminders = activeRenewalReminders;
        }

        public long getTotalScheduledReports() {
            return totalScheduledReports;
        }

        public void setTotalScheduledReports(long totalScheduledReports) {
            this.totalScheduledReports = totalScheduledReports;
        }

        public long getActiveScheduledReports() {
            return activeScheduledReports;
        }

        public void setActiveScheduledReports(long activeScheduledReports) {
            this.activeScheduledReports = activeScheduledReports;
        }

        public long getTotalAutomationRules() {
            return totalAutomationRules;
        }

        public void setTotalAutomationRules(long totalAutomationRules) {
            this.totalAutomationRules = totalAutomationRules;
        }

        public long getActiveAutomationRules() {
            return activeAutomationRules;
        }

        public void setActiveAutomationRules(long activeAutomationRules) {
            this.activeAutomationRules = activeAutomationRules;
        }

        public long getExecutionsToday() {
            return executionsToday;
        }

        public void setExecutionsToday(long executionsToday) {
            this.executionsToday = executionsToday;
        }

        public double getSuccessRate() {
            return successRate;
        }

        public void setSuccessRate(double successRate) {
            this.successRate = successRate;
        }
    }

    // Methods for AutomationController that return Map types
    public List<Map<String, Object>> getRecurringInvoices(int page, int size, Boolean active) {
        return new ArrayList<>();
    }

    public Map<String, Object> createRecurringInvoice(Map<String, Object> invoiceData) {
        return new HashMap<>();
    }

    public Map<String, Object> updateRecurringInvoice(Long id, Map<String, Object> invoiceData) {
        return new HashMap<>();
    }

    public void generateInvoiceNow(Long id) {
        generateRecurringInvoiceNow(id);
    }

    public List<Map<String, Object>> getContractRenewalReminders(int page, int size, Boolean active) {
        return new ArrayList<>();
    }

    public Map<String, Object> createContractRenewalReminder(Map<String, Object> reminderData) {
        return new HashMap<>();
    }

    public Map<String, Object> updateContractRenewalReminder(Long id, Map<String, Object> reminderData) {
        return new HashMap<>();
    }

    public List<Map<String, Object>> getScheduledReports(int page, int size, Boolean active) {
        return new ArrayList<>();
    }

    public Map<String, Object> createScheduledReport(Map<String, Object> reportData) {
        return new HashMap<>();
    }

    public Map<String, Object> updateScheduledReport(Long id, Map<String, Object> reportData) {
        return new HashMap<>();
    }

    public Map<String, Object> runScheduledReportNow(Long id) {
        return new HashMap<>();
    }

    public List<Map<String, Object>> getAutomationRules(int page, int size, Boolean active, String triggerType) {
        return new ArrayList<>();
    }

    public Map<String, Object> createAutomationRule(Map<String, Object> ruleData) {
        return new HashMap<>();
    }

    public Map<String, Object> updateAutomationRule(Long id, Map<String, Object> ruleData) {
        return new HashMap<>();
    }

    public void deleteAutomationRule(Long id) {
    }

    public Map<String, Object> executeAutomationRule(Long id) {
        return new HashMap<>();
    }

    public Map<String, Object> toggleAutomationRule(Long id) {
        return new HashMap<>();
    }

    public List<Map<String, Object>> getAutomationExecutions(int page, int size, Long ruleId, String status) {
        return new ArrayList<>();
    }

    public Map<String, Object> getAutomationExecution(Long id) {
        return new HashMap<>();
    }

    public Map<String, Object> getAutomationStats() {
        AutomationStats stats = getAutomationStatsInternal();
        Map<String, Object> result = new HashMap<>();
        result.put("totalRecurringInvoices", stats.getTotalRecurringInvoices());
        result.put("activeRecurringInvoices", stats.getActiveRecurringInvoices());
        result.put("totalRenewalReminders", stats.getTotalRenewalReminders());
        result.put("activeRenewalReminders", stats.getActiveRenewalReminders());
        result.put("totalScheduledReports", stats.getTotalScheduledReports());
        result.put("activeScheduledReports", stats.getActiveScheduledReports());
        result.put("totalAutomationRules", stats.getTotalAutomationRules());
        result.put("activeAutomationRules", stats.getActiveAutomationRules());
        result.put("executionsToday", stats.getExecutionsToday());
        result.put("successRate", stats.getSuccessRate());
        return result;
    }

    public List<Map<String, Object>> getTriggerTypes() {
        return new ArrayList<>();
    }

    public List<Map<String, Object>> getActionTypes() {
        return new ArrayList<>();
    }
}
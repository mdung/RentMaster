package com.rentmaster.automation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/automation")
@CrossOrigin(origins = "*")
public class AutomationController {

    @Autowired
    private AutomationService automationService;

    // Recurring Invoices
    @GetMapping("/recurring-invoices")
    public ResponseEntity<List<Map<String, Object>>> getRecurringInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean active) {
        try {
            List<Map<String, Object>> invoices = automationService.getRecurringInvoices(page, size, active);
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/recurring-invoices")
    public ResponseEntity<Map<String, Object>> createRecurringInvoice(@RequestBody Map<String, Object> invoiceData) {
        try {
            Map<String, Object> invoice = automationService.createRecurringInvoice(invoiceData);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/recurring-invoices/{id}")
    public ResponseEntity<Map<String, Object>> updateRecurringInvoice(
            @PathVariable Long id,
            @RequestBody Map<String, Object> invoiceData) {
        try {
            Map<String, Object> invoice = automationService.updateRecurringInvoice(id, invoiceData);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/recurring-invoices/{id}")
    public ResponseEntity<Void> deleteRecurringInvoice(@PathVariable Long id) {
        try {
            automationService.deleteRecurringInvoice(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/recurring-invoices/{id}/generate")
    public ResponseEntity<Map<String, Object>> generateInvoiceNow(@PathVariable Long id) {
        try {
            automationService.generateInvoiceNow(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Invoice generation triggered"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Contract Renewal Reminders
    @GetMapping("/contract-renewals")
    public ResponseEntity<List<Map<String, Object>>> getContractRenewalReminders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean active) {
        try {
            List<Map<String, Object>> reminders = automationService.getContractRenewalReminders(page, size, active);
            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/contract-renewals")
    public ResponseEntity<Map<String, Object>> createContractRenewalReminder(
            @RequestBody Map<String, Object> reminderData) {
        try {
            Map<String, Object> reminder = automationService.createContractRenewalReminder(reminderData);
            return ResponseEntity.ok(reminder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/contract-renewals/{id}")
    public ResponseEntity<Map<String, Object>> updateContractRenewalReminder(
            @PathVariable Long id,
            @RequestBody Map<String, Object> reminderData) {
        try {
            Map<String, Object> reminder = automationService.updateContractRenewalReminder(id, reminderData);
            return ResponseEntity.ok(reminder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Scheduled Reports
    @GetMapping("/scheduled-reports")
    public ResponseEntity<List<Map<String, Object>>> getScheduledReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean active) {
        try {
            List<Map<String, Object>> reports = automationService.getScheduledReports(page, size, active);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/scheduled-reports")
    public ResponseEntity<Map<String, Object>> createScheduledReport(@RequestBody Map<String, Object> reportData) {
        try {
            Map<String, Object> report = automationService.createScheduledReport(reportData);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/scheduled-reports/{id}")
    public ResponseEntity<Map<String, Object>> updateScheduledReport(
            @PathVariable Long id,
            @RequestBody Map<String, Object> reportData) {
        try {
            Map<String, Object> report = automationService.updateScheduledReport(id, reportData);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/scheduled-reports/{id}/run")
    public ResponseEntity<Map<String, Object>> runScheduledReportNow(@PathVariable Long id) {
        try {
            Map<String, Object> result = automationService.runScheduledReportNow(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Automation Rules
    @GetMapping("/rules")
    public ResponseEntity<List<Map<String, Object>>> getAutomationRules(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String triggerType) {
        try {
            List<Map<String, Object>> rules = automationService.getAutomationRules(page, size, active, triggerType);
            return ResponseEntity.ok(rules);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/rules")
    public ResponseEntity<Map<String, Object>> createAutomationRule(@RequestBody Map<String, Object> ruleData) {
        try {
            Map<String, Object> rule = automationService.createAutomationRule(ruleData);
            return ResponseEntity.ok(rule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<Map<String, Object>> updateAutomationRule(
            @PathVariable Long id,
            @RequestBody Map<String, Object> ruleData) {
        try {
            Map<String, Object> rule = automationService.updateAutomationRule(id, ruleData);
            return ResponseEntity.ok(rule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<Void> deleteAutomationRule(@PathVariable Long id) {
        try {
            automationService.deleteAutomationRule(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/rules/{id}/execute")
    public ResponseEntity<Map<String, Object>> executeAutomationRule(@PathVariable Long id) {
        try {
            Map<String, Object> result = automationService.executeAutomationRule(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/rules/{id}/toggle")
    public ResponseEntity<Map<String, Object>> toggleAutomationRule(@PathVariable Long id) {
        try {
            Map<String, Object> rule = automationService.toggleAutomationRule(id);
            return ResponseEntity.ok(rule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Automation Executions
    @GetMapping("/executions")
    public ResponseEntity<List<Map<String, Object>>> getAutomationExecutions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long ruleId,
            @RequestParam(required = false) String status) {
        try {
            List<Map<String, Object>> executions = automationService.getAutomationExecutions(page, size, ruleId,
                    status);
            return ResponseEntity.ok(executions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/executions/{id}")
    public ResponseEntity<Map<String, Object>> getAutomationExecution(@PathVariable Long id) {
        try {
            Map<String, Object> execution = automationService.getAutomationExecution(id);
            return ResponseEntity.ok(execution);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Automation Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAutomationStats() {
        try {
            Map<String, Object> stats = automationService.getAutomationStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Trigger Types
    @GetMapping("/trigger-types")
    public ResponseEntity<List<Map<String, Object>>> getTriggerTypes() {
        try {
            List<Map<String, Object>> triggerTypes = automationService.getTriggerTypes();
            return ResponseEntity.ok(triggerTypes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Action Types
    @GetMapping("/action-types")
    public ResponseEntity<List<Map<String, Object>>> getActionTypes() {
        try {
            List<Map<String, Object>> actionTypes = automationService.getActionTypes();
            return ResponseEntity.ok(actionTypes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
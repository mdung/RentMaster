package com.rentmaster.integration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations")
@CrossOrigin(origins = "*")
public class IntegrationController {

    @Autowired
    private IntegrationService integrationService;

    // Integration Management
    @GetMapping
    public ResponseEntity<List<Integration>> getIntegrations() {
        List<Integration> integrations = integrationService.getAllIntegrations();
        return ResponseEntity.ok(integrations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Integration> getIntegration(@PathVariable Long id) {
        Integration integration = integrationService.getIntegration(id);
        return ResponseEntity.ok(integration);
    }

    @PostMapping
    public ResponseEntity<Integration> createIntegration(@RequestBody Integration integration) {
        Integration created = integrationService.createIntegration(integration);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integration> updateIntegration(@PathVariable Long id, @RequestBody Integration integration) {
        integration.setId(id);
        Integration updated = integrationService.updateIntegration(integration);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntegration(@PathVariable Long id) {
        integrationService.deleteIntegration(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<Integration> toggleIntegration(@PathVariable Long id) {
        Integration toggled = integrationService.toggleIntegration(id);
        return ResponseEntity.ok(toggled);
    }

    @PostMapping("/{id}/test")
    public ResponseEntity<Map<String, Object>> testIntegration(@PathVariable Long id) {
        Map<String, Object> result = integrationService.testIntegration(id);
        return ResponseEntity.ok(result);
    }

    // QuickBooks Integration
    @PostMapping("/quickbooks/sync")
    public ResponseEntity<Map<String, Object>> syncWithQuickBooks(@RequestBody Map<String, Object> syncData) {
        Map<String, Object> result = integrationService.syncWithQuickBooks(syncData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/quickbooks/accounts")
    public ResponseEntity<List<Map<String, Object>>> getQuickBooksAccounts() {
        List<Map<String, Object>> accounts = integrationService.getQuickBooksAccounts();
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/quickbooks/export-invoices")
    public ResponseEntity<Map<String, Object>> exportInvoicesToQuickBooks(@RequestBody Map<String, Object> exportData) {
        Map<String, Object> result = integrationService.exportInvoicesToQuickBooks(exportData);
        return ResponseEntity.ok(result);
    }

    // Xero Integration
    @PostMapping("/xero/sync")
    public ResponseEntity<Map<String, Object>> syncWithXero(@RequestBody Map<String, Object> syncData) {
        Map<String, Object> result = integrationService.syncWithXero(syncData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/xero/contacts")
    public ResponseEntity<List<Map<String, Object>>> getXeroContacts() {
        List<Map<String, Object>> contacts = integrationService.getXeroContacts();
        return ResponseEntity.ok(contacts);
    }

    @PostMapping("/xero/export-transactions")
    public ResponseEntity<Map<String, Object>> exportTransactionsToXero(@RequestBody Map<String, Object> exportData) {
        Map<String, Object> result = integrationService.exportTransactionsToXero(exportData);
        return ResponseEntity.ok(result);
    }

    // Bank Integration
    @GetMapping("/banks")
    public ResponseEntity<List<Map<String, Object>>> getSupportedBanks() {
        List<Map<String, Object>> banks = integrationService.getSupportedBanks();
        return ResponseEntity.ok(banks);
    }

    @PostMapping("/banks/connect")
    public ResponseEntity<Map<String, Object>> connectBank(@RequestBody Map<String, Object> bankData) {
        Map<String, Object> result = integrationService.connectBank(bankData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/banks/{bankId}/accounts")
    public ResponseEntity<List<Map<String, Object>>> getBankAccounts(@PathVariable String bankId) {
        List<Map<String, Object>> accounts = integrationService.getBankAccounts(bankId);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/banks/{bankId}/transactions")
    public ResponseEntity<List<Map<String, Object>>> getBankTransactions(
            @PathVariable String bankId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<Map<String, Object>> transactions = integrationService.getBankTransactions(bankId, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/banks/{bankId}/sync-transactions")
    public ResponseEntity<Map<String, Object>> syncBankTransactions(@PathVariable String bankId) {
        Map<String, Object> result = integrationService.syncBankTransactions(bankId);
        return ResponseEntity.ok(result);
    }

    // Google Calendar Integration
    @PostMapping("/google-calendar/connect")
    public ResponseEntity<Map<String, Object>> connectGoogleCalendar(@RequestBody Map<String, Object> authData) {
        Map<String, Object> result = integrationService.connectGoogleCalendar(authData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/google-calendar/calendars")
    public ResponseEntity<List<Map<String, Object>>> getGoogleCalendars() {
        List<Map<String, Object>> calendars = integrationService.getGoogleCalendars();
        return ResponseEntity.ok(calendars);
    }

    @PostMapping("/google-calendar/events")
    public ResponseEntity<Map<String, Object>> createCalendarEvent(@RequestBody Map<String, Object> eventData) {
        Map<String, Object> result = integrationService.createCalendarEvent(eventData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/google-calendar/events")
    public ResponseEntity<List<Map<String, Object>>> getCalendarEvents(
            @RequestParam(required = false) String calendarId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<Map<String, Object>> events = integrationService.getCalendarEvents(calendarId, startDate, endDate);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/google-calendar/sync-maintenance")
    public ResponseEntity<Map<String, Object>> syncMaintenanceToCalendar() {
        Map<String, Object> result = integrationService.syncMaintenanceToCalendar();
        return ResponseEntity.ok(result);
    }

    // Integration Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getIntegrationStats() {
        Map<String, Object> stats = integrationService.getIntegrationStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<Map<String, Object>>> getIntegrationLogs(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<Map<String, Object>> logs = integrationService.getIntegrationLogs(id, page, size);
        return ResponseEntity.ok(logs);
    }

    // Supported Integration Types
    @GetMapping("/types")
    public ResponseEntity<List<Map<String, Object>>> getSupportedIntegrationTypes() {
        List<Map<String, Object>> types = integrationService.getSupportedIntegrationTypes();
        return ResponseEntity.ok(types);
    }
}
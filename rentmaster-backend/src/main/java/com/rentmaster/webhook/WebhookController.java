package com.rentmaster.webhook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@CrossOrigin(origins = "*")
public class WebhookController {

    @Autowired
    private WebhookService webhookService;

    // Webhook Configuration Management
    @GetMapping("/configurations")
    public ResponseEntity<List<WebhookConfiguration>> getWebhookConfigurations() {
        List<WebhookConfiguration> configurations = webhookService.getAllConfigurations();
        return ResponseEntity.ok(configurations);
    }

    @PostMapping("/configurations")
    public ResponseEntity<WebhookConfiguration> createWebhookConfiguration(@RequestBody WebhookConfiguration configuration) {
        WebhookConfiguration created = webhookService.createConfiguration(configuration);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/configurations/{id}")
    public ResponseEntity<WebhookConfiguration> updateWebhookConfiguration(
            @PathVariable Long id,
            @RequestBody WebhookConfiguration configuration) {
        configuration.setId(id);
        WebhookConfiguration updated = webhookService.updateConfiguration(configuration);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/configurations/{id}")
    public ResponseEntity<Void> deleteWebhookConfiguration(@PathVariable Long id) {
        webhookService.deleteConfiguration(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/configurations/{id}/toggle")
    public ResponseEntity<WebhookConfiguration> toggleWebhookConfiguration(@PathVariable Long id) {
        WebhookConfiguration toggled = webhookService.toggleConfiguration(id);
        return ResponseEntity.ok(toggled);
    }

    @PostMapping("/configurations/{id}/test")
    public ResponseEntity<Map<String, Object>> testWebhookConfiguration(@PathVariable Long id) {
        Map<String, Object> result = webhookService.testConfiguration(id);
        return ResponseEntity.ok(result);
    }

    // Webhook Event Logs
    @GetMapping("/events")
    public ResponseEntity<List<WebhookEvent>> getWebhookEvents(
            @RequestParam(required = false) Long configurationId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<WebhookEvent> events = webhookService.getEvents(configurationId, status, page, size);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<WebhookEvent> getWebhookEvent(@PathVariable Long id) {
        WebhookEvent event = webhookService.getEvent(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping("/events/{id}/retry")
    public ResponseEntity<Map<String, Object>> retryWebhookEvent(@PathVariable Long id) {
        Map<String, Object> result = webhookService.retryEvent(id);
        return ResponseEntity.ok(result);
    }

    // Webhook Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getWebhookStats(
            @RequestParam(required = false) Long configurationId,
            @RequestParam(required = false) String period) {
        Map<String, Object> stats = webhookService.getStats(configurationId, period);
        return ResponseEntity.ok(stats);
    }

    // Supported Event Types
    @GetMapping("/event-types")
    public ResponseEntity<List<Map<String, Object>>> getSupportedEventTypes() {
        List<Map<String, Object>> eventTypes = webhookService.getSupportedEventTypes();
        return ResponseEntity.ok(eventTypes);
    }

    // Webhook Signature Verification
    @PostMapping("/verify-signature")
    public ResponseEntity<Map<String, Object>> verifyWebhookSignature(@RequestBody Map<String, Object> verificationData) {
        Map<String, Object> result = webhookService.verifySignature(verificationData);
        return ResponseEntity.ok(result);
    }
}
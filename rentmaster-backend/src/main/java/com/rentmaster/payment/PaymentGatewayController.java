package com.rentmaster.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment-gateway")
@CrossOrigin(origins = "*")
public class PaymentGatewayController {

    @Autowired
    private PaymentGatewayService paymentGatewayService;

    // Payment Gateways Management
    @GetMapping("/gateways")
    public ResponseEntity<List<Map<String, Object>>> getPaymentGateways(
            @RequestParam(required = false) Boolean active) {
        try {
            List<Map<String, Object>> gateways = paymentGatewayService.getPaymentGateways(active);
            return ResponseEntity.ok(gateways);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/gateways")
    public ResponseEntity<Map<String, Object>> createPaymentGateway(@RequestBody Map<String, Object> gatewayData) {
        try {
            Map<String, Object> gateway = paymentGatewayService.createPaymentGateway(gatewayData);
            return ResponseEntity.ok(gateway);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/gateways/{id}")
    public ResponseEntity<Map<String, Object>> updatePaymentGateway(
            @PathVariable Long id,
            @RequestBody Map<String, Object> gatewayData) {
        try {
            Map<String, Object> gateway = paymentGatewayService.updatePaymentGateway(id, gatewayData);
            return ResponseEntity.ok(gateway);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/gateways/{id}")
    public ResponseEntity<Void> deletePaymentGateway(@PathVariable Long id) {
        try {
            paymentGatewayService.deletePaymentGateway(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/gateways/{id}/toggle")
    public ResponseEntity<Map<String, Object>> togglePaymentGateway(@PathVariable Long id) {
        try {
            Map<String, Object> gateway = paymentGatewayService.togglePaymentGateway(id);
            return ResponseEntity.ok(gateway);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/gateways/{id}/test")
    public ResponseEntity<Map<String, Object>> testPaymentGateway(@PathVariable Long id) {
        try {
            Map<String, Object> result = paymentGatewayService.testPaymentGateway(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Payment Intents
    @PostMapping("/intents")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody Map<String, Object> intentData) {
        try {
            Map<String, Object> intent = paymentGatewayService.createPaymentIntent(intentData);
            return ResponseEntity.ok(intent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/intents/{id}")
    public ResponseEntity<Map<String, Object>> getPaymentIntent(@PathVariable String id) {
        try {
            Map<String, Object> intent = paymentGatewayService.getPaymentIntent(id);
            return ResponseEntity.ok(intent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/intents/{id}/confirm")
    public ResponseEntity<Map<String, Object>> confirmPaymentIntent(
            @PathVariable String id,
            @RequestBody Map<String, Object> confirmationData) {
        try {
            Map<String, Object> result = paymentGatewayService.confirmPaymentIntent(id, confirmationData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/intents/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelPaymentIntent(@PathVariable String id) {
        try {
            Map<String, Object> result = paymentGatewayService.cancelPaymentIntent(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Payment Methods
    @GetMapping("/methods")
    public ResponseEntity<List<Map<String, Object>>> getPaymentMethods(
            @RequestParam(required = false) Long tenantId,
            @RequestParam(required = false) Long gatewayId) {
        try {
            List<Map<String, Object>> methods = paymentGatewayService.getPaymentMethods(tenantId, gatewayId);
            return ResponseEntity.ok(methods);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/methods")
    public ResponseEntity<Map<String, Object>> createPaymentMethod(@RequestBody Map<String, Object> methodData) {
        try {
            Map<String, Object> method = paymentGatewayService.createPaymentMethod(methodData);
            return ResponseEntity.ok(method);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/methods/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable String id) {
        try {
            paymentGatewayService.deletePaymentMethod(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/methods/{id}/default")
    public ResponseEntity<Map<String, Object>> setDefaultPaymentMethod(
            @PathVariable String id,
            @RequestParam Long tenantId) {
        try {
            Map<String, Object> method = paymentGatewayService.setDefaultPaymentMethod(id, tenantId);
            return ResponseEntity.ok(method);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Payment Processing
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            Map<String, Object> result = paymentGatewayService.processPayment(paymentData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/refund")
    public ResponseEntity<Map<String, Object>> processRefund(@RequestBody Map<String, Object> refundData) {
        try {
            Map<String, Object> result = paymentGatewayService.processRefund(refundData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Webhooks
    @PostMapping("/webhooks/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        try {
            paymentGatewayService.handleStripeWebhook(payload, signature);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error");
        }
    }

    @PostMapping("/webhooks/paypal")
    public ResponseEntity<String> handlePayPalWebhook(@RequestBody Map<String, Object> payload) {
        try {
            paymentGatewayService.handlePayPalWebhook(payload);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error");
        }
    }

    // Payment Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPaymentStats(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) Long gatewayId) {
        try {
            Map<String, Object> stats = paymentGatewayService.getPaymentStats(period, gatewayId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Supported Payment Methods
    @GetMapping("/supported-methods")
    public ResponseEntity<List<Map<String, Object>>> getSupportedPaymentMethods() {
        try {
            List<Map<String, Object>> methods = paymentGatewayService.getSupportedPaymentMethods();
            return ResponseEntity.ok(methods);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
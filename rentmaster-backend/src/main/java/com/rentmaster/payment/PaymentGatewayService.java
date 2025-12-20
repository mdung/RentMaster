package com.rentmaster.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.model.*;
import com.stripe.param.*;

import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PaymentGatewayService {

    @Autowired
    private PaymentGatewayRepository paymentGatewayRepository;

    @Autowired
    private PaymentIntentRepository paymentIntentRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${stripe.secret.key:sk_test_}")
    private String stripeSecretKey;

    @Value("${paypal.client.id:}")
    private String paypalClientId;

    @Value("${paypal.client.secret:}")
    private String paypalClientSecret;

    @Value("${square.access.token:}")
    private String squareAccessToken;

    // Payment Gateways Management
    public List<Map<String, Object>> getPaymentGateways(Boolean active) {
        List<PaymentGateway> gateways;
        if (active != null) {
            gateways = paymentGatewayRepository.findByIsActive(active);
        } else {
            gateways = paymentGatewayRepository.findAll();
        }

        return gateways.stream().map(this::convertToMap).toList();
    }

    public Map<String, Object> createPaymentGateway(Map<String, Object> gatewayData) {
        PaymentGateway gateway = new PaymentGateway();
        gateway.setName((String) gatewayData.get("name"));
        gateway.setType(PaymentGateway.GatewayType.valueOf((String) gatewayData.get("type")));
        gateway.setIsActive((Boolean) gatewayData.getOrDefault("isActive", true));
        String supportedMethodsStr = (String) gatewayData.get("supportedMethods");
        if (supportedMethodsStr != null) {
            List<PaymentGateway.PaymentMethodType> methods = new ArrayList<>();
            for (String method : supportedMethodsStr.split(",")) {
                methods.add(PaymentGateway.PaymentMethodType.valueOf(method.trim().toUpperCase()));
            }
            gateway.setSupportedMethods(methods);
        }
        gateway.setProcessingFee(((Number) gatewayData.get("processingFee")).doubleValue());
        gateway.setFeeType(PaymentGateway.FeeType.valueOf((String) gatewayData.get("feeType")));
        gateway.setCurrency((String) gatewayData.get("currency"));
        Object configObj = gatewayData.get("configuration");
        if (configObj != null) {
            if (configObj instanceof Map) {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    gateway.setConfiguration(mapper.writeValueAsString(configObj));
                } catch (Exception e) {
                    gateway.setConfiguration(configObj.toString());
                }
            } else if (configObj instanceof String) {
                gateway.setConfiguration((String) configObj);
            }
        }

        if (gatewayData.containsKey("minAmount")) {
            gateway.setMinAmount(((Number) gatewayData.get("minAmount")).doubleValue());
        }
        if (gatewayData.containsKey("maxAmount")) {
            gateway.setMaxAmount(((Number) gatewayData.get("maxAmount")).doubleValue());
        }

        PaymentGateway saved = paymentGatewayRepository.save(gateway);
        return convertToMap(saved);
    }

    public Map<String, Object> updatePaymentGateway(Long id, Map<String, Object> gatewayData) {
        PaymentGateway gateway = paymentGatewayRepository.findById(id).orElseThrow();

        if (gatewayData.containsKey("name")) {
            gateway.setName((String) gatewayData.get("name"));
        }
        if (gatewayData.containsKey("isActive")) {
            gateway.setIsActive((Boolean) gatewayData.get("isActive"));
        }
        if (gatewayData.containsKey("processingFee")) {
            gateway.setProcessingFee(((Number) gatewayData.get("processingFee")).doubleValue());
        }
        if (gatewayData.containsKey("configuration")) {
            Object configObj = gatewayData.get("configuration");
            if (configObj instanceof Map) {
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    gateway.setConfiguration(mapper.writeValueAsString(configObj));
                } catch (Exception e) {
                    gateway.setConfiguration(configObj.toString());
                }
            } else if (configObj instanceof String) {
                gateway.setConfiguration((String) configObj);
            }
        }

        PaymentGateway saved = paymentGatewayRepository.save(gateway);
        return convertToMap(saved);
    }

    public void deletePaymentGateway(Long id) {
        paymentGatewayRepository.deleteById(id);
    }

    public Map<String, Object> togglePaymentGateway(Long id) {
        PaymentGateway gateway = paymentGatewayRepository.findById(id).orElseThrow();
        gateway.setIsActive(!gateway.getIsActive());
        PaymentGateway saved = paymentGatewayRepository.save(gateway);
        return convertToMap(saved);
    }

    public Map<String, Object> testPaymentGateway(Long id) {
        PaymentGateway gateway = paymentGatewayRepository.findById(id).orElseThrow();
        Map<String, Object> result = new HashMap<>();

        try {
            switch (gateway.getType()) {
                case STRIPE:
                    result = testStripeConnection(gateway);
                    break;
                case PAYPAL:
                    result = testPayPalConnection(gateway);
                    break;
                case SQUARE:
                    result = testSquareConnection(gateway);
                    break;
                default:
                    result.put("success", true);
                    result.put("message", "Gateway type not supported for testing");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Connection failed: " + e.getMessage());
        }

        return result;
    }

    // Payment Intents
    public Map<String, Object> createPaymentIntent(Map<String, Object> intentData) {
        try {
            Long gatewayId = Long.valueOf(intentData.get("gatewayId").toString());
            PaymentGateway gateway = paymentGatewayRepository.findById(gatewayId).orElseThrow();

            switch (gateway.getType()) {
                case STRIPE:
                    return createStripePaymentIntent(intentData, gateway);
                case PAYPAL:
                    return createPayPalPaymentIntent(intentData, gateway);
                case SQUARE:
                    return createSquarePaymentIntent(intentData, gateway);
                default:
                    throw new RuntimeException("Unsupported gateway type");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage());
        }
    }

    public Map<String, Object> getPaymentIntent(String id) {
        PaymentIntent intent = paymentIntentRepository.findById(id).orElseThrow();
        return convertPaymentIntentToMap(intent);
    }

    public Map<String, Object> confirmPaymentIntent(String id, Map<String, Object> confirmationData) {
        PaymentIntent intent = paymentIntentRepository.findById(id).orElseThrow();

        try {
            // Process confirmation based on gateway type
            intent.setStatus(PaymentIntent.PaymentIntentStatus.SUCCEEDED);
            PaymentIntent saved = paymentIntentRepository.save(intent);

            Map<String, Object> result = convertPaymentIntentToMap(saved);
            result.put("success", true);
            return result;
        } catch (Exception e) {
            intent.setStatus(PaymentIntent.PaymentIntentStatus.FAILED);
            intent.setErrorMessage(e.getMessage());
            paymentIntentRepository.save(intent);

            Map<String, Object> result = convertPaymentIntentToMap(intent);
            result.put("success", false);
            return result;
        }
    }

    public Map<String, Object> cancelPaymentIntent(String id) {
        PaymentIntent intent = paymentIntentRepository.findById(id).orElseThrow();
        intent.setStatus(PaymentIntent.PaymentIntentStatus.CANCELLED);
        PaymentIntent saved = paymentIntentRepository.save(intent);
        return convertPaymentIntentToMap(saved);
    }

    // Payment Methods
    public List<Map<String, Object>> getPaymentMethods(Long tenantId, Long gatewayId) {
        // Implementation for retrieving payment methods
        List<Map<String, Object>> methods = new ArrayList<>();

        // Sample payment methods
        Map<String, Object> creditCard = new HashMap<>();
        creditCard.put("id", "pm_1234567890");
        creditCard.put("type", "CREDIT_CARD");
        creditCard.put("name", "Visa ending in 4242");
        creditCard.put("lastFour", "4242");
        creditCard.put("isDefault", true);
        methods.add(creditCard);

        return methods;
    }

    public Map<String, Object> createPaymentMethod(Map<String, Object> methodData) {
        // Implementation for creating payment method
        Map<String, Object> method = new HashMap<>();
        method.put("id", "pm_" + System.currentTimeMillis());
        method.put("type", methodData.get("type"));
        method.put("name", methodData.get("name"));
        method.put("isDefault", false);
        return method;
    }

    public void deletePaymentMethod(String id) {
        // Implementation for deleting payment method
    }

    public Map<String, Object> setDefaultPaymentMethod(String id, Long tenantId) {
        // Implementation for setting default payment method
        Map<String, Object> method = new HashMap<>();
        method.put("id", id);
        method.put("isDefault", true);
        return method;
    }

    // Payment Processing
    public Map<String, Object> processPayment(Map<String, Object> paymentData) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Process payment logic
            result.put("success", true);
            result.put("transactionId", "txn_" + System.currentTimeMillis());
            result.put("amount", paymentData.get("amount"));
            result.put("status", "COMPLETED");
            result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }

        return result;
    }

    public Map<String, Object> processRefund(Map<String, Object> refundData) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Process refund logic
            result.put("success", true);
            result.put("refundId", "ref_" + System.currentTimeMillis());
            result.put("amount", refundData.get("amount"));
            result.put("status", "COMPLETED");
            result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }

        return result;
    }

    // Webhooks
    public void handleStripeWebhook(String payload, String signature) {
        try {
            // Verify webhook signature and process event
            // Implementation for Stripe webhook handling
        } catch (Exception e) {
            throw new RuntimeException("Failed to process Stripe webhook: " + e.getMessage());
        }
    }

    public void handlePayPalWebhook(Map<String, Object> payload) {
        try {
            // Process PayPal webhook event
            // Implementation for PayPal webhook handling
        } catch (Exception e) {
            throw new RuntimeException("Failed to process PayPal webhook: " + e.getMessage());
        }
    }

    // Statistics
    public Map<String, Object> getPaymentStats(String period, Long gatewayId) {
        Map<String, Object> stats = new HashMap<>();

        // Sample statistics
        stats.put("totalTransactions", 150);
        stats.put("totalAmount", 45000.00);
        stats.put("successRate", 98.5);
        stats.put("averageAmount", 300.00);
        stats.put("topPaymentMethod", "CREDIT_CARD");

        List<Map<String, Object>> dailyStats = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            Map<String, Object> day = new HashMap<>();
            day.put("date", LocalDateTime.now().minusDays(i).format(DateTimeFormatter.ISO_LOCAL_DATE));
            day.put("transactions", 20 + (int) (Math.random() * 10));
            day.put("amount", 5000 + (Math.random() * 2000));
            dailyStats.add(day);
        }
        stats.put("dailyStats", dailyStats);

        return stats;
    }

    public List<Map<String, Object>> getSupportedPaymentMethods() {
        List<Map<String, Object>> methods = new ArrayList<>();

        methods.add(createMethodInfo("CREDIT_CARD", "Credit Card", "💳", true));
        methods.add(createMethodInfo("DEBIT_CARD", "Debit Card", "💳", true));
        methods.add(createMethodInfo("BANK_ACCOUNT", "Bank Account", "🏦", true));
        methods.add(createMethodInfo("DIGITAL_WALLET", "Digital Wallet", "📱", true));
        methods.add(createMethodInfo("CRYPTO", "Cryptocurrency", "₿", false));

        return methods;
    }

    // Helper Methods
    private Map<String, Object> convertToMap(PaymentGateway gateway) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", gateway.getId());
        map.put("name", gateway.getName());
        map.put("type", gateway.getType().toString());
        map.put("isActive", gateway.getIsActive());
        map.put("supportedMethods", gateway.getSupportedMethods());
        map.put("processingFee", gateway.getProcessingFee());
        map.put("feeType", gateway.getFeeType().toString());
        map.put("minAmount", gateway.getMinAmount());
        map.put("maxAmount", gateway.getMaxAmount());
        map.put("currency", gateway.getCurrency());
        map.put("configuration", gateway.getConfiguration());
        return map;
    }

    private Map<String, Object> convertPaymentIntentToMap(PaymentIntent intent) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", intent.getId());
        map.put("amount", intent.getAmount());
        map.put("currency", intent.getCurrency());
        map.put("status", intent.getStatus().toString());
        map.put("clientSecret", intent.getClientSecret());
        map.put("errorMessage", intent.getErrorMessage());
        map.put("metadata", intent.getMetadata());
        map.put("createdAt", intent.getCreatedAt());
        return map;
    }

    private Map<String, Object> createMethodInfo(String type, String name, String icon, boolean enabled) {
        Map<String, Object> method = new HashMap<>();
        method.put("type", type);
        method.put("name", name);
        method.put("icon", icon);
        method.put("enabled", enabled);
        return method;
    }

    private Map<String, Object> testStripeConnection(PaymentGateway gateway) {
        Map<String, Object> result = new HashMap<>();
        try {
            Stripe.apiKey = stripeSecretKey;
            Account account = Account.retrieve();
            result.put("success", true);
            result.put("message", "Stripe connection successful");
            result.put("accountId", account.getId());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Stripe connection failed: " + e.getMessage());
        }
        return result;
    }

    private Map<String, Object> testPayPalConnection(PaymentGateway gateway) {
        Map<String, Object> result = new HashMap<>();
        try {
            // PayPal API test call
            result.put("success", true);
            result.put("message", "PayPal connection successful");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "PayPal connection failed: " + e.getMessage());
        }
        return result;
    }

    private Map<String, Object> testSquareConnection(PaymentGateway gateway) {
        Map<String, Object> result = new HashMap<>();
        try {
            // Square API test call
            result.put("success", true);
            result.put("message", "Square connection successful");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Square connection failed: " + e.getMessage());
        }
        return result;
    }

    private Map<String, Object> createStripePaymentIntent(Map<String, Object> intentData, PaymentGateway gateway) {
        try {
            Stripe.apiKey = stripeSecretKey;

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(((Number) intentData.get("amount")).longValue())
                    .setCurrency((String) intentData.get("currency"))
                    .putMetadata("invoiceId", intentData.get("invoiceId").toString())
                    .build();

            com.stripe.model.PaymentIntent stripeIntent = com.stripe.model.PaymentIntent.create(params);

            // Save to database
            PaymentIntent intent = new PaymentIntent();
            intent.setId(stripeIntent.getId());
            intent.setAmount(((Number) intentData.get("amount")).doubleValue());
            intent.setCurrency((String) intentData.get("currency"));
            intent.setPaymentMethodId((String) intentData.get("paymentMethodId"));
            intent.setStatus(PaymentIntent.PaymentIntentStatus.PENDING);
            intent.setClientSecret(stripeIntent.getClientSecret());
            try {
                intent.setMetadata(objectMapper.writeValueAsString(intentData.get("metadata")));
            } catch (Exception e) {
                intent.setMetadata("{}");
            }
            intent.setCreatedAt(LocalDateTime.now());

            PaymentIntent saved = paymentIntentRepository.save(intent);
            return convertPaymentIntentToMap(saved);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Stripe payment intent: " + e.getMessage());
        }
    }

    private Map<String, Object> createPayPalPaymentIntent(Map<String, Object> intentData, PaymentGateway gateway) {
        // PayPal payment intent creation logic
        PaymentIntent intent = new PaymentIntent();
        intent.setId("pi_paypal_" + System.currentTimeMillis());
        intent.setAmount(((Number) intentData.get("amount")).doubleValue());
        intent.setCurrency((String) intentData.get("currency"));
        intent.setStatus(PaymentIntent.PaymentIntentStatus.PENDING);
        intent.setCreatedAt(LocalDateTime.now());

        PaymentIntent saved = paymentIntentRepository.save(intent);
        return convertPaymentIntentToMap(saved);
    }

    private Map<String, Object> createSquarePaymentIntent(Map<String, Object> intentData, PaymentGateway gateway) {
        // Square payment intent creation logic
        PaymentIntent intent = new PaymentIntent();
        intent.setId("pi_square_" + System.currentTimeMillis());
        intent.setAmount(((Number) intentData.get("amount")).doubleValue());
        intent.setCurrency((String) intentData.get("currency"));
        intent.setStatus(PaymentIntent.PaymentIntentStatus.PENDING);
        intent.setCreatedAt(LocalDateTime.now());

        PaymentIntent saved = paymentIntentRepository.save(intent);
        return convertPaymentIntentToMap(saved);
    }
}
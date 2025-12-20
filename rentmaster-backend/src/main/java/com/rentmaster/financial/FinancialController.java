package com.rentmaster.financial;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/financial")
@CrossOrigin(origins = "*")
public class FinancialController {
    
    @Autowired
    private FinancialService financialService;
    
    // Expenses Management
    @GetMapping("/expenses")
    public ResponseEntity<List<Map<String, Object>>> getExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            List<Map<String, Object>> expenses = financialService.getExpenses(page, size, category, propertyId, startDate, endDate);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/expenses")
    public ResponseEntity<Map<String, Object>> createExpense(@RequestBody Map<String, Object> expenseData) {
        try {
            Map<String, Object> expense = financialService.createExpense(expenseData);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/expenses/{id}")
    public ResponseEntity<Map<String, Object>> updateExpense(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> expenseData) {
        try {
            Map<String, Object> expense = financialService.updateExpense(id, expenseData);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        try {
            financialService.deleteExpense(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Financial Reports
    @GetMapping("/reports/profit-loss")
    public ResponseEntity<Map<String, Object>> getProfitLossReport(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> report = financialService.getProfitLossReport(startDate, endDate, propertyId);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/reports/cash-flow")
    public ResponseEntity<Map<String, Object>> getCashFlowReport(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> report = financialService.getCashFlowReport(startDate, endDate, propertyId);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/reports/tax")
    public ResponseEntity<Map<String, Object>> getTaxReport(
            @RequestParam String year,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> report = financialService.getTaxReport(year, propertyId);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Financial Forecasting
    @GetMapping("/forecasts")
    public ResponseEntity<List<Map<String, Object>>> getFinancialForecasts(
            @RequestParam(defaultValue = "12") int months,
            @RequestParam(required = false) Long propertyId) {
        try {
            List<Map<String, Object>> forecasts = financialService.getFinancialForecasts(months, propertyId);
            return ResponseEntity.ok(forecasts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/forecasts")
    public ResponseEntity<Map<String, Object>> createForecast(@RequestBody Map<String, Object> forecastData) {
        try {
            Map<String, Object> forecast = financialService.createForecast(forecastData);
            return ResponseEntity.ok(forecast);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Deposits Management
    @GetMapping("/deposits")
    public ResponseEntity<List<Map<String, Object>>> getDeposits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        try {
            List<Map<String, Object>> deposits = financialService.getDeposits(page, size, status);
            return ResponseEntity.ok(deposits);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/deposits/{id}/refund")
    public ResponseEntity<Map<String, Object>> processDepositRefund(
            @PathVariable Long id,
            @RequestBody Map<String, Object> refundData) {
        try {
            Map<String, Object> deposit = financialService.processDepositRefund(id, refundData);
            return ResponseEntity.ok(deposit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Payment Plans
    @GetMapping("/payment-plans")
    public ResponseEntity<List<Map<String, Object>>> getPaymentPlans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        try {
            List<Map<String, Object>> paymentPlans = financialService.getPaymentPlans(page, size, status);
            return ResponseEntity.ok(paymentPlans);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/payment-plans")
    public ResponseEntity<Map<String, Object>> createPaymentPlan(@RequestBody Map<String, Object> planData) {
        try {
            Map<String, Object> paymentPlan = financialService.createPaymentPlan(planData);
            return ResponseEntity.ok(paymentPlan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/payment-plans/{id}")
    public ResponseEntity<Map<String, Object>> updatePaymentPlan(
            @PathVariable Long id,
            @RequestBody Map<String, Object> planData) {
        try {
            Map<String, Object> paymentPlan = financialService.updatePaymentPlan(id, planData);
            return ResponseEntity.ok(paymentPlan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Currency Management
    @GetMapping("/currencies")
    public ResponseEntity<List<Map<String, Object>>> getCurrencies() {
        try {
            List<Map<String, Object>> currencies = financialService.getCurrencies();
            return ResponseEntity.ok(currencies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/currencies")
    public ResponseEntity<Map<String, Object>> createCurrency(@RequestBody Map<String, Object> currencyData) {
        try {
            Map<String, Object> currency = financialService.createCurrency(currencyData);
            return ResponseEntity.ok(currency);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/currencies/{id}")
    public ResponseEntity<Map<String, Object>> updateCurrency(
            @PathVariable Long id,
            @RequestBody Map<String, Object> currencyData) {
        try {
            Map<String, Object> currency = financialService.updateCurrency(id, currencyData);
            return ResponseEntity.ok(currency);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Financial Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getFinancialStats(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> stats = financialService.getFinancialStats(period, propertyId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Expense Categories
    @GetMapping("/expense-categories")
    public ResponseEntity<List<String>> getExpenseCategories() {
        try {
            List<String> categories = financialService.getExpenseCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
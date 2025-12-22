package com.rentmaster.financial;

import com.rentmaster.billing.Invoice;
import com.rentmaster.billing.InvoiceRepository;
import com.rentmaster.billing.Payment;
import com.rentmaster.billing.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class FinancialService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DepositRepository depositRepository;

    @Autowired
    private PaymentPlanRepository paymentPlanRepository;

    @Autowired
    private CurrencyRepository currencyRepository;

    public List<Map<String, Object>> getExpenses(int page, int size, String category, Long propertyId, String startDate,
            String endDate) {
        List<Expense> expenses;
        
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
        
        if (propertyId != null && start != null && end != null) {
            expenses = expenseRepository.findByPropertyAndDateRange(propertyId, start, end);
        } else if (start != null && end != null) {
            expenses = expenseRepository.findByDateRange(start, end);
        } else if (propertyId != null) {
            expenses = expenseRepository.findByPropertyId(propertyId);
        } else if (category != null) {
            expenses = expenseRepository.findByCategory(category);
        } else {
            expenses = expenseRepository.findAll();
        }
        
        if (category != null && expenses != null) {
            expenses = expenses.stream()
                .filter(e -> e.getCategory().equals(category))
                .collect(Collectors.toList());
        }
        
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, expenses.size());
        List<Expense> pagedExpenses = expenses.subList(Math.min(fromIndex, expenses.size()), toIndex);
        
        return pagedExpenses.stream().map(this::expenseToMap).collect(Collectors.toList());
    }

    public Map<String, Object> createExpense(Map<String, Object> expenseData) {
        Expense expense = new Expense();
        expense.setCategory((String) expenseData.get("category"));
        expense.setDescription((String) expenseData.get("description"));
        expense.setAmount(((Number) expenseData.get("amount")).doubleValue());
        expense.setCurrency((String) expenseData.getOrDefault("currency", "USD"));
        expense.setExpenseDate(LocalDate.parse((String) expenseData.get("expenseDate")));
        if (expenseData.containsKey("propertyId")) {
            expense.setPropertyId(((Number) expenseData.get("propertyId")).longValue());
        }
        if (expenseData.containsKey("vendor")) {
            expense.setVendor((String) expenseData.get("vendor"));
        }
        if (expenseData.containsKey("receiptNumber")) {
            expense.setReceiptNumber((String) expenseData.get("receiptNumber"));
        }
        if (expenseData.containsKey("notes")) {
            expense.setNotes((String) expenseData.get("notes"));
        }
        
        expense = expenseRepository.save(expense);
        return expenseToMap(expense);
    }

    public Map<String, Object> updateExpense(Long id, Map<String, Object> expenseData) {
        Expense expense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (expenseData.containsKey("category")) {
            expense.setCategory((String) expenseData.get("category"));
        }
        if (expenseData.containsKey("description")) {
            expense.setDescription((String) expenseData.get("description"));
        }
        if (expenseData.containsKey("amount")) {
            expense.setAmount(((Number) expenseData.get("amount")).doubleValue());
        }
        if (expenseData.containsKey("currency")) {
            expense.setCurrency((String) expenseData.get("currency"));
        }
        if (expenseData.containsKey("expenseDate")) {
            expense.setExpenseDate(LocalDate.parse((String) expenseData.get("expenseDate")));
        }
        if (expenseData.containsKey("propertyId")) {
            expense.setPropertyId(((Number) expenseData.get("propertyId")).longValue());
        }
        if (expenseData.containsKey("vendor")) {
            expense.setVendor((String) expenseData.get("vendor"));
        }
        if (expenseData.containsKey("receiptNumber")) {
            expense.setReceiptNumber((String) expenseData.get("receiptNumber"));
        }
        if (expenseData.containsKey("notes")) {
            expense.setNotes((String) expenseData.get("notes"));
        }
        
        expense = expenseRepository.save(expense);
        return expenseToMap(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Map<String, Object> getProfitLossReport(String startDate, String endDate, Long propertyId) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        // Get all invoices in date range
        List<Invoice> invoices = invoiceRepository.findAll().stream()
            .filter(inv -> {
                LocalDate periodStart = inv.getPeriodStart();
                LocalDate periodEnd = inv.getPeriodEnd();
                return !periodStart.isAfter(end) && !periodEnd.isBefore(start);
            })
            .collect(Collectors.toList());
        
        // Calculate total revenue from invoices
        double totalRevenue = invoices.stream()
            .mapToDouble(inv -> inv.getTotalAmount().doubleValue())
            .sum();
        
        // Get expenses in date range
        List<Expense> expenses;
        if (propertyId != null) {
            expenses = expenseRepository.findByPropertyAndDateRange(propertyId, start, end);
        } else {
            expenses = expenseRepository.findByDateRange(start, end);
        }
        
        // Calculate total expenses
        double totalExpenses = expenses.stream()
            .mapToDouble(Expense::getAmount)
            .sum();
        
        // Calculate net profit
        double netProfit = totalRevenue - totalExpenses;
        double profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
        
        // Group revenue by category (from invoice items)
        Map<String, Double> revenueByCategory = new HashMap<>();
        invoices.forEach(inv -> {
            inv.getItems().forEach(item -> {
                String category = item.getDescription(); // Using description as category
                revenueByCategory.merge(category, item.getAmount().doubleValue(), Double::sum);
            });
        });
        
        // Group expenses by category
        Map<String, Double> expensesByCategory = expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.summingDouble(Expense::getAmount)
            ));
        
        // Monthly breakdown
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        YearMonth current = YearMonth.from(start);
        YearMonth endMonth = YearMonth.from(end);
        
        while (!current.isAfter(endMonth)) {
            LocalDate monthStart = current.atDay(1);
            LocalDate monthEnd = current.atEndOfMonth();
            
            double monthRevenue = invoices.stream()
                .filter(inv -> {
                    LocalDate periodStart = inv.getPeriodStart();
                    LocalDate periodEnd = inv.getPeriodEnd();
                    return !periodStart.isAfter(monthEnd) && !periodEnd.isBefore(monthStart);
                })
                .mapToDouble(inv -> inv.getTotalAmount().doubleValue())
                .sum();
            
            double monthExpenses = expenses.stream()
                .filter(e -> {
                    LocalDate expDate = e.getExpenseDate();
                    return !expDate.isBefore(monthStart) && !expDate.isAfter(monthEnd);
                })
                .mapToDouble(Expense::getAmount)
                .sum();
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", current.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            monthData.put("revenue", monthRevenue);
            monthData.put("expenses", monthExpenses);
            monthData.put("profit", monthRevenue - monthExpenses);
            monthlyData.add(monthData);
            
            current = current.plusMonths(1);
        }
        
        Map<String, Object> report = new HashMap<>();
        report.put("totalRevenue", totalRevenue);
        report.put("totalExpenses", totalExpenses);
        report.put("netProfit", netProfit);
        report.put("profitMargin", profitMargin);
        report.put("revenueByCategory", revenueByCategory);
        report.put("expensesByCategory", expensesByCategory);
        report.put("monthlyData", monthlyData);
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        
        return report;
    }

    public Map<String, Object> getCashFlowReport(String startDate, String endDate, Long propertyId) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        // Get all payments (cash inflows)
        List<Payment> payments = paymentRepository.findAll().stream()
            .filter(p -> {
                LocalDate paidDate = LocalDate.from(p.getPaidAt());
                return !paidDate.isBefore(start) && !paidDate.isAfter(end);
            })
            .collect(Collectors.toList());
        
        // Calculate total inflow
        double totalInflow = payments.stream()
            .mapToDouble(p -> p.getAmount().doubleValue())
            .sum();
        
        // Get expenses (cash outflows)
        List<Expense> expenses;
        if (propertyId != null) {
            expenses = expenseRepository.findByPropertyAndDateRange(propertyId, start, end);
        } else {
            expenses = expenseRepository.findByDateRange(start, end);
        }
        
        // Calculate total outflow
        double totalOutflow = expenses.stream()
            .mapToDouble(Expense::getAmount)
            .sum();
        
        // Calculate net cash flow
        double netCashFlow = totalInflow - totalOutflow;
        
        // Prepare inflows list
        List<Map<String, Object>> inflows = payments.stream()
            .map(p -> {
                Map<String, Object> inflow = new HashMap<>();
                inflow.put("source", "Invoice Payment");
                inflow.put("amount", p.getAmount().doubleValue());
                inflow.put("date", p.getPaidAt().toString());
                return inflow;
            })
            .collect(Collectors.toList());
        
        // Prepare outflows list
        List<Map<String, Object>> outflows = expenses.stream()
            .map(e -> {
                Map<String, Object> outflow = new HashMap<>();
                outflow.put("category", e.getCategory());
                outflow.put("amount", e.getAmount());
                outflow.put("date", e.getExpenseDate().toString());
                return outflow;
            })
            .collect(Collectors.toList());
        
        // Monthly cash flow
        List<Map<String, Object>> monthlyCashFlow = new ArrayList<>();
        YearMonth current = YearMonth.from(start);
        YearMonth endMonth = YearMonth.from(end);
        
        while (!current.isAfter(endMonth)) {
            LocalDate monthStart = current.atDay(1);
            LocalDate monthEnd = current.atEndOfMonth();
            
            double monthInflow = payments.stream()
                .filter(p -> {
                    LocalDate paidDate = LocalDate.from(p.getPaidAt());
                    return !paidDate.isBefore(monthStart) && !paidDate.isAfter(monthEnd);
                })
                .mapToDouble(p -> p.getAmount().doubleValue())
                .sum();
            
            double monthOutflow = expenses.stream()
                .filter(e -> {
                    LocalDate expDate = e.getExpenseDate();
                    return !expDate.isBefore(monthStart) && !expDate.isAfter(monthEnd);
                })
                .mapToDouble(Expense::getAmount)
                .sum();
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", current.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            monthData.put("inflow", monthInflow);
            monthData.put("outflow", monthOutflow);
            monthData.put("netFlow", monthInflow - monthOutflow);
            monthlyCashFlow.add(monthData);
            
            current = current.plusMonths(1);
        }
        
        Map<String, Object> report = new HashMap<>();
        report.put("totalInflow", totalInflow);
        report.put("totalOutflow", totalOutflow);
        report.put("netCashFlow", netCashFlow);
        report.put("endingBalance", netCashFlow); // Simplified - should track actual balance
        report.put("inflows", inflows);
        report.put("outflows", outflows);
        report.put("monthlyCashFlow", monthlyCashFlow);
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        
        return report;
    }

    public Map<String, Object> getTaxReport(String year, Long propertyId) {
        int yearInt = Integer.parseInt(year);
        LocalDate yearStart = LocalDate.of(yearInt, 1, 1);
        LocalDate yearEnd = LocalDate.of(yearInt, 12, 31);
        
        // Get all invoices for the year
        List<Invoice> invoices = invoiceRepository.findAll().stream()
            .filter(inv -> {
                LocalDate periodStart = inv.getPeriodStart();
                LocalDate periodEnd = inv.getPeriodEnd();
                return !periodStart.isAfter(yearEnd) && !periodEnd.isBefore(yearStart);
            })
            .collect(Collectors.toList());
        
        // Calculate taxable income (total revenue)
        double taxableIncome = invoices.stream()
            .mapToDouble(inv -> inv.getTotalAmount().doubleValue())
            .sum();
        
        // Get expenses for the year (deductions)
        List<Expense> expenses;
        if (propertyId != null) {
            expenses = expenseRepository.findByPropertyAndDateRange(propertyId, yearStart, yearEnd);
        } else {
            expenses = expenseRepository.findByDateRange(yearStart, yearEnd);
        }
        
        // Calculate total deductions
        double totalDeductions = expenses.stream()
            .mapToDouble(Expense::getAmount)
            .sum();
        
        // Calculate tax owed (simplified - 20% of net income)
        double netIncome = taxableIncome - totalDeductions;
        double taxOwed = Math.max(0, netIncome * 0.20); // 20% tax rate
        double effectiveTaxRate = taxableIncome > 0 ? (taxOwed / taxableIncome) * 100 : 0;
        
        // Income breakdown by source
        Map<String, Double> incomeBreakdown = new HashMap<>();
        invoices.forEach(inv -> {
            inv.getItems().forEach(item -> {
                String source = item.getDescription();
                incomeBreakdown.merge(source, item.getAmount().doubleValue(), Double::sum);
            });
        });
        
        // Deductions list
        List<Map<String, Object>> deductions = expenses.stream()
            .map(e -> {
                Map<String, Object> deduction = new HashMap<>();
                deduction.put("category", e.getCategory());
                deduction.put("description", e.getDescription());
                deduction.put("amount", e.getAmount());
                return deduction;
            })
            .collect(Collectors.toList());
        
        // Quarterly breakdown
        List<Map<String, Object>> quarterlyData = new ArrayList<>();
        for (int quarter = 1; quarter <= 4; quarter++) {
            LocalDate quarterStart = LocalDate.of(yearInt, (quarter - 1) * 3 + 1, 1);
            LocalDate quarterEnd = quarterStart.plusMonths(3).minusDays(1);
            
            double quarterIncome = invoices.stream()
                .filter(inv -> {
                    LocalDate periodStart = inv.getPeriodStart();
                    LocalDate periodEnd = inv.getPeriodEnd();
                    return !periodStart.isAfter(quarterEnd) && !periodEnd.isBefore(quarterStart);
                })
                .mapToDouble(inv -> inv.getTotalAmount().doubleValue())
                .sum();
            
            double quarterExpenses = expenses.stream()
                .filter(e -> {
                    LocalDate expDate = e.getExpenseDate();
                    return !expDate.isBefore(quarterStart) && !expDate.isAfter(quarterEnd);
                })
                .mapToDouble(Expense::getAmount)
                .sum();
            
            Map<String, Object> quarterData = new HashMap<>();
            quarterData.put("quarter", quarter);
            quarterData.put("income", quarterIncome);
            quarterData.put("expenses", quarterExpenses);
            quarterData.put("taxable", Math.max(0, quarterIncome - quarterExpenses));
            quarterlyData.add(quarterData);
        }
        
        Map<String, Object> report = new HashMap<>();
        report.put("year", year);
        report.put("taxableIncome", taxableIncome);
        report.put("totalDeductions", totalDeductions);
        report.put("taxOwed", taxOwed);
        report.put("effectiveTaxRate", effectiveTaxRate);
        report.put("incomeBreakdown", incomeBreakdown);
        report.put("deductions", deductions);
        report.put("quarterlyData", quarterlyData);
        
        return report;
    }
    
    private Map<String, Object> expenseToMap(Expense expense) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", expense.getId());
        map.put("propertyId", expense.getPropertyId());
        map.put("propertyName", expense.getPropertyName());
        map.put("category", expense.getCategory());
        map.put("description", expense.getDescription());
        map.put("amount", expense.getAmount());
        map.put("currency", expense.getCurrency());
        map.put("expenseDate", expense.getExpenseDate().toString());
        map.put("vendor", expense.getVendor());
        map.put("receiptNumber", expense.getReceiptNumber());
        map.put("notes", expense.getNotes());
        map.put("createdAt", expense.getCreatedAt() != null ? expense.getCreatedAt().toString() : null);
        return map;
    }

    public List<Map<String, Object>> getFinancialForecasts(int months, Long propertyId) {
        // Generate forecast based on historical data
        List<Map<String, Object>> forecasts = new ArrayList<>();
        LocalDate startDate = LocalDate.now();
        
        for (int i = 0; i < months; i++) {
            LocalDate monthDate = startDate.plusMonths(i);
            
            // Get historical averages for projection
            LocalDate historicalStart = monthDate.minusYears(1);
            LocalDate historicalEnd = monthDate.minusMonths(1);
            
            List<Invoice> historicalInvoices = invoiceRepository.findAll().stream()
                .filter(inv -> {
                    LocalDate periodStart = inv.getPeriodStart();
                    LocalDate periodEnd = inv.getPeriodEnd();
                    return !periodStart.isAfter(historicalEnd) && !periodEnd.isBefore(historicalStart);
                })
                .collect(Collectors.toList());
            
            double avgRevenue = historicalInvoices.isEmpty() ? 0 : 
                historicalInvoices.stream().mapToDouble(inv -> inv.getTotalAmount().doubleValue()).average().orElse(0);
            
            List<Expense> historicalExpenses = expenseRepository.findByDateRange(historicalStart, historicalEnd);
            double avgExpenses = historicalExpenses.isEmpty() ? 0 :
                historicalExpenses.stream().mapToDouble(Expense::getAmount).average().orElse(0);
            
            Map<String, Object> forecast = new HashMap<>();
            forecast.put("month", monthDate.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            forecast.put("revenue", avgRevenue);
            forecast.put("expenses", avgExpenses);
            forecast.put("profit", avgRevenue - avgExpenses);
            forecasts.add(forecast);
        }
        
        return forecasts;
    }

    public Map<String, Object> createForecast(Map<String, Object> forecastData) {
        // For now, return the forecast data as-is
        return forecastData;
    }

    public List<Map<String, Object>> getDeposits(int page, int size, String status) {
        List<Deposit> deposits;
        if (status != null) {
            deposits = depositRepository.findByStatus(Deposit.DepositStatus.valueOf(status));
        } else {
            deposits = depositRepository.findAll();
        }
        
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, deposits.size());
        List<Deposit> pagedDeposits = deposits.subList(Math.min(fromIndex, deposits.size()), toIndex);
        
        return pagedDeposits.stream().map(this::depositToMap).collect(Collectors.toList());
    }

    public Map<String, Object> processDepositRefund(Long id, Map<String, Object> refundData) {
        Deposit deposit = depositRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Deposit not found"));
        
        deposit.setStatus(Deposit.DepositStatus.REFUNDED);
        deposit.setRefundDate(LocalDate.now());
        if (refundData.containsKey("refundAmount")) {
            deposit.setRefundAmount(((Number) refundData.get("refundAmount")).doubleValue());
        }
        if (refundData.containsKey("notes")) {
            deposit.setNotes((String) refundData.get("notes"));
        }
        
        deposit = depositRepository.save(deposit);
        return depositToMap(deposit);
    }

    public List<Map<String, Object>> getPaymentPlans(int page, int size, String status) {
        List<PaymentPlan> plans;
        if (status != null) {
            plans = paymentPlanRepository.findByStatus(PaymentPlan.PaymentPlanStatus.valueOf(status));
        } else {
            plans = paymentPlanRepository.findAll();
        }
        
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, plans.size());
        List<PaymentPlan> pagedPlans = plans.subList(Math.min(fromIndex, plans.size()), toIndex);
        
        return pagedPlans.stream().map(this::paymentPlanToMap).collect(Collectors.toList());
    }

    public Map<String, Object> createPaymentPlan(Map<String, Object> planData) {
        PaymentPlan plan = new PaymentPlan();
        plan.setInvoiceId(((Number) planData.get("invoiceId")).longValue());
        
        // Get invoice to populate details
        Invoice invoice = invoiceRepository.findById(plan.getInvoiceId())
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        plan.setInvoiceNumber("INV-" + invoice.getId());
        plan.setTenantName(invoice.getContract() != null && invoice.getContract().getPrimaryTenant() != null ? 
            invoice.getContract().getPrimaryTenant().getFullName() : "Unknown");
        plan.setTotalAmount(invoice.getTotalAmount().doubleValue());
        plan.setInstallments((Integer) planData.get("installments"));
        plan.setInstallmentAmount(plan.getTotalAmount() / plan.getInstallments());
        plan.setFrequency(PaymentPlan.PaymentFrequency.valueOf((String) planData.get("frequency")));
        plan.setStartDate(LocalDate.parse((String) planData.get("startDate")));
        plan.setRemainingAmount(plan.getTotalAmount());
        
        plan = paymentPlanRepository.save(plan);
        return paymentPlanToMap(plan);
    }

    public Map<String, Object> updatePaymentPlan(Long id, Map<String, Object> planData) {
        PaymentPlan plan = paymentPlanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment plan not found"));
        
        if (planData.containsKey("installments")) {
            plan.setInstallments((Integer) planData.get("installments"));
            plan.setInstallmentAmount(plan.getTotalAmount() / plan.getInstallments());
        }
        if (planData.containsKey("frequency")) {
            plan.setFrequency(PaymentPlan.PaymentFrequency.valueOf((String) planData.get("frequency")));
        }
        if (planData.containsKey("startDate")) {
            plan.setStartDate(LocalDate.parse((String) planData.get("startDate")));
        }
        
        plan = paymentPlanRepository.save(plan);
        return paymentPlanToMap(plan);
    }

    public List<Map<String, Object>> getCurrencies() {
        return currencyRepository.findAll().stream()
            .map(this::currencyToMap)
            .collect(Collectors.toList());
    }

    public Map<String, Object> createCurrency(Map<String, Object> currencyData) {
        Currency currency = new Currency();
        currency.setCode((String) currencyData.get("code"));
        currency.setName((String) currencyData.get("name"));
        currency.setSymbol((String) currencyData.get("symbol"));
        currency.setExchangeRate(new java.math.BigDecimal(((Number) currencyData.get("exchangeRate")).doubleValue()));
        currency.setActive((Boolean) currencyData.getOrDefault("active", true));
        currency.setIsDefault((Boolean) currencyData.getOrDefault("isDefault", false));
        
        // If setting as default, unset other defaults
        if (currency.getIsDefault()) {
            currencyRepository.findByIsDefaultTrue().ifPresent(c -> {
                c.setIsDefault(false);
                currencyRepository.save(c);
            });
        }
        
        currency = currencyRepository.save(currency);
        return currencyToMap(currency);
    }

    public Map<String, Object> updateCurrency(Long id, Map<String, Object> currencyData) {
        Currency currency = currencyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Currency not found"));
        
        if (currencyData.containsKey("name")) {
            currency.setName((String) currencyData.get("name"));
        }
        if (currencyData.containsKey("symbol")) {
            currency.setSymbol((String) currencyData.get("symbol"));
        }
        if (currencyData.containsKey("exchangeRate")) {
            currency.setExchangeRate(new java.math.BigDecimal(((Number) currencyData.get("exchangeRate")).doubleValue()));
        }
        if (currencyData.containsKey("active")) {
            currency.setActive((Boolean) currencyData.get("active"));
        }
        if (currencyData.containsKey("isDefault")) {
            boolean isDefault = (Boolean) currencyData.get("isDefault");
            if (isDefault) {
                currencyRepository.findByIsDefaultTrue().ifPresent(c -> {
                    c.setIsDefault(false);
                    currencyRepository.save(c);
                });
            }
            currency.setIsDefault(isDefault);
        }
        
        currency = currencyRepository.save(currency);
        return currencyToMap(currency);
    }

    public void setDefaultCurrency(Long id) {
        Currency currency = currencyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Currency not found"));
        
        // Unset current default
        currencyRepository.findByIsDefaultTrue().ifPresent(c -> {
            c.setIsDefault(false);
            currencyRepository.save(c);
        });
        
        // Set new default
        currency.setIsDefault(true);
        currencyRepository.save(currency);
    }
    
    private Map<String, Object> depositToMap(Deposit deposit) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", deposit.getId());
        map.put("contractId", deposit.getContractId());
        map.put("contractCode", deposit.getContractCode());
        map.put("tenantName", deposit.getTenantName());
        map.put("amount", deposit.getAmount());
        map.put("currency", deposit.getCurrency());
        map.put("depositDate", deposit.getDepositDate().toString());
        map.put("status", deposit.getStatus().toString());
        map.put("refundDate", deposit.getRefundDate() != null ? deposit.getRefundDate().toString() : null);
        map.put("refundAmount", deposit.getRefundAmount());
        map.put("notes", deposit.getNotes());
        return map;
    }
    
    private Map<String, Object> paymentPlanToMap(PaymentPlan plan) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", plan.getId());
        map.put("invoiceId", plan.getInvoiceId());
        map.put("invoiceNumber", plan.getInvoiceNumber());
        map.put("tenantName", plan.getTenantName());
        map.put("totalAmount", plan.getTotalAmount());
        map.put("installments", plan.getInstallments());
        map.put("installmentAmount", plan.getInstallmentAmount());
        map.put("frequency", plan.getFrequency().toString());
        map.put("startDate", plan.getStartDate().toString());
        map.put("status", plan.getStatus().toString());
        map.put("paidInstallments", plan.getPaidInstallments());
        map.put("remainingAmount", plan.getRemainingAmount());
        map.put("schedule", new ArrayList<>()); // Schedule would need separate entity
        return map;
    }
    
    private Map<String, Object> currencyToMap(Currency currency) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", currency.getId());
        map.put("code", currency.getCode());
        map.put("name", currency.getName());
        map.put("symbol", currency.getSymbol());
        map.put("exchangeRate", currency.getExchangeRate().doubleValue());
        map.put("isDefault", currency.getIsDefault());
        map.put("active", currency.getActive());
        return map;
    }

    public Map<String, Object> getFinancialStats(String period, Long propertyId) {
        return new HashMap<>();
    }

    public List<String> getExpenseCategories() {
        return new ArrayList<>();
    }
}

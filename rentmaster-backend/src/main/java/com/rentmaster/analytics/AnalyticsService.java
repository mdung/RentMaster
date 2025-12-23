package com.rentmaster.analytics;

import com.rentmaster.billing.Invoice;
import com.rentmaster.billing.InvoiceRepository;
import com.rentmaster.billing.Payment;
import com.rentmaster.billing.PaymentRepository;
import com.rentmaster.contract.Contract;
import com.rentmaster.contract.ContractRepository;
import com.rentmaster.contract.ContractStatus;
import com.rentmaster.financial.Expense;
import com.rentmaster.financial.ExpenseRepository;
import com.rentmaster.maintenance.MaintenanceRequest;
import com.rentmaster.maintenance.MaintenanceRequestRepository;
import com.rentmaster.property.Property;
import com.rentmaster.property.PropertyRepository;
import com.rentmaster.property.Room;
import com.rentmaster.property.RoomRepository;
import com.rentmaster.property.RoomStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnalyticsService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private PropertyRepository propertyRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired(required = false)
    private MaintenanceRequestRepository maintenanceRequestRepository;
    
    public Map<String, Object> getDashboardAnalytics(int months, Long propertyId) {
        Map<String, Object> result = new HashMap<>();
        LocalDate startDate = LocalDate.now().minusMonths(months);
        LocalDate endDate = LocalDate.now();
        
        // Calculate revenue from invoices
        List<Invoice> invoices = invoiceRepository.findAll().stream()
            .filter(i -> {
                if (propertyId != null) {
                    return i.getContract() != null && 
                           i.getContract().getRoom() != null &&
                           i.getContract().getRoom().getProperty() != null &&
                           i.getContract().getRoom().getProperty().getId() != null &&
                           i.getContract().getRoom().getProperty().getId().equals(propertyId);
                }
                return true;
            })
            .filter(i -> i.getPeriodStart() != null && 
                        i.getPeriodStart().isAfter(startDate.minusDays(1)) &&
                        i.getPeriodStart().isBefore(endDate.plusDays(1)))
            .collect(Collectors.toList());
        
        double totalRevenue = invoices.stream()
            .mapToDouble(i -> i.getTotalAmount() != null ? i.getTotalAmount().doubleValue() : 0.0)
            .sum();
        
        // Calculate expenses
        List<Expense> expenses = expenseRepository.findAll().stream()
            .filter(e -> {
                if (propertyId != null) {
                    return e.getPropertyId() != null && e.getPropertyId().equals(propertyId);
                }
                return true;
            })
            .filter(e -> e.getExpenseDate() != null &&
                        e.getExpenseDate().isAfter(startDate.minusDays(1)) &&
                        e.getExpenseDate().isBefore(endDate.plusDays(1)))
            .collect(Collectors.toList());
        
        double totalExpenses = expenses.stream()
            .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
            .sum();
        
        // Calculate occupancy
        List<Room> allRooms = propertyId != null 
            ? roomRepository.findByPropertyId(propertyId)
            : roomRepository.findAll();
        
        long totalRooms = allRooms.size();
        long occupiedRooms = allRooms.stream()
            .filter(r -> r.getStatus() == RoomStatus.OCCUPIED)
            .count();
        
        double occupancyRate = totalRooms > 0 ? (occupiedRooms * 100.0 / totalRooms) : 0.0;
        
        // Calculate net profit
        double netProfit = totalRevenue - totalExpenses;
        
        // Calculate growth (simplified - compare with previous period)
        LocalDate prevStartDate = startDate.minusMonths(months);
        double prevRevenue = calculateRevenueForPeriod(prevStartDate, startDate, propertyId);
        double revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        
        double prevExpenses = calculateExpensesForPeriod(prevStartDate, startDate, propertyId);
        double expenseGrowth = prevExpenses > 0 ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 : 0;
        
        result.put("totalRevenue", totalRevenue);
        result.put("totalExpenses", totalExpenses);
        result.put("netProfit", netProfit);
        result.put("occupancyRate", Math.round(occupancyRate * 100.0) / 100.0);
        result.put("totalRooms", totalRooms);
        result.put("occupiedRooms", occupiedRooms);
        result.put("revenueGrowth", Math.round(revenueGrowth * 100.0) / 100.0);
        result.put("expenseGrowth", Math.round(expenseGrowth * 100.0) / 100.0);
        result.put("profitGrowth", prevRevenue - prevExpenses > 0 
            ? Math.round(((netProfit - (prevRevenue - prevExpenses)) / (prevRevenue - prevExpenses)) * 100 * 100.0) / 100.0 
            : 0);
        result.put("occupancyChange", 0.0); // Can be calculated from historical data
        
        return result;
    }
    
    private double calculateRevenueForPeriod(LocalDate start, LocalDate end, Long propertyId) {
        return invoiceRepository.findAll().stream()
            .filter(i -> {
                if (propertyId != null) {
                    return i.getContract() != null && 
                           i.getContract().getRoom() != null &&
                           i.getContract().getRoom().getProperty() != null &&
                           i.getContract().getRoom().getProperty().getId() != null &&
                           i.getContract().getRoom().getProperty().getId().equals(propertyId);
                }
                return true;
            })
            .filter(i -> i.getPeriodStart() != null && 
                        i.getPeriodStart().isAfter(start.minusDays(1)) &&
                        i.getPeriodStart().isBefore(end.plusDays(1)))
            .mapToDouble(i -> i.getTotalAmount() != null ? i.getTotalAmount().doubleValue() : 0.0)
            .sum();
    }
    
    private double calculateExpensesForPeriod(LocalDate start, LocalDate end, Long propertyId) {
        return expenseRepository.findAll().stream()
            .filter(e -> {
                if (propertyId != null) {
                    return e.getPropertyId() != null && e.getPropertyId().equals(propertyId);
                }
                return true;
            })
            .filter(e -> e.getExpenseDate() != null &&
                        e.getExpenseDate().isAfter(start.minusDays(1)) &&
                        e.getExpenseDate().isBefore(end.plusDays(1)))
            .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
            .sum();
    }
    
    public Map<String, Object> getRevenueAnalytics(int months, Long propertyId, String granularity) {
        Map<String, Object> result = new HashMap<>();
        // Implementation similar to getDashboardAnalytics but with time series data
        return result;
    }
    
    public Map<String, Object> getOccupancyAnalytics(int months, Long propertyId) {
        Map<String, Object> result = new HashMap<>();
        // Implementation for occupancy trends
        return result;
    }
    
    public Map<String, Object> getFinancialPerformance(int months, Long propertyId) {
        return getDashboardAnalytics(months, propertyId);
    }
    
    public Map<String, Object> getTenantAnalytics(int months, Long propertyId) {
        Map<String, Object> result = new HashMap<>();
        // Implementation for tenant analytics
        return result;
    }
    
    public Map<String, Object> getMaintenanceAnalytics(int months, Long propertyId) {
        Map<String, Object> result = new HashMap<>();
        // Implementation for maintenance analytics
        return result;
    }
    
    public Map<String, Object> getComparativeAnalytics(String currentPeriod, String comparisonPeriod, Long propertyId) {
        Map<String, Object> result = new HashMap<>();
        // Implementation for comparative analytics
        return result;
    }
    
    public Map<String, Object> getForecasting(int forecastMonths, Long propertyId, String metrics) {
        Map<String, Object> result = new HashMap<>();
        
        // Get current data
        Map<String, Object> currentData = getDashboardAnalytics(12, propertyId);
        double currentRevenue = ((Number) currentData.get("totalRevenue")).doubleValue();
        double currentOccupancy = ((Number) currentData.get("occupancyRate")).doubleValue();
        double currentExpenses = ((Number) currentData.get("totalExpenses")).doubleValue();
        
        // Simple linear forecasting (can be enhanced with ML models)
        List<Double> revenueForecast = new ArrayList<>();
        List<Double> occupancyForecast = new ArrayList<>();
        List<Double> expenseForecast = new ArrayList<>();
        List<String> periods = new ArrayList<>();
        
        double revenueGrowthRate = 0.02; // 2% monthly growth
        double occupancyGrowthRate = 0.01; // 1% monthly growth
        double expenseGrowthRate = 0.015; // 1.5% monthly growth
        
        for (int i = 1; i <= forecastMonths; i++) {
            LocalDate forecastDate = LocalDate.now().plusMonths(i);
            periods.add(forecastDate.getYear() + "-" + String.format("%02d", forecastDate.getMonthValue()));
            
            revenueForecast.add(currentRevenue * Math.pow(1 + revenueGrowthRate, i));
            occupancyForecast.add(Math.min(100, currentOccupancy * Math.pow(1 + occupancyGrowthRate, i)));
            expenseForecast.add(currentExpenses * Math.pow(1 + expenseGrowthRate, i));
        }
        
        result.put("currentRevenue", currentRevenue);
        result.put("currentOccupancy", currentOccupancy);
        result.put("currentExpenses", currentExpenses);
        result.put("revenueForecast", revenueForecast);
        result.put("occupancyForecast", occupancyForecast);
        result.put("expenseForecast", expenseForecast);
        result.put("periods", periods);
        result.put("revenueConfidence", 0.85);
        result.put("occupancyConfidence", 0.80);
        result.put("expenseConfidence", 0.75);
        
        return result;
    }
    
    public Map<String, Object> getPropertyHeatmap(String metric, int months) {
        Map<String, Object> result = new HashMap<>();
        // Implementation for property heatmap
        return result;
    }
    
    public Map<String, Object> createCustomReport(Map<String, Object> reportConfig) {
        Map<String, Object> result = new HashMap<>();
        // Implementation for custom reports
        return result;
    }
    
    public List<Map<String, Object>> getCustomReports(int page, int size) {
        return new ArrayList<>();
    }
    
    public Map<String, Object> executeCustomReport(Long id) {
        Map<String, Object> result = new HashMap<>();
        // Implementation for executing custom reports
        return result;
    }
    
    public Map<String, Object> getKPIMetrics(Long propertyId, String period) {
        Map<String, Object> result = new HashMap<>();
        
        // Get current period data
        int months = period.equals("current_month") ? 1 : period.equals("current_quarter") ? 3 : 12;
        Map<String, Object> dashboardData = getDashboardAnalytics(months, propertyId);
        
        result.put("totalRevenue", dashboardData.get("totalRevenue"));
        result.put("revenueTarget", ((Number) dashboardData.get("totalRevenue")).doubleValue() * 1.1); // 10% above current
        result.put("revenueTrend", dashboardData.get("revenueGrowth"));
        
        result.put("occupancyRate", dashboardData.get("occupancyRate"));
        result.put("occupancyTrend", dashboardData.get("occupancyChange"));
        
        result.put("totalExpenses", dashboardData.get("totalExpenses"));
        result.put("expenseTarget", ((Number) dashboardData.get("totalExpenses")).doubleValue() * 0.9); // 10% below current
        result.put("expenseTrend", dashboardData.get("expenseGrowth"));
        
        result.put("netProfit", dashboardData.get("netProfit"));
        result.put("profitTarget", ((Number) dashboardData.get("netProfit")).doubleValue() * 1.15); // 15% above current
        result.put("profitTrend", dashboardData.get("profitGrowth"));
        
        return result;
    }
    
    public Map<String, Object> getTrendAnalysis(String metric, int months, Long propertyId) {
        Map<String, Object> result = new HashMap<>();
        LocalDate startDate = LocalDate.now().minusMonths(months);
        LocalDate endDate = LocalDate.now();
        
        List<Double> values = new ArrayList<>();
        List<String> labels = new ArrayList<>();
        
        // Generate monthly data points
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            LocalDate monthStart = current.withDayOfMonth(1);
            LocalDate monthEnd = current.withDayOfMonth(current.lengthOfMonth());
            
            double value = 0.0;
            if (metric.equals("revenue")) {
                value = calculateRevenueForPeriod(monthStart, monthEnd, propertyId);
            } else if (metric.equals("expenses")) {
                value = calculateExpensesForPeriod(monthStart, monthEnd, propertyId);
            } else if (metric.equals("profit")) {
                value = calculateRevenueForPeriod(monthStart, monthEnd, propertyId) - 
                        calculateExpensesForPeriod(monthStart, monthEnd, propertyId);
            } else if (metric.equals("occupancy")) {
                // Calculate occupancy for the month
                List<Room> rooms = propertyId != null 
                    ? roomRepository.findByPropertyId(propertyId)
                    : roomRepository.findAll();
                long occupied = rooms.stream()
                    .filter(r -> r.getStatus() == RoomStatus.OCCUPIED)
                    .count();
                value = rooms.size() > 0 ? (occupied * 100.0 / rooms.size()) : 0;
            }
            
            values.add(value);
            labels.add(monthStart.getYear() + "-" + String.format("%02d", monthStart.getMonthValue()));
            
            current = current.plusMonths(1);
        }
        
        // Calculate statistics
        double average = values.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double peak = values.stream().mapToDouble(Double::doubleValue).max().orElse(0.0);
        double lowest = values.stream().mapToDouble(Double::doubleValue).min().orElse(0.0);
        
        // Calculate growth rate
        double firstValue = values.isEmpty() ? 0 : values.get(0);
        double lastValue = values.isEmpty() ? 0 : values.get(values.size() - 1);
        double growthRate = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
        
        result.put("values", values);
        result.put("labels", labels);
        result.put("average", average);
        result.put("peak", peak);
        result.put("lowest", lowest);
        result.put("growthRate", Math.round(growthRate * 100.0) / 100.0);
        
        return result;
    }
    
    public byte[] exportAnalytics(Map<String, Object> exportConfig) {
        // Implementation for exporting analytics data
        return new byte[0];
    }
}

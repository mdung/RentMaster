package com.rentmaster.dashboard;

import com.rentmaster.automation.RecurringInvoiceRepository;
import com.rentmaster.billing.InvoiceRepository;
import com.rentmaster.billing.PaymentRepository;
import com.rentmaster.contract.ContractRepository;
import com.rentmaster.messaging.TenantFeedbackRepository;
import com.rentmaster.property.PropertyRepository;
import com.rentmaster.tenant.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private RecurringInvoiceRepository recurringInvoiceRepository;

    @Autowired
    private TenantFeedbackRepository tenantFeedbackRepository;

    public Map<String, Object> getEnhancedDashboardData() {
        Map<String, Object> data = new HashMap<>();
        
        data.put("stats", getEnhancedStats());
        data.put("revenueData", getRevenueData("monthly"));
        data.put("occupancyData", getOccupancyData("monthly"));
        data.put("paymentMethodData", getPaymentMethodData());
        data.put("recentActivities", getRecentActivities(15));
        data.put("upcomingDueDates", getUpcomingDueDates(30));
        data.put("quickActions", getQuickActions());
        data.put("widgets", getDashboardWidgets());
        
        return data;
    }

    public Map<String, Object> getEnhancedStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Mock enhanced statistics
        stats.put("totalRooms", 150);
        stats.put("occupiedRooms", 142);
        stats.put("availableRooms", 8);
        stats.put("maintenanceRooms", 3);
        stats.put("activeContracts", 138);
        stats.put("totalOutstanding", 45000000L);
        stats.put("monthlyRevenue", 285000000L);
        stats.put("totalTenants", 156);
        stats.put("newTenantsThisMonth", 8);
        stats.put("averageRent", 2000000L);
        stats.put("collectionRate", 94.5);
        
        return stats;
    }

    public Map<String, Object> getRevenueData(String period) {
        Map<String, Object> data = new HashMap<>();
        
        if ("monthly".equals(period)) {
            List<Map<String, Object>> monthly = Arrays.asList(
                createDataPoint("Jan", 250000000L),
                createDataPoint("Feb", 265000000L),
                createDataPoint("Mar", 280000000L),
                createDataPoint("Apr", 275000000L),
                createDataPoint("May", 290000000L),
                createDataPoint("Jun", 285000000L)
            );
            data.put("monthly", monthly);
        } else {
            List<Map<String, Object>> yearly = Arrays.asList(
                createDataPoint("2020", 2800000000L),
                createDataPoint("2021", 3100000000L),
                createDataPoint("2022", 3350000000L),
                createDataPoint("2023", 3420000000L)
            );
            data.put("yearly", yearly);
        }
        
        Map<String, Object> comparison = new HashMap<>();
        comparison.put("currentMonth", 285000000L);
        comparison.put("previousMonth", 290000000L);
        comparison.put("growth", -1.7);
        data.put("comparison", comparison);
        
        return data;
    }

    public Map<String, Object> getOccupancyData(String period) {
        Map<String, Object> data = new HashMap<>();
        
        List<Map<String, Object>> monthly = Arrays.asList(
            createDataPoint("Jan", 92),
            createDataPoint("Feb", 94),
            createDataPoint("Mar", 96),
            createDataPoint("Apr", 93),
            createDataPoint("May", 95),
            createDataPoint("Jun", 94.7)
        );
        data.put("monthly", monthly);
        
        List<Map<String, Object>> byPropertyType = Arrays.asList(
            createDataPointWithPercentage("Studio", 45, 30),
            createDataPointWithPercentage("1BR", 65, 43),
            createDataPointWithPercentage("2BR", 32, 21),
            createDataPointWithPercentage("3BR", 8, 6)
        );
        data.put("byPropertyType", byPropertyType);
        
        Map<String, Object> trends = new HashMap<>();
        trends.put("currentRate", 94.7);
        trends.put("previousRate", 95.0);
        trends.put("change", -0.3);
        data.put("trends", trends);
        
        return data;
    }

    public Map<String, Object> getPaymentMethodData() {
        Map<String, Object> data = new HashMap<>();
        
        List<Map<String, Object>> methods = Arrays.asList(
            createDataPointWithPercentage("Bank Transfer", 65, 65),
            createDataPointWithPercentage("Cash", 20, 20),
            createDataPointWithPercentage("Credit Card", 10, 10),
            createDataPointWithPercentage("Mobile Wallet", 5, 5)
        );
        data.put("methods", methods);
        
        List<Map<String, Object>> trends = Arrays.asList(
            createDataPoint("Jan", 60),
            createDataPoint("Feb", 62),
            createDataPoint("Mar", 65),
            createDataPoint("Apr", 63),
            createDataPoint("May", 67),
            createDataPoint("Jun", 65)
        );
        data.put("trends", trends);
        
        return data;
    }

    public List<Map<String, Object>> getRecentActivities(int limit) {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        // Mock recent activities
        activities.add(createActivity(1L, "PAYMENT", "Payment Received", 
            "Rent payment of ₫2,000,000 received from John Doe (Unit 4B)",
            LocalDateTime.now().minusMinutes(5), "MEDIUM", "💰", "#10B981"));
            
        activities.add(createActivity(2L, "MAINTENANCE", "Maintenance Request", 
            "Water leak reported in Unit 12A - Urgent repair needed",
            LocalDateTime.now().minusHours(2), "HIGH", "🔧", "#F59E0B"));
            
        activities.add(createActivity(3L, "TENANT", "New Tenant Onboarded", 
            "Sarah Connor has been added to Unit 3A with 12-month contract",
            LocalDateTime.now().minusHours(5), "MEDIUM", "👤", "#3B82F6"));
            
        activities.add(createActivity(4L, "CONTRACT", "Contract Renewal", 
            "Contract for Unit 7C has been renewed for another year",
            LocalDateTime.now().minusDays(1), "LOW", "📄", "#6366F1"));
            
        activities.add(createActivity(5L, "INVOICE", "Invoice Generated", 
            "Monthly invoice #INV-2024-001 generated for Unit 5B",
            LocalDateTime.now().minusDays(2), "MEDIUM", "🧾", "#EF4444"));
        
        return activities.subList(0, Math.min(limit, activities.size()));
    }

    public List<Map<String, Object>> getUpcomingDueDates(int days) {
        List<Map<String, Object>> dueDates = new ArrayList<>();
        
        // Mock upcoming due dates
        dueDates.add(createDueDate(1L, "INVOICE", "Rent Payment Due", 
            "Unit 4B - John Doe - Monthly rent payment",
            LocalDate.now().plusDays(1), 2000000L, "HIGH", "DUE_TODAY"));
            
        dueDates.add(createDueDate(2L, "CONTRACT", "Contract Expiring", 
            "Unit 7A - Contract expires in 3 days",
            LocalDate.now().plusDays(3), null, "MEDIUM", "UPCOMING"));
            
        dueDates.add(createDueDate(3L, "MAINTENANCE", "Scheduled Inspection", 
            "Annual safety inspection for Building A",
            LocalDate.now().plusDays(7), null, "MEDIUM", "UPCOMING"));
            
        dueDates.add(createDueDate(4L, "INVOICE", "Overdue Payment", 
            "Unit 2C - Payment overdue by 5 days",
            LocalDate.now().minusDays(5), 1800000L, "URGENT", "OVERDUE"));
        
        return dueDates;
    }

    public List<Map<String, Object>> getQuickActions() {
        List<Map<String, Object>> actions = new ArrayList<>();
        
        // Count recurring invoices due for generation
        long invoicesDueCount = recurringInvoiceRepository.findDueForGeneration(LocalDate.now()).size();
        
        // Count pending maintenance requests (TenantFeedback with type MAINTENANCE and status SUBMITTED or IN_REVIEW)
        long pendingMaintenanceCount = tenantFeedbackRepository.findAll().stream()
            .filter(feedback -> "MAINTENANCE".equals(feedback.getType()) && 
                   ("SUBMITTED".equals(feedback.getStatus()) || "IN_REVIEW".equals(feedback.getStatus())))
            .count();
        
        actions.add(createQuickAction("add-tenant", "Add New Tenant", 
            "Onboard a new tenant to the system", "👤", "#3B82F6", "/tenants/new", true, null));
            
        actions.add(createQuickAction("generate-invoice", "Generate Invoice", 
            "Create invoices for monthly rent", "🧾", "#EF4444", "/invoices/generate", true, 
            invoicesDueCount > 0 ? (int) invoicesDueCount : null));
            
        actions.add(createQuickAction("record-payment", "Record Payment", 
            "Log a new payment received", "💰", "#10B981", "/payments/new", true, null));
            
        actions.add(createQuickAction("maintenance-request", "Maintenance Request", 
            "Create a new maintenance request", "🔧", "#F59E0B", "/maintenance/new", true, 
            pendingMaintenanceCount > 0 ? (int) pendingMaintenanceCount : null));
            
        actions.add(createQuickAction("add-property", "Add Property", 
            "Register a new property", "🏢", "#6366F1", "/properties/new", true, null));
            
        actions.add(createQuickAction("reports", "Generate Report", 
            "Create financial and occupancy reports", "📊", "#8B5CF6", "/reports", true, null));
        
        return actions;
    }

    public List<Map<String, Object>> getDashboardWidgets() {
        List<Map<String, Object>> widgets = new ArrayList<>();
        
        // Mock widget configurations
        widgets.add(createWidget("stats", "STATS", "Statistics", 0, 0, 4, 2, true));
        widgets.add(createWidget("revenue-chart", "CHART", "Revenue Chart", 0, 2, 2, 2, true));
        widgets.add(createWidget("occupancy-chart", "CHART", "Occupancy Chart", 2, 2, 2, 2, true));
        widgets.add(createWidget("activities", "ACTIVITY", "Recent Activities", 0, 4, 2, 3, true));
        widgets.add(createWidget("due-dates", "DUE_DATES", "Due Dates", 2, 4, 2, 3, true));
        
        return widgets;
    }

    public List<Map<String, Object>> updateDashboardWidgets(List<Map<String, Object>> widgets) {
        // TODO: Implement widget persistence
        // For now, just return the received widgets
        return widgets;
    }

    // Helper methods
    private Map<String, Object> createDataPoint(String label, Object value) {
        Map<String, Object> point = new HashMap<>();
        point.put("label", label);
        point.put("value", value);
        return point;
    }

    private Map<String, Object> createDataPointWithPercentage(String label, Object value, Object percentage) {
        Map<String, Object> point = createDataPoint(label, value);
        point.put("percentage", percentage);
        return point;
    }

    private Map<String, Object> createActivity(Long id, String type, String title, String description,
                                             LocalDateTime timestamp, String priority, String icon, String color) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("id", id);
        activity.put("type", type);
        activity.put("title", title);
        activity.put("description", description);
        activity.put("timestamp", timestamp.toString());
        activity.put("priority", priority);
        activity.put("icon", icon);
        activity.put("color", color);
        return activity;
    }

    private Map<String, Object> createDueDate(Long id, String type, String title, String description,
                                            LocalDate dueDate, Long amount, String priority, String status) {
        Map<String, Object> dueItem = new HashMap<>();
        dueItem.put("id", id);
        dueItem.put("type", type);
        dueItem.put("title", title);
        dueItem.put("description", description);
        dueItem.put("dueDate", dueDate.toString());
        if (amount != null) {
            dueItem.put("amount", amount);
        }
        dueItem.put("priority", priority);
        dueItem.put("status", status);
        dueItem.put("relatedEntityId", id);
        dueItem.put("relatedEntityType", type);
        return dueItem;
    }

    private Map<String, Object> createQuickAction(String id, String title, String description,
                                                String icon, String color, String action, boolean enabled, Integer count) {
        Map<String, Object> quickAction = new HashMap<>();
        quickAction.put("id", id);
        quickAction.put("title", title);
        quickAction.put("description", description);
        quickAction.put("icon", icon);
        quickAction.put("color", color);
        quickAction.put("action", action);
        quickAction.put("enabled", enabled);
        if (count != null) {
            quickAction.put("count", count);
        }
        return quickAction;
    }

    private Map<String, Object> createWidget(String id, String type, String title,
                                           int x, int y, int w, int h, boolean visible) {
        Map<String, Object> widget = new HashMap<>();
        widget.put("id", id);
        widget.put("type", type);
        widget.put("title", title);
        
        Map<String, Object> position = new HashMap<>();
        position.put("x", x);
        position.put("y", y);
        position.put("w", w);
        position.put("h", h);
        widget.put("position", position);
        
        widget.put("visible", visible);
        return widget;
    }
}